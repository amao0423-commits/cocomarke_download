import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const HERO_SELECT =
  "id, title, hero_description, hero_highlight_1, hero_highlight_2, hero_highlight_3, hero_highlights_extra, hero_image_1_url";

type HeroFields = {
  title: string | null;
  hero_description: string | null;
  hero_highlight_1: string | null;
  hero_highlight_2: string | null;
  hero_highlight_3: string | null;
  hero_highlights_extra: string | null;
  hero_image_1_url: string | null;
};

export type PageDocument = {
  id: string;
  label: string;
  title?: string | null;
} & Partial<HeroFields>;

export async function getDownloadPageContext(
  documentId: string | undefined,
  formSlug: string
): Promise<{
  formName: string;
  requestedDocumentLabel: string | null;
  documents: PageDocument[];
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      formName: "COCOマーケ資料ダウンロード",
      requestedDocumentLabel: documentId ? "ご指定の資料" : null,
      documents: [],
    };
  }

  const { data: config } = await supabase
    .from("download_form_configs")
    .select("name, template_id")
    .eq("slug", formSlug)
    .maybeSingle();

  let documents: PageDocument[] = [];
  if (config?.template_id) {
    const { data: links } = await supabase
      .from("template_document_links")
      .select("document_id, label, sort_order")
      .eq("template_id", config.template_id)
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
            hero_image_1_url: r.hero_image_1_url ?? null,
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

  if (!documentId?.trim()) {
    return {
      formName: config?.name?.trim() || "COCOマーケ資料ダウンロード",
      requestedDocumentLabel: null,
      documents,
    };
  }

  const matched = documents.find((item) => item.id === documentId.trim());
  if (matched) {
    return {
      formName: config?.name?.trim() || "COCOマーケ資料ダウンロード",
      requestedDocumentLabel: matched.title?.trim() || matched.label,
      documents,
    };
  }

  const { data: document } = await supabase
    .from("documents")
    .select(`title, ${HERO_SELECT}`)
    .eq("id", documentId.trim())
    .maybeSingle();

  const extraDoc: PageDocument | null = document
    ? {
        id: documentId.trim(),
        label: document.title ?? "ご指定の資料",
        hero_description: document.hero_description ?? null,
        hero_highlight_1: document.hero_highlight_1 ?? null,
        hero_highlight_2: document.hero_highlight_2 ?? null,
        hero_highlight_3: document.hero_highlight_3 ?? null,
        hero_highlights_extra: document.hero_highlights_extra ?? null,
        hero_image_1_url: document.hero_image_1_url ?? null,
      }
    : null;

  if (extraDoc && !documents.some((d) => d.id === extraDoc.id)) {
    documents = [extraDoc, ...documents];
  }

  return {
    formName: config?.name?.trim() || "COCOマーケ資料ダウンロード",
    requestedDocumentLabel: extraDoc?.label ?? "ご指定の資料",
    documents,
  };
}
