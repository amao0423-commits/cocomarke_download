import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { sendOutboundEmailForRequest } from '@/lib/downloadEmail';

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'id が必要です' }, { status: 400 });
    }

    const result = await sendOutboundEmailForRequest(id);
    return NextResponse.json({
      ok: result.ok,
      emailStatus: result.emailStatus,
      reason: result.reason,
    });
  } catch (error) {
    console.error('resend error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
