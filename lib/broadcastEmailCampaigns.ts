import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/types/database.types';
import type { BroadcastBodyMode } from '@/lib/broadcastEmailContent';
import type { BroadcastRecipientSource } from '@/lib/broadcastEmail';
import { sendBroadcastEmails } from '@/lib/broadcastEmail';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const BROADCAST_CAMPAIGN_STATUSES = [
  'draft',
  'scheduled',
  'sending',
  'sent',
  'failed',
  'cancelled',
] as const;

export type BroadcastCampaignStatus = (typeof BROADCAST_CAMPAIGN_STATUSES)[number];

export type BroadcastCampaign = {
  id: string;
  subject: string;
  bodyContent: string;
  bodyMode: BroadcastBodyMode;
  recipientSources: BroadcastRecipientSource[];
  senderEmail: string | null;
  status: BroadcastCampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  errors: { email: string; reason: string }[];
  createdAt: string;
  updatedAt: string;
};

type CampaignRow = {
  id: string;
  subject: string;
  body_content: string;
  body_mode: BroadcastBodyMode;
  recipient_sources: BroadcastRecipientSource[];
  sender_email: string | null;
  status: BroadcastCampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  total_count: number;
  sent_count: number;
  failed_count: number;
  errors: { email: string; reason: string }[] | null;
  created_at: string;
  updated_at: string;
};

