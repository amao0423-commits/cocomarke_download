-- 資料カテゴリマスタ（管理画面から追加可能）
CREATE TABLE IF NOT EXISTS public.document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT document_categories_name_unique UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS document_categories_sort_idx
  ON public.document_categories (sort_order ASC, name ASC);

-- 公開3カテゴリ + 未分類（後続マイグレーションで「非公開」に改名）
INSERT INTO public.document_categories (name, sort_order) VALUES
  ('Instagram運用のノウハウ集', 10),
  ('最新アルゴリズム調査レポート', 20),
  ('サービス関連', 90),
  ('未分類', 100)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '未分類';

UPDATE public.documents
SET category = '未分類'
WHERE category IS NULL OR trim(category) = '';

CREATE INDEX IF NOT EXISTS documents_category_idx ON public.documents (category);

ALTER TABLE public.download_requests
  ADD COLUMN IF NOT EXISTS document_id UUID REFERENCES public.documents (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS download_requests_document_id_idx
  ON public.download_requests (document_id);

ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
