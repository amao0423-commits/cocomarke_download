-- ダウンロードページ左カラムの資料別カスタム設定
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS hero_description TEXT,
  ADD COLUMN IF NOT EXISTS overview_heading TEXT,
  ADD COLUMN IF NOT EXISTS hero_highlight_2 TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_1_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_2_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_3_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_4_url TEXT;

COMMENT ON COLUMN public.documents.hero_description   IS 'ダウンロードページ左カラム：ヒーロー説明文（空の場合はデフォルト）';
COMMENT ON COLUMN public.documents.overview_heading   IS 'ダウンロードページ左カラム：Overview 見出し（改行は \n で表現）';
COMMENT ON COLUMN public.documents.hero_highlight_2   IS 'ダウンロードページ左カラム：箇条書き 2 行目';
COMMENT ON COLUMN public.documents.hero_image_1_url   IS 'ダウンロードページ左カラム：画像1（公開URL）';
COMMENT ON COLUMN public.documents.hero_image_2_url   IS 'ダウンロードページ左カラム：画像2（公開URL）';
COMMENT ON COLUMN public.documents.hero_image_3_url   IS 'ダウンロードページ左カラム：画像3（公開URL）';
COMMENT ON COLUMN public.documents.hero_image_4_url   IS 'ダウンロードページ左カラム：画像4（公開URL）';
