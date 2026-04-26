import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { SERVICE_OVERVIEW_DOCUMENT_TITLE } from '@/lib/pickFeaturedDocuments';

/**
 * トップの「COCOマーケサービス概要」と同じ資料のダウンロードURL（メニュー用）。
 * 該当資料が無い・DB未接続時は従来どおり `/download`。
 */
export async function getServiceOverviewDocumentId(): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('documents')
    .select('id')
    .eq('title', SERVICE_OVERVIEW_DOCUMENT_TITLE)
    .limit(1);

  if (error || !data?.length) return null;
  const id = data[0]?.id;
  return typeof id === 'string' && id.trim() ? id.trim() : null;
}

export function serviceOverviewDownloadHref(documentId: string | null): string {
  if (!documentId?.trim()) return '/download';
  return `/download?documentId=${encodeURIComponent(documentId.trim())}`;
}
