'use client';

import { useState, useCallback, useEffect } from 'react';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import {
  buildHeroHighlights,
  DEFAULT_HERO_DESCRIPTION,
  DEFAULT_HIGHLIGHT_2,
  DOCUMENT_SUMMARY_HEADING,
  defaultHeroHighlight1,
  defaultHeroHighlight3,
  HeroSummaryCheckIcon,
} from '@/app/download/DownloadPageShell';

/** 管理プレビュー用（実ページではフォーム設定名が使われます） */
const HERO_PREVIEW_FORM_NAME = '資料請求フォーム';

type DocumentRow = {
  id: string;
  title: string;
  category: string;
  storage_path: string;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
  sort_order: number;
  thumbnail_url?: string | null;
  hero_description?: string | null;
  hero_highlight_1?: string | null;
  hero_highlight_2?: string | null;
  hero_highlight_3?: string | null;
  hero_highlights_extra?: string | null;
  hero_image_1_url?: string | null;
  hero_image_2_url?: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  sort_order: number;
  headline: string | null;
  description: string | null;
};

type HeroForm = {
  hero_description: string;
  hero_highlight_1: string;
  hero_highlight_2: string;
  hero_highlight_3: string;
  hero_highlights_extra: string;
  hero_image_1_url: string;
  hero_image_2_url: string;
};

function docToHeroForm(doc: DocumentRow): HeroForm {
  return {
    hero_description: doc.hero_description ?? '',
    hero_highlight_1: doc.hero_highlight_1 ?? '',
    hero_highlight_2: doc.hero_highlight_2 ?? '',
    hero_highlight_3: doc.hero_highlight_3 ?? '',
    hero_highlights_extra: doc.hero_highlights_extra ?? '',
    hero_image_1_url: doc.hero_image_1_url ?? '',
    hero_image_2_url: doc.hero_image_2_url ?? '',
  };
}

