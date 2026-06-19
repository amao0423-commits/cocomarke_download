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
  is_published?: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  sort_order: number;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
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
  const [uploadIsPublished, setUploadIsPublished] = useState(false);
  const [autoThumbBlob, setAutoThumbBlob] = useState<Blob | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState('');
  const [thumbGenerating, setThumbGenerating] = useState(false);
  const [manualThumbOverride, setManualThumbOverride] = useState('');
  const [reorderBusy, setReorderBusy] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const prevThumbPreviewRef = useRef('');

  // オブジェクトURL の解放
  useEffect(() => {
    prevThumbPreviewRef.current = thumbPreviewUrl;
    return () => {
      if (prevThumbPreviewRef.current) URL.revokeObjectURL(prevThumbPreviewRef.current);
    };
  }, [thumbPreviewUrl]);

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
  }, [secretKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [secretKey, filterCategory]); // eslint-disable-line react-hooks/exhaustive-deps

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

  /** 「すべて」ビューで資料カードを全体的に並び替える（トップページの並び順に反映） */
  const moveDocument = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= documents.length) return;
    const next = [...documents];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((d, i) => ({ ...d, sort_order: i * 10 }));
    setDocuments(reordered);
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

  const filteredDocs =
    filterCategory === 'all'
      ? documents
      : documents.filter((d) => d.category === filterCategory);

  return (
    <div className="space-y-8">
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

      {/* 資料を追加 */}
      <div className="border border-blue-50/90 rounded-3xl p-5 space-y-4 shadow-xl shadow-blue-500/[0.04]">
        <h2 className="font-semibold">資料を追加</h2>

        <label className="block">
          <span className="text-xs font-medium text-gray-500">PDFファイルを選択</span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => void handleFileSelect(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
        </label>

        {file && (
          <div className="space-y-4 border-t border-blue-50/80 pt-4">
            <div className="flex gap-4 items-start">
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

            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={busy || !title.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#A0D8EF] text-[#2C657A] text-sm font-semibold disabled:opacity-40"
            >
              {busy ? '処理中…' : '登録する'}
            </button>

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

      {/* カテゴリの表示順（並び替えのみ） */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <h2 className="font-semibold">カテゴリの表示順</h2>
        <p className="text-xs text-gray-500">
          ↑↓ で並び替え（即時保存）。トップページのカテゴリタブの並び順に反映されます。
        </p>
        {categories.length === 0 ? (
          <p className="text-gray-400 text-xs">カテゴリがありません</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li
                key={cat.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <span className="flex-1 text-sm font-medium text-gray-800">{cat.name}</span>
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
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 登録済み（アコーディオン） */}
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
        {filterCategory === 'all' ? (
          <p className="text-xs text-gray-500 mb-3">
            ↑↓ ボタンで資料カードの並び順を変更できます（トップページに反映・即時保存）
          </p>
        ) : (
          <p className="text-xs text-gray-400 mb-3">
            並び替えは「すべて」タブで行えます。
          </p>
        )}

        {filteredDocs.length === 0 ? (
          <p className="text-gray-500 text-sm">該当する資料がありません</p>
        ) : (
          <ul className="space-y-2">
            {filteredDocs.map((d, i) => {
              const open = expandedId === d.id;
              return (
                <li
                  key={d.id}
                  className="rounded-2xl border border-blue-50/90 bg-white overflow-hidden shadow-sm"
                >
                  {/* 行ヘッダー（クリックで開閉） */}
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    {filterCategory === 'all' && (
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={i === 0 || reorderBusy}
                          onClick={() => void moveDocument(i, -1)}
                          className="rounded border border-gray-200 bg-white px-1.5 py-0 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition leading-none"
                          aria-label="上へ"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={i === filteredDocs.length - 1 || reorderBusy}
                          onClick={() => void moveDocument(i, 1)}
                          className="rounded border border-gray-200 bg-white px-1.5 py-0 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition leading-none"
                          aria-label="下へ"
                        >
                          ↓
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(open ? null : d.id)}
                      className="flex flex-1 min-w-0 items-center gap-2 text-left"
                    >
                      <span className="flex-1 min-w-0 truncate font-medium text-slate-700">
                        {d.title}
                      </span>
                      <span className="hidden sm:inline-block shrink-0 rounded-full bg-[#E6EFFA] px-2.5 py-0.5 text-[10px] font-bold text-[#0C447C]">
                        {d.category}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          d.is_published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {d.is_published ? '公開中' : '非公開'}
                      </span>
                      <Chevron open={open} />
                    </button>
                  </div>

                  {/* 詳細（開いたときだけ） */}
                  {open && (
                    <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-4 space-y-4 text-sm">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 w-16">公開状態</span>
                          <button
                            type="button"
                            onClick={() => void updateDocumentPublished(d.id, !d.is_published)}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition ${
                              d.is_published
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {d.is_published ? '公開中（クリックで非公開）' : '非公開（クリックで公開）'}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 w-16">カテゴリ</span>
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
                        </div>
                      </div>

                      <label className="block">
                        <span className="text-xs font-medium text-gray-500">サムネイルURL</span>
                        <input
                          type="url"
                          defaultValue={d.thumbnail_url ?? ''}
                          key={`${d.id}-${d.thumbnail_url ?? ''}`}
                          onBlur={(e) =>
                            void updateDocumentThumbnail(d.id, d.thumbnail_url ?? null, e.target.value)
                          }
                          className="mt-1 w-full max-w-xl border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs"
                          placeholder="https://…"
                          title="フォーカスを外すと保存されます。空にすると解除"
                        />
                      </label>

                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div>
                          ファイル名:{' '}
                          <span className="text-gray-700 break-all">{d.file_name ?? '—'}</span>
                        </div>
                        <div>登録日時: {new Date(d.created_at).toLocaleString('ja-JP')}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
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
                          className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
