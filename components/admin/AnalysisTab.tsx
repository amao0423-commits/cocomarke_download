'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Trash2, X } from 'lucide-react';
import {
  ENTERED_ID_STATUSES,
  type EnteredIdStatus,
  type EnteredIdEntry,
} from '@/lib/enteredIdShared';
import {
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PINK,
  ADMIN_CARD_TABLE_WRAP,
  ADMIN_FOCUS_RING,
} from '@/components/admin/adminPastel';
import { buildImprovementFromMetrics } from '@/lib/improvementFromMetrics';
import type { MetricsInput } from '@/lib/feedbackFromMetrics';

function enteredIdStatusSelectClass(status: EnteredIdStatus | undefined): string {
  const s = status ?? '未対応';
  switch (s) {
    case '未対応':
      return 'bg-[#FFD1D1] text-[#D32F2F] border-[#FFD1D1]';
    case 'リタ中':
      return 'bg-[#FFF9C4] text-[#F57F17] border-[#FFF9C4]';
    case '契約':
      return 'bg-[#C8E6C9] text-[#2E7D32] border-[#C8E6C9]';
    case 'NG':
      return 'bg-[#F5F5F5] text-[#757575] border-[#F5F5F5]';
    default:
      return 'bg-white text-slate-600 border-blue-50';
  }
}

function enteredIdStatusOptionClass(status: EnteredIdStatus): string {
  switch (status) {
    case '未対応':
      return 'bg-[#FFD1D1] text-[#D32F2F]';
    case 'リタ中':
      return 'bg-[#FFF9C4] text-[#F57F17]';
    case '契約':
      return 'bg-[#C8E6C9] text-[#2E7D32]';
    case 'NG':
      return 'bg-[#F5F5F5] text-[#757575]';
    default:
      return '';
  }
}

type DiagnosisSnapshot = Record<string, unknown> & {
  username?: string;
  full_name?: string;
  biography?: string;
  profile_image_url?: string;
  follower_count?: number;
  follow_count?: number;
  post_count?: number;
  average_like_count?: number;
  average_comment_count?: number;
  follower_grade?: string;
  post_count_grade?: string;
  activity_grade?: string;
  total_grade?: string;
  feedback_message?: string[];
  improvement_message?: string[];
};

// ── 公開ページ（InstagramDiagnostic）と同じグレード表記・配色 ──
function normalizeGradeToLetter(raw: unknown): string {
  if (raw == null || String(raw).trim() === '') return '—';
  const s = String(raw).trim();
  const u = s.toUpperCase();
  if (u === 'S' || u === 'A' || u === 'B' || u === 'C' || u === 'D') return u;
  if (s === '不足' || s === '低' || s === '悪' || u === 'LOW' || u === 'POOR') return 'D';
  if (s === '良好' || s === '高' || u === 'HIGH' || u === 'GOOD') return 'A';
  return 'B';
}

function gradeBadgeClasses(grade: string): { dot: string; pill: string } {
  const g = grade;
  const dot =
    g === 'S' || g === 'A' ? 'bg-[#2E7D32]'
      : g === 'B' ? 'bg-[#2E7D32]'
        : g === 'C' ? 'bg-[#F57F17]'
          : g === 'D' ? 'bg-[#E65100]'
            : 'bg-[#D580A0]';
  const pill =
    g === 'S' || g === 'A' ? 'bg-[#C8E6C9] text-[#1B5E20] border border-[#81C784]/40'
      : g === 'B' ? 'bg-[#C8E6C9] text-[#2E7D32] border border-[#81C784]/40'
        : g === 'C' ? 'bg-[#FFF9C4] text-[#F57F17] border border-[#FFE082]/50'
          : g === 'D' ? 'bg-[#FFE0B2] text-[#E65100] border border-[#FFCC80]/50'
            : 'bg-[#FCE4EC] text-[#D580A0] border border-[#F8BBD0]/50';
  return { dot, pill };
}

