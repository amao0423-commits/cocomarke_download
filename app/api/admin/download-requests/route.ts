import { NextRequest, NextResponse } from 'next/server';
import { getDownloadRequestsForAdmin } from '@/lib/downloadRequestsDb';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const providedKey =
      authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    if (!adminSecretKey || !providedKey || providedKey !== adminSecretKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const entries = await getDownloadRequestsForAdmin();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Admin download-requests GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
