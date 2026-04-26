import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { documentCategoryUpdateSchema } from '@/lib/validators/adminDocuments';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }
    const { id } = await params;
    const json = await request.json();
    const parsed = documentCategoryUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }
    const updates: Record<string, string | null> = {};
    if (parsed.data.headline !== undefined) {
      updates.headline = parsed.data.headline?.trim() || null;
    }
    if (parsed.data.description !== undefined) {
      updates.description = parsed.data.description?.trim() || null;
    }
    const { data, error } = await supabase
      .from('document_categories')
      .update(updates)
      .eq('id', id)
      .select('id, name, sort_order, headline, description')
      .single();
    if (error) {
      console.error('document-categories PATCH [id]:', error);
      return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ category: data });
  } catch (e) {
    console.error('document-categories PATCH [id]:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
