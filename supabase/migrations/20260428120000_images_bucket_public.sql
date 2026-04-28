-- images バケットを確実に公開設定にする（ON CONFLICT DO NOTHING では既存バケットに反映されないため UPDATE で上書き）
UPDATE storage.buckets
SET public = true
WHERE id = 'images';
