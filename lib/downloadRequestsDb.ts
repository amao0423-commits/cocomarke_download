import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';
import type { EmailStatus } from '@/types/database.types';
import {
  normalizeDownloadRequestStatusForUi,
  type DownloadRequestStatus,
  type DownloadRequestEntry,
} from '@/lib/downloadRequestShared';
import { readDownloadRequests } from '@/lib/saveDownloadRequest';

export async function insertDownloadRequestRow(params: {
  id: string;
  name: string;
  lastName: string;
  firstName: string;
  email: string;
  company: string;
  department: string;
  phone: string;
  requestPurpose: string;
  questions: string;
  privacyConsent: boolean;
  requestedAt: string;
  templateId?: string | null;
  /** 後方互換: 単一資料。複数指定時は先頭と同一でよい */
  documentId?: string | null;
  /** 紐づける資料（1件以上）。空のときは document_id のみ */
  documentIds?: string[] | null;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const docIds = params.documentIds?.length
    ? params.documentIds
    : params.documentId
      ? [params.documentId]
      : [];
  const primaryDocId = docIds[0] ?? params.documentId ?? null;

  const { error } = await supabase.from('download_requests').insert({
    id: params.id,
    name: params.name,
    last_name: params.lastName,
    first_name: params.firstName,
    email: params.email,
    company: params.company,
    department: params.department,
    phone: params.phone,
    request_purpose: params.requestPurpose,
    questions: params.questions,
    privacy_consent: params.privacyConsent,
    requested_at: params.requestedAt,
    workflow_status: '送付済',
    email_status: 'pending',
    template_id: params.templateId ?? null,
    document_id: primaryDocId,
  });
  if (error) {
    console.error('insertDownloadRequestRow:', error);
    return false;
  }

  if (docIds.length > 0) {
    const rows = docIds.map((document_id, i) => ({
      request_id: params.id,
      document_id,
      sort_order: i,
    }));
    const { error: jErr } = await supabase
      .from('download_request_documents')
      .insert(rows);
    if (jErr) {
      console.error('insertDownloadRequestRow junction:', jErr);
      return false;
    }
  }

  return true;
}

/** メール送付・表示用: 申請に紐づく資料 ID（子テーブル優先） */
export async function fetchDocumentIdsForRequest(
  requestId: string
): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data: rows, error } = await supabase
    .from('download_request_documents')
    .select('document_id')
    .eq('request_id', requestId)
    .order('sort_order', { ascending: true });
  if (!error && rows && rows.length > 0) {
    return rows.map((r) => r.document_id);
  }
  const { data: one } = await supabase
    .from('download_requests')
    .select('document_id')
    .eq('id', requestId)
    .maybeSingle();
  return one?.document_id ? [one.document_id] : [];
}

export async function updateWorkflowStatusInDb(
  id: string,
  status: DownloadRequestStatus
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const { error } = await supabase
    .from('download_requests')
    .update({ workflow_status: status })
    .eq('id', id);
  if (error) console.error('updateWorkflowStatusInDb:', error);
}

export async function updateEmailStatusInDb(
  id: string,
  emailStatus: EmailStatus,
  templateId: string | null
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const { error } = await supabase
    .from('download_requests')
    .update({
      email_status: emailStatus,
      template_id: templateId,
    })
    .eq('id', id);
  if (error) console.error('updateEmailStatusInDb:', error);
}

export type DownloadRequestDbRow = {
  id: string;
  name: string;
  last_name: string | null;
  first_name: string | null;
  email: string;
  company: string;
  department: string;
  phone: string;
  request_purpose: string | null;
  questions: string;
  privacy_consent: boolean;
  requested_at: string;
  workflow_status: string;
  email_status: EmailStatus;
  template_id: string | null;
  document_id: string | null;
  template_subject?: string | null;
  document_title?: string | null;
};

