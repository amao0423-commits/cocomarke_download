'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Eye, Mail, Trash2, X } from 'lucide-react';
import {
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PINK,
  ADMIN_FOCUS_RING,
} from '@/components/admin/adminPastel';

type DiagnosisEntry = {
  id: string;
  store_name: string;
  email: string;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string[];
  q5: string[];
  q6: string | null;
  q8_area: string[];
  instagram: string | null;
  consultation: string | null;
  created_at: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${day} ${h}:${min}`;
}

function joinArr(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return '—';
  return arr.join('、');
}

function nullToHyphen(v: string | null | undefined): string {
  const t = v?.trim() ?? '';
  return t || '—';
}

function DetailDialog({
  entry,
  onClose,
}: {
  entry: DiagnosisEntry;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const rows: { k: string; v: string }[] = [
    { k: '店舗名', v: nullToHyphen(entry.store_name) },
    { k: 'メールアドレス', v: entry.email },
    { k: 'Instagramアカウント', v: nullToHyphen(entry.instagram) },
    { k: '申請日時', v: formatDate(entry.created_at) },
    { k: 'Q1 店舗カテゴリー', v: nullToHyphen(entry.q1) },
    { k: 'Q2 Instagramの運用状況', v: nullToHyphen(entry.q2) },
    { k: 'Q3 月の投稿回数', v: nullToHyphen(entry.q3) },
    { k: 'Q4 一番のお悩み', v: joinArr(entry.q4) },
    { k: 'Q5 新規来店のきっかけ', v: joinArr(entry.q5) },
    { k: 'Q6 Instagram広告', v: nullToHyphen(entry.q6) },
    { k: 'Q8 店舗エリア', v: joinArr(entry.q8_area) },
    { k: '相談内容', v: nullToHyphen(entry.consultation) },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-500/25 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="diag-detail-title"
        className="max-h-[min(90vh,44rem)] w-full max-w-lg overflow-hidden rounded-3xl border border-blue-50/90 bg-white shadow-xl shadow-blue-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-blue-50/80 px-4 py-3">
          <h2 id="diag-detail-title" className="text-sm font-semibold text-slate-600">
            診断申請の詳細
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'min(80vh, 40rem)' }}>
          <dl className="space-y-3 text-sm">
            {rows.map(({ k, v }) => (
              <div key={k}>
                <dt className="text-xs font-semibold text-slate-500">{k}</dt>
                <dd className="mt-0.5 whitespace-pre-wrap break-words text-slate-600">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function RestaurantDiagnosisTab({ secretKey }: { secretKey: string }) {
  const [entries, setEntries] = useState<DiagnosisEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailEntry, setDetailEntry] = useState<DiagnosisEntry | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const selectAllRef = useRef<HTMLInputElement>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/restaurant-diagnosis-requests', {
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
    void loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const allowed = new Set(entries.map((e) => e.id));
    setSelectedIds((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (allowed.has(id)) next.add(id);
      });
      return next;
    });
  }, [entries]);

  const allSelected =
    entries.length > 0 && entries.every((e) => selectedIds.has(e.id));
  const someSelected =
    entries.filter((e) => selectedIds.has(e.id)).length > 0 &&
    entries.filter((e) => selectedIds.has(e.id)).length < entries.length;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someSelected;
  }, [someSelected]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allOn = entries.length > 0 && entries.every((e) => next.has(e.id));
      if (allOn) entries.forEach((e) => next.delete(e.id));
      else entries.forEach((e) => next.add(e.id));
      return next;
    });
  }, [entries]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const runBulkDelete = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      setDeleteBusy(true);
      setDeleteError('');
      try {
        const res = await fetch('/api/admin/restaurant-diagnosis-requests/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secretKey}`,
          },
          body: JSON.stringify({ ids }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !data.ok) {
          setDeleteError(data?.error ?? '削除に失敗しました');
          return;
        }
        const idSet = new Set(ids);
        setEntries((prev) => prev.filter((e) => !idSet.has(e.id)));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
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
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `選択中の ${ids.length} 件の診断申請を削除します。この操作は取り消せません。よろしいですか？`
      )
    ) {
      return;
    }
    void runBulkDelete(ids);
  }, [selectedIds, runBulkDelete]);

  const deleteAllVisible = useCallback(() => {
    const ids = entries.map((e) => e.id);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `一覧の全 ${ids.length} 件の診断申請を削除します。この操作は取り消せません。よろしいですか？`
      )
    ) {
      return;
    }
    void runBulkDelete(ids);
  }, [entries, runBulkDelete]);

  const downloadCsv = useCallback(() => {
    const header = [
      'No.',
      '店舗名',
      'メールアドレス',
      'Instagramアカウント',
      '申請日時',
      'Q1 店舗カテゴリー',
      'Q2 Instagramの運用状況',
      'Q3 月の投稿回数',
      'Q4 一番のお悩み',
      'Q5 新規来店のきっかけ',
      'Q6 Instagram広告',
      'Q8 店舗エリア',
      '相談内容',
    ];
    const fmt = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const rows = entries.map((e, i) => [
      String(i + 1),
      e.store_name,
      e.email,
      e.instagram ?? '',
      new Date(e.created_at).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }),
      e.q1 ?? '',
      e.q2 ?? '',
      e.q3 ?? '',
      joinArr(e.q4),
      joinArr(e.q5),
      e.q6 ?? '',
      joinArr(e.q8_area),
      e.consultation ?? '',
    ]);
    const csvBody = [header.map(fmt).join(','), ...rows.map((r) => r.map(fmt).join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    a.download = `sns-diagnosis-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

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
          className={`mt-4 px-4 py-2 text-sm rounded-2xl border border-blue-100 bg-white text-slate-600 hover:bg-sky-50/60 ${ADMIN_FOCUS_RING}`}
        >
          再試行
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return <div className="py-16 text-center text-slate-500">まだ申請がありません</div>;
  }

  const cellWrap = 'min-w-0 px-1.5 py-2 align-top text-slate-600 [overflow-wrap:anywhere] [word-break:break-word]';

  return (
    <>
      {detailEntry && (
        <DetailDialog entry={detailEntry} onClose={() => setDetailEntry(null)} />
      )}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <p className="text-slate-600">
          合計 <span className="font-semibold">{entries.length}</span> 件
        </p>
        <button
          type="button"
          onClick={downloadCsv}
          className="px-3 py-1.5 text-sm rounded-2xl border border-blue-100 bg-white text-slate-600 hover:bg-violet-50/50"
        >
          CSVでダウンロード
        </button>
        <button
          type="button"
          onClick={() => void deleteSelected()}
          disabled={deleteBusy || selectedIds.size === 0}
          className={`${ADMIN_BTN_PINK} disabled:pointer-events-none disabled:opacity-40`}
        >
          <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          選択を削除
          {selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
        </button>
        <button
          type="button"
          onClick={() => void deleteAllVisible()}
          disabled={deleteBusy || entries.length === 0}
          className={`${ADMIN_BTN_OUTLINE} border-rose-200/90 text-rose-700 hover:bg-rose-50/50 disabled:pointer-events-none disabled:opacity-40`}
        >
          表示中をすべて削除
          {entries.length > 0 ? ` (${entries.length})` : ''}
        </button>
      </div>
      {deleteError && (
        <p className="text-sm text-rose-600 mb-3" role="alert">
          {deleteError}
        </p>
      )}
      <div className="w-full max-w-full rounded-2xl border border-blue-50/80 bg-white shadow-xl shadow-blue-500/5">
        <table className="w-full table-fixed border-collapse text-xs">
          <colgroup>
            <col style={{ width: '2.5rem' }} />
            <col style={{ width: '3%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '5%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-blue-50/90 bg-sky-50/40">
              <th className="px-1 py-2 text-center font-semibold text-slate-500 w-10">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => toggleSelectAll()}
                  disabled={deleteBusy || entries.length === 0}
                  className={`h-3.5 w-3.5 rounded border-blue-200 text-sky-500 ${ADMIN_FOCUS_RING}`}
                  aria-label="すべて選択"
                />
              </th>
              <th className="px-1 py-2 text-left font-semibold uppercase tracking-wide text-slate-500">#</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">店舗名</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">メール</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">Instagram</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">エリア</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">お悩み</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">カテゴリー</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">申請日時</th>
              <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">相談</th>
              <th className="px-1 py-2 text-center font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const stripe = index % 2 === 1 ? 'bg-blue-50/30' : 'bg-white';
              return (
                <tr
                  key={entry.id}
                  className={`border-b border-blue-50/50 transition-colors ${stripe} hover:bg-sky-50/40`}
                >
                  <td className="px-1 py-2 align-middle text-center w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(entry.id)}
                      onChange={() => toggleRow(entry.id)}
                      disabled={deleteBusy}
                      className={`h-3.5 w-3.5 rounded border-blue-200 text-sky-500 ${ADMIN_FOCUS_RING}`}
                      aria-label={`${entry.store_name} を選択`}
                    />
                  </td>
                  <td className={`${cellWrap} text-slate-500 tabular-nums align-middle`}>{index + 1}</td>
                  <td className={cellWrap}>
                    <div className="font-medium text-slate-600 leading-snug">{entry.store_name}</div>
                  </td>
                  <td className={cellWrap}>
                    <div className="leading-snug">{entry.email}</div>
                  </td>
                  <td className={cellWrap}>
                    <div className="leading-snug text-[11px]">{nullToHyphen(entry.instagram)}</div>
                  </td>
                  <td className={cellWrap}>
                    <div className="leading-snug">{joinArr(entry.q8_area)}</div>
                  </td>
                  <td className={cellWrap}>
                    <div className="whitespace-pre-wrap leading-snug">{joinArr(entry.q4)}</div>
                  </td>
                  <td className={cellWrap}>
                    <div className="leading-snug">{nullToHyphen(entry.q1)}</div>
                  </td>
                  <td className={`${cellWrap} tabular-nums text-[11px] leading-snug`}>
                    {formatDate(entry.created_at)}
                  </td>
                  <td className={cellWrap}>
                    <div className="leading-snug text-[11px]">
                      {entry.consultation?.trim() ? '有' : '—'}
                    </div>
                  </td>
                  <td className="px-1 py-2 align-middle">
                    <div className="flex flex-wrap items-center justify-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => setDetailEntry(entry)}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-blue-50 bg-white text-sky-400 hover:bg-sky-50/50 hover:text-sky-500 ${ADMIN_FOCUS_RING}`}
                        title="詳細表示"
                        aria-label="詳細表示"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={`mailto:${entry.email}`}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-blue-50 bg-white text-rose-300 hover:bg-rose-50/40 hover:text-rose-400 ${ADMIN_FOCUS_RING}`}
                        title="メール作成"
                        aria-label="メール作成"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
