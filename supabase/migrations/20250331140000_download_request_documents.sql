-- 1申請あたり複数資料を紐づける（集計・メール送付用）
CREATE TABLE IF NOT EXISTS public.download_request_documents (
  request_id UUID NOT NULL REFERENCES public.download_requests (id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents (id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (request_id, document_id)
);

CREATE INDEX IF NOT EXISTS download_request_documents_document_idx
  ON public.download_request_documents (document_id);

CREATE INDEX IF NOT EXISTS download_request_documents_request_idx
  ON public.download_request_documents (request_id);

-- 既存行（document_id のみ）を子テーブルへ移行
INSERT INTO public.download_request_documents (request_id, document_id, sort_order)
SELECT id, document_id, 0
FROM public.download_requests
WHERE document_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 資料別ダウンロード件数（期間は NULL で累計）
CREATE OR REPLACE FUNCTION public.download_counts_by_document (p_since timestamptz)
RETURNS TABLE (
  document_id uuid,
  download_count bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    drd.document_id,
    COUNT(*)::bigint AS download_count
  FROM public.download_request_documents drd
  INNER JOIN public.download_requests dr ON dr.id = drd.request_id
  WHERE (p_since IS NULL OR dr.requested_at >= p_since)
  GROUP BY drd.document_id
  ORDER BY COUNT(*) DESC;
$$;

ALTER TABLE public.download_request_documents ENABLE ROW LEVEL SECURITY;
