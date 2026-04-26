import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!storeName || !email) {
      return NextResponse.json({ error: '店舗名とメールアドレスは必須です' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 500 });
    }

    const toArray = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
    const toStr = (v: unknown): string | null =>
      typeof v === 'string' && v.trim() ? v.trim() : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('restaurant_diagnosis_requests')
      .insert({
        store_name: storeName,
        email,
        q1: toStr(body.q1),
        q2: toStr(body.q2),
        q3: toStr(body.q3),
        q4: toArray(body.q4),
        q5: toArray(body.q5),
        q6: toStr(body.q6),
        q8_area: toArray(body.q8_area),
        instagram: toStr(body.instagram),
        consultation: toStr(body.consultation),
      });

    if (error) {
      console.error('restaurant_diagnosis_requests insert error:', error);
      return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('restaurant-diagnosis POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
