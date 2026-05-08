import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { buildBroadcastEmailHtml } from '@/lib/broadcastEmailLayout';
import { brevoMailConfigured } from '@/lib/brevoConfigured';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** download_requests と restaurant_diagnosis_requests から宛先を集約（重複は小文字キーで1件） */
export async function collectBroadcastRecipientEmails(
  supabase: SupabaseClient<Database>
): Promise<{ emails: string[]; error?: string }> {
  const { data: dr, error: e1 } = await supabase.from('download_requests').select('email');
  if (e1) {
    console.error('collectBroadcastRecipientEmails download_requests:', e1);
    return { emails: [], error: 'ダウンロード申請の取得に失敗しました' };
  }

  // DB 型に未登録のテーブルのため narrow クエリのみ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rd, error: e2 } = await (supabase as any)
    .from('restaurant_diagnosis_requests')
    .select('email');
  if (e2) {
    console.error('collectBroadcastRecipientEmails restaurant_diagnosis_requests:', e2);
    return { emails: [], error: 'レストラン診断申請の取得に失敗しました' };
  }

  const byLower = new Map<string, string>();
  for (const row of dr ?? []) {
    const raw = typeof row.email === 'string' ? row.email.trim() : '';
    if (!raw || !looksLikeEmail(raw)) continue;
    const key = raw.toLowerCase();
    if (!byLower.has(key)) byLower.set(key, raw);
  }
  for (const row of (rd ?? []) as { email?: string }[]) {
    const raw = typeof row.email === 'string' ? row.email.trim() : '';
    if (!raw || !looksLikeEmail(raw)) continue;
    const key = raw.toLowerCase();
    if (!byLower.has(key)) byLower.set(key, raw);
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
  mainBodyHtml: string;
}): Promise<(BroadcastSendResult & { ok: true }) | { ok: false; reason: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, reason: 'Supabase未設定' };
  }
  if (!brevoMailConfigured()) {
    return { ok: false, reason: 'メール送信の設定が不足しています' };
  }

  const { emails, error } = await collectBroadcastRecipientEmails(supabase);
  if (error) {
    return { ok: false, reason: error };
  }
  if (emails.length === 0) {
    return { ok: false, reason: '宛先がありません' };
  }

  const html = buildBroadcastEmailHtml(params.mainBodyHtml);

  const errors: { email: string; reason: string }[] = [];
  let sent = 0;
  let n = 0;
  for (const to of emails) {
    try {
      await sendBrevoTransactionalEmail({
        to,
        subject: params.subject,
        html,
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
