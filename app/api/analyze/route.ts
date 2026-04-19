import { NextRequest, NextResponse } from 'next/server';
import { saveEnteredIdWithResult } from '@/lib/saveEnteredId';
import { buildFeedbackFromMetrics, type MetricsInput } from '@/lib/feedbackFromMetrics';
import { buildImprovementFromMetrics } from '@/lib/improvementFromMetrics';
import { getClientIp, checkRateLimit, recordRateLimitUsage } from '@/lib/rateLimiter';
import { toJapaneseError } from '@/lib/errorMessages';

const GROWTHCORE_URL = 'https://api.growthcore.co.kr/api/thirdparty/id-analytics';

/** クライアントに返す表示用フィールドのみ。生スコア等はネットワークレスポンスに含めない */
const DISPLAY_ONLY_KEYS = [
  'username',
  'full_name',
  'biography',
  'profile_image_url',
  'follower_count',
  'follow_count',
  'post_count',
  'average_like_count',
  'average_comment_count',
  'average_post_hour',
  'follower_grade',
  'post_count_grade',
  'activity_grade',
  'total_grade',
  'photo_rate',
  'reels_rate',
  'carousel_rate',
  'recent_hashtag_list',
  'feedback_message',
  'improvement_message',
  'growthcore_customer',
  'posts_per_day',
  'most_popular_post_time',
] as const;

function toDisplayResult(result: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of DISPLAY_ONLY_KEYS) {
    if (key in result) {
      out[key] = result[key];
    }
  }
  return out;
}

export async function GET(request: NextRequest) {
  try {
    // IP制限チェック
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      if (rateLimitResult.reason === 'diagnosis_interval') {
        // 10分間隔制限
        return NextResponse.json(
          {
            error: '診断の実行は10分に1回までです。',
            nextAvailable: rateLimitResult.nextAvailable,
            remainingMinutes: rateLimitResult.remainingMinutes,
          },
          { status: 429 }
        );
      } else if (rateLimitResult.reason === 'hourly_limit') {
        // 1時間80回制限
        return NextResponse.json(
          {
            error: 'アクセス回数が上限を超えました。しばらく時間をおいてから再度お試しください。',
            blockedUntil: rateLimitResult.blockedUntil,
          },
          { status: 429 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('id')?.trim() ?? '';
    // 本番でブラウザのオートコンプリート等により ":1" 等が付与されることがあるため除去（Instagram ID にコロンは含まれない）
    const id = rawId.replace(/:\d+$/, '').trim();

    if (!id) {
      return NextResponse.json(
        { error: 'Instagram IDを指定してください' },
        { status: 400 }
      );
    }

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
        { error: '分析結果を取得できませんでした' },
        { status: response.ok ? 500 : response.status }
      );
    }

    if (data.status !== 'success') {
      // 原因切り分け用: GrowthCore の実際の返答をログに残す（APIキー・ID・個人データは含めない）
      console.warn('[GrowthCore] 非success応答', {
        httpStatus: response.status,
        responseOk: response.ok,
        dataStatus: data.status,
        dataMessage: typeof data.message === 'string' ? data.message : '(なし)',
        requestedId: id,
      });
      const rawMessage =
        typeof data.message === 'string' ? data.message : '分析結果を取得できませんでした';
      const message = toJapaneseError(rawMessage);
      return NextResponse.json(
        { error: message },
        { status: response.ok ? 400 : response.status }
      );
    }

    const rawResult = data.result;
    if (rawResult == null || typeof rawResult !== 'object') {
      return NextResponse.json(
        { error: '分析結果を取得できませんでした' },
        { status: 500 }
      );
    }

    const result = rawResult as Record<string, unknown>;
    result.feedback_message = buildFeedbackFromMetrics(result as MetricsInput);
    result.improvement_message = buildImprovementFromMetrics(result as MetricsInput);

    // 診断成功時のみ、その時の表示内容を保存（管理者が後から確認できるようにする）
    await saveEnteredIdWithResult(id, result);

    // 成功時のみレート制限を消費（400/500 のときは消費しない）
    await recordRateLimitUsage(clientIp);

    // 表示用フィールドのみ返却（グロスコア等の生データはネットワークレスポンスに含めない）
    return NextResponse.json(toDisplayResult(result));
  } catch (error: unknown) {
    console.error('GrowthCore API Error:', error);

    let errorMessage = '分析中にエラーが発生しました';
    if (error instanceof Error) {
      errorMessage = toJapaneseError(error.message);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
