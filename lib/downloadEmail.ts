import sgMail from '@sendgrid/mail';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { updateEmailStatusInDb } from '@/lib/downloadRequestsDb';
import type { EmailStatus } from '@/types/database.types';
import { applyEmailHtmlAssetUrls } from '@/lib/emailLogoUrl';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getDocumentPublicUrl(storagePath?: string | null): string {
  const supabase = getSupabaseAdmin();
  if (!supabase || !storagePath?.trim()) {
    return '';
  }

  return (
    supabase.storage
      .from('documents')
      .getPublicUrl(storagePath).data.publicUrl ?? ''
  );
}

export async function getActiveTemplate(): Promise<{
  id: string;
  subject: string;
  body_html: string;
} | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('email_templates')
    .select('id, subject, body_html')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('getActiveTemplate:', error);
    return null;
  }
  if (!data) return null;
  return data;
}

async function loadTemplateLinks(templateId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('template_document_links')
    .select('label, document_id, sort_order')
    .eq('template_id', templateId)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('loadTemplateLinks:', error);
    return [];
  }
  return data ?? [];
}

async function loadRequestDocuments(requestId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('download_request_documents')
    .select(
      `
      document_id,
      documents (
        id,
        title,
        storage_path
      )
    `
    )
    .eq('request_id', requestId);

  if (error) {
    console.error('loadRequestDocuments:', error);
    return [];
  }

  return data ?? [];
}

async function buildDocumentButtonsHtml(
  templateId: string,
  requestId?: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return '<p style="color:#666;font-size:14px;">（資料のリンクを取得できませんでした）</p>';
  }

  const templateLinks = await loadTemplateLinks(templateId);
  const requestDocs = requestId ? await loadRequestDocuments(requestId) : [];

  const map = new Map<string, { label: string; storagePath: string }>();

  for (const link of templateLinks) {
    const { data: doc, error: docErr } = await supabase
      .from('documents')
      .select('id, title, storage_path')
      .eq('id', link.document_id)
      .maybeSingle();
    if (docErr || !doc?.storage_path) continue;

    map.set(link.document_id, {
      label: link.label?.trim() || doc.title || '資料をダウンロード',
      storagePath: doc.storage_path,
    });
  }

  for (const item of requestDocs) {
    const doc = Array.isArray(item.documents) ? item.documents[0] : item.documents;
    if (!doc?.id || !doc.storage_path || map.has(doc.id)) {
      continue;
    }

    map.set(doc.id, {
      label: doc.title?.trim() || '資料をダウンロード',
      storagePath: doc.storage_path,
    });
  }

  if (map.size === 0) {
    return '<p style="color:#666;font-size:14px;">（このテンプレに紐づく資料がありません）</p>';
  }

  const buttons = Array.from(map.values())
    .map((doc) => {
      const url = getDocumentPublicUrl(doc.storagePath);
      if (!url) return '';

      return `
      <div style="margin:12px 0;">
        <a href="${url}" target="_blank"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#111;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
            font-size:14px;
          ">
          ${escapeHtml(doc.label)}
        </a>
      </div>
    `;
    })
    .filter(Boolean);

  if (buttons.length === 0) {
    return '<p style="color:#666;font-size:14px;">（資料の公開リンクを生成できませんでした）</p>';
  }

  return buttons.join('');
}

function sendgridConfigured(): boolean {
  return !!(
    process.env.SENDGRID_API_KEY?.trim() && process.env.SENDGRID_FROM_EMAIL?.trim()
  );
}

export async function sendOutboundEmailForRequest(
  requestId: string,
  options?: { templateId?: string }
): Promise<{ ok: boolean; emailStatus: EmailStatus; reason?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, emailStatus: 'pending', reason: 'Supabase未設定' };
  }

  if (!sendgridConfigured()) {
    return { ok: false, emailStatus: 'pending', reason: 'SendGrid未設定' };
  }

  const { data: row, error: rowErr } = await supabase
    .from('download_requests')
    .select('id, name, email, company, phone, template_id, document_id')
    .eq('id', requestId)
    .maybeSingle();
  if (rowErr || !row) {
    return { ok: false, emailStatus: 'failed', reason: '申請が見つかりません' };
  }

  let template =
    options?.templateId != null
      ? (
          await supabase
            .from('email_templates')
            .select('id, subject, body_html')
            .eq('id', options.templateId)
            .maybeSingle()
        ).data
      : null;

  if (!template) {
    const tid = row.template_id;
    if (tid) {
      const { data } = await supabase
        .from('email_templates')
        .select('id, subject, body_html')
        .eq('id', tid)
        .maybeSingle();
      template = data;
    }
  }
  if (!template) {
    template = await getActiveTemplate();
  }

  if (!template) {
    await updateEmailStatusInDb(requestId, 'failed', null);
    return {
      ok: false,
      emailStatus: 'failed',
      reason: 'メールテンプレートが見つかりません（指定または公開中のテンプレを確認してください）',
    };
  }

  const documentButtons = await buildDocumentButtonsHtml(template.id, requestId);
  const phoneText =
    typeof row.phone === 'string' ? row.phone.trim() : '';
  let html = template.body_html
    .replace(/\{\{name\}\}/g, escapeHtml(row.name))
    .replace(/\{\{phone\}\}/g, escapeHtml(phoneText))
    .replace(/\{\{documentButtons\}\}/g, documentButtons);

  html = applyEmailHtmlAssetUrls(html);

  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: false, emailStatus: 'pending', reason: 'SendGrid未設定' };
  }

  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      to: row.email,
      from,
      subject: template.subject,
      html,
    });
    await updateEmailStatusInDb(requestId, 'sent', template.id);
    return { ok: true, emailStatus: 'sent' };
  } catch (e) {
    console.error('sendOutboundEmailForRequest:', e);
    await updateEmailStatusInDb(requestId, 'failed', template.id);
    return { ok: false, emailStatus: 'failed', reason: 'SendGrid送信エラー' };
  }
}

/**
 * 管理画面からのテスト送信。実際の資料URLを含む。
 */
export async function sendTemplateTestEmail(params: {
  templateId: string;
  to: string;
  sampleName: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, reason: 'Supabase未設定' };
  }
  if (!sendgridConfigured()) {
    return { ok: false, reason: 'SendGrid未設定' };
  }
  const { data: template, error } = await supabase
    .from('email_templates')
    .select('id, subject, body_html')
    .eq('id', params.templateId)
    .maybeSingle();
  if (error || !template) {
    return { ok: false, reason: 'テンプレが見つかりません' };
  }
  const documentButtons = await buildDocumentButtonsHtml(template.id);
  let html = template.body_html
    .replace(/\{\{name\}\}/g, escapeHtml(params.sampleName))
    .replace(/\{\{phone\}\}/g, '')
    .replace(/\{\{documentButtons\}\}/g, documentButtons);
  html = applyEmailHtmlAssetUrls(html);
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: false, reason: 'SendGrid未設定' };
  }
  sgMail.setApiKey(apiKey);
  try {
    await sgMail.send({
      to: params.to.trim(),
      from,
      subject: `[テスト] ${template.subject}`,
      html,
    });
    return { ok: true };
  } catch (e) {
    console.error('sendTemplateTestEmail:', e);
    return { ok: false, reason: 'SendGrid送信エラー' };
  }
}
