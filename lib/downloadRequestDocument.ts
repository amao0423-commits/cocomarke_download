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

