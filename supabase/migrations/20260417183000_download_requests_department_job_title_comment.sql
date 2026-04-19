-- フォーム表記「役職」に合わせて列コメントを更新（列名 department は互換のため維持）
COMMENT ON COLUMN public.download_requests.department IS '役職（必須・選択肢はアプリで定義）';
