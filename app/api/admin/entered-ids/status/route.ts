import { NextRequest, NextResponse } from 'next/server';
import {
  ENTERED_ID_STATUSES,
  type EnteredIdStatus,
} from '@/lib/enteredIdShared';
import { setEnteredIdStatus } from '@/lib/saveEnteredId';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const providedKey =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    if (!adminSecretKey || !providedKey || providedKey !== adminSecretKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, timestamp, status } = body as {
      id?: string;
      timestamp?: string;
      status?: string;
    };

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof timestamp !== 'string' ||
      !timestamp.trim()
    ) {
      return NextResponse.json(
        { error: 'id と timestamp が必要です' },
        { status: 400 }
      );
    }

    if (
      typeof status !== 'string' ||
      !ENTERED_ID_STATUSES.includes(status as EnteredIdStatus)
    ) {
      return NextResponse.json(
        { error: 'status は 未対応 / リタ中 / NG / 契約 のいずれかを指定してください' },
        { status: 400 }
      );
    }

    await setEnteredIdStatus(id.trim(), timestamp.trim(), status as EnteredIdStatus);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin status PATCH Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
