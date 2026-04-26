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
