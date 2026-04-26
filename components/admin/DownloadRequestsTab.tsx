'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Eye, Mail, RefreshCw, X } from 'lucide-react';
import {
  DOWNLOAD_REQUEST_STATUSES,
  normalizeDownloadRequestStatusForUi,
  type DownloadRequestStatus,
  type DownloadRequestEntry,
} from '@/lib/downloadRequestShared';
import type { EmailStatus } from '@/types/database.types';
import { ADMIN_FOCUS_RING } from '@/components/admin/adminPastel';

function emailStatusLabel(s: EmailStatus | undefined): string {
  if (!s) return '—';
  if (s === 'pending') return 'メール待ち';
  if (s === 'sent') return '送信済';
  return '失敗';
}

/** 旧データ（氏名のみ）では name を姓欄に表示 */
function displayFamilyName(entry: DownloadRequestEntry): string {
  if (entry.lastName?.trim()) return entry.lastName.trim();
  if (!entry.firstName?.trim() && entry.name?.trim()) return entry.name.trim();
  return '—';
}

function displayGivenName(entry: DownloadRequestEntry): string {
  return entry.firstName?.trim() || '—';
}

function displayFullName(entry: DownloadRequestEntry): string {
  const f = displayFamilyName(entry);
  const g = displayGivenName(entry);
  if (f === '—' && g === '—') return '—';
  if (f === '—') return g;
  if (g === '—') return f;
  return `${f} ${g}`;
}

function formatRequestDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${day} ${h}:${min}`;
}

function statusSelectClasses(status: DownloadRequestStatus): string {
  switch (status) {
    case '送付済':
      return 'bg-[#FFD1D1] text-[#D32F2F] border-[#FFD1D1]';
    case 'リタ中':
      return 'bg-[#FFF9C4] text-[#F57F17] border-[#FFF9C4]';
    case '契約':
      return 'bg-[#C8E6C9] text-[#2E7D32] border-[#C8E6C9]';
    default:
      return 'bg-white text-slate-600 border-blue-50';
  }
}

function statusOptionClasses(status: DownloadRequestStatus): string {
  switch (status) {
    case '送付済':
      return 'bg-[#FFD1D1] text-[#D32F2F]';
    case 'リタ中':
      return 'bg-[#FFF9C4] text-[#F57F17]';
    case '契約':
      return 'bg-[#C8E6C9] text-[#2E7D32]';
    default:
      return '';
  }
}

function multilineCell(value: string | undefined | null): string {
  const t = value?.trim() ?? '';
  return t || '—';
}

function EntryDetailDialog({
  entry,
  onClose,
}: {
  entry: DownloadRequestEntry;
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
    { k: '氏名', v: displayFullName(entry) },
    { k: '会社名', v: entry.company?.trim() || '—' },
    { k: 'メール', v: entry.email },
    { k: '電話', v: entry.phone?.trim() || '—' },
    { k: '役職', v: entry.department?.trim() || '—' },
    { k: '資料請求の目的', v: entry.requestPurpose?.trim() || '—' },
    { k: 'ご質問・ご要望', v: entry.questions?.trim() || '—' },
    { k: '申請日時', v: formatRequestDate(entry.timestamp) },
    { k: '希望資料', v: entry.documentTitle ?? '—' },
    { k: '使用したメール文面', v: entry.templateSubject ?? (entry.templateId ? '（件名未取得）' : '標準のメール') },
    { k: 'ステータス', v: normalizeDownloadRequestStatusForUi(entry.status) },
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
        aria-labelledby="entry-detail-title"
        className="max-h-[min(90vh,40rem)] w-full max-w-lg overflow-hidden rounded-3xl border border-blue-50/90 bg-white shadow-xl shadow-blue-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-blue-50/80 px-4 py-3">
          <h2 id="entry-detail-title" className="text-sm font-semibold text-slate-600">
            申請の詳細
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
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'min(75vh, 36rem)' }}>
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

export function DownloadRequestsTab({ secretKey }: { secretKey: string }) {
  const [entries, setEntries] = useState<DownloadRequestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<DownloadRequestStatus | 'all'>('all');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [detailEntry, setDetailEntry] = useState<DownloadRequestEntry | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/download-requests', {
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

  const updateStatus = useCallback(
    async (entry: DownloadRequestEntry, newStatus: DownloadRequestStatus) => {
      try {
        const res = await fetch('/api/admin/download-requests/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secretKey}`,
          },
          body: JSON.stringify({ id: entry.id, status: newStatus }),
        });
        if (!res.ok) return;
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, status: newStatus } : e))
        );
      } catch {
        // 更新失敗は静かに無視
      }
    },
    [secretKey]
  );

  const resend = useCallback(
    async (entry: DownloadRequestEntry) => {
      setResendingId(entry.id);
      try {
        const res = await fetch('/api/admin/download-requests/resend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secretKey}`,
          },
          body: JSON.stringify({ id: entry.id }),
        });
        const data = await res.json();
        if (!res.ok) return;
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, emailStatus: data.emailStatus as EmailStatus }
              : e
          )
        );
      } catch {
        // ignore
      } finally {
        setResendingId(null);
      }
    },
    [secretKey]
  );

  const filteredEntries =
    statusFilter === 'all'
      ? entries
      : entries.filter((e) => normalizeDownloadRequestStatusForUi(e.status) === statusFilter);

  const downloadCsv = useCallback(() => {
    const header = [
      'No.',
      '姓',
      '名',
      'メールアドレス',
      '電話番号',
      '会社名',
      '役職',
      '資料請求の目的',
      'ご質問・ご要望',
      '申請日時',
      '希望資料',
      '使用したメール文面',
      'ステータス',
    ];
    const fmt = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const rows = filteredEntries.map((entry, i) => [
      String(i + 1),
      displayFamilyName(entry),
      displayGivenName(entry),
      entry.email,
      entry.phone ?? '',
      entry.company,
      entry.department ?? '',
      entry.requestPurpose ?? '',
      entry.questions ?? '',
      new Date(entry.timestamp).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }),
      entry.documentTitle ?? '—',
      entry.templateSubject ?? (entry.templateId ? '（件名未取得）' : '標準のメール'),
      normalizeDownloadRequestStatusForUi(entry.status),
    ]);
    const csvBody = [header.map(fmt).join(','), ...rows.map((r) => r.map(fmt).join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    a.download = `download-requests-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
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
          className={`mt-4 px-4 py-2 text-sm rounded-2xl border border-blue-100 bg-white text-slate-600 hover:bg-sky-50/60 ${ADMIN_FOCUS_RING}`}
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <>
      {detailEntry && (
        <EntryDetailDialog entry={detailEntry} onClose={() => setDetailEntry(null)} />
      )}
      {entries.length === 0 ? (
        <div className="py-16 text-center text-slate-500">まだ申請がありません</div>
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
                  onChange={(e) => setStatusFilter(e.target.value as DownloadRequestStatus | 'all')}
                  className={`w-full appearance-none rounded-full border py-0.5 pl-2.5 pr-7 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap transition-[filter] hover:brightness-95 ${ADMIN_FOCUS_RING} ${
                    statusFilter === 'all'
                      ? 'border-blue-100 bg-white text-slate-600'
                      : statusSelectClasses(statusFilter)
                  }`}
                >
                  <option value="all" className="bg-white text-slate-600">
                    すべて
                  </option>
                  {DOWNLOAD_REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s} className={statusOptionClasses(s)}>
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
              className="px-3 py-1.5 text-sm rounded-2xl border border-blue-100 bg-white text-slate-600 hover:bg-violet-50/50"
            >
              CSVでダウンロード
            </button>
          </div>
          <div className="w-full max-w-full rounded-2xl border border-blue-50/80 bg-white shadow-xl shadow-blue-500/5">
            <table className="w-full table-fixed border-collapse text-xs">
              <colgroup>
                <col style={{ width: '3%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '7%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-blue-50/90 bg-sky-50/40">
                  <th className="px-1 py-2 text-left font-semibold uppercase tracking-wide text-slate-500">
                    #
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    申請者
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    メール
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    電話
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    役職
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    目的
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    ご質問
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    申請日時
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    希望資料
                  </th>
                  <th className="min-w-0 px-1 py-2 text-left font-semibold text-slate-600">
                    メール文面
                  </th>
                  <th className="w-[7.5rem] min-w-[7.5rem] max-w-[7.5rem] whitespace-nowrap px-1 py-2 text-left text-xs font-semibold text-slate-600">
                    対応
                  </th>
                  <th className="px-1 py-2 text-center font-semibold text-slate-600">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => {
                  const st = normalizeDownloadRequestStatusForUi(entry.status);
                  const stripe = index % 2 === 1 ? 'bg-blue-50/30' : 'bg-white';
                  const cellWrap =
                    'min-w-0 px-1.5 py-2 align-top text-slate-600 [overflow-wrap:anywhere] [word-break:break-word]';
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-blue-50/50 transition-colors ${stripe} hover:bg-sky-50/40`}
                    >
                      <td className={`${cellWrap} text-slate-500 tabular-nums align-middle`}>
                        {index + 1}
                      </td>
                      <td className={cellWrap}>
                        <div className="space-y-0.5 leading-snug">
                          <div className="font-medium text-slate-600">{displayFullName(entry)}</div>
                          <div className="text-[11px] text-slate-500">
                            {entry.company?.trim() || '—'}
                          </div>
                        </div>
                      </td>
                      <td className={cellWrap}>
                        <div className="leading-snug">{entry.email}</div>
                      </td>
                      <td className={cellWrap}>
                        {entry.phone?.trim() ? (
                          <a
                            href={`tel:${entry.phone.replace(/\s/g, '')}`}
                            className="leading-snug text-slate-600 underline-offset-2 hover:text-sky-600 hover:underline"
                          >
                            {entry.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className={cellWrap}>
                        <div className="leading-snug">
                          {entry.department?.trim() ? entry.department : '—'}
                        </div>
                      </td>
                      <td className={cellWrap}>
                        <div className="whitespace-pre-wrap leading-snug">{multilineCell(entry.requestPurpose)}</div>
                      </td>
                      <td className={cellWrap}>
                        <div className="whitespace-pre-wrap leading-snug">{multilineCell(entry.questions)}</div>
                      </td>
                      <td className={`${cellWrap} tabular-nums text-[11px] leading-snug`}>
                        {formatRequestDate(entry.timestamp)}
                      </td>
                      <td className={cellWrap}>
                        <div className="leading-snug">{entry.documentTitle ?? '—'}</div>
                      </td>
                      <td className={cellWrap}>
                        <div className="leading-snug text-[11px]">
                          {entry.templateSubject ?? (entry.templateId ? '（件名未取得）' : '標準のメール')}
                        </div>
                      </td>
                      <td className="w-[7.5rem] min-w-[7.5rem] max-w-[7.5rem] whitespace-nowrap px-1.5 py-1.5 align-middle text-slate-600">
                        <div className="relative inline-flex w-full min-w-0">
                          <select
                            value={st}
                            onChange={(e) => updateStatus(entry, e.target.value as DownloadRequestStatus)}
                            className={`w-full min-w-0 appearance-none rounded-full border py-0.5 pl-2.5 pr-7 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap transition-[filter] hover:brightness-95 ${ADMIN_FOCUS_RING} ${statusSelectClasses(st)}`}
                            aria-label={`${displayFullName(entry)} のステータス`}
                          >
                            {DOWNLOAD_REQUEST_STATUSES.map((s) => (
                              <option key={s} value={s} className={statusOptionClasses(s)}>
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
                          <button
                            type="button"
                            onClick={() => void resend(entry)}
                            disabled={resendingId === entry.id}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-blue-50 bg-white text-violet-300 hover:bg-violet-50/50 hover:text-violet-400 ${ADMIN_FOCUS_RING} disabled:pointer-events-none disabled:opacity-40`}
                            title="メール再送"
                            aria-label="メール再送"
                          >
                            <RefreshCw
                              className={`h-3.5 w-3.5 ${resendingId === entry.id ? 'animate-spin' : ''}`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
