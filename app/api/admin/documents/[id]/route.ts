import { NextRequest, NextResponse } from 'next/server';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { documentCreateSchema } from '@/lib/validators/adminDocuments';
import type { Database } from '@/types/database.types';

type DocUpdate = Database['public']['Tables']['documents']['Update'];

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
    const partial = documentCreateSchema.partial().safeParse(json);
    if (!partial.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    const normalizeUrl = (v: unknown): string | null | undefined => {
      if (v === undefined) return undefined;
      if (typeof v !== 'string') return null;
      return v.trim().length > 0 ? v.trim() : null;
    };

    const patch: DocUpdate = {
      ...(partial.data as DocUpdate),
      updated_at: new Date().toISOString(),
    };
    if ('category' in partial.data && partial.data.category !== undefined) {
      const raw = partial.data.category;
      const c = typeof raw === 'string' ? raw.trim() : '';
      patch.category = c.length > 0 ? c : PRIVATE_CATEGORY_NAME;
    }
    for (const key of ['thumbnail_url', 'hero_image_1_url', 'hero_image_2_url'] as const) {
      if (key in partial.data && (partial.data as Record<string, unknown>)[key] !== undefined) {
        (patch as Record<string, unknown>)[key] = normalizeUrl((partial.data as Record<string, unknown>)[key]);
      }
    }
    for (const key of [
      'hero_description',
      'hero_highlight_1',
      'hero_highlight_2',
      'hero_highlight_3',
      'hero_highlights_extra',
    ] as const) {
      if (key in partial.data && (partial.data as Record<string, unknown>)[key] !== undefined) {
        const v = (partial.data as Record<string, unknown>)[key];
        (patch as Record<string, unknown>)[key] =
          typeof v === 'string' && v.trim().length > 0 ? v.trim() : null;
      }
    }
    Object.keys(patch).forEach((k) => {
      if (patch[k as keyof DocUpdate] === undefined) {
        delete patch[k as keyof DocUpdate];
      }
    });

    const { data, error } = await supabase
      .from('documents')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('documents PATCH:', error);
      return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ document: data });
  } catch (e) {
    console.error('documents PATCH:', e);
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

    const { data: row, error: fetchErr } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !row?.storage_path) {
      return NextResponse.json({ error: '資料が見つかりません' }, { status: 404 });
    }

    const { error: rmErr } = await supabase.storage.from('documents').remove([row.storage_path]);
    if (rmErr) {
      console.error('storage remove:', rmErr);
    }

    const { error: delErr } = await supabase.from('documents').delete().eq('id', id);
    if (delErr) {
      console.error('documents DELETE:', delErr);
      return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('documents DELETE:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
