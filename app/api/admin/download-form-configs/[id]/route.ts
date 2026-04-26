import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

type Ctx = { params: Promise<{ id: string }> };

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
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof json?.name === 'string') {
      const name = json.name.trim();
      if (!name) {
        return NextResponse.json({ error: '表示名を入力してください' }, { status: 400 });
      }
      payload.name = name;
    }

    if (typeof json?.slug === 'string') {
      const slug = json.slug.trim().toLowerCase();
      if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
        return NextResponse.json(
          {
            error:
              'スラッグは英小文字・数字・ハイフンで、先頭は英数字にしてください',
          },
          { status: 400 }
        );
      }
      payload.slug = slug;
    }

    if ('template_id' in json) {
      const tid = json.template_id;
      if (tid === null || tid === '') {
        payload.template_id = null;
      } else if (typeof tid === 'string') {
        const trimmed = tid.trim();
        const { data: t } = await supabase
          .from('email_templates')
          .select('id')
          .eq('id', trimmed)
          .maybeSingle();
        payload.template_id = t?.id ?? null;
      }
    }

    if (typeof json?.sort_order === 'number' && Number.isFinite(json.sort_order)) {
      payload.sort_order = Math.floor(json.sort_order);
    }

    const { data, error } = await supabase
      .from('download_form_configs')
      .update(payload)
      .eq('id', id)
      .select('id, slug, name, template_id, sort_order, created_at, updated_at')
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'このスラッグは既に使われています' },
          { status: 409 }
        );
      }
      console.error('download-form-configs PATCH:', error);
      return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: '見つかりません' }, { status: 404 });
    }
    return NextResponse.json({ config: data });
  } catch (e) {
    console.error('download-form-configs PATCH:', e);
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

    const { data: row } = await supabase
      .from('download_form_configs')
      .select('slug')
      .eq('id', id)
      .maybeSingle();
    if (row?.slug === 'default') {
      return NextResponse.json(
        { error: '既定フォーム（default）は削除できません' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('download_form_configs').delete().eq('id', id);
    if (error) {
      console.error('download-form-configs DELETE:', error);
      return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('download-form-configs DELETE:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
