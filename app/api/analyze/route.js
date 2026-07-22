import { NextResponse } from 'next/server';
import {
  buildAnalyzePayload,
  fetchTokenAnalysis,
  isValidAnalyzePayload,
  normalizeAnalysisResult,
} from '../../lib/report';

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = buildAnalyzePayload(body);

    if (!isValidAnalyzePayload(payload)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid analysis inputs.',
        },
        { status: 400 }
      );
    }

    const result = await fetchTokenAnalysis(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Analysis failed.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: normalizeAnalysisResult(payload, result.data),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to analyze token.',
      },
      { status: 500 }
    );
  }
}
