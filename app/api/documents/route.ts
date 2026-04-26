import { NextResponse } from 'next/server';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 公開用: HOME 等。storage_path は返さない。
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ documents: [] });
    }
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, category, sort_order')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });
    if (error) {
      console.error('public documents GET:', error);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }
    const list = (data ?? []).filter((d) => d.category !== PRIVATE_CATEGORY_NAME);
    return NextResponse.json({ documents: list });
  } catch (e) {
    console.error('public documents GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
