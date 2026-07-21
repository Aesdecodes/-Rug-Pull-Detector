'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

function TokenAnalyzer({ onAnalysisComplete }) {
  const [formData, setFormData] = useState({
    tokenAddress: '',
    totalSupply: '',
    creatorBalance: '',
    lockedLiquidity: '',
    totalLiquidity: '',
    isPotentialHoneypot: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenAddress: formData.tokenAddress,
          totalSupply: formData.totalSupply,
          creatorBalance: formData.creatorBalance,
          lockedLiquidity: formData.lockedLiquidity,
          totalLiquidity: formData.totalLiquidity,
          isPotentialHoneypot: formData.isPotentialHoneypot,
        }),
      });
      const payload = await response.json();

      if (payload.success) {
        onAnalysisComplete({
          ...payload.data,
          timestamp: new Date().toISOString(),
        });
        setFormData({
          tokenAddress: '',
          totalSupply: '',
          creatorBalance: '',
          lockedLiquidity: '',
          totalLiquidity: '',
          isPotentialHoneypot: false,
        });
      } else {
        setError(payload.error || 'Analysis failed');
      }
    } catch (_error) {
      setError('Failed to connect to API server. Make sure the Rust backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary-400" />
        Token Analyzer
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-danger-500/20 border border-danger-500/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-danger-400" />
          <span className="text-danger-300">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Stellar Asset (Code:Issuer)
          </label>
          <input
            type="text"
            name="tokenAddress"
            value={formData.tokenAddress}
            onChange={handleChange}
            placeholder="USDC:GA5ZSEJYB37JRC52Z40060EQ11SVF4XI..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Supply
            </label>
            <input
              type="number"
              name="totalSupply"
              value={formData.totalSupply}
              onChange={handleChange}
              placeholder="1000000"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Creator Balance
            </label>
            <input
              type="number"
              name="creatorBalance"
              value={formData.creatorBalance}
              onChange={handleChange}
              placeholder="50000"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Locked Liquidity
            </label>
            <input
              type="number"
              name="lockedLiquidity"
              value={formData.lockedLiquidity}
              onChange={handleChange}
              placeholder="900000"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Liquidity
            </label>
            <input
              type="number"
              name="totalLiquidity"
              value={formData.totalLiquidity}
              onChange={handleChange}
              placeholder="1000000"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isPotentialHoneypot"
            id="honeypot"
            checked={formData.isPotentialHoneypot}
            onChange={handleChange}
            className="w-5 h-5 rounded bg-white/5 border-white/10 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="honeypot" className="text-sm text-gray-300">
            Potential Honeypot Detected
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze Token
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400">
        Successful analyses generate shareable public report routes with server-rendered metadata.
      </p>
    </div>
  );
}

export default TokenAnalyzer;
