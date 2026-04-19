import type { HomeDocument, HomeSection } from '@/lib/homeDocuments';

/** サービス概要資料（トップの代表カード用）。DBの資料タイトルと一致させる */
export const SERVICE_OVERVIEW_DOCUMENT_TITLE = 'COCOマーケサービス概要';

/**
 * 先頭から最大 `limit` 件をピックアップ用に取得（カテゴリ順・資料は既存の並びのまま）。
 */
export function pickFeaturedDocuments(
  sections: HomeSection[],
  limit = 3,
): HomeDocument[] {
  const out: HomeDocument[] = [];
  for (const s of sections) {
    for (const d of s.documents) {
      if (d.title === SERVICE_OVERVIEW_DOCUMENT_TITLE) continue;
      if (out.length >= limit) return out;
      out.push(d);
    }
  }
  return out;
}

/**
 * サービス概要資料を1件取得（ダウンロードリンク用）。
 */
export function findServiceOverviewDocument(
  sections: HomeSection[],
): HomeDocument | null {
  for (const s of sections) {
    for (const d of s.documents) {
      if (d.title === SERVICE_OVERVIEW_DOCUMENT_TITLE) return d;
    }
  }
  return null;
}
