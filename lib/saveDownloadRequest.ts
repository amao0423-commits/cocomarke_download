import { getKv } from '@/lib/kv';
import {
  normalizeDownloadRequestStatusForUi,
  type DownloadRequestEntry,
  type DownloadRequestStatus,
} from '@/lib/downloadRequestShared';

export {
  DOWNLOAD_REQUEST_STATUSES,
  type DownloadRequestStatus,
  type DownloadRequestEntry,
} from '@/lib/downloadRequestShared';

const DEFAULT_STATUS: DownloadRequestStatus = '送付済';

const LIST_KEY = 'download-requests';
const STATUS_KEY_PREFIX = 'download:status:';
const STATUS_TTL_SEC = 180 * 24 * 3600; // 180日
const LIST_MAX = 2000;

function statusKey(id: string): string {
  return `${STATUS_KEY_PREFIX}${id}`;
}

export async function saveDownloadRequest(
  entry: Omit<DownloadRequestEntry, 'status'>
): Promise<void> {
  try {
    const kv = getKv();
    const item = JSON.stringify(entry);
    const p = kv.pipeline();
    p.lpush(LIST_KEY, item);
    p.ltrim(LIST_KEY, 0, LIST_MAX - 1);
    p.set(statusKey(entry.id), DEFAULT_STATUS, { ex: STATUS_TTL_SEC });
    await p.exec();
  } catch (error) {
    console.error('Failed to save download request:', error);
  }
}

export async function readDownloadRequests(): Promise<DownloadRequestEntry[]> {
  try {
    const kv = getKv();
    const raw = await kv.lrange<string>(LIST_KEY, 0, LIST_MAX - 1);
    const list = Array.isArray(raw) ? raw : [];
    const entries: DownloadRequestEntry[] = [];

    for (const item of list) {
      try {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        if (
          parsed &&
          typeof parsed.id === 'string' &&
          typeof parsed.email === 'string' &&
          typeof parsed.timestamp === 'string'
        ) {
          const statusVal = await kv.get<string>(statusKey(parsed.id));
          const status: DownloadRequestStatus = statusVal?.trim()
            ? normalizeDownloadRequestStatusForUi(statusVal)
            : DEFAULT_STATUS;
          entries.push({
            id: parsed.id,
            name: parsed.name ?? '',
            lastName:
              typeof parsed.lastName === 'string' ? parsed.lastName : undefined,
            firstName:
              typeof parsed.firstName === 'string' ? parsed.firstName : undefined,
            email: parsed.email,
            company: parsed.company ?? '',
            department:
              typeof parsed.department === 'string' ? parsed.department : undefined,
            phone: typeof parsed.phone === 'string' ? parsed.phone : '',
            requestPurpose:
              typeof parsed.requestPurpose === 'string'
                ? parsed.requestPurpose
                : undefined,
            questions:
              typeof parsed.questions === 'string' ? parsed.questions : undefined,
            privacyConsent:
              typeof parsed.privacyConsent === 'boolean'
                ? parsed.privacyConsent
                : undefined,
            documentTitle:
              typeof parsed.documentTitle === 'string' && parsed.documentTitle.trim()
                ? parsed.documentTitle.trim()
                : undefined,
            timestamp: parsed.timestamp,
            status,
          });
        }
      } catch {
        // 壊れたエントリはスキップ
      }
    }

    return entries;
  } catch (error) {
    console.error('Failed to read download requests:', error);
    return [];
  }
}

/** 一覧から指定 ID を除き直す（DB 削除後の Redis 残骸や Redis のみの行用） */
export async function removeDownloadRequestsFromRedisByIds(
  ids: string[]
): Promise<number> {
  if (ids.length === 0) return 0;
  const idSet = new Set(ids);
  try {
    const kv = getKv();
    const raw = await kv.lrange<string>(LIST_KEY, 0, LIST_MAX - 1);
    const list = Array.isArray(raw) ? raw : [];
    const kept: string[] = [];
    const removedStatusIds: string[] = [];

    for (const item of list) {
      try {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        if (parsed && typeof parsed.id === 'string' && idSet.has(parsed.id)) {
          removedStatusIds.push(parsed.id);
          continue;
        }
        kept.push(typeof item === 'string' ? item : JSON.stringify(parsed));
      } catch {
        if (typeof item === 'string') kept.push(item);
      }
    }

    if (removedStatusIds.length === 0) return 0;

    const pipe = kv.pipeline();
    pipe.del(LIST_KEY);
    for (let i = kept.length - 1; i >= 0; i--) {
      pipe.lpush(LIST_KEY, kept[i]);
    }
    for (const rid of removedStatusIds) {
      pipe.del(statusKey(rid));
    }
    await pipe.exec();
    return removedStatusIds.length;
  } catch (error) {
    console.error('removeDownloadRequestsFromRedisByIds:', error);
    return 0;
  }
}

export async function setDownloadRequestStatus(
  id: string,
  status: DownloadRequestStatus
): Promise<void> {
  try {
    const kv = getKv();
    await kv.set(statusKey(id), status, { ex: STATUS_TTL_SEC });
  } catch (error) {
    console.error('Failed to set download request status:', error);
    throw error;
  }
}