function HeroPreview({ title, form }: { title: string; form: HeroForm }) {
  const description = form.hero_description.trim() || DEFAULT_HERO_DESCRIPTION;
  const highlights = buildHeroHighlights(HERO_PREVIEW_FORM_NAME, title, {
    hero_highlight_1: form.hero_highlight_1,
    hero_highlight_2: form.hero_highlight_2,
    hero_highlight_3: form.hero_highlight_3,
    hero_highlights_extra: form.hero_highlights_extra,
  });

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 shadow-lg text-left"
      style={{ background: 'linear-gradient(160deg, #1a3a6b 0%, #0d2a55 60%, #0a2040 100%)' }}
    >
      <div className="relative flex min-w-0 max-w-full flex-col gap-3 overflow-hidden p-4 text-white">
        {/* バッジ */}
        <div className="flex max-w-full items-center gap-1.5 self-start rounded-full border border-sky-400/35 bg-sky-400/18 px-2.5 py-0.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
          <span className="max-w-full break-words text-[10px] font-medium tracking-wide text-white/85">
            お役立ち資料
          </span>
        </div>

        {/* 資料名 */}
        <h4 className="min-w-0 break-words text-[13px] font-bold leading-snug text-white">{title}</h4>

        {/* 説明文 */}
        <p className="min-w-0 whitespace-pre-line break-words text-[10px] leading-relaxed text-white/90">
          {description}
        </p>

        {/* プレビュー行 */}
        <div className="flex min-w-0 max-w-full items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
          <div className="h-12 w-[68px] shrink-0 overflow-hidden rounded-lg bg-white sm:h-12 sm:w-20 min-h-0 min-w-0">
            {form.hero_image_1_url.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.hero_image_1_url.trim()}
                alt=""
                className="block h-full w-full min-h-0 min-w-0 max-h-full max-w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[9px] font-medium text-neutral-600">
                画像1
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
            <p className="min-w-0 break-words text-[11px] font-bold leading-snug text-white line-clamp-3">
              {title}
            </p>
            <p className="min-w-0 shrink-0 break-words text-[9px] font-medium text-white/85">PDF · 無料ダウンロード</p>
          </div>
        </div>

        {/* 区切り */}
        <div className="h-px bg-white/8" />

        {/* 資料概要 */}
        <div className="min-w-0 max-w-full">
          <p className="mb-1.5 text-[12px] font-bold uppercase tracking-widest text-white">
            {DOCUMENT_SUMMARY_HEADING}
          </p>
          <ul className="flex min-w-0 flex-col gap-1.5">
            {highlights.map((item, i) => (
              <li key={i} className="flex min-w-0 items-start gap-1.5 text-[10px] leading-relaxed text-white/90">
                <HeroSummaryCheckIcon size="sm" />
                <span className="min-w-0 flex-1 break-words">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stat バー */}
        <div className="grid min-w-0 grid-cols-2 gap-2">
          {([['無料', 'ダウンロード'], ['5分', '読了目安']] as const).map(([num, label]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center rounded-xl border border-white/8 bg-white/5 px-1 py-2"
            >
              <span className="max-w-full truncate text-center text-sm font-bold text-sky-400">{num}</span>
              <span className="max-w-full break-words text-center text-[9px] leading-tight text-white/85">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type HeroEditModalProps = {
  doc: DocumentRow;
  secretKey: string;
  onSaved: (updated: DocumentRow) => void;
  onClose: () => void;
};

function HeroEditModal({ doc, secretKey, onSaved, onClose }: HeroEditModalProps) {
  const auth = { Authorization: `Bearer ${secretKey}` };
  const [form, setForm] = useState<HeroForm>(docToHeroForm(doc));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof HeroForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setBusy(true);
    setError('');
    try {
      const payload: Record<string, string | null> = {};
      for (const [k, v] of Object.entries(form)) {
        payload[k] = v.trim() || null;
      }
      const res = await fetch(`/api/admin/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? '保存に失敗しました');
        return;
      }
      onSaved(data.document as DocumentRow);
    } catch {
      setError('保存中にエラーが発生しました');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-5xl my-6 rounded-3xl bg-white border border-blue-50/90 shadow-xl shadow-blue-500/10 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 font-medium">ダウンロードページ 左カラム編集</p>
            <h2 className="font-semibold text-slate-600 mt-0.5">{doc.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="閉じる"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 flex-1 min-h-0">
          <div className="p-6 space-y-5 overflow-y-auto border-r border-gray-100">
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <fieldset className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">
                ① ヒーロー説明文
                <span className="ml-1 font-normal text-gray-400">
                  （空欄でデフォルト。改行は公開ページでもそのまま表示されます）
                </span>
              </label>
              <textarea
                value={form.hero_description}
                onChange={set('hero_description')}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                placeholder={DEFAULT_HERO_DESCRIPTION}
              />
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium text-gray-600">
                ② 箇条書き（1〜3行＋任意で4行目以降）
                <span className="ml-1 font-normal text-gray-400">（1〜3行は空欄でデフォルト）</span>
              </legend>
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-500">1 行目</label>
                <input
                  type="text"
                  value={form.hero_highlight_1}
                  onChange={set('hero_highlight_1')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                  placeholder={defaultHeroHighlight1(doc.title)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-500">2 行目</label>
                <input
                  type="text"
                  value={form.hero_highlight_2}
                  onChange={set('hero_highlight_2')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                  placeholder={DEFAULT_HIGHLIGHT_2}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-500">3 行目</label>
                <input
                  type="text"
                  value={form.hero_highlight_3}
                  onChange={set('hero_highlight_3')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                  placeholder={defaultHeroHighlight3(HERO_PREVIEW_FORM_NAME)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-500">
                  4 行目以降
                  <span className="ml-1 font-normal text-gray-400">（1行に1項目。空行は無視）</span>
                </label>
                <textarea
                  value={form.hero_highlights_extra}
                  onChange={set('hero_highlights_extra')}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                  placeholder={'4行目の文\n5行目の文'}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-gray-600">
                ③ プレビュー画像URL
                <span className="ml-1 font-normal text-gray-400">（公開URLを入力）</span>
              </legend>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-xs text-gray-500 w-12">画像</span>
                <input
                  type="url"
                  value={form.hero_image_1_url}
                  onChange={set('hero_image_1_url')}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200/80"
                  placeholder="https://…"
                />
              </div>
            </fieldset>
          </div>

          <div className="p-5 bg-gray-50 rounded-br-2xl lg:rounded-tr-2xl overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 mb-3">リアルタイムプレビュー</p>
            <HeroPreview title={doc.title} form={form} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={busy}
            className="px-5 py-2 rounded-2xl bg-[#A0D8EF] text-[#2C657A] text-sm font-medium disabled:opacity-40 hover:brightness-105 transition"
          >
            {busy ? '保存中…' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentsTab({ secretKey }: { secretKey: string }) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState(PRIVATE_CATEGORY_NAME);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [busy, setBusy] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [uploadThumbnailUrl, setUploadThumbnailUrl] = useState('');
  const [editingDoc, setEditingDoc] = useState<DocumentRow | null>(null);
  const [reorderBusy, setReorderBusy] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState({ headline: '', description: '' });
  const [categorySaveBusy, setCategorySaveBusy] = useState(false);

  const auth = { Authorization: `Bearer ${secretKey}` };

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/document-categories', { headers: auth });
      const data = await res.json();
      if (!res.ok) return;
      setCategories(data.categories ?? []);
    } catch {
      // ignore
    }
  }, [secretKey]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const qs =
        filterCategory !== 'all'
          ? `?category=${encodeURIComponent(filterCategory)}`
          : '';
      const res = await fetch(`/api/admin/documents${qs}`, { headers: auth });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '取得に失敗しました（Supabase を確認してください）');
        return;
      }
      setDocuments(data.documents ?? []);
    } catch {
      setErrorMessage('取得中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, [secretKey, filterCategory]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    setBusy(true);
    setErrorMessage('');
    try {
      // Step 1: 署名付きアップロードURLを取得（ファイルデータはサーバーを経由しない）
      const urlRes = await fetch('/api/admin/documents/upload-url', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          fileSize: file.size,
        }),
      });
      const urlData = await urlRes.json();
      if (!urlRes.ok) {
        setErrorMessage(urlData?.error ?? 'アップロード準備に失敗しました');
        return;
      }

      // Step 2: ブラウザからSupabaseへ直接アップロード
      const uploadRes = await fetch(urlData.uploadUrl as string, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!uploadRes.ok) {
        setErrorMessage('ファイルのアップロードに失敗しました');
        return;
      }

      // Step 3: ドキュメント情報をデータベースに登録
      const regRes = await fetch('/api/admin/documents/register', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category: uploadCategory,
          thumbnail_url: uploadThumbnailUrl.trim() || null,
          storage_path: urlData.path as string,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) {
        const hint = regData?.details ? ` (${String(regData.details)})` : '';
        setErrorMessage((regData?.error ?? '登録に失敗しました') + hint);
        return;
      }

      setTitle('');
      setFile(null);
      setUploadThumbnailUrl('');
      setUploadCategory(PRIVATE_CATEGORY_NAME);
      await load();
    } catch {
      setErrorMessage('処理中にエラーが発生しました');
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setAddingCategory(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/document-categories', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? 'カテゴリの追加に失敗しました');
        return;
      }
      setNewCategoryName('');
      await loadCategories();
      if (data?.category?.name) setUploadCategory(data.category.name);
    } catch {
      setErrorMessage('カテゴリ追加中にエラーが発生しました');
    } finally {
      setAddingCategory(false);
    }
  };

  const updateDocumentCategory = async (id: string, category: string) => {
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      if (!res.ok) return;
      await load();
    } catch {
      // ignore
    }
  };

  const updateDocumentThumbnail = async (id: string, current: string | null, next: string) => {
    const trimmed = next.trim();
    if (trimmed === (current ?? '')) return;
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ thumbnail_url: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.error ?? 'サムネイルURLの更新に失敗しました');
        return;
      }
      await load();
    } catch {
      setErrorMessage('サムネイルURLの更新中にエラーが発生しました');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('この資料を削除しますか？')) return;
    const res = await fetch(`/api/admin/documents/${id}`, {
      method: 'DELETE',
      headers: auth,
    });
    if (res.ok) await load();
  };

  const openCategoryEdit = (cat: CategoryRow) => {
    setEditingCategoryId(cat.id);
    setCategoryDraft({
      headline: cat.headline ?? '',
      description: cat.description ?? '',
    });
  };

  const saveCategoryCopy = async (id: string) => {
    setCategorySaveBusy(true);
    try {
      const res = await fetch(`/api/admin/document-categories/${id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: categoryDraft.headline || null,
          description: categoryDraft.description || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '見出し・説明の保存に失敗しました');
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, headline: data.category.headline, description: data.category.description }
            : c,
        ),
      );
      setEditingCategoryId(null);
    } catch {
      setErrorMessage('保存中にエラーが発生しました');
    } finally {
      setCategorySaveBusy(false);
    }
  };

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const next = [...categories];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((c, i) => ({ ...c, sort_order: i * 10 }));
    setCategories(reordered);
    setReorderBusy(true);
    try {
      await fetch('/api/admin/document-categories', {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reordered.map(({ id, sort_order }) => ({ id, sort_order })) }),
      });
    } finally {
      setReorderBusy(false);
    }
  };

  const moveDocument = async (index: number, direction: -1 | 1) => {
    const filtered = documents.filter((d) => d.category === filterCategory);
    const target = index + direction;
    if (target < 0 || target >= filtered.length) return;
    const next = [...filtered];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((d, i) => ({ ...d, sort_order: i * 10 }));
    setDocuments((prev) =>
      prev.map((d) => {
        const updated = reordered.find((r) => r.id === d.id);
        return updated ?? d;
      }),
    );
    setReorderBusy(true);
    try {
      await fetch('/api/admin/documents/reorder', {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reordered.map(({ id, sort_order }) => ({ id, sort_order })) }),
      });
    } finally {
      setReorderBusy(false);
    }
  };

  const categoryNames = categories.map((c) => c.name);
  const filterChips: { key: string; label: string }[] = [
    { key: 'all', label: 'すべて' },
    ...categories.map((c) => ({ key: c.name, label: c.name })),
  ];

  if (isLoading) {
    return <div className="py-16 text-center text-gray-500">読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

      <div className="border border-blue-50/90 rounded-3xl p-4 space-y-4 shadow-xl shadow-blue-500/[0.04]">
        <h2 className="font-semibold">資料を追加</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <label className="flex-1 block">
              <span className="text-xs text-gray-500">表示名</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="例：サービス紹介PDF"
              />
            </label>
            <label className="sm:w-56 block">
              <span className="text-xs text-gray-500">カテゴリ</span>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {categoryNames.length === 0 ? (
                  <option value={PRIVATE_CATEGORY_NAME}>{PRIVATE_CATEGORY_NAME}</option>
                ) : (
                  categoryNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label className="flex-1 block">
              <span className="text-xs text-gray-500">ファイル</span>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full text-sm"
              />
            </label>
            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={busy || !file || !title.trim()}
              className="px-4 py-2 rounded-2xl bg-[#A0D8EF] text-[#2C657A] text-sm font-medium disabled:opacity-40 shrink-0"
            >
              {busy ? '処理中…' : 'アップロードして登録'}
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="block flex-1">
              <span className="text-xs text-gray-500">
                サムネイルURL（任意・トップ一覧用・公開URL）
              </span>
              <input
                type="url"
                value={uploadThumbnailUrl}
                onChange={(e) => setUploadThumbnailUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://…（Storageの公開URLなど）"
              />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <label className="flex-1 block">
              <span className="text-xs text-gray-500">新規カテゴリ名（一覧に追加）</span>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="例：ホワイトペーパー"
              />
            </label>
            <button
              type="button"
              onClick={() => void addCategory()}
              disabled={addingCategory || !newCategoryName.trim()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
            >
              {addingCategory ? '追加中…' : 'カテゴリを追加'}
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <h2 className="font-semibold">カテゴリの表示順・見出し・説明</h2>
        <p className="text-xs text-gray-500">↑↓ で順序変更（即時保存）。「編集」でトップページの見出しと説明を変更できます。</p>
        {categories.length === 0 ? (
          <p className="text-gray-400 text-xs">カテゴリがありません</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={cat.id} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="flex-1 text-sm font-medium text-gray-800">{cat.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      editingCategoryId === cat.id
                        ? setEditingCategoryId(null)
                        : openCategoryEdit(cat)
                    }
                    className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    {editingCategoryId === cat.id ? '閉じる' : '見出し・説明を編集'}
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={i === 0 || reorderBusy}
                      onClick={() => void moveCategory(i, -1)}
                      className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                      aria-label="上へ"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={i === categories.length - 1 || reorderBusy}
                      onClick={() => void moveCategory(i, 1)}
                      className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
                      aria-label="下へ"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {editingCategoryId === cat.id && (
                  <div className="border-t border-gray-200 bg-white px-3 pb-3 pt-2 space-y-2">
                    <p className="text-[11px] text-gray-500">
                      空のままにすると、デフォルトの文章が表示されます。
                    </p>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-700">見出し（大きい文字）</span>
                      <input
                        type="text"
                        value={categoryDraft.headline}
                        onChange={(e) =>
                          setCategoryDraft((d) => ({ ...d, headline: e.target.value }))
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="例：Instagram運用のヒントがまとまった資料集"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-gray-700">説明文（小さい文字）</span>
                      <textarea
                        value={categoryDraft.description}
                        onChange={(e) =>
                          setCategoryDraft((d) => ({ ...d, description: e.target.value }))
                        }
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-y"
                        placeholder="例：投稿の設計や運用の見直し、成果につなげるためのノウハウが揃っています。"
                      />
                    </label>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => void saveCategoryCopy(cat.id)}
                        disabled={categorySaveBusy}
                        className="rounded-2xl bg-[#A0D8EF] px-4 py-1.5 text-xs font-medium text-[#2C657A] hover:brightness-105 disabled:opacity-40 transition"
                      >
                        {categorySaveBusy ? '保存中…' : '保存'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="font-semibold mb-2">登録済み</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setFilterCategory(chip.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                filterCategory === chip.key
                  ? 'rounded-2xl bg-[#A0D8EF] text-[#2C657A] border-sky-200/80'
                  : 'bg-white text-slate-600 border-blue-100 hover:bg-sky-50/50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {filterCategory !== 'all' && (
          <p className="text-xs text-gray-500 mb-3">
            ↑↓ ボタンで資料の表示順を変更できます（即座に保存されます）
          </p>
        )}
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm">該当する資料がありません</p>
        ) : (
          <div className="overflow-x-auto border border-blue-50/90 rounded-3xl shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {filterCategory !== 'all' && <th className="py-2 px-2 w-16" />}
                  <th className="text-left py-2 px-3">タイトル</th>
                  <th className="text-left py-2 px-3">カテゴリ</th>
                  <th className="text-left py-2 px-3 min-w-[200px]">サムネイルURL</th>
                  <th className="text-left py-2 px-3">ファイル名</th>
                  <th className="text-left py-2 px-3">登録日時</th>
                  <th className="text-left py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered =
                    filterCategory === 'all'
                      ? documents
                      : documents.filter((d) => d.category === filterCategory);
                  return filtered.map((d, i) => (
                    <tr key={d.id} className="border-b border-gray-100">
                      {filterCategory !== 'all' && (
                        <td className="py-2 px-2">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={i === 0 || reorderBusy}
                              onClick={() => void moveDocument(i, -1)}
                              className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition leading-none"
                              aria-label="上へ"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={i === filtered.length - 1 || reorderBusy}
                              onClick={() => void moveDocument(i, 1)}
                              className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition leading-none"
                              aria-label="下へ"
                            >
                              ↓
                            </button>
                          </div>
                        </td>
                      )}
                      <td className="py-2 px-3 font-medium text-slate-600">{d.title}</td>
                      <td className="py-2 px-3 text-gray-700">
                        <select
                          value={d.category}
                          onChange={(e) => void updateDocumentCategory(d.id, e.target.value)}
                          className="max-w-[220px] border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white"
                        >
                          {(categoryNames.length ? categoryNames : [PRIVATE_CATEGORY_NAME]).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                          {!categoryNames.includes(d.category) && (
                            <option value={d.category}>{d.category}</option>
                          )}
                        </select>
                      </td>
                      <td className="py-2 px-3 text-gray-600 align-top">
                        <input
                          type="url"
                          defaultValue={d.thumbnail_url ?? ''}
                          key={`${d.id}-${d.thumbnail_url ?? ''}`}
                          onBlur={(e) =>
                            void updateDocumentThumbnail(
                              d.id,
                              d.thumbnail_url ?? null,
                              e.target.value,
                            )
                          }
                          className="w-full min-w-[180px] max-w-[280px] border border-gray-300 rounded-lg px-2 py-1.5 text-xs"
                          placeholder="https://…"
                          title="フォーカスを外すと保存されます。空にすると解除"
                        />
                      </td>
                      <td className="py-2 px-3 text-gray-600 break-all max-w-xs">
                        {d.file_name ?? '—'}
                      </td>
                      <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                        {new Date(d.created_at).toLocaleString('ja-JP')}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDoc(d)}
                            className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                          >
                            左カラム編集
                          </button>
                          <button
                            type="button"
                            onClick={() => void remove(d.id)}
                            className="text-red-600 hover:underline text-xs"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingDoc && (
        <HeroEditModal
          doc={editingDoc}
          secretKey={secretKey}
          onSaved={(updated) => {
            setDocuments((prev) =>
              prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)),
            );
            setEditingDoc(null);
          }}
          onClose={() => setEditingDoc(null)}
        />
      )}
    </div>
  );
}
