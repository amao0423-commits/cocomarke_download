import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 公開用: slug に紐づくフォーム設定（使用するメールテンプレID）を返す。
 */
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug')?.trim() || 'default';
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ templateId: null, name: '' });
    }
    const { data, error } = await supabase
      .from('download_form_configs')
      .select('template_id, name')
      .eq('slug', slug)
      .maybeSingle();
    if (error) {
      console.error('download-form-config GET:', error);
      return NextResponse.json({ templateId: null, name: '' });
    }
    if (!data) {
      return NextResponse.json({ templateId: null, name: '' });
    }
    return NextResponse.json({
      templateId: data.template_id,
      name: data.name,
    });
  } catch (e) {
    console.error('download-form-config GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
