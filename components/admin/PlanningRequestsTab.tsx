'use client';

import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { ADMIN_BTN_OUTLINE } from '@/components/admin/adminPastel';

type PlanningEntry = {
  id: string;
  created_at: string;
  email: string;
  account_id: string | null;
  plan: string | null;
  industry: string | null;
  issue: string | null;
  status: string | null;
  time_available: string | null;
  budget: string | null;
  note: string | null;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const dash = (v: string | null | undefined) => (v && v.trim() ? v : '—');

export function PlanningRequestsTab({ secretKey }: { secretKey: string }) {
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/planning-requests', {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      if (!res.ok) {
        setError('データの取得に失敗しました。テーブル planning_requests が未作成の可能性があります。');
        return;
      }
      const data = await res.json();
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch {
      setError('通信エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm('この履歴を削除しますか？')) return;
    try {
      const res = await fetch('/api/admin/planning-requests', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
      else alert('削除に失敗しました。');
    } catch {
      alert('通信エラーが発生しました。');
    }
  };

  const th = 'px-3 py-2 text-left text-xs font-semibold text-slate-500 whitespace-nowrap';
  const td = 'px-3 py-2 text-sm text-slate-700 align-top';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-700">🧭 かんたんプランニング履歴</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            /subscription/diagnosis の送信履歴です（{entries.length}件）。
          </p>
        </div>
        <button type="button" onClick={load} className={`${ADMIN_BTN_OUTLINE} inline-flex items-center gap-1.5 text-sm`}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
          更新
        </button>
      </div>

      {error && <p className="text-rose-500 text-sm rounded-xl bg-rose-50 px-4 py-3">{error}</p>}

      {loading && entries.length === 0 ? (
        <p className="text-slate-400 text-sm py-8 text-center">読み込み中...</p>
      ) : entries.length === 0 && !error ? (
        <p className="text-slate-400 text-sm py-8 text-center">まだ送信履歴はありません。</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/70">
              <tr>
                <th className={th}>受付日時</th>
                <th className={th}>メール</th>
                <th className={th}>おすすめプラン</th>
                <th className={th}>業種</th>
                <th className={th}>悩み</th>
                <th className={th}>状況</th>
                <th className={th}>時間</th>
                <th className={th}>予算</th>
                <th className={th}>アカウント</th>
                <th className={th}>補足</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className={`${td} whitespace-nowrap`}>{formatDate(e.created_at)}</td>
                  <td className={`${td} whitespace-nowrap`}>{dash(e.email)}</td>
                  <td className={`${td} whitespace-nowrap font-medium text-[#1A5C37]`}>{dash(e.plan)}</td>
                  <td className={td}>{dash(e.industry)}</td>
                  <td className={`${td} max-w-[200px]`}>{dash(e.issue)}</td>
                  <td className={td}>{dash(e.status)}</td>
                  <td className={td}>{dash(e.time_available)}</td>
                  <td className={td}>{dash(e.budget)}</td>
                  <td className={`${td} whitespace-nowrap`}>{dash(e.account_id)}</td>
                  <td className={`${td} max-w-[220px] whitespace-pre-wrap`}>{dash(e.note)}</td>
                  <td className={td}>
                    <button
                      type="button"
                      onClick={() => remove(e.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
