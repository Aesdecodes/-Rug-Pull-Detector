import { cache } from 'react';
import AnalysisReport from '../../components/AnalysisReport';
import { buildAnalyzePayload, fetchTokenAnalysis, isValidAnalyzePayload, normalizeAnalysisResult } from '../../lib/report';

export const dynamic = 'force-dynamic';

const loadAnalysis = cache(async (tokenAddress, totalSupply, creatorBalance, lockedLiquidity, totalLiquidity, isPotentialHoneypot, chainId) => {
  const payload = buildAnalyzePayload({
    tokenAddress,
    totalSupply,
    creatorBalance,
    lockedLiquidity,
    totalLiquidity,
    isPotentialHoneypot,
    chainId,
  });

  if (!isValidAnalyzePayload(payload)) {
    return {
      ok: false,
      error: 'Missing report inputs. Re-run the analysis from the homepage to generate a complete report URL.',
    };
  }

  try {
    const response = await fetchTokenAnalysis(payload);

    if (!response.success) {
      return {
        ok: false,
        error: response.error || 'Analysis failed for this token report.',
      };
    }

    return {
      ok: true,
      analysis: normalizeAnalysisResult(payload, response.data),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to load report.',
    };
  }
});

function getReportInput(tokenAddress, searchParams) {
  return [
    tokenAddress,
    searchParams.totalSupply,
    searchParams.creatorBalance,
    searchParams.lockedLiquidity,
    searchParams.totalLiquidity,
    searchParams.isPotentialHoneypot,
    searchParams.chainId,
  ];
}

export async function generateMetadata({ params, searchParams }) {
  const report = await loadAnalysis(...getReportInput(params.tokenAddress, searchParams));

  if (!report.ok) {
    return {
      title: `Token Report | ${params.tokenAddress}`,
      description: 'Public token report for the Rug Pull Detector.',
    };
  }

  const risk = report.analysis.riskLevel;
  const score = `${(report.analysis.score * 100).toFixed(1)}%`;
  const title = `${params.tokenAddress} | ${risk} Risk Token Report`;
  const description = `Server-rendered token report for ${params.tokenAddress}. Risk level: ${risk}. Model score: ${score}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function TokenReportPage({ params, searchParams }) {
  const report = await loadAnalysis(...getReportInput(params.tokenAddress, searchParams));

  if (!report.ok) {
    return (
      <div className="min-h-screen px-4 py-12 text-white">
        <div className="glass-card mx-auto max-w-3xl p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary-300">Public Token Report</p>
          <h1 className="mt-3 text-3xl font-bold">Unable to render this report</h1>
          <p className="mt-4 text-gray-300">{report.error}</p>
        </div>
      </div>
    );
  }

  return (
    <AnalysisReport
      tokenAddress={params.tokenAddress}
      analysis={report.analysis}
      generatedAt={new Date().toLocaleString()}
      chainId={searchParams.chainId || report.analysis.chainId || null}
    />
  );
}
