CREATE TABLE IF NOT EXISTS public.broadcast_email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body_content TEXT NOT NULL DEFAULT '',
  body_mode TEXT NOT NULL DEFAULT 'plain',
  recipient_sources TEXT[] NOT NULL DEFAULT '{}',
  recipient_document_id UUID,
  sender_email TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  total_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT broadcast_email_campaigns_body_mode_check CHECK (
    body_mode IN ('plain', 'html')
  ),
  CONSTRAINT broadcast_email_campaigns_status_check CHECK (
    status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')
  )
);

CREATE INDEX IF NOT EXISTS broadcast_email_campaigns_status_scheduled_at_idx
  ON public.broadcast_email_campaigns (status, scheduled_at);

ALTER TABLE public.broadcast_email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_manage_broadcast_email_campaigns"
  ON public.broadcast_email_campaigns
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
