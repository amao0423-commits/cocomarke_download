import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { emailTemplateCreateSchema } from '@/lib/validators/adminDocuments';
import { getDefaultEmailTemplateBodyHtml } from '@/lib/siteSettings';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      console.error('email-templates GET:', error);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ templates: data ?? [] });
  } catch (e) {
    console.error('email-templates GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const json = await request.json();
    const parsed = emailTemplateCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    let bodyHtml = parsed.data.body_html;
    if (bodyHtml === '__DEFAULT__') {
      bodyHtml = await getDefaultEmailTemplateBodyHtml();
    }

    const { data: inserted, error } = await supabase
      .from('email_templates')
      .insert({
        subject: parsed.data.subject,
        body_html: bodyHtml,
        // 旧構成の必須項目が残っている環境でも作成できるようにする。
        download_url: '',
        is_published: parsed.data.is_published ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('email-templates POST:', error);
      return NextResponse.json({ error: '作成に失敗しました' }, { status: 500 });
    }

    const links = parsed.data.links;
    if (links.length > 0 && inserted) {
      const rows = links.map((l, i) => ({
        template_id: inserted.id,
        document_id: l.document_id,
        label: l.label,
        sort_order: l.sort_order ?? i,
      }));
      const { error: linkErr } = await supabase.from('template_document_links').insert(rows);
      if (linkErr) {
        console.error('template links:', linkErr);
        await supabase.from('email_templates').delete().eq('id', inserted.id);
        return NextResponse.json({ error: '資料リンクの保存に失敗しました' }, { status: 500 });
      }
    }

    return NextResponse.json({ template: inserted });
  } catch (e) {
    console.error('email-templates POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
