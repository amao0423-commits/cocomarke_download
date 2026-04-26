import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, unauthorized } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return unauthorized();

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('restaurant_diagnosis_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('restaurant_diagnosis_requests select error:', error);
      return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ entries: data ?? [] });
  } catch (err) {
    console.error('admin restaurant-diagnosis-requests GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
