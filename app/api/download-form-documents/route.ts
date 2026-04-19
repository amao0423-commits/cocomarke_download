import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 公開: フォーム slug に紐づくテンプレの資料一覧（チェックボックス用）
 */
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug')?.trim() || 'default';
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ templateId: null, documents: [] });
    }

    const { data: cfg, error: cfgErr } = await supabase
      .from('download_form_configs')
      .select('template_id')
      .eq('slug', slug)
      .maybeSingle();

    if (cfgErr || !cfg?.template_id) {
      return NextResponse.json({ templateId: null, documents: [] });
    }

    const templateId = cfg.template_id as string;

    const { data: links, error: linkErr } = await supabase
      .from('template_document_links')
      .select('document_id, label, sort_order')
      .eq('template_id', templateId)
      .order('sort_order', { ascending: true });

    if (linkErr) {
      console.error('download-form-documents:', linkErr);
      return NextResponse.json({ error: '取得に失敗しました' }, { status: 500 });
    }

    const documents = (links ?? []).map((row) => ({
      id: row.document_id,
      label: row.label?.trim() || '資料',
    }));

    return NextResponse.json({ templateId, documents });
  } catch (e) {
    console.error('download-form-documents GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
