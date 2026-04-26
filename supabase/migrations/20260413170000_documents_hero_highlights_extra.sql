-- ダウンロードページ左カラム：箇条書き4行目以降（改行区切りで複数行）
alter table public.documents
  add column if not exists hero_highlights_extra text;

comment on column public.documents.hero_highlights_extra is
  '箇条書き4行目以降。1行につき1項目（空行は無視）';
