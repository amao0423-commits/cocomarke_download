import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

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
      .from('download_form_configs')
      .select('id, slug, name, template_id, sort_order, created_at, updated_at')
      .order('sort_order', { ascending: true })
      .order('slug', { ascending: true });
    if (error) {
      console.error('download-form-configs GET:', error);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ configs: data ?? [] });
  } catch (e) {
    console.error('download-form-configs GET:', e);
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
    const slug =
      typeof json?.slug === 'string' ? json.slug.trim().toLowerCase() : '';
    const name = typeof json?.name === 'string' ? json.name.trim() : '';
    const templateId =
      json?.template_id === null || json?.template_id === ''
        ? null
        : typeof json?.template_id === 'string'
          ? json.template_id.trim()
          : null;

    if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            'スラッグは英小文字・数字・ハイフンで、先頭は英数字にしてください',
        },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: '表示名を入力してください' }, { status: 400 });
    }

    let verifiedTemplateId: string | null = null;
    if (templateId) {
      const { data: t } = await supabase
        .from('email_templates')
        .select('id')
        .eq('id', templateId)
        .maybeSingle();
      verifiedTemplateId = t?.id ?? null;
    }

    const { data, error } = await supabase
      .from('download_form_configs')
      .insert({
        slug,
        name,
        template_id: verifiedTemplateId,
        updated_at: new Date().toISOString(),
      })
      .select('id, slug, name, template_id, sort_order, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'このスラッグは既に使われています' },
          { status: 409 }
        );
      }
      console.error('download-form-configs POST:', error);
      return NextResponse.json({ error: '作成に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ config: data });
  } catch (e) {
    console.error('download-form-configs POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
