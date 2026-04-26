import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { emailTemplateUpdateSchema } from '@/lib/validators/adminDocuments';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Ctx) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const { data: template, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !template) {
      return NextResponse.json({ error: '見つかりません' }, { status: 404 });
    }

    const { data: links } = await supabase
      .from('template_document_links')
      .select('id, document_id, label, sort_order')
      .eq('template_id', id)
      .order('sort_order', { ascending: true });

    return NextResponse.json({ template, links: links ?? [] });
  } catch (e) {
    console.error('email-templates GET id:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Ctx) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const json = await request.json();
    const parsed = emailTemplateUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    const { links, ...rest } = parsed.data;
    const updatePayload: Record<string, unknown> = {
      ...rest,
      updated_at: new Date().toISOString(),
    };
    Object.keys(updatePayload).forEach((k) => {
      if (updatePayload[k] === undefined) delete updatePayload[k];
    });

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await supabase.from('email_templates').update(updatePayload).eq('id', id);
      if (error) {
        console.error('email-templates PATCH:', error);
        return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
      }
    }

    if (links) {
      await supabase.from('template_document_links').delete().eq('template_id', id);
      if (links.length > 0) {
        const rows = links.map((l, i) => ({
          template_id: id,
          document_id: l.document_id,
          label: l.label,
          sort_order: l.sort_order ?? i,
        }));
        const { error: linkErr } = await supabase.from('template_document_links').insert(rows);
        if (linkErr) {
          console.error('template links PATCH:', linkErr);
          return NextResponse.json({ error: '資料リンクの更新に失敗しました' }, { status: 500 });
        }
      }
    }

    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    return NextResponse.json({ template });
  } catch (e) {
    console.error('email-templates PATCH:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Ctx) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const { error } = await supabase.from('email_templates').delete().eq('id', id);
    if (error) {
      console.error('email-templates DELETE:', error);
      return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('email-templates DELETE:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
