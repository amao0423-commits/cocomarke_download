import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PATH = '/api/contact/set-instagram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ref = typeof body?.ref === 'string' ? body.ref.trim() : '';
    const instagramId = typeof body?.instagram_id === 'string' ? body.instagram_id.trim() : '';

    if (!ref || !instagramId) {
      return NextResponse.json(
        { error: 'ref と instagram_id が必要です' },
        { status: 400 }
      );
    }

    const hpBase = process.env.NEXT_PUBLIC_HP_API_BASE?.trim();
    if (!hpBase) {
      return NextResponse.json(
        { error: '送信先が設定されていません' },
        { status: 500 }
      );
    }

    const path =
      (typeof process.env.NEXT_PUBLIC_HP_SET_INSTAGRAM_PATH === 'string' &&
        process.env.NEXT_PUBLIC_HP_SET_INSTAGRAM_PATH.trim()) ||
      DEFAULT_PATH;
    const base = hpBase.replace(/\/$/, '');
    const targetUrl =
      path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref, instagram_id: instagramId }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('HP set-instagram failed', res.status, text);
      return NextResponse.json(
        { error: '送信先での処理に失敗しました' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('HP set-instagram proxy error', e);
    return NextResponse.json(
      { error: '送信時にエラーが発生しました' },
      { status: 500 }
    );
  }
}
