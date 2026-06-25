import { unstable_cache } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const HERO_SELECT =
  "id, title, hero_description, hero_highlight_1, hero_highlight_2, hero_highlight_3, hero_highlights_extra, hero_image_1_url, thumbnail_url";

type HeroFields = {
  title: string | null;
  hero_description: string | null;
  hero_highlight_1: string | null;
  hero_highlight_2: string | null;
  hero_highlight_3: string | null;
  hero_highlights_extra: string | null;
  hero_image_1_url: string | null;
};

/** ヒーロー画像未設定時は資料サムネイルを流用する */
function resolveHeroImage(
  heroImage: string | null | undefined,
  thumbnail: string | null | undefined,
): string | null {
  const hero = typeof heroImage === "string" ? heroImage.trim() : "";
  if (hero) return hero;
  const thumb = typeof thumbnail === "string" ? thumbnail.trim() : "";
  return thumb || null;
}

export type PageDocument = {
  id: string;
  label: string;
  title?: string | null;
} & Partial<HeroFields>;

type DownloadPageContext = {
  formName: string;
  requestedDocumentLabel: string | null;
  templateId: string | null;
  documents: PageDocument[];
};

async function fetchDownloadPageContext(
  documentId: string | undefined,
  formSlug: string
): Promise<DownloadPageContext> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      formName: "COCOマーケ資料ダウンロード",
      requestedDocumentLabel: documentId ? "ご指定の資料" : null,
      templateId: null,
      documents: [],
    };
  }

  const { data: config } = await supabase
    .from("download_form_configs")
    .select("name, template_id")
    .eq("slug", formSlug)
    .maybeSingle();

  const formName = config?.name?.trim() || "COCOマーケ資料ダウンロード";
  const templateId = config?.template_id ?? null;

  // ── documentId 指定時（広告などの個別URL）──
  // ページは指定資料 1 件しか表示しないため、テンプレ紐づけ一覧は取得せず
  // その 1 件だけを取りに行く（config + documents の 2 クエリで完結）。
  if (documentId?.trim()) {
    const id = documentId.trim();
    const { data: document } = await supabase
      .from("documents")
      .select(`title, ${HERO_SELECT}`)
      .eq("id", id)
      .maybeSingle();

    if (!document) {
      return { formName, requestedDocumentLabel: "ご指定の資料", templateId, documents: [] };
    }

    const doc: PageDocument = {
      id,
      label: document.title ?? "ご指定の資料",
      title: document.title ?? null,
      hero_description: document.hero_description ?? null,
      hero_highlight_1: document.hero_highlight_1 ?? null,
      hero_highlight_2: document.hero_highlight_2 ?? null,
      hero_highlight_3: document.hero_highlight_3 ?? null,
      hero_highlights_extra: document.hero_highlights_extra ?? null,
      hero_image_1_url: resolveHeroImage(document.hero_image_1_url, document.thumbnail_url),
    };

    return {
      formName,
      requestedDocumentLabel: doc.title?.trim() || doc.label,
      templateId,
      documents: [doc],
    };
  }

  // ── documentId 未指定（汎用 /download）──
  // 既定で先頭資料を表示するため、テンプレ紐づけ一覧を取得する。
  let documents: PageDocument[] = [];
  if (templateId) {
    const { data: links } = await supabase
      .from("template_document_links")
      .select("document_id, label, sort_order")
      .eq("template_id", templateId)
      .order("sort_order", { ascending: true });

    if (links && links.length > 0) {
      const docIds = links.map((l) => l.document_id);
      const { data: heroRows } = await supabase
        .from("documents")
        .select(HERO_SELECT)
        .in("id", docIds);

      const heroMap = new Map<string, HeroFields>(
        (heroRows ?? []).map((r) => [
          r.id,
          {
            title: r.title ?? null,
            hero_description: r.hero_description ?? null,
            hero_highlight_1: r.hero_highlight_1 ?? null,
            hero_highlight_2: r.hero_highlight_2 ?? null,
            hero_highlight_3: r.hero_highlight_3 ?? null,
            hero_highlights_extra: r.hero_highlights_extra ?? null,
            hero_image_1_url: resolveHeroImage(r.hero_image_1_url, r.thumbnail_url),
          },
        ])
      );

      documents = links.map((item) => ({
        id: item.document_id,
        label: item.label?.trim() || "資料",
        ...(heroMap.get(item.document_id) ?? {}),
      }));
    }
  }

  return {
    formName,
    requestedDocumentLabel: null,
    templateId,
    documents,
  };
}

/**
 * ダウンロードページのデータは Supabase へ複数回クエリするため、
 * (documentId, formSlug) 単位で1時間キャッシュする。
 * 資料の編集 → revalidateTag('documents')、
 * フォーム設定／テンプレートの編集 → revalidateTag('download-form') で即時反映される。
 */
export const getDownloadPageContext = unstable_cache(
  fetchDownloadPageContext,
  ["download-page-context"],
  { revalidate: 3600, tags: ["documents", "download-form"] }
);
