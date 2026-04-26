import { NextRequest, NextResponse } from 'next/server';
import { getEnteredIdResult } from '@/lib/saveEnteredId';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const providedKey =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY;
    if (!adminSecretKey || !providedKey || providedKey !== adminSecretKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();
    const timestamp = searchParams.get('timestamp')?.trim();

    if (!id || !timestamp) {
      return NextResponse.json(
        { error: 'id と timestamp を指定してください' },
        { status: 400 }
      );
    }

    const result = await getEnteredIdResult(id, timestamp);
    if (result == null) {
      return NextResponse.json(
        { error: '該当する診断結果が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin result API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
