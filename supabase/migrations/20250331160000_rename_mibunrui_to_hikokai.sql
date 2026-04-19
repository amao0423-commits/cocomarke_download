-- 「未分類」を「非公開」に改名（管理画面表示・トップ非表示用）
UPDATE public.document_categories
SET name = '非公開'
WHERE name = '未分類';

UPDATE public.documents
SET category = '非公開'
WHERE category = '未分類';

ALTER TABLE public.documents
  ALTER COLUMN category SET DEFAULT '非公開';
