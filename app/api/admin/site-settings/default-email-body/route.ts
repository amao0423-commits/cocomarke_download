import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  getDefaultEmailTemplateBodyHtml,
  getDefaultEmailTemplateSubject,
} from '@/lib/siteSettings';
import {
  DEFAULT_EMAIL_TEMPLATE_BODY_HTML,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from '@/lib/email-template-defaults';
import { z } from 'zod';

const putSchema = z
  .object({
    /** 既定HTML本文 */
    bodyHtml: z.string().optional(),
    /** 互換: 旧クライアント向け（bodyHtml と同義） */
    value: z.string().optional(),
    /** 既定件名 */
    subject: z.string().optional(),
  })
  .refine(
    (d) =>
      d.bodyHtml !== undefined ||
      d.value !== undefined ||
      d.subject !== undefined,
    { message: 'bodyHtml・value・subject のいずれかを指定してください' }
  );

const KEY_BODY = 'default_email_template_body_html';
const KEY_SUBJECT = 'default_email_template_subject';

export async function GET(_request: NextRequest) {
  try {
    if (!verifyAdmin(_request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const [bodyHtml, subject] = await Promise.all([
      getDefaultEmailTemplateBodyHtml(),
      getDefaultEmailTemplateSubject(),
    ]);
    return NextResponse.json({
      value: bodyHtml,
      bodyHtml,
      subject,
      usesFallbackBody: bodyHtml === DEFAULT_EMAIL_TEMPLATE_BODY_HTML,
      usesFallbackSubject: subject === DEFAULT_EMAIL_TEMPLATE_SUBJECT,
      /** @deprecated usesFallbackBody を参照 */
      fallback: bodyHtml === DEFAULT_EMAIL_TEMPLATE_BODY_HTML,
    });
  } catch (e) {
    console.error('default-email-body GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const json = await request.json();
    const parsed = putSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    const bodyToSave = parsed.data.bodyHtml ?? parsed.data.value;
    if (bodyToSave !== undefined) {
      const { error } = await supabase.from('site_settings').upsert({
        key: KEY_BODY,
        value: bodyToSave,
      });
      if (error) {
        console.error('site_settings upsert body:', error);
        return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
      }
    }

    if (parsed.data.subject !== undefined) {
      const trimmed = parsed.data.subject.trim();
      if (!trimmed) {
        return NextResponse.json({ error: '件名は空にできません' }, { status: 400 });
      }
      const { error } = await supabase.from('site_settings').upsert({
        key: KEY_SUBJECT,
        value: trimmed,
      });
      if (error) {
        console.error('site_settings upsert subject:', error);
        return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('default-email-body PUT:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