function mapCampaign(row: CampaignRow): BroadcastCampaign {
  return {
    id: row.id,
    subject: row.subject,
    bodyContent: row.body_content,
    bodyMode: row.body_mode,
    recipientSources: row.recipient_sources,
    senderEmail: row.sender_email,
    status: row.status,
    scheduledAt: row.scheduled_at,
    sentAt: row.sent_at,
    totalCount: row.total_count,
    sentCount: row.sent_count,
    failedCount: row.failed_count,
    errors: Array.isArray(row.errors) ? row.errors : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listBroadcastCampaigns(
  supabase: SupabaseClient<Database>,
  limit = 30
): Promise<{ campaigns: BroadcastCampaign[]; error?: string }> {
  // types/database.types.ts に未登録の新規テーブルのため narrow クエリのみ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('broadcast_email_campaigns')
    .select(
      'id, subject, body_content, body_mode, recipient_sources, sender_email, status, scheduled_at, sent_at, total_count, sent_count, failed_count, errors, created_at, updated_at'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('listBroadcastCampaigns:', error);
    return { campaigns: [], error: '配信履歴の取得に失敗しました' };
  }
  return { campaigns: ((data ?? []) as CampaignRow[]).map(mapCampaign) };
}

export async function createBroadcastCampaign(
  supabase: SupabaseClient<Database>,
  params: {
    subject: string;
    bodyContent: string;
    bodyMode: BroadcastBodyMode;
    recipientSources: BroadcastRecipientSource[];
    senderEmail?: string;
    status: 'draft' | 'scheduled';
    scheduledAt?: string | null;
  }
): Promise<{ campaign?: BroadcastCampaign; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('broadcast_email_campaigns')
    .insert({
      subject: params.subject,
      body_content: params.bodyContent,
      body_mode: params.bodyMode,
      recipient_sources: params.recipientSources,
      sender_email: params.senderEmail?.trim() || null,
      status: params.status,
      scheduled_at: params.scheduledAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .select(
      'id, subject, body_content, body_mode, recipient_sources, sender_email, status, scheduled_at, sent_at, total_count, sent_count, failed_count, errors, created_at, updated_at'
    )
    .single();

  if (error) {
    console.error('createBroadcastCampaign:', error);
    return { error: '配信データの保存に失敗しました' };
  }
  return { campaign: mapCampaign(data as CampaignRow) };
}

export async function recordCompletedBroadcastCampaign(
  supabase: SupabaseClient<Database>,
  params: {
    subject: string;
    bodyContent: string;
    bodyMode: BroadcastBodyMode;
    recipientSources: BroadcastRecipientSource[];
    senderEmail?: string;
    totalCount: number;
    sentCount: number;
    failedCount: number;
    errors: { email: string; reason: string }[];
  }
): Promise<void> {
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('broadcast_email_campaigns').insert({
    subject: params.subject,
    body_content: params.bodyContent,
    body_mode: params.bodyMode,
    recipient_sources: params.recipientSources,
    sender_email: params.senderEmail?.trim() || null,
    status: params.failedCount > 0 ? 'failed' : 'sent',
    sent_at: now,
    total_count: params.totalCount,
    sent_count: params.sentCount,
    failed_count: params.failedCount,
    errors: params.errors as Json,
    updated_at: now,
  });

  if (error) {
    console.error('recordCompletedBroadcastCampaign:', error);
  }
}

export async function markBroadcastCampaignCancelled(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<{ ok: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('broadcast_email_campaigns')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'scheduled');

  if (error) {
    console.error('markBroadcastCampaignCancelled:', error);
    return { ok: false, error: '予約のキャンセルに失敗しました' };
  }
  return { ok: true };
}

async function sendCampaignRow(
  supabase: SupabaseClient<Database>,
  row: CampaignRow
): Promise<void> {
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: sendingError } = await (supabase as any)
    .from('broadcast_email_campaigns')
    .update({ status: 'sending', updated_at: now })
    .eq('id', row.id)
    .in('status', ['draft', 'scheduled']);

  if (sendingError) {
    console.error('sendCampaignRow status sending:', sendingError);
    return;
  }

  const result = await sendBroadcastEmails({
    subject: row.subject,
    bodyContent: row.body_content,
    bodyMode: row.body_mode,
    sources: row.recipient_sources,
    senderEmail: row.sender_email ?? undefined,
  });

  const finishedAt = new Date().toISOString();
  if (!result.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('broadcast_email_campaigns')
      .update({
        status: 'failed',
        failed_count: 1,
        errors: [{ email: '', reason: result.reason }] as Json,
        updated_at: finishedAt,
      })
      .eq('id', row.id);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('broadcast_email_campaigns')
    .update({
      status: result.failed > 0 ? 'failed' : 'sent',
      sent_at: finishedAt,
      total_count: result.total,
      sent_count: result.sent,
      failed_count: result.failed,
      errors: result.errors as Json,
      updated_at: finishedAt,
    })
    .eq('id', row.id);
}

export async function sendSavedBroadcastCampaign(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: 'Supabase が未設定です' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('broadcast_email_campaigns')
    .select(
      'id, subject, body_content, body_mode, recipient_sources, sender_email, status, scheduled_at, sent_at, total_count, sent_count, failed_count, errors, created_at, updated_at'
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('sendSavedBroadcastCampaign select:', error);
    return { ok: false, error: '配信データの取得に失敗しました' };
  }
  if (!data) return { ok: false, error: '配信データが見つかりません' };
  const row = data as CampaignRow;
  if (!['draft', 'scheduled'].includes(row.status)) {
    return { ok: false, error: 'この配信は送信できない状態です' };
  }

  await sendCampaignRow(supabase, row);
  return { ok: true };
}

export async function processDueBroadcastCampaigns(): Promise<{
  ok: boolean;
  processed: number;
  error?: string;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, processed: 0, error: 'Supabase が未設定です' };

  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('broadcast_email_campaigns')
    .select(
      'id, subject, body_content, body_mode, recipient_sources, sender_email, status, scheduled_at, sent_at, total_count, sent_count, failed_count, errors, created_at, updated_at'
    )
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })
    .limit(3);

  if (error) {
    console.error('processDueBroadcastCampaigns select:', error);
    return { ok: false, processed: 0, error: '予約配信の取得に失敗しました' };
  }

  let processed = 0;
  for (const row of (data ?? []) as CampaignRow[]) {
    await sendCampaignRow(supabase, row);
    processed++;
  }

  return { ok: true, processed };
}
