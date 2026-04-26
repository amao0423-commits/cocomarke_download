-- site_settings: 新規メールテンプレ用の既定 HTML など
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  download_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 公開テンプレは高々1件（誤って複数 publish しても DB で拒否）
CREATE UNIQUE INDEX IF NOT EXISTS email_templates_single_published
  ON public.email_templates ((1))
  WHERE (is_published = true);

CREATE TABLE IF NOT EXISTS public.template_document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (template_id, document_id)
);

CREATE INDEX IF NOT EXISTS template_document_links_template_idx
  ON public.template_document_links (template_id, sort_order);

CREATE TABLE IF NOT EXISTS public.download_requests (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  requested_at TIMESTAMPTZ NOT NULL,
  workflow_status TEXT NOT NULL DEFAULT '未対応',
  email_status TEXT NOT NULL DEFAULT 'pending',
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT download_requests_workflow_check CHECK (
    workflow_status IN ('未対応', '送付済', 'NG', '商談中')
  ),
  CONSTRAINT download_requests_email_status_check CHECK (
    email_status IN ('pending', 'sent', 'failed')
  )
);

CREATE INDEX IF NOT EXISTS download_requests_requested_at_idx
  ON public.download_requests (requested_at DESC);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_document_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_requests ENABLE ROW LEVEL SECURITY;

-- バケットは非公開（メール・管理画面は署名 URL）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;
