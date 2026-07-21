import React, { useState, useEffect } from 'react';
import { TokenAnalyzer } from './components/TokenAnalyzer';
import { checkHealth } from './services/api';
import { ShieldCheck, AlertCircle, Activity } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="text-indigo-600" />
          <h1 className="text-xl font-bold">Rug Pull Detector</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-zinc-500">Backend API: <strong className="text-zinc-700 dark:text-zinc-300">{backendStatus}</strong></span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8">
        <TokenAnalyzer onAnalysisComplete={handleNewAnalysis} />

        {history.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold mb-4">Recent Analysis History</h3>
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-sm">
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">{item.address || 'Token Address'}</span>
                  <span className={`px-2 py-0.5 rounded font-semibold text-xs ${
                    item.risk_level === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {item.risk_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
