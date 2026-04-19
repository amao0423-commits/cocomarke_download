import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 申請に紐づける資料 ID。存在する documents の UUID のみ返す。
 */
export async function normalizeDownloadRequestDocumentId(
  raw: unknown
): Promise<string | null> {
  if (raw == null || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || !UUID_RE.test(trimmed)) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from('documents')
    .select('id')
    .eq('id', trimmed)
    .maybeSingle();
  return data?.id ?? null;
}

const MAX_DOCUMENT_IDS = 30;

/**
 * フォームから送られた資料 ID の配列（および単一 documentId）を検証し、
 * 存在する documents の UUID のみ重複なく返す。
 */
export async function normalizeDownloadRequestDocumentIds(
  rawList: unknown,
  rawSingle: unknown
): Promise<string[]> {
  const ordered: string[] = [];
  const seen = new Set<string>();

  const pushId = (id: string | null) => {
    if (!id || seen.has(id)) return;
    if (ordered.length >= MAX_DOCUMENT_IDS) return;
    seen.add(id);
    ordered.push(id);
  };

  if (Array.isArray(rawList)) {
    for (const item of rawList) {
      if (typeof item !== 'string') continue;
      const id = await normalizeDownloadRequestDocumentId(item);
      pushId(id);
    }
  }

  const single = await normalizeDownloadRequestDocumentId(rawSingle);
  pushId(single);

  return ordered;
}
