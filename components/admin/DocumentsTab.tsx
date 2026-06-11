'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';

/** PDF 1ページ目 → JPEG Blob（クライアントサイド・pdfjs-dist 使用） */
async function generatePdfThumbnail(file: File): Promise<Blob | null> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // pdfjs-dist 6.x では canvas プロパティも必須
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: ctx as any, canvas, viewport } as any).promise;
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
    });
  } catch (e) {
    console.warn('[DocumentsTab] PDF thumbnail generation failed:', e);
    return null;
  }
}
import {
  buildHeroHighlights,
  DEFAULT_HIGHLIGHT_2,
  DOCUMENT_SUMMARY_HEADING,
  defaultHeroDescription,
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
  is_published?: boolean;
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
  const description = form.hero_description.trim() || defaultHeroDescription(title);
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
                placeholder={defaultHeroDescription(doc.title)}
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
  const [replacingDocumentId, setReplacingDocumentId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [uploadThumbnailUrl, setUploadThumbnailUrl] = useState('');
  const [uploadIsPublished, setUploadIsPublished] = useState(false);
  const [autoThumbBlob, setAutoThumbBlob] = useState<Blob | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState('');
  const [thumbGenerating, setThumbGenerating] = useState(false);
  const [manualThumbOverride, setManualThumbOverride] = useState('');
  const prevThumbPreviewRef = useRef('');

  // オブジェクトURL の解放
  useEffect(() => {
    prevThumbPreviewRef.current = thumbPreviewUrl;
    return () => {
      if (prevThumbPreviewRef.current) URL.revokeObjectURL(prevThumbPreviewRef.current);
    };
  }, [thumbPreviewUrl]);
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

  /** ファイル選択時: 表示名自動補完 + PDF サムネ自動生成 */
  const handleFileSelect = useCallback(async (selected: File | null) => {
    setFile(selected);
    setAutoThumbBlob(null);
    setThumbPreviewUrl('');
    if (!selected) return;
    // 表示名が空のときだけファイル名から補完
    setTitle((prev) => {
      if (prev.trim()) return prev;
      return selected.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, ' ').trim();
    });
    // PDF のみサムネ自動生成
    const isPdf = selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return;
    setThumbGenerating(true);
    try {
      const blob = await generatePdfThumbnail(selected);
      if (blob) {
        setAutoThumbBlob(blob);
        setThumbPreviewUrl(URL.createObjectURL(blob));
      }
    } finally {
      setThumbGenerating(false);
    }
  }, []);

  /** 生成した JPEG を images バケットへアップロードして公開URLを返す */
  const uploadThumbnailToImages = useCallback(async (blob: Blob): Promise<string | null> => {
    try {
      const urlRes = await fetch('/api/admin/images/upload-url', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mimeType: 'image/jpeg', fileSize: blob.size }),
      });
      const urlData = await urlRes.json();
      if (!urlRes.ok) return null;
      const uploadRes = await fetch(urlData.signedUrl as string, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });
      if (!uploadRes.ok) return null;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      return `${supabaseUrl}/storage/v1/object/public/images/${urlData.path as string}`;
    } catch {
      return null;
    }
  }, [secretKey]); // eslint-disable-line react-hooks/exhaustive-deps

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

      // Step 3: サムネイルを決定（手動優先 → 自動生成 → null）
      let finalThumbnailUrl: string | null = null;
      const manualTrim = manualThumbOverride.trim();
      if (manualTrim) {
        finalThumbnailUrl = manualTrim;
      } else if (autoThumbBlob) {
        finalThumbnailUrl = await uploadThumbnailToImages(autoThumbBlob);
      }

      // Step 4: ドキュメント情報をデータベースに登録
      const regRes = await fetch('/api/admin/documents/register', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category: uploadCategory,
          thumbnail_url: finalThumbnailUrl,
          is_published: uploadIsPublished,
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
      setUploadIsPublished(false);
      setUploadCategory(PRIVATE_CATEGORY_NAME);
      setAutoThumbBlob(null);
      setThumbPreviewUrl('');
      setManualThumbOverride('');
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

  const updateDocumentPublished = async (id: string, published: boolean) => {
    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: published }),
      });
      if (!res.ok) return;
      setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, is_published: published } : d)));
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

  const replaceDocumentFile = async (doc: DocumentRow, nextFile: File | null) => {
    if (!nextFile) return;
    setReplacingDocumentId(doc.id);
    setErrorMessage('');
    try {
      const urlRes = await fetch('/api/admin/documents/upload-url', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: nextFile.name,
          mimeType: nextFile.type || 'application/octet-stream',
          fileSize: nextFile.size,
        }),
      });
      const urlData = await urlRes.json();
      if (!urlRes.ok) {
        setErrorMessage(urlData?.error ?? '差し替えファイルの準備に失敗しました');
        return;
      }

      const uploadRes = await fetch(urlData.uploadUrl as string, {
        method: 'PUT',
        headers: { 'Content-Type': nextFile.type || 'application/octet-stream' },
        body: nextFile,
      });
      if (!uploadRes.ok) {
        setErrorMessage('差し替えファイルのアップロードに失敗しました');
        return;
      }

      const patchRes = await fetch(`/api/admin/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storage_path: urlData.path as string,
          file_name: nextFile.name,
          file_size: nextFile.size,
          file_type: nextFile.type || 'application/octet-stream',
        }),
      });
      const patchData = await patchRes.json().catch(() => ({}));
      if (!patchRes.ok) {
        setErrorMessage(patchData?.error ?? '資料の差し替えに失敗しました');
        return;
      }

      setDocuments((prev) =>
        prev.map((row) =>
          row.id === doc.id ? { ...row, ...(patchData.document as DocumentRow) } : row,
        ),
      );
    } catch {
      setErrorMessage('資料の差し替え中にエラーが発生しました');
    } finally {
      setReplacingDocumentId(null);
    }
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

      <div className="border border-blue-50/90 rounded-3xl p-5 space-y-4 shadow-xl shadow-blue-500/[0.04]">
        <h2 className="font-semibold">資料を追加</h2>

        {/* Step 1: ファイル選択（最初に見える唯一の操作） */}
        <label className="block">
          <span className="text-xs font-medium text-gray-500">PDFファイルを選択</span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => void handleFileSelect(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </label>

        {/* ファイル選択後に展開 */}
        {file && (
          <div className="space-y-4 border-t border-blue-50/80 pt-4">
            <div className="flex gap-4 items-start">
              {/* サムネプレビュー */}
              <div className="shrink-0 w-24 h-[3.5rem] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {thumbGenerating ? (
                  <span className="text-[10px] text-gray-400 text-center leading-tight px-1">生成中…</span>
                ) : thumbPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbPreviewUrl} alt="サムネイルプレビュー" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-gray-400 text-center leading-tight px-1">サムネなし</span>
                )}
              </div>

              {/* 表示名 */}
              <label className="flex-1 block">
                <span className="text-xs font-medium text-gray-500">表示名</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="例：サービス紹介PDF"
                />
              </label>
            </div>

            {/* カテゴリ + 公開トグル */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="block flex-1 min-w-[160px]">
                <span className="text-xs font-medium text-gray-500">カテゴリ</span>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {categoryNames.length === 0 ? (
                    <option value={PRIVATE_CATEGORY_NAME}>{PRIVATE_CATEGORY_NAME}</option>
                  ) : (
                    categoryNames.map((n) => <option key={n} value={n}>{n}</option>)
                  )}
                </select>
              </label>
              <label className="flex items-center gap-2 cursor-pointer self-end pb-1">
                <input
                  type="checkbox"
                  checked={uploadIsPublished}
                  onChange={(e) => setUploadIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded accent-sky-500"
                />
                <span className="text-sm font-medium text-slate-600">公開する</span>
              </label>
            </div>

            {/* 登録ボタン */}
            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={busy || !title.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#A0D8EF] text-[#2C657A] text-sm font-semibold disabled:opacity-40"
            >
              {busy ? '処理中…' : '登録する'}
            </button>

            {/* 折りたたみ: サムネイル手動差し替え */}
            <details className="text-sm">
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 select-none">
                サムネイルを手動で差し替える
              </summary>
              <label className="block mt-2">
                <span className="text-xs text-gray-500">サムネイルURL（手動入力・空欄で自動生成を使用）</span>
                <input
                  type="url"
                  value={manualThumbOverride}
                  onChange={(e) => setManualThumbOverride(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="https://…"
                />
              </label>
            </details>
          </div>
        )}

        {/* 折りたたみ: カテゴリ追加 */}
        <details className="text-sm border-t border-blue-50/80 pt-3">
          <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 select-none">
            カテゴリを新規追加
          </summary>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end mt-2">
            <label className="flex-1 block">
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
        </details>
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
                  <th className="text-left py-2 px-3 whitespace-nowrap">公開</th>
                  <th className="text-left py-2 px-3 min-w-[200px]">サムネイルURL</th>
                  <th className="text-left py-2 px-3 min-w-[220px] whitespace-nowrap">ファイル名</th>
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
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => void updateDocumentPublished(d.id, !d.is_published)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                            d.is_published
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          aria-label={d.is_published ? '公開中（クリックで非公開）' : '非公開（クリックで公開）'}
                        >
                          {d.is_published ? '公開中' : '非公開'}
                        </button>
                      </td>
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
                      <td className="py-2 px-3 text-gray-600 min-w-[220px]">
                        {d.file_name ? (
                          <span
                            className="block max-w-[260px] truncate whitespace-nowrap"
                            title={d.file_name}
                          >
                            {d.file_name}
                          </span>
                        ) : (
                          '—'
                        )}
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
                          <label className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 whitespace-nowrap cursor-pointer">
                            {replacingDocumentId === d.id ? '差し替え中…' : 'ファイル差し替え'}
                            <input
                              type="file"
                              className="hidden"
                              disabled={replacingDocumentId !== null}
                              onChange={(e) => {
                                const selectedFile = e.target.files?.[0] ?? null;
                                void replaceDocumentFile(d, selectedFile);
                                e.target.value = '';
                              }}
                            />
                          </label>
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
