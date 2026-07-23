const TRADE_OPERATIONS = ['approve', 'transfer', 'swapexacttokensforeth'];
const HIGH_TAX_BPS = 9000;
const DYNAMIC_TAX_DELTA_BPS = 5000;
const SUSPICIOUS_GAS_RATIO = 3;

function toNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeOperationName(value) {
  if (!value) {
    return '';
  }

  return String(value).toLowerCase();
}

function getOperationName(trace) {
  const rawName = trace?.operation || trace?.method || trace?.functionName || trace?.name || '';
  const normalized = normalizeOperationName(rawName);
  const matched = TRADE_OPERATIONS.find((operation) => normalized.includes(operation.toLowerCase()));
  return matched || normalized;
}

function getGasUsed(trace) {
  return toNumber(trace?.gasUsed ?? trace?.gas_used ?? trace?.receipt?.gasUsed ?? trace?.result?.gasUsed);
}

function getGasLimit(trace) {
  return toNumber(trace?.gasLimit ?? trace?.gas_limit ?? trace?.transaction?.gasLimit ?? trace?.request?.gasLimit);
}

function isReverted(trace) {
  const status = trace?.status ?? trace?.receipt?.status ?? trace?.result?.status;
  return Boolean(
    trace?.reverted === true ||
      trace?.error ||
      trace?.revertReason ||
      status === false ||
      status === 0 ||
      String(status).toLowerCase() === 'reverted'
  );
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getTradeTraces(chainData) {
  return [
    ...asArray(chainData?.tradeSimulation?.callSequence),
    ...asArray(chainData?.tradeSimulation?.traces),
    ...asArray(chainData?.simulationTraces),
    ...asArray(chainData?.callSequence),
  ];
}

function calculateGasDeltas(traces) {
  const gasByOperation = {};

  traces.forEach((trace) => {
    const operation = getOperationName(trace);
    const gasUsed = getGasUsed(trace);

    if (TRADE_OPERATIONS.includes(operation) && gasUsed !== null) {
      gasByOperation[operation] = gasUsed;
    }
  });

  const deltas = {};
  TRADE_OPERATIONS.forEach((fromOperation) => {
    TRADE_OPERATIONS.forEach((toOperation) => {
      if (fromOperation === toOperation) {
        return;
      }

      if (gasByOperation[fromOperation] !== undefined && gasByOperation[toOperation] !== undefined) {
        deltas[`${fromOperation}_to_${toOperation}`] = gasByOperation[toOperation] - gasByOperation[fromOperation];
      }
    });
  });

  return { gasByOperation, deltas };
}

function getTaxBps(value) {
  const numericValue = toNumber(value);
  if (numericValue === null) {
    return null;
  }

  return numericValue <= 100 ? numericValue * 100 : numericValue;
}

function extractTaxValues(source) {
  const values = [];
  const keys = ['taxBps', 'tax_bps', 'sellTaxBps', 'sell_tax_bps', 'taxPercent', 'tax_percent', 'sellTaxPercent'];

  keys.forEach((key) => {
    const value = getTaxBps(source?.[key]);
    if (value !== null) {
      values.push(value);
    }
  });

  return values;
}

function getStorageSnapshot(chainData, key) {
  return chainData?.storageSnapshots?.[key] || chainData?.storage?.[key] || chainData?.tradeSimulation?.storage?.[key] || null;
}

function compareStorageSnapshots(beforeTrade, afterTrade) {
  if (!beforeTrade || !afterTrade) {
    return [];
  }

  const changedSlots = [];
  const slotKeys = new Set([...Object.keys(beforeTrade), ...Object.keys(afterTrade)]);

  slotKeys.forEach((slot) => {
    if (beforeTrade[slot] !== afterTrade[slot]) {
      changedSlots.push({ slot, before: beforeTrade[slot], after: afterTrade[slot] });
    }
  });

  return changedSlots;
}

function analyzeDynamicTax(chainData) {
  const beforeTrade = getStorageSnapshot(chainData, 'beforeTrade') || getStorageSnapshot(chainData, 'preTrade');
  const afterTrade = getStorageSnapshot(chainData, 'afterTrade') || getStorageSnapshot(chainData, 'postTrade');
  const changedSlots = [
    ...compareStorageSnapshots(beforeTrade, afterTrade),
    ...asArray(chainData?.storageChanges),
    ...asArray(chainData?.tradeSimulation?.storageChanges),
  ];
  const beforeTaxValues = extractTaxValues(beforeTrade);
  const afterTaxValues = extractTaxValues(afterTrade);
  const explicitTaxValues = extractTaxValues(chainData?.tradeSimulation).concat(extractTaxValues(chainData));
  const maxBeforeTaxBps = Math.max(0, ...beforeTaxValues);
  const maxAfterTaxBps = Math.max(0, ...afterTaxValues, ...explicitTaxValues);
  const taxDeltaBps = maxAfterTaxBps - maxBeforeTaxBps;
  const flagged = maxAfterTaxBps >= HIGH_TAX_BPS || taxDeltaBps >= DYNAMIC_TAX_DELTA_BPS;

  return {
    flagged,
    maxBeforeTaxBps,
    maxAfterTaxBps,
    taxDeltaBps,
    changedSlots,
  };
}

function analyzeConditionalReverts(traces) {
  const operationGroups = new Map();
  const callerGroups = new Map();

  traces.forEach((trace) => {
    const operation = getOperationName(trace) || 'unknown';
    const caller = trace?.caller || trace?.from || trace?.transaction?.from || trace?.request?.from || 'unknown';
    const item = {
      operation,
      caller,
      gasLimit: getGasLimit(trace),
      gasUsed: getGasUsed(trace),
      reverted: isReverted(trace),
      reason: trace?.revertReason || trace?.error || null,
    };

    operationGroups.set(operation, [...(operationGroups.get(operation) || []), item]);
    callerGroups.set(`${operation}:${caller}`, [...(callerGroups.get(`${operation}:${caller}`) || []), item]);
  });

  const gasLimitFindings = [];
  const callerFindings = [];

  operationGroups.forEach((items, operation) => {
    const reverted = items.filter((item) => item.reverted && item.gasLimit !== null);
    const succeeded = items.filter((item) => !item.reverted && item.gasLimit !== null);

    reverted.forEach((revertedItem) => {
      succeeded.forEach((succeededItem) => {
        const ratio = succeededItem.gasLimit / Math.max(revertedItem.gasLimit, 1);
        if (ratio >= SUSPICIOUS_GAS_RATIO) {
          gasLimitFindings.push({
            operation,
            revertedGasLimit: revertedItem.gasLimit,
            succeededGasLimit: succeededItem.gasLimit,
            ratio: Number(ratio.toFixed(2)),
          });
        }
      });
    });

    const callers = [...new Set(items.map((item) => item.caller))];
    callers.forEach((caller) => {
      const callerItems = callerGroups.get(`${operation}:${caller}`) || [];
      const otherCallerItems = items.filter((item) => item.caller !== caller);
      if (callerItems.some((item) => item.reverted) && otherCallerItems.some((item) => !item.reverted)) {
        callerFindings.push({ operation, caller });
      }
    });
  });

  return {
    flagged: gasLimitFindings.length > 0 || callerFindings.length > 0,
    gasLimitFindings,
    callerFindings,
  };
}

function calculateScore({ gasAnalysis, taxAnalysis, revertAnalysis }) {
  let score = 0;

  if (Object.keys(gasAnalysis.gasByOperation).length >= 3) {
    const approveGas = gasAnalysis.gasByOperation.approve || 1;
    const sellGas = gasAnalysis.gasByOperation.swapexacttokensforeth || 0;
    if (sellGas / approveGas >= SUSPICIOUS_GAS_RATIO) {
      score += 0.2;
    }
  }

  if (taxAnalysis.flagged) {
    score += 0.35;
  }

  if (revertAnalysis.gasLimitFindings.length > 0) {
    score += 0.2;
  }

  if (revertAnalysis.callerFindings.length > 0) {
    score += 0.25;
  }

  return Math.min(Number(score.toFixed(2)), 1);
}

export function analyzeDynamicHoneypotSignals(chainData = {}) {
  const traces = getTradeTraces(chainData);
  const gasAnalysis = calculateGasDeltas(traces);
  const taxAnalysis = analyzeDynamicTax(chainData);
  const revertAnalysis = analyzeConditionalReverts(traces);
  const score = calculateScore({ gasAnalysis, taxAnalysis, revertAnalysis });
  const triggeredRules = [];

  if (Object.keys(gasAnalysis.deltas).length > 0) {
    triggeredRules.push('gas_usage_delta');
  }
  if (taxAnalysis.flagged) {
    triggeredRules.push('dynamic_tax_storage_change');
  }
  if (revertAnalysis.gasLimitFindings.length > 0) {
    triggeredRules.push('gas_limit_conditional_revert');
  }
  if (revertAnalysis.callerFindings.length > 0) {
    triggeredRules.push('caller_blacklist_conditional_revert');
  }

  return {
    score,
    flagged: score >= 0.4,
    triggeredRules,
    gas: gasAnalysis,
    dynamicTax: taxAnalysis,
    conditionalReverts: revertAnalysis,
  };
}
