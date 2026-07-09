import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, unauthorized } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// かんたんプランニングの送信履歴（管理画面タブから閲覧・削除）
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return unauthorized();
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 500 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('planning_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('planning_requests select error:', error);
      return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ entries: data ?? [] });
  } catch (err) {
    console.error('admin planning-requests GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) return unauthorized();
  try {
    const body = await request.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids)
      ? body.ids.filter((x: unknown): x is string => typeof x === 'string' && x.trim() !== '')
      : [];
    if (ids.length === 0) return NextResponse.json({ deleted: 0 });
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 500 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('planning_requests')
      .delete()
      .in('id', ids)
      .select('id');
    if (error) {
      console.error('planning_requests delete error:', error);
      return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ deleted: (data as { id: string }[] | null)?.length ?? 0 });
  } catch (err) {
    console.error('admin planning-requests DELETE error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
