import {
  PRIVATE_CATEGORY_NAME,
  UNCATEGORIZED_CATEGORY_NAME,
} from '@/lib/documentCategoryConstants';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 一覧・カード用。`thumbnail_url` は管理画面から画像URLを保存する想定（Supabase `documents` 列が未追加のときは null）。
 */
export type HomeDocument = {
  id: string;
  title: string;
  category: string;
  /** 資料サムネイル（公開URL）。未設定時はプレースホルダーを表示 */
  thumbnailUrl: string | null;
};

export type HomeSection = {
  categoryId: string;
  categoryName: string;
  /** 管理画面で設定した見出し。未設定時は null（表示側でフォールバックを使用） */
  headline: string | null;
  /** 管理画面で設定した説明文。未設定時は null（表示側でフォールバックを使用） */
  description: string | null;
  documents: HomeDocument[];
};

type DocumentRow = {
  id: string;
  title: string;
  category: string;
  thumbnail_url?: string | null;
  sort_order?: number;
};

function mapDocumentRow(row: DocumentRow): HomeDocument {
  const thumb = row.thumbnail_url;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    thumbnailUrl:
      typeof thumb === 'string' && thumb.trim().length > 0 ? thumb.trim() : null,
  };
}

/**
 * トップ用: カテゴリマスタ順にセクションを組み、マスタにないカテゴリ名の資料は非公開バケットに寄せる。「非公開」「未分類」セクションはトップに出さない。
 */
export async function loadHomeDocumentSections(): Promise<{
  sections: HomeSection[];
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { sections: [] };
  }

  /** `thumbnail_url` は資料サムネ用。未作成のDBでは select が失敗するため、下でフォールバック取得する */
  const [catsRes, docsRes] = await Promise.all([
    supabase
      .from('document_categories')
      .select('id, name, headline, description')
      .order('sort_order', { ascending: true }),
    supabase
      .from('documents')
      .select('id, title, category, thumbnail_url, sort_order')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true }),
  ]);

  let documentsRaw: DocumentRow[] = [];
  if (docsRes.error) {
    const basic = await supabase
      .from('documents')
      .select('id, title, category, sort_order')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });
    documentsRaw = (basic.data ?? []) as DocumentRow[];
  } else {
    documentsRaw = (docsRes.data ?? []) as DocumentRow[];
  }

  const categories = (catsRes.data ?? []) as {
    id: string;
    name: string;
    headline?: string | null;
    description?: string | null;
  }[];
  const documents = documentsRaw.map(mapDocumentRow);
  const nameSet = new Set(categories.map((c) => c.name));

  const sections: HomeSection[] = categories
    .map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      headline: cat.headline?.trim() || null,
      description: cat.description?.trim() || null,
      documents: documents.filter((d) => {
        if (cat.name === PRIVATE_CATEGORY_NAME) {
          return !nameSet.has(d.category) || d.category === PRIVATE_CATEGORY_NAME;
        }
        return d.category === cat.name;
      }),
    }))
    .filter(
      (s) =>
        s.categoryName !== PRIVATE_CATEGORY_NAME &&
        s.categoryName !== UNCATEGORIZED_CATEGORY_NAME &&
        s.documents.length > 0,
    );

  return { sections };
}

/**
 * トップ「人気資料 TOP 3」用: 「非公開」「未分類」以外を sort_order → title 昇順で最大3件。
 */
export async function loadTopDocuments(): Promise<HomeDocument[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const trySelect = async (cols: string) => {
    const res = await supabase
      .from('documents')
      .select(cols)
      .neq('category', PRIVATE_CATEGORY_NAME)
      .neq('category', UNCATEGORIZED_CATEGORY_NAME)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
      .limit(3);
    return res;
  };

  let docsRes = await trySelect('id, title, category, thumbnail_url, sort_order');
  if (docsRes.error) {
    docsRes = await trySelect('id, title, category, sort_order');
  }

  const raw = !docsRes.error ? docsRes.data : null;
  const rows = (Array.isArray(raw) ? raw : []) as unknown as DocumentRow[];
  return rows.map(mapDocumentRow);
}
