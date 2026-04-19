-- 資料カテゴリ再編（冪等）
-- 1) 公開維持対象以外の documents.category をすべて「非公開」へ
-- 2) マスタを想定4件（Instagram / アルゴリズムレポート / サービス関連 / 非公開）に整理
--    ※ name 一意制約前提。既存の「サービス関連」「非公開」は残し sort_order のみ揃える

BEGIN;

UPDATE public.documents
SET category = '非公開'
WHERE category NOT IN (
  'サービス関連',
  'Instagram運用のノウハウ集',
  '最新アルゴリズム調査レポート',
  '非公開'
);

INSERT INTO public.document_categories (name, sort_order) VALUES
  ('Instagram運用のノウハウ集', 10),
  ('最新アルゴリズム調査レポート', 20),
  ('サービス関連', 90),
  ('非公開', 100)
ON CONFLICT (name) DO UPDATE SET sort_order = EXCLUDED.sort_order;

DELETE FROM public.document_categories
WHERE name NOT IN (
  'Instagram運用のノウハウ集',
  '最新アルゴリズム調査レポート',
  'サービス関連',
  '非公開'
);

COMMIT;
