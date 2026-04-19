-- ポータル資料一覧・ピックアップ用サムネイル（公開URL）
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

COMMENT ON COLUMN public.documents.thumbnail_url IS '一覧表示用サムネイル画像の公開URL（任意）';
