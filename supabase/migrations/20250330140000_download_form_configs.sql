-- 表向きフォーム(slug)ごとに使用するメールテンプレを紐づける
CREATE TABLE IF NOT EXISTS public.download_form_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS download_form_configs_sort_idx
  ON public.download_form_configs (sort_order, slug);

ALTER TABLE public.download_form_configs ENABLE ROW LEVEL SECURITY;

-- 既定フォーム（テンプレは管理画面で設定）
INSERT INTO public.download_form_configs (slug, name, template_id, sort_order)
VALUES ('default', '既定の資料請求フォーム', NULL, 0)
ON CONFLICT (slug) DO NOTHING;
