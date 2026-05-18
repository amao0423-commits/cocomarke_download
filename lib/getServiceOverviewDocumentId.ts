import { unstable_cache } from 'next/cache';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { SERVICE_OVERVIEW_DOCUMENT_TITLE } from '@/lib/pickFeaturedDocuments';

async function fetchServiceOverviewDocumentId(): Promise<string | null> {
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

/**
 * トップの「COCOマーケサービス概要」と同じ資料のダウンロードURL（メニュー用）。
 * 1時間キャッシュ — layout.tsx から毎リクエスト呼ばれるため ISR の外でもキャッシュが効く。
 */
export const getServiceOverviewDocumentId = unstable_cache(
  fetchServiceOverviewDocumentId,
  ['service-overview-document-id'],
  { revalidate: 3600 }
);

export function serviceOverviewDownloadHref(documentId: string | null): string {
  if (!documentId?.trim()) return '/servicedocument';
  return `/servicedocument?documentId=${encodeURIComponent(documentId.trim())}`;
}
