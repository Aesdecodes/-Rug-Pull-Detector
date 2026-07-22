'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  CHAIN_IDS,
  getChainAdapter,
  stellarAdapter,
  evmAdapter,
} from '../lib/chains';

const ChainContext = createContext({});

export function ChainProvider({ children }) {
  const [activeChainId, setActiveChainId] = useState(CHAIN_IDS.STELLAR);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAdapter, setActiveAdapter] = useState(stellarAdapter);

  const switchChain = useCallback(async (chainId) => {
    setIsLoading(true);
    try {
      const adapter = getChainAdapter(chainId);
      await adapter.connect();
      setActiveChainId(chainId);
      setActiveAdapter(adapter);
    } catch (error) {
      console.error('Error switching chain:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => {
    return {
      activeChainId,
      activeAdapter,
      isLoading,
      switchChain,
      CHAIN_IDS,
      chains: [
        { id: CHAIN_IDS.ETHEREUM, name: 'EVM (Ethereum)', adapter: evmAdapter },
        { id: CHAIN_IDS.STELLAR, name: 'Stellar (Soroban)', adapter: stellarAdapter },
      ],
    };
  }, [activeChainId, activeAdapter, isLoading, switchChain]);

  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
}

export function useChain() {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
}
