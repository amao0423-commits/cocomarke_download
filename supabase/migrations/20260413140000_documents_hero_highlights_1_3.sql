-- ダウンロード左カラム：箇条書き 1・3 行目（2 行目は既存 hero_highlight_2）
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS hero_highlight_1 TEXT,
  ADD COLUMN IF NOT EXISTS hero_highlight_3 TEXT;

COMMENT ON COLUMN public.documents.hero_highlight_1 IS 'ダウンロードページ左カラム：箇条書き 1 行目（空の場合はデフォルト）';
COMMENT ON COLUMN public.documents.hero_highlight_3 IS 'ダウンロードページ左カラム：箇条書き 3 行目（空の場合はデフォルト）';
