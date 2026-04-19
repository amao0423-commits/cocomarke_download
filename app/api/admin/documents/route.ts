import { NextRequest, NextResponse } from 'next/server';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { documentCreateSchema } from '@/lib/validators/adminDocuments';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }
    const category = request.nextUrl.searchParams.get('category');
    let q = supabase
      .from('documents')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (category && category !== 'all' && category.trim()) {
      q = q.eq('category', category.trim());
    }
    const { data, error } = await q;
    if (error) {
      console.error('documents GET:', error);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ documents: data ?? [] });
  } catch (e) {
    console.error('documents GET:', e);
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
    const parsed = documentCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    const row = parsed.data;
    const category =
      row.category?.trim() && row.category.trim().length > 0
        ? row.category.trim()
        : PRIVATE_CATEGORY_NAME;
    const thumb =
      row.thumbnail_url && row.thumbnail_url.trim().length > 0
        ? row.thumbnail_url.trim()
        : null;

    const { data: inserted, error } = await supabase
      .from('documents')
      .insert({
        title: row.title,
        storage_path: row.storage_path,
        file_name: row.file_name ?? null,
        file_size: row.file_size ?? null,
        file_type: row.file_type ?? null,
        download_url: row.download_url ?? null,
        thumbnail_url: thumb,
        category,
      })
      .select()
      .single();

    if (error) {
      console.error('documents POST:', error);
      return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ document: inserted });
  } catch (e) {
    console.error('documents POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
