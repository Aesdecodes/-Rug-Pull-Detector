import React, { useState } from 'react';
import { analyzeToken } from '../services/api';
import { ShieldAlert, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

export const TokenAnalyzer = ({ onAnalysisComplete }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [liquidity, setLiquidity] = useState('');
  const [holderCount, setHolderCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeToken({
        address: tokenAddress,
        liquidity: parseFloat(liquidity),
        holder_count: parseInt(holderCount, 10),
      });
      setResult(data);
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err) {
      setError('Failed to connect to backend or analyze token. Ensure Rust server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 max-w-xl mx-auto border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        <ShieldAlert className="text-indigo-500" /> Token Risk Analyzer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Token Address</label>
          <input
            type="text"
            required
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Liquidity (USD)</label>
          <input
            type="number"
            required
            placeholder="10000"
            value={liquidity}
            onChange={(e) => setLiquidity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Holder Count</label>
          <input
            type="number"
            required
            placeholder="150"
            value={holderCount}
            onChange={(e) => setHolderCount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          Analyze Token Security
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Risk Assessment Result</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${
              result.risk_level === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              result.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {result.risk_level === 'HIGH' ? <AlertTriangle size={14}/> : <ShieldCheck size={14}/>}
              {result.risk_level} RISK
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Score: <strong className="text-zinc-900 dark:text-zinc-100">{result.score ?? 'N/A'}</strong></p>
          <p className="text-xs text-zinc-500 mt-1">Details: {result.message || 'Analyzed successfully via Rust backend.'}</p>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Successful analyses generate shareable public report routes with server-rendered metadata.
      </p>
    </div>
  );
};
