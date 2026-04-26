-- 申請時にフォームから送られた希望資料の表示名（資料マスタの title 解決より優先して一覧表示）
ALTER TABLE public.download_requests
  ADD COLUMN IF NOT EXISTS requested_document_title TEXT;

COMMENT ON COLUMN public.download_requests.requested_document_title IS
  '資料請求フォーム送信時の希望資料表示名（クライアント送信・申請時点のスナップショット）';
