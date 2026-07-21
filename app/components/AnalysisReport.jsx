import Link from 'next/link';
import { AlertTriangle, CheckCircle, Clock, Shield, XCircle } from 'lucide-react';

function getRiskLevelColor(level) {
  switch (level) {
    case 'Low':
      return 'text-success-400 bg-success-500/20 border-success-500/50';
    case 'Medium':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    case 'High':
      return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
    case 'Critical':
      return 'text-danger-400 bg-danger-500/20 border-danger-500/50';
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
  }
}

function getRiskIcon(level) {
  switch (level) {
    case 'Low':
      return <CheckCircle className="h-5 w-5" />;
    case 'Medium':
      return <AlertTriangle className="h-5 w-5" />;
    case 'High':
      return <AlertTriangle className="h-5 w-5" />;
    case 'Critical':
      return <XCircle className="h-5 w-5" />;
    default:
      return <Shield className="h-5 w-5" />;
  }
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function AnalysisReport({ tokenAddress, analysis, generatedAt }) {
  return (
    <div className="min-h-screen text-white">
      <header className="glass-card m-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-500 p-3">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary-300">Public Token Report</p>
              <h1 className="text-2xl font-bold">{tokenAddress}</h1>
            </div>
          </div>
          <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getRiskLevelColor(analysis.riskLevel)}`}>
            {getRiskIcon(analysis.riskLevel)}
            <span>{analysis.riskLevel} Risk</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[1.35fr_0.85fr]">
        <section className="glass-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Risk Summary</h2>
              <p className="mt-2 text-gray-300">
                Server-rendered report for SEO, social previews, and direct linking.
              </p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <div className="flex items-center justify-end gap-2">
                <Clock className="h-4 w-4" />
                <span>{generatedAt}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-400">Model Score</p>
            <p className="mt-2 text-5xl font-bold">{formatPercent(analysis.score)}</p>
            <p className="mt-3 max-w-2xl text-gray-300">
              Higher scores indicate stronger rug-pull signals based on creator ownership, liquidity protection, and honeypot behavior.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Creator Ownership</p>
              <p className="mt-2 text-2xl font-semibold">{formatPercent(analysis.components.creatorOwnership)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Liquidity Lock</p>
              <p className="mt-2 text-2xl font-semibold">{formatPercent(analysis.components.liquidityLock)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Honeypot Signal</p>
              <p className="mt-2 text-2xl font-semibold">{formatPercent(analysis.components.honeypot)}</p>
            </div>
          </div>
        </section>

        <aside className="glass-card p-6">
          <h2 className="text-xl font-bold">Next Steps</h2>
          <p className="mt-3 text-gray-300">
            Re-run the analysis from the main analyzer to generate a fresh report or compare this result with another token profile.
          </p>
          <div className="mt-6 space-y-3 text-sm text-gray-300">
            <p>Token address: {tokenAddress}</p>
            <p>Risk level: {analysis.riskLevel}</p>
            <p>Score: {formatPercent(analysis.score)}</p>
          </div>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700"
          >
            Back to Analyzer
          </Link>
        </aside>
      </main>
    </div>
  );
}
