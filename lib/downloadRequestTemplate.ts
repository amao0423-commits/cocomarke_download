import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * フォームから送られた templateId を検証し、存在するテンプレの UUID のみ返す。
 * 不正・未登録の場合は null（送信時は公開テンプレにフォールバック）。
 */
export async function normalizeDownloadRequestTemplateId(
  raw: unknown
): Promise<string | null> {
  if (raw == null || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || !UUID_RE.test(trimmed)) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from('email_templates')
    .select('id')
    .eq('id', trimmed)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * 選択された資料から、送信に使うテンプレートをできるだけ自動で決める。
 * - フォーム側で指定済みのテンプレートがあり、全資料がそのテンプレに含まれる場合はそれを優先
 * - 指定がなくても、全資料に共通するテンプレートが1つだけならそれを採用
 * - 資料ごとに別テンプレートが混在する場合は、フォーム指定または公開中テンプレにフォールバック
 */
export async function resolveDownloadRequestTemplateId(params: {
  requestedTemplateId: string | null;
  documentIds: string[];
}): Promise<string | null> {
  const requestedTemplateId = params.requestedTemplateId;
  const documentIds = [...new Set(params.documentIds.filter(Boolean))];

  if (documentIds.length === 0) {
    return requestedTemplateId;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return requestedTemplateId;

  const { data: links, error } = await supabase
    .from('template_document_links')
    .select('template_id, document_id')
    .in('document_id', documentIds);

  if (error || !links || links.length === 0) {
    if (error) {
      console.error('resolveDownloadRequestTemplateId:', error);
    }
    return requestedTemplateId;
  }

  const templateIdsByDocument = new Map<string, Set<string>>();
  for (const documentId of documentIds) {
    templateIdsByDocument.set(documentId, new Set<string>());
  }

  for (const link of links) {
    const set = templateIdsByDocument.get(link.document_id);
    if (set) set.add(link.template_id);
  }

  if (
    requestedTemplateId &&
    documentIds.every((documentId) =>
      templateIdsByDocument.get(documentId)?.has(requestedTemplateId)
    )
  ) {
    return requestedTemplateId;
  }

  let sharedTemplateIds: Set<string> | null = null;
  for (const documentId of documentIds) {
    const candidates = templateIdsByDocument.get(documentId);
    if (!candidates || candidates.size === 0) {
      return requestedTemplateId;
    }
    if (!sharedTemplateIds) {
      sharedTemplateIds = new Set(candidates);
      continue;
    }
    sharedTemplateIds = new Set(
      [...sharedTemplateIds].filter((templateId) => candidates.has(templateId))
    );
    if (sharedTemplateIds.size === 0) {
      return requestedTemplateId;
    }
  }

  if (!sharedTemplateIds || sharedTemplateIds.size !== 1) {
    return requestedTemplateId;
  }

  return [...sharedTemplateIds][0] ?? requestedTemplateId;
}
