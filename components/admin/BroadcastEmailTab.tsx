'use client';

import { useCallback, useEffect, useState } from 'react';
import { Megaphone, RefreshCw } from 'lucide-react';
import {
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PINK,
  ADMIN_BTN_PRIMARY,
  ADMIN_FOCUS_RING,
} from '@/components/admin/adminPastel';

type CountResponse = { count?: number; error?: string };

type SendResponse = {
  ok?: boolean;
  total?: number;
  sent?: number;
  failed?: number;
  errors?: { email: string; reason: string }[];
  reason?: string;
  error?: string;
};

export function BroadcastEmailTab({ secretKey }: { secretKey: string }) {
  const auth = { Authorization: `Bearer ${secretKey}` };
  const [subject, setSubject] = useState('');
  const [mainBodyHtml, setMainBodyHtml] = useState('');
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(true);
  const [countError, setCountError] = useState('');
  const [sendBusy, setSendBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [lastResult, setLastResult] = useState<SendResponse | null>(null);

  const loadCount = useCallback(async () => {
    setCountLoading(true);
    setCountError('');
    try {
      const res = await fetch('/api/admin/broadcast-email', { headers: auth });
      const data = (await res.json()) as CountResponse;
      if (!res.ok) {
        setCountError(data?.error ?? '件数の取得に失敗しました');
        setRecipientCount(null);
        return;
      }
      setRecipientCount(typeof data.count === 'number' ? data.count : 0);
    } catch {
      setCountError('件数の取得中にエラーが発生しました');
      setRecipientCount(null);
    } finally {
      setCountLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  const send = async () => {
    setFormError('');
    setLastResult(null);
    const sub = subject.trim();
    if (!sub) {
      setFormError('件名を入力してください');
      return;
    }
    const ok = window.confirm(
      `登録メール宛に一斉送信します。\n件名: ${sub}\n宛先件数: ${recipientCount ?? '（未取得）'} 件\n\n実行しますか？`
    );
    if (!ok) return;

    setSendBusy(true);
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sub,
          mainBodyHtml,
        }),
      });
      const data = (await res.json()) as SendResponse;
      if (!res.ok) {
        setFormError(data?.reason ?? data?.error ?? '送信に失敗しました');
        return;
      }
      setLastResult(data);
      void loadCount();
    } catch {
      setFormError('送信中にエラーが発生しました');
    } finally {
      setSendBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-rose-300 shrink-0" aria-hidden />
            一斉メール配信
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            資料ダウンロード申請とレストラン診断申請に登録されたメール宛に、同じ内容を送信します（重複アドレスは1通）。
            下記は本文のメイン部分のみ。フッター（公式サイト・ブログ・連絡先など）は送信時に自動で付きます。
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadCount()}
          disabled={countLoading}
          className={`${ADMIN_BTN_OUTLINE} shrink-0`}
        >
          <RefreshCw
            className={`h-4 w-4 ${countLoading ? 'animate-spin' : ''}`}
            aria-hidden
          />
          宛先件数を更新
        </button>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
        大量送信はサーバーの制限時間内で処理されます。件数が非常に多い場合は分割送信や時間帯の調整を検討してください。
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-slate-600">ユニーク宛先:</span>
        {countLoading ? (
          <span className="text-slate-400">取得中…</span>
        ) : countError ? (
          <span className="text-rose-600">{countError}</span>
        ) : (
          <span className="text-slate-800 font-semibold tabular-nums">
            {recipientCount ?? 0} 件
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="broadcast-subject" className="text-sm font-medium text-slate-600">
          件名
        </label>
        <input
          id="broadcast-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="【COCOマーケ】…"
          className={`w-full max-w-2xl rounded-2xl border border-blue-100 bg-white px-4 py-2.5 text-slate-700 text-sm ${ADMIN_FOCUS_RING}`}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="broadcast-main" className="text-sm font-medium text-slate-600">
          本文メイン（HTML 断片）
        </label>
        <p className="text-xs text-slate-500">
          段落なら <code className="text-rose-600/90">&lt;p&gt;…&lt;/p&gt;</code> のみでも可。表組の行から始める場合は{' '}
          <code className="text-rose-600/90">&lt;tr&gt;…&lt;/tr&gt;</code> でそのまま挿入されます。
        </p>
        <textarea
          id="broadcast-main"
          value={mainBodyHtml}
          onChange={(e) => setMainBodyHtml(e.target.value)}
          rows={14}
          spellCheck={false}
          className={`w-full font-mono text-sm rounded-2xl border border-blue-100 bg-white px-4 py-3 text-slate-700 ${ADMIN_FOCUS_RING}`}
          placeholder={`<p>お世話になっております。</p>\n<p>…</p>`}
        />
      </div>

      {formError && (
        <p className="text-sm text-rose-600" role="alert">
          {formError}
        </p>
      )}

      {lastResult?.ok && (
        <div
          className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900 space-y-1"
          role="status"
        >
          <p>
            送信完了: 成功 <strong>{lastResult.sent}</strong> 件 / 全{' '}
            <strong>{lastResult.total}</strong> 件
            {lastResult.failed ? (
              <>
                {' '}
                （失敗 <strong>{lastResult.failed}</strong> 件）
              </>
            ) : null}
          </p>
          {lastResult.errors && lastResult.errors.length > 0 && (
            <ul className="list-disc pl-5 text-xs text-emerald-950/90 max-h-40 overflow-y-auto">
              {lastResult.errors.map((e) => (
                <li key={e.email}>
                  {e.email}: {e.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void send()}
          disabled={sendBusy || countLoading || recipientCount === 0}
          className={ADMIN_BTN_PINK}
        >
          {sendBusy ? '送信中…' : '一斉送信する'}
        </button>
        <button
          type="button"
          onClick={() => void loadCount()}
          disabled={countLoading}
          className={ADMIN_BTN_PRIMARY}
        >
          件数だけ再取得
        </button>
      </div>
    </div>
  );
}
