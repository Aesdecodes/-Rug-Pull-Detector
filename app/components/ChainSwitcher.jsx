'use client';

import { useChain } from '../context/ChainProvider';
import { Check } from 'lucide-react';

export function ChainSwitcher() {
  const { activeChainId, switchChain, chains, isLoading } = useChain();

  return (
    <div className="glass-card p-4 mb-6">
      <div className="text-sm text-gray-400 mb-2">Select Chain</div>
      <div className="flex flex-wrap gap-2">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain(chain.id)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeChainId === chain.id
                ? 'bg-primary-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {activeChainId === chain.id && <Check className="w-4 h-4" />}
            <span>{chain.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
