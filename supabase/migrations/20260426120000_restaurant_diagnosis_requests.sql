CREATE TABLE public.restaurant_diagnosis_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL,
  email TEXT NOT NULL,
  q1 TEXT,
  q2 TEXT,
  q3 TEXT,
  q4 TEXT[] DEFAULT '{}' NOT NULL,
  q5 TEXT[] DEFAULT '{}' NOT NULL,
  q6 TEXT,
  q8_area TEXT[] DEFAULT '{}' NOT NULL,
  instagram TEXT,
  consultation TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.restaurant_diagnosis_requests IS 'SNS集客無料診断フォームの申請記録';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.store_name IS '店舗名（必須）';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.email IS 'メールアドレス（必須）';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q1 IS 'Q1 店舗カテゴリー';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q2 IS 'Q2 Instagramの運用状況';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q3 IS 'Q3 月の投稿回数';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q4 IS 'Q4 一番のお悩み（複数可）';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q5 IS 'Q5 新規来店のきっかけ（複数可）';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q6 IS 'Q6 Instagram広告の有無';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.q8_area IS 'Q8 店舗のエリア（複数可）';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.instagram IS 'Instagramアカウント（任意）';
COMMENT ON COLUMN public.restaurant_diagnosis_requests.consultation IS '相談内容（任意）';

ALTER TABLE public.restaurant_diagnosis_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_insert" ON public.restaurant_diagnosis_requests
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_role_select" ON public.restaurant_diagnosis_requests
  FOR SELECT TO service_role USING (true);
