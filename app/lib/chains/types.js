// Normalized data schema that can represent both EVM and Soroban data
export const CHAIN_IDS = {
  ETHEREUM: 'ethereum',
  STELLAR: 'stellar',
};

// Normalized Risk Input (backend-compatible)
export class NormalizedRiskInput {
  constructor({
    chainId,
    tokenAddress,
    tokenSymbol,
    totalSupply,
    creatorBalance,
    lockedLiquidity,
    totalLiquidity,
    isPotentialHoneypot,
    rawChainData,
  }) {
    this.chainId = chainId;
    this.tokenAddress = tokenAddress;
    this.tokenSymbol = tokenSymbol;
    this.totalSupply = Number(totalSupply);
    this.creatorBalance = Number(creatorBalance);
    this.lockedLiquidity = Number(lockedLiquidity);
    this.totalLiquidity = Number(totalLiquidity);
    this.isPotentialHoneypot = Boolean(isPotentialHoneypot);
    this.rawChainData = rawChainData;
  }

  toBackendPayload() {
    return {
      token_address: this.tokenAddress,
      total_supply: this.totalSupply,
      creator_balance: this.creatorBalance,
      locked_liquidity: this.lockedLiquidity,
      total_liquidity: this.totalLiquidity,
      is_potential_honeypot: this.isPotentialHoneypot,
      chain_id: this.chainId,
      normalized_chain_data: this.rawChainData,
    };
  }
}

// Normalized Asset/Token Data
export class NormalizedTokenData {
  constructor({
    address,
    symbol,
    name,
    decimals,
    issuer,
    totalSupply,
    createdAt,
    chainId,
  }) {
    this.address = address;
    this.symbol = symbol;
    this.name = name;
    this.decimals = decimals;
    this.issuer = issuer;
    this.totalSupply = totalSupply;
    this.createdAt = createdAt;
    this.chainId = chainId;
  }
}

// Normalized Account Data
export class NormalizedAccountData {
  constructor({
    address,
    balances,
    trustlines,
    transactions,
    chainId,
  }) {
    this.address = address;
    this.balances = balances;
    this.trustlines = trustlines;
    this.transactions = transactions;
    this.chainId = chainId;
  }
}

// Normalized Transaction Data
export class NormalizedTransactionData {
  constructor({
    hash,
    from,
    to,
    value,
    timestamp,
    type,
    chainId,
    raw,
  }) {
    this.hash = hash;
    this.from = from;
    this.to = to;
    this.value = value;
    this.timestamp = timestamp;
    this.type = type;
    this.chainId = chainId;
    this.raw = raw;
  }
}

// Normalized Trustline Data (Stellar-specific, but normalized schema)
export class NormalizedTrustlineData {
  constructor({
    assetCode,
    assetIssuer,
    limit,
    balance,
    authorized,
    chainId,
  }) {
    this.assetCode = assetCode;
    this.assetIssuer = assetIssuer;
    this.limit = limit;
    this.balance = balance;
    this.authorized = authorized;
    this.chainId = chainId;
  }
}

export class NormalizedIssuanceData {
  constructor({
    assetCode,
    assetIssuer,
    issuedAmount,
    distributionCount,
    firstIssuedAt,
    lastIssuedAt,
    chainId,
  }) {
    this.assetCode = assetCode;
    this.assetIssuer = assetIssuer;
    this.issuedAmount = issuedAmount;
    this.distributionCount = distributionCount;
    this.firstIssuedAt = firstIssuedAt;
    this.lastIssuedAt = lastIssuedAt;
    this.chainId = chainId;
  }
}

export class NormalizedContractData {
  constructor({
    contractId,
    eventCount,
    latestLedger,
    transactions,
    metadata,
    chainId,
  }) {
    this.contractId = contractId;
    this.eventCount = eventCount;
    this.latestLedger = latestLedger;
    this.transactions = transactions;
    this.metadata = metadata;
    this.chainId = chainId;
  }
}
