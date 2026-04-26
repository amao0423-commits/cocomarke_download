import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  DEFAULT_EMAIL_TEMPLATE_BODY_HTML,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from '@/lib/email-template-defaults';

const KEY_DEFAULT_BODY = 'default_email_template_body_html';
const KEY_DEFAULT_SUBJECT = 'default_email_template_subject';

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
