ALTER TABLE public.download_requests
  DROP CONSTRAINT IF EXISTS download_requests_workflow_status_check;

ALTER TABLE public.download_requests
  ADD CONSTRAINT download_requests_workflow_status_check CHECK (
    workflow_status IN ('受取済', 'リタ中', '契約', '未対応', '送付済', 'NG', '商談中')
  );
