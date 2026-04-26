-- 資料請求フォーム拡張: 氏名分割・部署・目的・質問・同意
ALTER TABLE public.download_requests
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS request_purpose TEXT,
  ADD COLUMN IF NOT EXISTS questions TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.download_requests.last_name IS '姓';
COMMENT ON COLUMN public.download_requests.first_name IS '名';
COMMENT ON COLUMN public.download_requests.department IS '部署（任意）';
COMMENT ON COLUMN public.download_requests.request_purpose IS '資料請求の目的（選択）';
COMMENT ON COLUMN public.download_requests.questions IS 'ご質問・ご要望';
COMMENT ON COLUMN public.download_requests.privacy_consent IS '個人情報・プライバシーポリシー同意';
