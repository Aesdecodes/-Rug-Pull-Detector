import React, { useState, useEffect } from 'react';
import { Shield, Activity } from 'lucide-react';
import TokenAnalyzer from './components/TokenAnalyzer';
import RiskDashboard from './components/RiskDashboard';
import WalletConnect from './components/WalletConnect';
import { Web3Provider } from './context/Web3Provider';
import { checkHealth } from './services/api';
import './index.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    checkHealth()
      .then(() => setBackendStatus('Connected (Healthy)'))
      .catch(() => setBackendStatus('Disconnected (Offline)'));
  }, []);

  const handleNewAnalysis = (res) => {
    setHistory(prev => [res, ...prev]);
  };

  return (
    <div className="min-h-screen text-white bg-slate-900">
      {/* Header */}
      <header className="glass-card m-4 p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Rug Pull Detector</h1>
              <p className="text-gray-400 text-sm">DeFi Token Scam Predictive Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Backend API: <strong className="text-emerald-400">{backendStatus}</strong></span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <TokenAnalyzer onAnalysisComplete={handleNewAnalysis} />
        <RiskDashboard history={history} />
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Web3Provider>
      <App />
    </Web3Provider>
  );
}

