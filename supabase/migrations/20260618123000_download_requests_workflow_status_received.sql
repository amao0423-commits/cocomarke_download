-- 「受取済」を許可するため workflow_status の CHECK 制約を更新する。
-- 実際の制約名は download_requests_workflow_check（旧名 _workflow_status_check も念のため削除）。
ALTER TABLE public.download_requests
  DROP CONSTRAINT IF EXISTS download_requests_workflow_check;
ALTER TABLE public.download_requests
  DROP CONSTRAINT IF EXISTS download_requests_workflow_status_check;

ALTER TABLE public.download_requests
  ADD CONSTRAINT download_requests_workflow_check CHECK (
    workflow_status IN ('受取済', 'リタ中', '契約', '未対応', '送付済', 'NG', '商談中')
  );

-- 既存データ（送付済）を新ラベルへ揃える。
UPDATE public.download_requests
  SET workflow_status = '受取済'
  WHERE workflow_status = '送付済';
