import { NextRequest, NextResponse } from 'next/server';
import {
  DOWNLOAD_REQUEST_STATUSES,
  type DownloadRequestStatus,
} from '@/lib/downloadRequestShared';
import { setDownloadRequestStatus } from '@/lib/saveDownloadRequest';
import { updateWorkflowStatusInDb } from '@/lib/downloadRequestsDb';

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
    const { id, status } = body as { id?: string; status?: string };

    if (typeof id !== 'string' || !id.trim()) {
      return NextResponse.json({ error: 'id が必要です' }, { status: 400 });
    }

    if (
      typeof status !== 'string' ||
      !DOWNLOAD_REQUEST_STATUSES.includes(status as DownloadRequestStatus)
    ) {
      return NextResponse.json(
        { error: 'status は 送付済 / リタ中 / 契約 のいずれかを指定してください' },
        { status: 400 }
      );
    }

    await setDownloadRequestStatus(id.trim(), status as DownloadRequestStatus);
    await updateWorkflowStatusInDb(id.trim(), status as DownloadRequestStatus);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin download-requests status PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
