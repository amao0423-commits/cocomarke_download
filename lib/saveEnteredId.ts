import { getKv } from '@/lib/kv';
import {
  ENTERED_ID_STATUSES,
  type EnteredIdEntry,
  type EnteredIdStatus,
} from '@/lib/enteredIdShared';

export {
  ENTERED_ID_STATUSES,
  type EnteredIdStatus,
  type EnteredIdEntry,
} from '@/lib/enteredIdShared';

const DEFAULT_STATUS: EnteredIdStatus = '未対応';

const ENTERED_IDS_KEY = 'entered-ids';
const RESULT_KEY_PREFIX = 'entered:result:';
const STATUS_KEY_PREFIX = 'entered:status:';
const RESULT_TTL_SEC = 90 * 24 * 3600; // 90日
const LIST_MAX = 2000;

function resultKey(id: string, timestamp: string): string {
  return `${RESULT_KEY_PREFIX}${id}::${timestamp}`;
}

function statusKey(id: string, timestamp: string): string {
  return `${STATUS_KEY_PREFIX}${id}::${timestamp}`;
}

/**
 * 診断成功時にIDとその時の結果を1件追加する（同じIDの複数回診断も別エントリで保存）。
 * 4つの書き込みを1本のパイプラインで送り、往復回数を削減する。
 */
export async function saveEnteredIdWithResult(
  instagramId: string,
  result: Record<string, unknown>
): Promise<void> {
  try {
    const kv = getKv();
    const timestamp = new Date().toISOString();

    const listEntry = JSON.stringify({ id: instagramId, timestamp });
    const p = kv.pipeline();
    p.lpush(ENTERED_IDS_KEY, listEntry);
    p.ltrim(ENTERED_IDS_KEY, 0, LIST_MAX - 1);
    p.set(resultKey(instagramId, timestamp), result, { ex: RESULT_TTL_SEC });
    p.set(statusKey(instagramId, timestamp), DEFAULT_STATUS, { ex: RESULT_TTL_SEC });
    await p.exec();
  } catch (error) {
    console.error('Failed to save entered ID with result:', error);
  }
}

/**
 * 一覧用：全エントリを返す（result は含めず軽くする）
 */
export async function readEnteredIds(): Promise<Omit<EnteredIdEntry, 'result'>[]> {
  try {
    const kv = getKv();
    const raw = await kv.lrange<string>(ENTERED_IDS_KEY, 0, LIST_MAX - 1);
    const list = Array.isArray(raw) ? raw : [];
    const entries: Omit<EnteredIdEntry, 'result'>[] = [];

    for (const item of list) {
      try {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        if (parsed && typeof parsed.id === 'string' && typeof parsed.timestamp === 'string') {
          const statusVal = await kv.get<string>(statusKey(parsed.id, parsed.timestamp));
          const status: EnteredIdStatus =
            statusVal && ENTERED_ID_STATUSES.includes(statusVal as EnteredIdStatus)
              ? (statusVal as EnteredIdStatus)
              : DEFAULT_STATUS;
          entries.push({ id: parsed.id, timestamp: parsed.timestamp, status });
        }
      } catch {
        // 壊れたエントリはスキップ
      }
    }

    return entries;
  } catch (error) {
    console.error('Failed to read entered IDs:', error);
    return [];
  }
}

/**
 * 指定した id + timestamp のステータスを更新する
 */
export async function setEnteredIdStatus(
  id: string,
  timestamp: string,
  status: EnteredIdStatus
): Promise<void> {
  try {
    const kv = getKv();
    await kv.set(statusKey(id, timestamp), status, { ex: RESULT_TTL_SEC });
  } catch (error) {
    console.error('Failed to set entered ID status:', error);
    throw error;
  }
}

/**
 * 指定した id + timestamp の当時の診断結果を返す
 */
export async function getEnteredIdResult(
  id: string,
  timestamp: string
): Promise<Record<string, unknown> | null> {
  try {
    const kv = getKv();
    const result = await kv.get<Record<string, unknown>>(resultKey(id, timestamp));
    return result ?? null;
  } catch (error) {
    console.error('Failed to get entered ID result:', error);
    return null;
  }
}
