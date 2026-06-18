import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { processDueBroadcastCampaigns } from '@/lib/broadcastEmailCampaigns';

export const maxDuration = 60;

function verifyCronOrAdmin(request: NextRequest): boolean {
  if (verifyAdmin(request)) return true;

  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get('Authorization');
  const provided = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (cronSecret && provided === cronSecret) return true;

  return request.headers.get('x-vercel-cron') === '1';
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyCronOrAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await processDueBroadcastCampaigns();
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, processed: result.processed, error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, processed: result.processed });
  } catch (e) {
    console.error('broadcast-email run-due:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