/** 公開ページ（InstagramDiagnostic）のIGブランド見出しグラデーション */
const IG_TITLE_GRADIENT_CLASS =
  'bg-gradient-to-r from-[#E1306C] to-[#F77737] bg-clip-text text-transparent';


function getInstagramUsername(id: string): string {
  const trimmed = id.trim();
  try {
    if (trimmed.includes('instagram.com')) {
      const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const seg = u.pathname.split('/').filter(Boolean)[0];
      return seg ?? trimmed;
    }
  } catch {
    // パース失敗時は id をそのまま返す
  }
  return trimmed;
}

function getInstagramProfileUrl(id: string): string {
  const username = getInstagramUsername(id);
  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
}

function packEntryKey(entry: EnteredIdEntry): string {
  return JSON.stringify({ id: entry.id, timestamp: entry.timestamp });
}

function unpackEntryKey(key: string): { id: string; timestamp: string } | null {
  try {
    const o = JSON.parse(key) as { id?: unknown; timestamp?: unknown };
    if (typeof o.id === 'string' && typeof o.timestamp === 'string') {
      return { id: o.id, timestamp: o.timestamp };
    }
  } catch {
    // ignore
  }
  return null;
}

export function AnalysisTab({ secretKey }: { secretKey: string }) {
  const [entries, setEntries] = useState<EnteredIdEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<DiagnosisSnapshot | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<EnteredIdEntry | null>(null);
  const [statusFilter, setStatusFilter] = useState<EnteredIdStatus | 'all'>('all');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const selectAllRef = useRef<HTMLInputElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [pngExporting, setPngExporting] = useState(false);
  // プロフィール画像は IG CDN 直リンクだと PNG化時にCORSで欠落するため、
  // プロキシ経由で取得して dataURL 化しておく（取得失敗時は直リンクへフォールバック）。
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/entered-ids', {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage('データの取得に失敗しました。');
        return;
      }
      setEntries(data.entries ?? []);
    } catch {
      setErrorMessage('取得中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const fetchResult = useCallback(
    async (entry: EnteredIdEntry) => {
      setSelectedEntry(entry);
      setModalOpen(true);
      setResultLoading(true);
      setResultError(null);
      setSnapshot(null);
      try {
        const res = await fetch(
          `/api/admin/entered-ids/result?id=${encodeURIComponent(entry.id)}&timestamp=${encodeURIComponent(entry.timestamp)}`,
          { headers: { Authorization: `Bearer ${secretKey}` } }
        );
        const data = await res.json();
        if (!res.ok) {
          setResultError(
            data?.error ??
              (res.status === 404
                ? 'この回は診断結果が保存されていません'
                : '取得に失敗しました')
          );
          return;
        }
        setSnapshot(data as DiagnosisSnapshot);
      } catch {
        setResultError('取得中にエラーが発生しました');
      } finally {
        setResultLoading(false);
      }
    },
    [secretKey]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedEntry(null);
    setSnapshot(null);
    setResultError(null);
  }, []);

  // snapshot が変わるたびにプロフィール画像をプロキシ経由で dataURL 化
  useEffect(() => {
    setAvatarDataUrl(null);
    const url = snapshot?.profile_image_url;
    if (typeof url !== 'string' || url.trim() === '') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/image-proxy?url=${encodeURIComponent(url)}`);
        if (!res.ok) return;
        const blob = await res.blob();
        const dataUrl = await new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(typeof reader.result === 'string' ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
        if (!cancelled && dataUrl) setAvatarDataUrl(dataUrl);
      } catch {
        /* プロキシ失敗時は直リンク表示にフォールバック */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [snapshot]);

  const handleDownloadPng = useCallback(async () => {
    const node = resultCardRef.current;
    if (!node) return;
    setPngExporting(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        // 外部フォントCSSの取得失敗で生成ごと落ちるのを防ぐ（システムフォントで描画）
        skipFonts: true,
      });
      const link = document.createElement('a');
      link.download = `${selectedEntry?.id ?? 'account'}_診断.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('PNG export failed', e);
      alert('PNGの生成に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setPngExporting(false);
    }
  }, [selectedEntry]);

  const updateStatus = useCallback(
    async (entry: EnteredIdEntry, newStatus: EnteredIdStatus) => {
      try {
        const res = await fetch('/api/admin/entered-ids/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secretKey}`,
          },
          body: JSON.stringify({ id: entry.id, timestamp: entry.timestamp, status: newStatus }),
        });
        if (!res.ok) return;
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id && e.timestamp === entry.timestamp
              ? { ...e, status: newStatus }
              : e
          )
        );
      } catch {
        // 更新失敗は静かに無視
      }
    },
    [secretKey]
  );

  const filteredEntries =
    statusFilter === 'all' ? entries : entries.filter((e) => (e.status ?? '未対応') === statusFilter);

  useEffect(() => {
    const filtered =
      statusFilter === 'all'
        ? entries
        : entries.filter((e) => (e.status ?? '未対応') === statusFilter);
    const allowed = new Set(filtered.map(packEntryKey));
    setSelectedKeys((prev) => {
      const next = new Set<string>();
      prev.forEach((k) => {
        if (allowed.has(k)) next.add(k);
      });
      return next;
    });
  }, [entries, statusFilter]);

  const selectedInView = filteredEntries.filter((e) => selectedKeys.has(packEntryKey(e))).length;
  const allFilteredSelected =
    filteredEntries.length > 0 && selectedInView === filteredEntries.length;
  const someFilteredSelected =
    selectedInView > 0 && selectedInView < filteredEntries.length;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someFilteredSelected;
  }, [someFilteredSelected]);

  const toggleSelectAll = useCallback(() => {
    setSelectedKeys((prev) => {
      const filtered =
        statusFilter === 'all'
          ? entries
          : entries.filter((e) => (e.status ?? '未対応') === statusFilter);
      const allOn =
        filtered.length > 0 && filtered.every((e) => prev.has(packEntryKey(e)));
      const next = new Set(prev);
      if (allOn) filtered.forEach((e) => next.delete(packEntryKey(e)));
      else filtered.forEach((e) => next.add(packEntryKey(e)));
      return next;
    });
  }, [entries, statusFilter]);

  const toggleRowSelect = useCallback((entry: EnteredIdEntry) => {
    const k = packEntryKey(entry);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);

  const runBulkDelete = useCallback(
    async (keys: { id: string; timestamp: string }[]) => {
      if (keys.length === 0) return;
      setDeleteBusy(true);
      setDeleteError('');
      try {
        const res = await fetch('/api/admin/entered-ids/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secretKey}`,
          },
          body: JSON.stringify({ keys }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          error?: string;
          removed?: number;
        };
        if (!res.ok || !data.ok) {
          setDeleteError(data?.error ?? '削除に失敗しました');
          return;
        }
        const keySet = new Set(
          keys.map((x) => JSON.stringify({ id: x.id, timestamp: x.timestamp }))
        );
        setEntries((prev) => prev.filter((e) => !keySet.has(packEntryKey(e))));
        setSelectedKeys((prev) => {
          const next = new Set(prev);
          keys.forEach((x) =>
            next.delete(JSON.stringify({ id: x.id, timestamp: x.timestamp }))
          );
          return next;
        });
      } catch {
        setDeleteError('削除中にエラーが発生しました');
      } finally {
        setDeleteBusy(false);
      }
    },
    [secretKey]
  );

  const deleteSelected = useCallback(() => {
    const keys = [...selectedKeys]
      .map(unpackEntryKey)
      .filter((k): k is { id: string; timestamp: string } => k != null);
    if (keys.length === 0) return;
    if (
      !window.confirm(
        `選択中の ${keys.length} 件の診断記録を削除します（診断結果データも消えます）。取り消せません。よろしいですか？`
      )
    ) {
      return;
    }
    void runBulkDelete(keys);
  }, [selectedKeys, runBulkDelete]);

  const deleteAllFiltered = useCallback(() => {
    const keys = filteredEntries.map((e) => ({ id: e.id, timestamp: e.timestamp }));
    if (keys.length === 0) return;
    const label =
      statusFilter === 'all'
        ? `一覧の全 ${keys.length} 件`
        : `表示中の ${keys.length} 件（フィルタ: ${statusFilter}）`;
    if (
      !window.confirm(
        `${label}の診断記録を削除します（診断結果データも消えます）。取り消せません。よろしいですか？`
      )
    ) {
      return;
    }
    void runBulkDelete(keys);
  }, [filteredEntries, statusFilter, runBulkDelete]);

  const downloadCsv = useCallback(() => {
    const header = ['No.', '入力ID', 'Instagram ID', '入力日時', 'ステータス'];
    const fmt = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const rows = filteredEntries.map((entry, i) => [
      String(i + 1),
      entry.id,
      getInstagramUsername(entry.id),
      new Date(entry.timestamp).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }),
      entry.status ?? '未対応',
    ]);
    const csvBody = [header.map(fmt).join(','), ...rows.map((r) => r.map(fmt).join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    a.download = `entered-ids-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredEntries]);

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">読み込み中...</div>;
  }

  if (errorMessage) {
    return (
      <div className="py-16 text-center">
        <p className="text-rose-500 text-sm">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadEntries()}
          className={`mt-4 px-4 py-2 text-sm rounded-2xl border border-blue-100 bg-white text-slate-600 hover:bg-sky-50/50 ${ADMIN_FOCUS_RING}`}
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <>
      {entries.length === 0 ? (
        <div className="py-16 text-center text-slate-500">まだIDが入力されていません</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <p className="text-slate-600">
              合計 <span className="font-semibold text-slate-600">{filteredEntries.length}</span> 件
              {statusFilter !== 'all' && (
                <span className="text-slate-500 text-sm ml-1">（全 {entries.length} 件中）</span>
              )}
            </p>
            <label className="flex items-center gap-2 text-slate-600 text-sm">
              表示:
              <div className="relative inline-flex w-[7.5rem] shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as EnteredIdStatus | 'all')}
                  className={`w-full appearance-none rounded-full border py-0.5 pl-2.5 pr-7 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap transition-[filter] hover:brightness-95 ${ADMIN_FOCUS_RING} ${
                    statusFilter === 'all'
                      ? 'border-blue-100 bg-white text-slate-600'
                      : enteredIdStatusSelectClass(statusFilter)
                  }`}
                >
                  <option value="all" className="bg-white text-slate-600">
                    すべて
                  </option>
                  {ENTERED_ID_STATUSES.map((s) => (
                    <option key={s} value={s} className={enteredIdStatusOptionClass(s)}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current opacity-45"
                  aria-hidden
                />
              </div>
            </label>
            <button
              type="button"
              onClick={downloadCsv}
              className="px-3 py-1.5 text-sm rounded-2xl border border-blue-100 bg-white text-slate-600 hover:bg-violet-50/40"
            >
              CSVでダウンロード
            </button>
            <button
              type="button"
              onClick={() => void deleteSelected()}
              disabled={deleteBusy || selectedKeys.size === 0}
              className={`${ADMIN_BTN_PINK} disabled:pointer-events-none disabled:opacity-40`}
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              選択を削除
              {selectedKeys.size > 0 ? ` (${selectedKeys.size})` : ''}
            </button>
            <button
              type="button"
              onClick={() => void deleteAllFiltered()}
              disabled={deleteBusy || filteredEntries.length === 0}
              className={`${ADMIN_BTN_OUTLINE} border-rose-200/90 text-rose-700 hover:bg-rose-50/50 disabled:pointer-events-none disabled:opacity-40`}
            >
              表示中をすべて削除
              {filteredEntries.length > 0 ? ` (${filteredEntries.length})` : ''}
            </button>
          </div>
          {deleteError && (
            <p className="text-sm text-rose-600 mb-2" role="alert">
              {deleteError}
            </p>
          )}
          <p className="text-sm text-slate-500 mb-4">
            行をクリックすると、その時の診断結果を確認できます。
          </p>
          <div className={ADMIN_CARD_TABLE_WRAP}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-50/90 bg-sky-50/40">
                  <th className="w-10 py-3 px-2 text-center text-slate-500 font-semibold">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={() => toggleSelectAll()}
                      disabled={deleteBusy || filteredEntries.length === 0}
                      className={`h-3.5 w-3.5 rounded border-blue-200 text-sky-500 ${ADMIN_FOCUS_RING}`}
                      aria-label="表示中の行をすべて選択"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">入力ID</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Instagram ID</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">入力日時</th>
                  <th className="w-[7.5rem] min-w-[7.5rem] max-w-[7.5rem] whitespace-nowrap py-3 px-4 text-left text-xs font-semibold text-slate-600">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr
                    key={`${entry.id}-${entry.timestamp}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => fetchResult(entry)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchResult(entry)}
                    className={`border-b border-blue-50/50 transition-colors cursor-pointer ${
                      index % 2 === 1 ? 'bg-blue-50/30' : 'bg-white'
                    } hover:bg-sky-50/40`}
                  >
                    <td
                      className="py-3 px-2 text-center align-middle w-10"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedKeys.has(packEntryKey(entry))}
                        onChange={() => toggleRowSelect(entry)}
                        disabled={deleteBusy}
                        className={`h-3.5 w-3.5 rounded border-blue-200 text-sky-500 ${ADMIN_FOCUS_RING}`}
                        aria-label={`@${getInstagramUsername(entry.id)} の行を選択`}
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 text-slate-600 text-sm break-all max-w-[200px]" title={entry.id}>
                      {entry.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={getInstagramProfileUrl(entry.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-sky-500"
                      >
                        @{getInstagramUsername(entry.id)}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {new Date(entry.timestamp).toLocaleString('ja-JP', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                      })}
                    </td>
                    <td
                      className="w-[7.5rem] min-w-[7.5rem] max-w-[7.5rem] whitespace-nowrap py-2 px-3 align-middle"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-flex w-full min-w-0">
                        <select
                          value={entry.status ?? '未対応'}
                          onChange={(e) => updateStatus(entry, e.target.value as EnteredIdStatus)}
                          className={`w-full min-w-0 appearance-none rounded-full border py-0.5 pl-2.5 pr-7 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap transition-[filter] hover:brightness-95 ${ADMIN_FOCUS_RING} ${enteredIdStatusSelectClass(entry.status)}`}
                          aria-label={`@${entry.id} のステータス`}
                        >
                          {ENTERED_ID_STATUSES.map((s) => (
                            <option key={s} value={s} className={enteredIdStatusOptionClass(s)}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current opacity-45"
                          aria-hidden
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-500/25 backdrop-blur-[1px]"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-blue-50/90 shadow-xl shadow-blue-500/10 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50/80">
              <h2
                id="modal-title"
                className="text-[23px] leading-[34px] font-semibold text-slate-600 md:text-[29px] md:leading-[41px]"
              >
                {selectedEntry
                  ? `@${selectedEntry.id} の診断結果（${new Date(selectedEntry.timestamp).toLocaleString('ja-JP')}）`
                  : '診断結果'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-sky-50/60"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {resultLoading && (
                <div className="py-12 text-center text-gray-500">読み込み中...</div>
              )}
              {!resultLoading && resultError && (
                <p className="py-6 text-center text-red-600">{resultError}</p>
              )}
              {!resultLoading && !resultError && snapshot && (() => {
                const gradeItems = (
                  [
                    ['フォロワー', 'follower_grade'],
                    ['投稿数', 'post_count_grade'],
                    ['活動性', 'activity_grade'],
                    ['総合', 'total_grade'],
                  ] as const
                ).map(([label, key]) => ({ label, grade: normalizeGradeToLetter(snapshot[key]) }));
                const hasGrades = gradeItems.some((g) => g.grade !== '—');
                const metrics = (
                  [
                    ['フォロワー', snapshot.follower_count],
                    ['フォロー', snapshot.follow_count],
                    ['投稿数', snapshot.post_count],
                    ['平均いいね', snapshot.average_like_count],
                  ] as const
                ).filter(([, v]) => v != null);
                const directAvatar =
                  typeof snapshot.profile_image_url === 'string' ? snapshot.profile_image_url : null;
                // dataURL（プロキシ取得成功）を優先し、失敗時は直リンクで表示
                const avatarSrc = avatarDataUrl ?? directAvatar;
                const feedback = (snapshot.feedback_message as string[] | undefined) ?? [];
                // 保存済みsnapshotは旧テキストのことがあるため、メトリクスから最新の詳細版を再計算。
                // 再計算が空なら保存値にフォールバック。
                const recomputed = buildImprovementFromMetrics(snapshot as unknown as MetricsInput);
                const improvements =
                  recomputed.length > 0
                    ? recomputed
                    : (snapshot.improvement_message as string[] | undefined) ?? [];
                return (
                  <>
                    {/* PNG出力対象：公開ページと同じ配色・様式の結果カード（全件表示） */}
                    <div ref={resultCardRef} className="bg-white p-5 space-y-5">
                      <p className={`text-[13px] font-bold tracking-wide ${IG_TITLE_GRADIENT_CLASS}`}>
                        アカウント診断結果
                      </p>
                      {/* プロフィール */}
                      <div className="flex gap-4">
                        {avatarSrc && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarSrc}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          {snapshot.full_name != null && (
                            <p className="text-base font-semibold text-gray-900 leading-tight">
                              {String(snapshot.full_name)}
                            </p>
                          )}
                          {snapshot.username != null && (
                            <p className="text-[#C13584] font-medium text-sm">@{String(snapshot.username)}</p>
                          )}
                          {snapshot.biography != null && (
                            <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap leading-relaxed">
                              {String(snapshot.biography)}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* 評価 */}
                      {hasGrades && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">評価</h4>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                            <div className="grid grid-cols-2 gap-3">
                              {gradeItems.map(({ label, grade }) => {
                                if (grade === '—') return null;
                                const { dot, pill } = gradeBadgeClasses(grade);
                                return (
                                  <div
                                    key={label}
                                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FDF8FB]/90"
                                  >
                                    <span className="text-sm text-[#B5658C]">{label}</span>
                                    <span className="flex items-center gap-2">
                                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${dot}`} aria-hidden />
                                      <span className={`rounded-md px-2 py-0.5 text-sm font-medium ${pill}`}>{grade}</span>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      {/* 主要数値 */}
                      {metrics.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">主要数値</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {metrics.map(([label, value]) => (
                              <div key={label} className="rounded-lg bg-[#FDF8FB]/90 px-3 py-2">
                                <span className="text-xs text-[#B5658C]">{label}</span>
                                <p className="font-semibold text-gray-900">{Number(value).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* フィードバック（全件） */}
                      {feedback.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">現状のアカウントに関するフィードバック</h4>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                            <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 [&_li]:marker:text-neutral-600">
                              {feedback.map((msg, i) => (
                                <li key={i}>{msg}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {/* 改善点（全件・截断なし） */}
                      {improvements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">今後の運用への改善点</h4>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                              {improvements.map((p, i) => (
                                <p key={i}>{p}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* アクション（PNG非対象） */}
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={handleDownloadPng}
                        disabled={pngExporting}
                        className={`inline-flex items-center gap-2 ${ADMIN_BTN_PINK} disabled:opacity-60`}
                      >
                        <Download className="w-4 h-4" aria-hidden />
                        {pngExporting ? '生成中…' : 'PNGで保存'}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