export async function listDownloadRequestsFromDb(
  limit = 2000
): Promise<DownloadRequestDbRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('download_requests')
    .select(
      'id, name, last_name, first_name, email, company, department, phone, request_purpose, questions, privacy_consent, requested_at, workflow_status, email_status, template_id, document_id'
    )
    .order('requested_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('listDownloadRequestsFromDb:', error);
    return [];
  }
  const rows = (data ?? []) as DownloadRequestDbRow[];
  const templateIds = [
    ...new Set(rows.map((r) => r.template_id).filter(Boolean)),
  ] as string[];
  const requestIds = rows.map((r) => r.id);

  const subjectById = new Map<string, string>();
  if (templateIds.length > 0) {
    const { data: subjects } = await supabase
      .from('email_templates')
      .select('id, subject')
      .in('id', templateIds);
    for (const t of subjects ?? []) {
      subjectById.set(t.id, t.subject);
    }
  }

  // 子テーブル（複数資料）から request_id ごとの資料 ID 一覧を取得
  const junctionDocIdsByRequest = new Map<string, string[]>();
  if (requestIds.length > 0) {
    const { data: junctionRows } = await supabase
      .from('download_request_documents')
      .select('request_id, document_id')
      .in('request_id', requestIds)
      .order('sort_order', { ascending: true });
    for (const jr of junctionRows ?? []) {
      const arr = junctionDocIdsByRequest.get(jr.request_id) ?? [];
      arr.push(jr.document_id);
      junctionDocIdsByRequest.set(jr.request_id, arr);
    }
  }

  // 全資料タイトルを一括取得（子テーブル + 単体 document_id）
  const allDocIds = new Set<string>();
  for (const ids of junctionDocIdsByRequest.values()) ids.forEach((id) => allDocIds.add(id));
  for (const r of rows) if (r.document_id) allDocIds.add(r.document_id);

  const titleByDocId = new Map<string, string>();
  if (allDocIds.size > 0) {
    const { data: docs } = await supabase
      .from('documents')
      .select('id, title')
      .in('id', [...allDocIds]);
    for (const d of docs ?? []) {
      titleByDocId.set(d.id, d.title);
    }
  }

  return rows.map((r) => {
    const junctionIds = junctionDocIdsByRequest.get(r.id);
    const effectiveDocIds = junctionIds?.length ? junctionIds : r.document_id ? [r.document_id] : [];
    const titles = effectiveDocIds.map((id) => titleByDocId.get(id)).filter(Boolean) as string[];
    return {
      ...r,
      template_subject: r.template_id
        ? subjectById.get(r.template_id) ?? null
        : null,
      document_title: titles.length > 0 ? titles.join(' / ') : null,
    };
  });
}

export async function getDownloadRequestById(
  id: string
): Promise<DownloadRequestDbRow | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('download_requests')
    .select(
      'id, name, last_name, first_name, email, company, department, phone, request_purpose, questions, privacy_consent, requested_at, workflow_status, email_status, template_id, document_id'
    )
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('getDownloadRequestById:', error);
    return null;
  }
  return data as DownloadRequestDbRow | null;
}

/** Supabase 設定時は DB を主とし、Redis にのみある旧行を併合。未設定時は Redis のみ。 */
export async function getDownloadRequestsForAdmin(): Promise<
  DownloadRequestEntry[]
> {
  const fromRedis = await readDownloadRequests();
  if (!isSupabaseConfigured()) {
    return fromRedis;
  }
  const rows = await listDownloadRequestsFromDb();
  const fromDb: DownloadRequestEntry[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    lastName: r.last_name?.trim() ? r.last_name : undefined,
    firstName: r.first_name?.trim() ? r.first_name : undefined,
    email: r.email,
    company: r.company,
    department:
      typeof r.department === 'string' && r.department.trim()
        ? r.department
        : undefined,
    phone: r.phone ?? '',
    requestPurpose: r.request_purpose?.trim() ? r.request_purpose : undefined,
    questions: r.questions?.trim() ? r.questions : undefined,
    privacyConsent: r.privacy_consent,
    timestamp: r.requested_at,
    status: normalizeDownloadRequestStatusForUi(r.workflow_status),
    emailStatus: r.email_status,
    templateId: r.template_id,
    templateSubject: r.template_subject ?? null,
    documentId: r.document_id,
    documentTitle: r.document_title ?? null,
  }));
  const dbIds = new Set(fromDb.map((e) => e.id));
  const onlyRedis = fromRedis.filter((e) => !dbIds.has(e.id));
  const merged = [...fromDb, ...onlyRedis];
  merged.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return merged;
}
