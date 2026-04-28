'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Trash2, X } from 'lucide-react';
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

function normalizeGrade(raw: string | undefined): string {
  if (raw == null || String(raw).trim() === '') return '—';
  const s = String(raw).trim().toUpperCase();
  if (['S', 'A', 'B', 'C', 'D'].includes(s)) return s;
  return s;
}

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
              {!resultLoading && !resultError && snapshot && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    {snapshot.profile_image_url && (
                      <img src={snapshot.profile_image_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div className="min-w-0">
                      {snapshot.full_name && <p className="font-semibold text-gray-900">{snapshot.full_name}</p>}
                      {snapshot.username && <p className="text-gray-600 text-sm">@{snapshot.username}</p>}
                      {snapshot.biography && (
                        <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">{String(snapshot.biography)}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">主要数値</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      {snapshot.follower_count != null && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">フォロワー</span>
                          <p className="font-semibold text-gray-900">{Number(snapshot.follower_count).toLocaleString()}</p>
                        </div>
                      )}
                      {snapshot.follow_count != null && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">フォロー</span>
                          <p className="font-semibold text-gray-900">{Number(snapshot.follow_count).toLocaleString()}</p>
                        </div>
                      )}
                      {snapshot.post_count != null && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">投稿数</span>
                          <p className="font-semibold text-gray-900">{Number(snapshot.post_count).toLocaleString()}</p>
                        </div>
                      )}
                      {snapshot.average_like_count != null && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">平均いいね</span>
                          <p className="font-semibold text-gray-900">{Number(snapshot.average_like_count).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">評価</h4>
                    <div className="flex flex-wrap gap-2">
                      {(['フォロワー', '投稿数', '活動性', '総合'] as const).map((label, i) => {
                        const key = (['follower_grade', 'post_count_grade', 'activity_grade', 'total_grade'] as const)[i];
                        const g = normalizeGrade(snapshot[key]);
                        if (g === '—') return null;
                        return (
                          <span key={label} className="inline-flex items-center gap-1.5 bg-gray-100 rounded-md px-2 py-1 text-sm">
                            <span className="text-gray-600">{label}</span>
                            <span className="font-medium text-gray-900">{g}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {snapshot.feedback_message && snapshot.feedback_message.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">フィードバック</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {(snapshot.feedback_message as string[]).map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {snapshot.improvement_message && snapshot.improvement_message.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">改善点</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        {(snapshot.improvement_message as string[]).map((msg, i) => (
                          <p key={i}>{msg}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
