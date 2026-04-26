-- 資料ダウンロード申請に電話番号（任意）
ALTER TABLE public.download_requests
  ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';
