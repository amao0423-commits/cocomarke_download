import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  collectBroadcastRecipientEmails,
  sendBroadcastEmails,
} from '@/lib/broadcastEmail';
import { z } from 'zod';

/** 大量逐次送信のため上限を延長（プランに応じて調整） */
export const maxDuration = 60;

const postSchema = z.object({
  subject: z.string().trim().min(1).max(998),
  mainBodyHtml: z.string().max(500_000),
});

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 503 });
    }
    const { emails, error } = await collectBroadcastRecipientEmails(supabase);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ count: emails.length });
  } catch (e) {
    console.error('broadcast-email GET:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'JSON が不正です' }, { status: 400 });
    }

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join('; ');
      return NextResponse.json({ error: msg || '入力が不正です' }, { status: 400 });
    }

    const result = await sendBroadcastEmails({
      subject: parsed.data.subject,
      mainBodyHtml: parsed.data.mainBodyHtml,
    });

    if (!result.ok) {
      const status =
        result.reason === '宛先がありません'
          ? 400
          : result.reason.includes('未設定')
            ? 503
            : 500;
      return NextResponse.json({ ok: false, reason: result.reason }, { status });
    }

    return NextResponse.json({
      ok: true,
      total: result.total,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors,
    });
  } catch (e) {
    console.error('broadcast-email POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
