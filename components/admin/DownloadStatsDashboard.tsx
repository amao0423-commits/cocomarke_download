'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** チャートバー：パステルブルー → ソフトピーチ */
const PASTEL_BAR_START = '#A0D8EF';
const PASTEL_BAR_END = '#FFD6E8';

type RangeKey = '7' | '30' | 'all';

type Item = { documentId: string; title: string; count: number };

function lerpRgb(t: number): string {
  const r1 = 0xa0,
    g1 = 0xd8,
    b1 = 0xef;
  const r2 = 0xff,
    g2 = 0xd6,
    b2 = 0xe8;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

function barColors(n: number): string[] {
  if (n <= 0) return [];
  if (n === 1) return [PASTEL_BAR_START];
  return Array.from({ length: n }, (_, i) =>
    lerpRgb(i / (n - 1))
  );
}

function truncateLabel(s: string, max = 14): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export function DownloadStatsDashboard({
  secretKey,
  className = '',
}: {
  secretKey: string;
  className?: string;
}) {
  const [range, setRange] = useState<RangeKey>('7');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/admin/download-stats?range=${encodeURIComponent(range)}`,
        { headers: { Authorization: `Bearer ${secretKey}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : '読み込みに失敗しました');
        setItems([]);
        return;
      }
      const raw = Array.isArray(data?.items) ? data.items : [];
      setItems(raw as Item[]);
    } catch {
      setError('通信エラーが発生しました');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [secretKey, range]);

  useEffect(() => {
    void load();
  }, [load]);

  const chartData = useMemo(() => {
    return items.map((row) => ({
      name: truncateLabel(row.title),
      fullTitle: row.title,
      count: row.count,
    }));
  }, [items]);

  const colors = useMemo(() => barColors(chartData.length), [chartData.length]);

  const rangeLabel =
    range === '7'
      ? '過去7日間'
      : range === '30'
        ? '過去30日間'
        : '累計';

  return (
    <div
      className={`mb-8 rounded-3xl border border-blue-50/90 bg-white p-6 shadow-xl shadow-blue-500/5 ${className}`}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-600">資料ダウンロード数</h2>
          <p className="text-sm text-slate-500">
            資料ごとの申請件数（{rangeLabel}）。多い順にパステルブルーからソフトピンクへ変化します。
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-2xl bg-sky-50/50 p-1 border border-blue-50/60">
          {(
            [
              ['7', '7日'],
              ['30', '30日'],
              ['all', '累計'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                range === key
                  ? 'bg-[#A0D8EF] text-[#2C657A] shadow-sm'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm font-medium text-rose-500" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-500">
          読み込み中…
        </div>
      ) : chartData.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          この期間に集計できる資料請求がありません。
        </p>
      ) : (
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={132}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number | string) => [value, '件']}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullTitle ?? ''
                }
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {chartData.map((_, i) => (
                  <Cell key={`c-${i}`} fill={colors[i] ?? PASTEL_BAR_START} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
