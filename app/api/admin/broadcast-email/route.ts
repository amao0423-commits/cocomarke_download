import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  collectBroadcastRecipientEmails,
  normalizeBroadcastRecipientSources,
  sendBroadcastEmails,
} from '@/lib/broadcastEmail';
import {
  buildBroadcastEmailHtmlFromContent,
  normalizeBroadcastBodyMode,
} from '@/lib/broadcastEmailContent';
import {
  createBroadcastCampaign,
  listBroadcastCampaigns,
  markBroadcastCampaignCancelled,
  recordCompletedBroadcastCampaign,
  sendSavedBroadcastCampaign,
} from '@/lib/broadcastEmailCampaigns';
import {
  getBroadcastSenderEmail,
  saveBroadcastSenderEmail,
} from '@/lib/siteSettings';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';
import { z } from 'zod';

/** 大量逐次送信のため上限を延長（プランに応じて調整） */
export const maxDuration = 60;

const emailSchema = z.string().trim().email().max(320);

const postSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('send_now'),
    subject: z.string().trim().min(1).max(998),
    mainBodyHtml: z.string().max(500_000).optional(),
    bodyContent: z.string().max(500_000).optional(),
    bodyMode: z.enum(['plain', 'html']).optional(),
    sources: z.array(z.string()).optional(),
    senderEmail: emailSchema.optional().or(z.literal('')),
  }),
  z.object({
    action: z.literal('preview'),
    bodyContent: z.string().max(500_000).optional(),
    mainBodyHtml: z.string().max(500_000).optional(),
    bodyMode: z.enum(['plain', 'html']).optional(),
  }),
  z.object({
    action: z.literal('test_send'),
    to: emailSchema,
    subject: z.string().trim().min(1).max(998),
    mainBodyHtml: z.string().max(500_000).optional(),
    bodyContent: z.string().max(500_000).optional(),
    bodyMode: z.enum(['plain', 'html']).optional(),
    senderEmail: emailSchema.optional().or(z.literal('')),
  }),
  z.object({
    action: z.literal('save_draft'),
    subject: z.string().trim().min(1).max(998),
    bodyContent: z.string().max(500_000),
    bodyMode: z.enum(['plain', 'html']).optional(),
    sources: z.array(z.string()).optional(),
    senderEmail: emailSchema.optional().or(z.literal('')),
  }),
  z.object({
    action: z.literal('schedule'),
    subject: z.string().trim().min(1).max(998),
    bodyContent: z.string().max(500_000),
    bodyMode: z.enum(['plain', 'html']).optional(),
    sources: z.array(z.string()).optional(),
    senderEmail: emailSchema.optional().or(z.literal('')),
    scheduledAt: z.string().datetime(),
  }),
  z.object({
    action: z.literal('cancel_schedule'),
    id: z.string().uuid(),
  }),
  z.object({
    action: z.literal('send_saved'),
    id: z.string().uuid(),
  }),
  z.object({
    action: z.literal('save_sender'),
    senderEmail: emailSchema,
  }),
]);

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'サーバー設定が不完全です' }, { status: 503 });
    }
    if (request.nextUrl.searchParams.get('view') === 'campaigns') {
      const { campaigns, error } = await listBroadcastCampaigns(supabase);
      if (error) return NextResponse.json({ error }, { status: 500 });
      const senderEmail = await getBroadcastSenderEmail();
      return NextResponse.json({ campaigns, senderEmail });
    }

    const sources = normalizeBroadcastRecipientSources(request.nextUrl.searchParams.getAll('source'));
    const { emails, error } = await collectBroadcastRecipientEmails(supabase, sources);
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

    const data = parsed.data as {
      action?: string;
      id?: string;
      to?: string;
      subject?: string;
      mainBodyHtml?: string;
      bodyContent?: string;
      bodyMode?: 'plain' | 'html';
      sources?: string[];
      senderEmail?: string;
      scheduledAt?: string;
    };
    const action = data.action ?? 'send_now';

    if (action === 'preview') {
      const html = buildBroadcastEmailHtmlFromContent({
        bodyContent: data.bodyContent ?? data.mainBodyHtml ?? '',
        bodyMode: normalizeBroadcastBodyMode(data.bodyMode),
      });
      return NextResponse.json({ ok: true, html });
    }

    if (action === 'test_send') {
      const html = buildBroadcastEmailHtmlFromContent({
        bodyContent: data.bodyContent ?? data.mainBodyHtml ?? '',
        bodyMode: normalizeBroadcastBodyMode(data.bodyMode),
      });
      await sendBrevoTransactionalEmail({
        to: data.to ?? '',
        subject: data.subject ?? '',
        html,
        senderEmail: data.senderEmail || undefined,
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'save_sender') {
      const saved = await saveBroadcastSenderEmail(data.senderEmail ?? '');
      if (!saved.ok) {
        return NextResponse.json({ error: saved.error }, { status: 500 });
      }
      return NextResponse.json({ ok: true, senderEmail: data.senderEmail });
    }

    if (action === 'save_draft' || action === 'schedule') {
      const sources = normalizeBroadcastRecipientSources(data.sources);
      if (sources.length === 0) {
        return NextResponse.json({ error: '送信先を1つ以上選んでください' }, { status: 400 });
      }
      const scheduledAt = action === 'schedule' ? data.scheduledAt ?? null : null;
      if (scheduledAt && new Date(scheduledAt).getTime() <= Date.now()) {
        return NextResponse.json({ error: '未来の予約日時を指定してください' }, { status: 400 });
      }
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
      }
      const created = await createBroadcastCampaign(supabase, {
        subject: data.subject ?? '',
        bodyContent: data.bodyContent ?? '',
        bodyMode: normalizeBroadcastBodyMode(data.bodyMode),
        recipientSources: sources,
        senderEmail: data.senderEmail || undefined,
        status: action === 'schedule' ? 'scheduled' : 'draft',
        scheduledAt,
      });
      if (created.error) {
        return NextResponse.json({ error: created.error }, { status: 500 });
      }
      return NextResponse.json({ ok: true, campaign: created.campaign });
    }

    if (action === 'cancel_schedule') {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
      }
      const result = await markBroadcastCampaignCancelled(supabase, data.id ?? '');
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'send_saved') {
      const result = await sendSavedBroadcastCampaign(data.id ?? '');
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    const sources = normalizeBroadcastRecipientSources(data.sources);
    if (sources.length === 0) {
      return NextResponse.json({ error: '送信先を1つ以上選んでください' }, { status: 400 });
    }
    const result = await sendBroadcastEmails({
      subject: data.subject ?? '',
      bodyContent: data.bodyContent ?? data.mainBodyHtml ?? '',
      bodyMode: normalizeBroadcastBodyMode(data.bodyMode),
      sources,
      senderEmail: data.senderEmail || undefined,
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

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await recordCompletedBroadcastCampaign(supabase, {
        subject: data.subject ?? '',
        bodyContent: data.bodyContent ?? data.mainBodyHtml ?? '',
        bodyMode: normalizeBroadcastBodyMode(data.bodyMode),
        recipientSources: sources,
        senderEmail: data.senderEmail || undefined,
        totalCount: result.total,
        sentCount: result.sent,
        failedCount: result.failed,
        errors: result.errors,
      });
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
