import { unstable_cache } from 'next/cache';
import {
  PRIVATE_CATEGORY_NAME,
  UNCATEGORIZED_CATEGORY_NAME,
} from '@/lib/documentCategoryConstants';
import { getHomeCategoryCopy } from '@/lib/homeCategoryCopy';
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

/** カード1枚分。カテゴリ名はバッジ、説明文はカテゴリ説明（または既定文）から解決する */
export type HomeFlatDocument = HomeDocument & {
  /** カテゴリ説明（バッジ下の説明文に使用） */
  description: string;
};

type DocumentRow = {
  id: string;
  title: string;
  category: string;
  thumbnail_url?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  sort_order?: number;
  hero_description?: string | null;
};

function withCacheBuster(url: string, version?: string | null): string {
  const v = typeof version === 'string' ? version.trim() : '';
  if (!v) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(v)}`;
}

function mapDocumentRow(row: DocumentRow): HomeDocument {
  const thumb = row.thumbnail_url;
  const updatedAt = typeof row.updated_at === 'string' ? row.updated_at : null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    thumbnailUrl:
      typeof thumb === 'string' && thumb.trim().length > 0
        ? withCacheBuster(thumb.trim(), updatedAt)
        : null,
  };
}

/**
 * トップ用: カテゴリマスタ順にセクションを組み、マスタにないカテゴリ名の資料は非公開バケットに寄せる。「非公開」「未分類」セクションはトップに出さない。
 */
async function fetchHomeDocumentSections(): Promise<{
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
      .select('id, title, category, thumbnail_url, updated_at, sort_order')
      .eq('is_published', true)
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

/** ISR の外（layout 等）でも Supabase を叩かないよう1時間キャッシュ */
export const loadHomeDocumentSections = unstable_cache(
  fetchHomeDocumentSections,
  ['home-document-sections'],
  { revalidate: 3600, tags: ['documents'] }
);

/**
 * トップ「人気資料 TOP 3」用: 「非公開」「未分類」以外を sort_order → title 昇順で最大3件。
 */
async function fetchTopDocuments(): Promise<HomeDocument[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const trySelect = async (cols: string) => {
    const res = await supabase
      .from('documents')
      .select(cols)
      .eq('is_published', true)
      .neq('category', PRIVATE_CATEGORY_NAME)
      .neq('category', UNCATEGORIZED_CATEGORY_NAME)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
      .limit(3);
    return res;
  };

  let docsRes = await trySelect('id, title, category, thumbnail_url, updated_at, sort_order');
  if (docsRes.error) {
    docsRes = await trySelect('id, title, category, sort_order, is_published');
  }

  const raw = !docsRes.error ? docsRes.data : null;
  const rows = (Array.isArray(raw) ? raw : []) as unknown as DocumentRow[];
  return rows.map(mapDocumentRow);
}

/** ISR の外でも Supabase を叩かないよう1時間キャッシュ */
export const loadTopDocuments = unstable_cache(
  fetchTopDocuments,
  ['home-top-documents'],
  { revalidate: 3600, tags: ['documents'] }
);

/**
 * トップ用（フラット表示）: カテゴリで分けず、公開資料をアップロード順（created_at 昇順）に並べる。
 * カードの説明文には所属カテゴリの説明（管理画面設定 → 既定文）を割り当てる。
 */
async function fetchHomeDocumentsFlat(): Promise<{
  documents: HomeFlatDocument[];
  categoryOrder: string[];
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { documents: [], categoryOrder: [] };
  }

  const [catsRes, docsRes] = await Promise.all([
    supabase
      .from('document_categories')
      .select('name, description, sort_order')
      .order('sort_order', { ascending: true }),
    supabase
      .from('documents')
      .select('id, title, category, thumbnail_url, updated_at, created_at, sort_order, hero_description')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
  ]);

  let documentsRaw: DocumentRow[] = [];
  if (docsRes.error) {
    const basic = await supabase
      .from('documents')
      .select('id, title, category, created_at, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    documentsRaw = (basic.data ?? []) as DocumentRow[];
  } else {
    documentsRaw = (docsRes.data ?? []) as DocumentRow[];
  }

  const cats = (catsRes.data ?? []) as {
    name: string;
    description?: string | null;
    sort_order?: number;
  }[];
  const categoryDescription = new Map<string, string | null>(
    cats.map((c) => [c.name, c.description?.trim() || null]),
  );
  const categoryOrder = cats.map((c) => c.name);

  const documents = documentsRaw.map((row) => {
    const base = mapDocumentRow(row);
    // 資料個別の紹介文（hero_description の1行目）を優先。未設定はカテゴリ説明にフォールバック。
    const heroFirstLine =
      typeof row.hero_description === 'string'
        ? row.hero_description.split('\n').map((l) => l.trim()).find(Boolean) ?? null
        : null;
    return {
      ...base,
      description:
        heroFirstLine ??
        categoryDescription.get(base.category) ??
        getHomeCategoryCopy(base.category).description,
    };
  });

  return { documents, categoryOrder };
}

/** ISR の外でも Supabase を叩かないよう1時間キャッシュ */
export const loadHomeDocumentsFlat = unstable_cache(
  fetchHomeDocumentsFlat,
  ['home-documents-flat'],
  { revalidate: 3600, tags: ['documents'] }
);
