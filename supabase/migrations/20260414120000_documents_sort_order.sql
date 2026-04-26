ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

UPDATE public.documents
SET sort_order = sub.rn
FROM (
  SELECT id, (ROW_NUMBER() OVER (PARTITION BY category ORDER BY created_at DESC) - 1) * 10 AS rn
  FROM public.documents
) sub
WHERE public.documents.id = sub.id;

CREATE INDEX IF NOT EXISTS documents_sort_order_idx ON public.documents (category, sort_order ASC);

COMMENT ON COLUMN public.documents.sort_order IS 'カテゴリ内での表示順（昇順）。管理画面から変更可能。';
