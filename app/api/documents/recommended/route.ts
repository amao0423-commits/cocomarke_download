import { NextRequest, NextResponse } from 'next/server';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/** サンクス画面用: 除外ID以外で created_at 最新から最大3件 */
const LIMIT = 3;
/** 除外が多い場合に備え、余分に取得してから絞り込む */
const FETCH_BUFFER = 48;

export async function GET(request: NextRequest) {
  try {
    const excludeParam = request.nextUrl.searchParams.get('exclude') ?? '';
    const excludeIds = excludeParam
      .split(',')
      .map((s) => s.trim())
      .filter((id) => /^[0-9a-f-]{36}$/i.test(id));

    const excludeSet = new Set(excludeIds);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ documents: [] });
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, title, category, thumbnail_url, created_at')
      .order('created_at', { ascending: false })
      .limit(FETCH_BUFFER);

    if (error) {
      console.error('documents recommended GET:', error);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }

    const documents = (data ?? [])
      .filter((d) => d.category !== PRIVATE_CATEGORY_NAME)
      .filter((d) => !excludeSet.has(d.id))
      .slice(0, LIMIT)
      .map((d) => ({
        id: d.id,
        label: typeof d.title === 'string' && d.title.trim() ? d.title.trim() : '資料',
        thumbnail_url:
          typeof d.thumbnail_url === 'string' && d.thumbnail_url.trim().length > 0
            ? d.thumbnail_url.trim()
            : null,
      }));

    return NextResponse.json({ documents });
  } catch (e) {
    console.error('documents recommended GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
