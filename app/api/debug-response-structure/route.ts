import { NextRequest, NextResponse } from 'next/server';
import { toJapaneseError } from '@/lib/errorMessages';

const GROWTHCORE_URL = 'https://api.growthcore.co.kr/api/thirdparty/id-analytics';

/** 値の型と軽量な構造のみを返す（個人データは含めない） */
function describeValue(value: unknown): unknown {
  if (value === null) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', length: 0 };
    return {
      type: 'array',
      length: value.length,
      itemKeys: typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])
        ? Object.keys(value[0] as object)
        : undefined,
    };
  }
  if (typeof value === 'object') {
    return { type: 'object', keys: Object.keys(value as object) };
  }
  return typeof value;
}

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(null, { status: 404 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim() || 'instagram';

    const apiKey = process.env.ACCOUNT_OPTIMIZATION_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません' },
        { status: 500 }
      );
    }

    const url = `${GROWTHCORE_URL}?id=${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Key': apiKey,
        Accept: 'application/json',
      },
    });

    let data: { status?: string; result?: unknown; message?: string };
    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        { error: 'APIレスポンスを解析できませんでした' },
        { status: response.ok ? 500 : response.status }
      );
    }

    if (data.status !== 'success' || data.result == null) {
      const rawError = typeof data.message === 'string' ? data.message : '分析結果を取得できませんでした';
      return NextResponse.json({
        ok: false,
        error: toJapaneseError(rawError),
        statusCode: response.status,
      });
    }

    const result = data.result as Record<string, unknown>;
    const topLevelKeys = Object.keys(result);

    const structure: Record<string, unknown> = {};
    for (const key of topLevelKeys) {
      structure[key] = describeValue(result[key]);
    }

    return NextResponse.json({
      ok: true,
      topLevelKeys,
      hasPostsPerDay: 'posts_per_day' in result,
      hasMostPopularPostTime: 'most_popular_post_time' in result,
      structure,
    });
  } catch (error: unknown) {
    console.error('Debug structure error:', error);
    const rawError = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      {
        ok: false,
        error: toJapaneseError(rawError),
      },
      { status: 500 }
    );
  }
}
