import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { documentCategoryCreateSchema } from '@/lib/validators/adminDocuments';

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
      .from('document_categories')
      .select('id, name, sort_order, created_at, headline, description')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) {
      console.error('document-categories GET:', error);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ categories: data ?? [] });
  } catch (e) {
    console.error('document-categories GET:', e);
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
    const parsed = documentCategoryCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'カテゴリ名を入力してください' }, { status: 400 });
    }
    const name = parsed.data.name;
    const { data: existing } = await supabase
      .from('document_categories')
      .select('id')
      .eq('name', name)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: '同じ名前のカテゴリが既にあります' }, { status: 409 });
    }
    const { data: maxRow } = await supabase
      .from('document_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (maxRow?.sort_order ?? 0) + 10;
    const { data: inserted, error } = await supabase
      .from('document_categories')
      .insert({ name, sort_order: nextOrder })
      .select()
      .single();
    if (error) {
      console.error('document-categories POST:', error);
      return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ category: inserted });
  } catch (e) {
    console.error('document-categories POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0) })).min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }
    const json = await request.json();
    const parsed = reorderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }
    const updates = parsed.data.items.map(({ id, sort_order }) =>
      supabase.from('document_categories').update({ sort_order }).eq('id', id),
    );
    await Promise.all(updates);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('document-categories PATCH:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
