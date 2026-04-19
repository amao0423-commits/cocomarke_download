import { NextRequest, NextResponse } from 'next/server';
import { readEnteredIds } from '@/lib/saveEnteredId';

export async function GET(request: NextRequest) {
  try {
    // 秘密キーは Authorization: Bearer <key> で受け取る（URLに載せない）
    const authHeader = request.headers.get('Authorization');
    const providedKey =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    // 秘密キーが設定されていない、または一致しない場合は403
    if (!adminSecretKey || !providedKey || providedKey !== adminSecretKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // キーが正しい場合のみ、入力されたIDの一覧を返す
    const entries = await readEnteredIds();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
