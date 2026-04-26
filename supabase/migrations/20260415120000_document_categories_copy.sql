ALTER TABLE public.document_categories
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT;

COMMENT ON COLUMN public.document_categories.headline IS 'トップページに表示するジャンルの見出し（空の場合は固定文言を使用）';
COMMENT ON COLUMN public.document_categories.description IS 'トップページに表示するジャンルの説明文（空の場合は固定文言を使用）';
