import { NextRequest } from 'next/server';
import { getKv } from '@/lib/kv';

// 10分間隔（秒・ミリ秒）
const DIAGNOSIS_INTERVAL_SEC = 10 * 60;
const DIAGNOSIS_INTERVAL_MS = 10 * 60 * 1000;
// 1時間（秒・ミリ秒）
const HOURLY_WINDOW_SEC = 60 * 60;
const HOURLY_WINDOW_MS = 60 * 60 * 1000;
// 1時間あたりの最大アクセス数
const MAX_HOURLY_ACCESS = 80;

const KEY_LAST = (ip: string) => `ratelimit:${ip}:last`;
const KEY_LOG = (ip: string) => `ratelimit:${ip}:log`;
const KEY_BLOCKED = (ip: string) => `ratelimit:${ip}:blocked`;

export type RateLimitResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: 'diagnosis_interval' | 'hourly_limit';
      nextAvailable?: string;
      remainingMinutes?: number;
      blockedUntil?: string;
    };

/**
 * NextRequestからクライアントのIPアドレスを取得
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

/**
 * IP制限をチェックする（記録は行わない）。
 * 10分制限は KV の ex（有効期限）で自動消滅。1時間80回はリストでカウント。
 * 3つの読み取りを1本のパイプラインで送り、往復回数を削減する。
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const kv = getKv();
  const now = new Date();
  const nowMs = now.getTime();

  const p = kv.pipeline();
  p.get<string>(KEY_BLOCKED(ip));
  p.get<string>(KEY_LAST(ip));
  p.lrange<string>(KEY_LOG(ip), 0, -1);
  const [blockedUntil, lastDiagnosis, logRaw] = await p.exec<[string | null, string | null, string[]]>();

  // 1. ブロック状態のチェック
  if (blockedUntil) {
    const blockedUntilMs = new Date(blockedUntil).getTime();
    if (nowMs < blockedUntilMs) {
      return {
        allowed: false,
        reason: 'hourly_limit',
        blockedUntil,
      };
    }
  }

  // 2. 10分間隔チェック
  if (lastDiagnosis) {
    const lastDiagnosisMs = new Date(lastDiagnosis).getTime();
    const timeSinceLastDiagnosis = nowMs - lastDiagnosisMs;

    if (timeSinceLastDiagnosis < DIAGNOSIS_INTERVAL_MS) {
      const nextAvailableMs = lastDiagnosisMs + DIAGNOSIS_INTERVAL_MS;
      const nextAvailable = new Date(nextAvailableMs).toISOString();
      const remainingMinutes = Math.ceil((nextAvailableMs - nowMs) / (60 * 1000));

      return {
        allowed: false,
        reason: 'diagnosis_interval',
        nextAvailable,
        remainingMinutes,
      };
    }
  }

  // 3. 1時間あたりのアクセス数チェック
  const logList = Array.isArray(logRaw) ? logRaw : [];
  const recentLogs = logList.filter((ts) => {
    const t = typeof ts === 'string' ? new Date(ts).getTime() : 0;
    return nowMs - t < HOURLY_WINDOW_MS;
  });

  if (recentLogs.length >= MAX_HOURLY_ACCESS) {
    const blockedUntilMs = nowMs + HOURLY_WINDOW_MS;
    const blockedUntilIso = new Date(blockedUntilMs).toISOString();
    await kv.set(KEY_BLOCKED(ip), blockedUntilIso, { ex: HOURLY_WINDOW_SEC });

    return {
      allowed: false,
      reason: 'hourly_limit',
      blockedUntil: blockedUntilIso,
    };
  }

  return { allowed: true };
}

/**
 * 診断が成功したときのみ呼ぶ。IPの利用を記録し、10分・1時間制限のカウントに加える。
 * 400/429/500 など失敗時は呼ばないため、失敗リクエストではレート制限を消費しない。
 * 3つの書き込みを1本のパイプラインで送り、往復回数を削減する。
 */
export async function recordRateLimitUsage(ip: string): Promise<void> {
  const kv = getKv();
  const nowIso = new Date().toISOString();

  const p = kv.pipeline();
  p.set(KEY_LAST(ip), nowIso, { ex: DIAGNOSIS_INTERVAL_SEC });
  p.lpush(KEY_LOG(ip), nowIso);
  p.ltrim(KEY_LOG(ip), 0, 99);
  await p.exec();
}
