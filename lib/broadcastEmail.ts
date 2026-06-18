import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import {
  buildBroadcastEmailHtmlFromContent,
  type BroadcastBodyMode,
} from '@/lib/broadcastEmailContent';
import { brevoMailConfigured } from '@/lib/brevoConfigured';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export const BROADCAST_RECIPIENT_SOURCES = [
  'download_requests',
  'restaurant_diagnosis_requests',
] as const;

export type BroadcastRecipientSource = (typeof BROADCAST_RECIPIENT_SOURCES)[number];

export const DEFAULT_BROADCAST_RECIPIENT_SOURCES: BroadcastRecipientSource[] = [
  ...BROADCAST_RECIPIENT_SOURCES,
];

export function normalizeBroadcastRecipientSources(
  sources: unknown
): BroadcastRecipientSource[] {
  if (!Array.isArray(sources)) return DEFAULT_BROADCAST_RECIPIENT_SOURCES;

  const allowed = new Set<BroadcastRecipientSource>(BROADCAST_RECIPIENT_SOURCES);
  const normalized: BroadcastRecipientSource[] = [];
  for (const source of sources) {
    if (typeof source !== 'string') continue;
    if (!allowed.has(source as BroadcastRecipientSource)) continue;
    const typedSource = source as BroadcastRecipientSource;
    if (!normalized.includes(typedSource)) normalized.push(typedSource);
  }
  return normalized;
}

/** 宛先絞り込みオプション。downloadDocumentId 指定時は資料ダウンロード申請をその資料の請求者のみに限定 */
export type BroadcastRecipientFilter = {
  downloadDocumentId?: string | null;
};

/** 選択された申請元から宛先を集約（重複は小文字キーで1件） */
export async function collectBroadcastRecipientEmails(
  supabase: SupabaseClient<Database>,
  sources: BroadcastRecipientSource[] = DEFAULT_BROADCAST_RECIPIENT_SOURCES,
  filter: BroadcastRecipientFilter = {}
): Promise<{ emails: string[]; error?: string }> {
  const byLower = new Map<string, string>();

  if (sources.includes('download_requests')) {
    let query = supabase.from('download_requests').select('email');
    const docId = filter.downloadDocumentId?.trim();
    if (docId) {
      query = query.eq('document_id', docId);
    }
    const { data: dr, error: e1 } = await query;
    if (e1) {
      console.error('collectBroadcastRecipientEmails download_requests:', e1);
      return { emails: [], error: 'ダウンロード申請の取得に失敗しました' };
    }

    for (const row of dr ?? []) {
      const raw = typeof row.email === 'string' ? row.email.trim() : '';
      if (!raw || !looksLikeEmail(raw)) continue;
      const key = raw.toLowerCase();
      if (!byLower.has(key)) byLower.set(key, raw);
    }
  }

  if (sources.includes('restaurant_diagnosis_requests')) {
    // DB 型に未登録のテーブルのため narrow クエリのみ
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rd, error: e2 } = await (supabase as any)
      .from('restaurant_diagnosis_requests')
      .select('email');
    if (e2) {
      console.error('collectBroadcastRecipientEmails restaurant_diagnosis_requests:', e2);
      return { emails: [], error: 'レストラン診断申請の取得に失敗しました' };
    }

    for (const row of (rd ?? []) as { email?: string }[]) {
      const raw = typeof row.email === 'string' ? row.email.trim() : '';
      if (!raw || !looksLikeEmail(raw)) continue;
      const key = raw.toLowerCase();
      if (!byLower.has(key)) byLower.set(key, raw);
    }
  }

  return { emails: [...byLower.values()] };
}

export type BroadcastSendResult = {
  total: number;
  sent: number;
  failed: number;
  errors: { email: string; reason: string }[];
};

export async function sendBroadcastEmails(params: {
  subject: string;
  mainBodyHtml?: string;
  bodyContent?: string;
  bodyMode?: BroadcastBodyMode;
  sources?: BroadcastRecipientSource[];
  senderEmail?: string;
  downloadDocumentId?: string | null;
}): Promise<(BroadcastSendResult & { ok: true }) | { ok: false; reason: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, reason: 'Supabase未設定' };
  }
  if (!brevoMailConfigured()) {
    return { ok: false, reason: 'メール送信の設定が不足しています' };
  }

  const { emails, error } = await collectBroadcastRecipientEmails(
    supabase,
    params.sources ?? DEFAULT_BROADCAST_RECIPIENT_SOURCES,
    { downloadDocumentId: params.downloadDocumentId ?? null }
  );
  if (error) {
    return { ok: false, reason: error };
  }
  if (emails.length === 0) {
    return { ok: false, reason: '宛先がありません' };
  }

  const html = buildBroadcastEmailHtmlFromContent({
    bodyContent: params.bodyContent ?? params.mainBodyHtml ?? '',
    bodyMode: params.bodyMode ?? 'html',
  });

  const errors: { email: string; reason: string }[] = [];
  let sent = 0;
  let n = 0;
  for (const to of emails) {
    try {
      await sendBrevoTransactionalEmail({
        to,
        subject: params.subject,
        html,
        senderEmail: params.senderEmail,
      });
      sent++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'メールの送信に失敗しました';
      errors.push({ email: to, reason: msg });
    }
    n++;
    if (n % 20 === 0) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  return {
    ok: true,
    total: emails.length,
    sent,
    failed: errors.length,
    errors,
  };
}
