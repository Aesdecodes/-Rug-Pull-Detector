export * from './types';
export * from './baseAdapter';
export * from './stellarAdapter';
export * from './evmAdapter';

import { stellarAdapter } from './stellarAdapter';
import { evmAdapter } from './evmAdapter';
import { CHAIN_IDS } from './types';

// Chain registry
export const CHAIN_ADAPTERS = {
  [CHAIN_IDS.STELLAR]: stellarAdapter,
  [CHAIN_IDS.ETHEREUM]: evmAdapter,
};

export function getChainAdapter(chainId) {
  return CHAIN_ADAPTERS[chainId];
}

