import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  DEFAULT_EMAIL_TEMPLATE_BODY_HTML,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from '@/lib/email-template-defaults';
import { defaultBrevoSenderEmail } from '@/lib/sendBrevoTransactionalEmail';

const KEY_DEFAULT_BODY = 'default_email_template_body_html';
const KEY_DEFAULT_SUBJECT = 'default_email_template_subject';
const KEY_BROADCAST_SENDER_EMAIL = 'broadcast_sender_email';

export async function getDefaultEmailTemplateBodyHtml(): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return DEFAULT_EMAIL_TEMPLATE_BODY_HTML;
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', KEY_DEFAULT_BODY)
    .maybeSingle();
  const v = data?.value?.trim();
  return v && v.length > 0 ? v : DEFAULT_EMAIL_TEMPLATE_BODY_HTML;
}

export async function getDefaultEmailTemplateSubject(): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return DEFAULT_EMAIL_TEMPLATE_SUBJECT;
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', KEY_DEFAULT_SUBJECT)
    .maybeSingle();
  const v = data?.value?.trim();
  return v && v.length > 0 ? v : DEFAULT_EMAIL_TEMPLATE_SUBJECT;
}

export async function getBroadcastSenderEmail(): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultBrevoSenderEmail();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', KEY_BROADCAST_SENDER_EMAIL)
    .maybeSingle();
  const v = data?.value?.trim();
  return v && v.length > 0 ? v : defaultBrevoSenderEmail();
}

export async function saveBroadcastSenderEmail(value: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: 'Supabase が未設定です' };
  const { error } = await supabase.from('site_settings').upsert({
    key: KEY_BROADCAST_SENDER_EMAIL,
    value: value.trim(),
  });
  if (error) {
    console.error('saveBroadcastSenderEmail:', error);
    return { ok: false, error: '送信元メールアドレスの保存に失敗しました' };
  }
  return { ok: true };
}
