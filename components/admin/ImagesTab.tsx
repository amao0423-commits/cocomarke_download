'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

type ImageFile = {
  name: string;
  size: number | null;
  created_at: string | null;
  public_url: string;
};

type CopyState = 'idle' | 'copied';

function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CopyButton({ url }: { url: string }) {
  const [state, setState] = useState<CopyState>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      // clipboard API が使えない環境のフォールバック
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`shrink-0 px-3 py-1.5 rounded-2xl text-xs font-medium transition-colors ${
        state === 'copied'
          ? 'bg-[#C8E6C9] text-[#388E3C]'
          : 'bg-sky-50/80 text-slate-600 hover:bg-sky-100/80'
      }`}
    >
      {state === 'copied' ? 'コピー済み ✓' : 'URLコピー'}
    </button>
  );
}

export function ImagesTab({ secretKey }: { secretKey: string }) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${secretKey}` };

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/images', { headers });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? '一覧の取得に失敗しました');
        return;
      }
      setFiles(json.files ?? []);
    } catch {
      setErrorMsg('通信エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secretKey]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFile = useCallback(async (file: File) => {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!ALLOWED.includes(file.type)) {
      setErrorMsg('画像ファイル（JPEG・PNG・WebP・GIF・SVG）のみアップロードできます');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('ファイルサイズは10MB以内にしてください');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/admin/images', { method: 'POST', headers, body: fd });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? 'アップロードに失敗しました');
        return;
      }
      setSuccessMsg('アップロード完了！URLをコピーして使用してください。');
      await fetchFiles();
    } catch {
      setErrorMsg('通信エラーが発生しました');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secretKey, fetchFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-600 mb-1">画像アップロード</h2>
        <p className="text-sm text-slate-500">
          アップロードした画像のURLをコピーして、サムネイルやヒーロー画像の入力欄に貼り付けてください。
        </p>
      </div>

      {/* アップロードエリア */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors select-none ${
          dragOver
            ? 'border-sky-300 bg-sky-50/60'
            : 'border-blue-100 hover:border-sky-200 hover:bg-violet-50/30'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">アップロード中...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-sky-50/90 flex items-center justify-center text-2xl border border-blue-50">
              🖼️
            </div>
            <p className="text-sm font-medium text-slate-600">
              クリックまたはドラッグ＆ドロップで画像を選択
            </p>
            <p className="text-xs text-slate-500">JPEG・PNG・WebP・GIF・SVG（最大10MB）</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-rose-50/90 border border-rose-100 text-rose-600 text-sm rounded-2xl px-4 py-3">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-[#C8E6C9]/50 border border-emerald-100 text-[#388E3C] text-sm rounded-2xl px-4 py-3">
          {successMsg}
        </div>
      )}

      {/* 画像一覧 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-600">
            アップロード済み画像
            {files.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-400">({files.length}件)</span>
            )}
          </h3>
          <button
            type="button"
            onClick={fetchFiles}
            disabled={isLoading}
            className="text-xs text-slate-500 hover:text-sky-500 disabled:opacity-40 transition-colors"
          >
            {isLoading ? '読み込み中...' : '更新'}
          </button>
        </div>

        {isLoading && files.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">読み込み中...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            まだ画像がアップロードされていません
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-3 border border-blue-50/90 rounded-3xl p-3 bg-white hover:bg-sky-50/40 transition-colors shadow-sm shadow-blue-500/[0.03]"
              >
                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-sky-50/50 border border-blue-50">
                  <Image
                    src={f.public_url}
                    alt={f.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={f.name.endsWith('.svg')}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs text-slate-500 truncate">{f.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(f.size)}</p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={f.public_url}
                      className="flex-1 min-w-0 text-xs bg-sky-50/50 border border-blue-50 rounded-xl px-2 py-1 text-slate-600 truncate focus:outline-none"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <CopyButton url={f.public_url} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
