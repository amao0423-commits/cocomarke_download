'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock, Eye, Mail, Megaphone, RefreshCw, Save, Send } from 'lucide-react';
import {
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PINK,
  ADMIN_BTN_PRIMARY,
  ADMIN_FOCUS_RING,
} from '@/components/admin/adminPastel';

type CountResponse = { count?: number; error?: string };

const RECIPIENT_SOURCE_OPTIONS = [
  {
    value: 'download_requests',
    label: '資料ダウンロード申請',
    description: '資料請求フォームに登録されたメール',
  },
  {
    value: 'restaurant_diagnosis_requests',
    label: '飲食店無料診断',
    description: 'SNS集客無料診断フォームに登録されたメール',
  },
] as const;

type RecipientSource = (typeof RECIPIENT_SOURCE_OPTIONS)[number]['value'];

type BodyMode = 'plain' | 'html';

type Campaign = {
  id: string;
  subject: string;
  bodyContent: string;
  bodyMode: BodyMode;
  recipientSources: RecipientSource[];
  senderEmail: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  scheduledAt: string | null;
  sentAt: string | null;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
};

type CampaignsResponse = {
  campaigns?: Campaign[];
  senderEmail?: string;
  error?: string;
};

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
  const [bodyMode, setBodyMode] = useState<BodyMode>('plain');
  const [bodyContent, setBodyContent] = useState('');
  const [selectedSources, setSelectedSources] = useState<RecipientSource[]>(
    RECIPIENT_SOURCE_OPTIONS.map((option) => option.value)
  );
  const [testEmailTo, setTestEmailTo] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [previewHtml, setPreviewHtml] = useState('');
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(true);
  const [countError, setCountError] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const [formError, setFormError] = useState('');
  const [lastResult, setLastResult] = useState<SendResponse | null>(null);

  const loadCount = useCallback(async () => {
    setCountLoading(true);
    setCountError('');
    try {
      const params = new URLSearchParams();
      selectedSources.forEach((source) => params.append('source', source));
      const res = await fetch(`/api/admin/broadcast-email?${params.toString()}`, {
        headers: auth,
      });
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
  }, [secretKey, selectedSources]);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/broadcast-email?view=campaigns', { headers: auth });
      const data = (await res.json()) as CampaignsResponse;
      if (!res.ok) {
        setFormError(data?.error ?? '配信履歴の取得に失敗しました');
        return;
      }
      setCampaigns(data.campaigns ?? []);
    } catch {
      setFormError('配信履歴の取得中にエラーが発生しました');
    }
  }, [secretKey]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  const selectedSourceLabel = () =>
    RECIPIENT_SOURCE_OPTIONS.filter((option) => selectedSources.includes(option.value))
      .map((option) => option.label)
      .join(' / ');

  const ensureReady = () => {
    setFormError('');
    setLastResult(null);
    const sub = subject.trim();
    if (!sub) {
      setFormError('件名を入力してください');
      return null;
    }
    if (selectedSources.length === 0) {
      setFormError('送信先の診断・申請を1つ以上選んでください');
      return null;
    }
    return sub;
  };

  const send = async () => {
    const sub = ensureReady();
    if (!sub) return;
    const targetLabel = selectedSourceLabel();
    const ok = window.confirm(
      `選択した宛先に一斉送信します。\n宛先: ${targetLabel}\n件名: ${sub}\n宛先件数: ${recipientCount ?? '（未取得）'} 件\n\n実行しますか？`
    );
    if (!ok) return;

    setBusyAction('send');
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_now',
          subject: sub,
          bodyContent,
          bodyMode,
          sources: selectedSources,
        }),
      });
      const data = (await res.json()) as SendResponse;
      if (!res.ok) {
        setFormError(data?.reason ?? data?.error ?? '送信に失敗しました');
        return;
      }
      setLastResult(data);
      void loadCount();
      void loadCampaigns();
    } catch {
      setFormError('送信中にエラーが発生しました');
    } finally {
      setBusyAction('');
    }
  };

  const preview = async () => {
    setFormError('');
    setBusyAction('preview');
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preview', bodyContent, bodyMode }),
      });
      const data = (await res.json()) as { html?: string; error?: string };
      if (!res.ok || !data.html) {
        setFormError(data?.error ?? 'プレビューの作成に失敗しました');
        return;
      }
      setPreviewHtml(data.html);
    } catch {
      setFormError('プレビュー作成中にエラーが発生しました');
    } finally {
      setBusyAction('');
    }
  };

  const testSend = async () => {
    setFormError('');
    const sub = subject.trim();
    if (!sub) {
      setFormError('件名を入力してください');
      return;
    }
    if (!testEmailTo.trim()) {
      setFormError('テスト送信先を入力してください');
      return;
    }
    setBusyAction('test');
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_send',
          to: testEmailTo.trim(),
          subject: sub,
          bodyContent,
          bodyMode,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFormError(data?.error ?? 'テスト送信に失敗しました');
        return;
      }
      setFormError('テストメールを送信しました');
    } catch {
      setFormError('テスト送信中にエラーが発生しました');
    } finally {
      setBusyAction('');
    }
  };

  const saveDraft = async () => {
    const sub = ensureReady();
    if (!sub) return;
    setBusyAction('draft');
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_draft',
          subject: sub,
          bodyContent,
          bodyMode,
          sources: selectedSources,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFormError(data?.error ?? '下書き保存に失敗しました');
        return;
      }
      setFormError('下書きを保存しました');
      void loadCampaigns();
    } catch {
      setFormError('下書き保存中にエラーが発生しました');
    } finally {
      setBusyAction('');
    }
  };

  const schedule = async () => {
    const sub = ensureReady();
    if (!sub) return;
    if (!scheduledAt) {
      setFormError('予約日時を入力してください');
      return;
    }
    setBusyAction('schedule');
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule',
          subject: sub,
          bodyContent,
          bodyMode,
          sources: selectedSources,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFormError(data?.error ?? '予約保存に失敗しました');
        return;
      }
      setFormError('予約送信を保存しました');
      void loadCampaigns();
    } catch {
      setFormError('予約保存中にエラーが発生しました');
    } finally {
      setBusyAction('');
    }
  };

  const campaignAction = async (action: 'cancel_schedule' | 'send_saved', id: string) => {
    setFormError('');
    setBusyAction(`${action}:${id}`);
    try {
      const res = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFormError(data?.error ?? '操作に失敗しました');
        return;
      }
      void loadCampaigns();
      void loadCount();
    } catch {
      setFormError('操作中にエラーが発生しました');
    } finally {
      setBusyAction('');
    }
  };

  const toggleSource = (source: RecipientSource) => {
    setRecipientCount(null);
    setSelectedSources((current) =>
      current.includes(source)
        ? current.filter((item) => item !== source)
        : [...current, source]
    );
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
            選択した診断・申請に登録されたメール宛に、同じ内容を送信します（重複アドレスは1通）。
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

      <section className="space-y-3" aria-labelledby="broadcast-recipient-sources">
        <div>
          <h3 id="broadcast-recipient-sources" className="text-sm font-semibold text-slate-700">
            送信先の診断・申請
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            チェックした宛先グループだけに送信します。複数選んだ場合、同じメールアドレスは1件にまとめます。
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {RECIPIENT_SOURCE_OPTIONS.map((option) => {
            const checked = selectedSources.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                  checked
                    ? 'border-rose-200 bg-rose-50/70'
                    : 'border-blue-100 bg-white hover:bg-blue-50/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSource(option.value)}
                  className={`mt-1 h-4 w-4 rounded border-slate-300 text-rose-400 ${ADMIN_FOCUS_RING}`}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-700">
                    {option.label}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

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
          className={`w-full rounded-2xl border border-blue-100 bg-white px-4 py-2.5 text-slate-700 text-sm ${ADMIN_FOCUS_RING}`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="broadcast-main" className="text-sm font-medium text-slate-600">
            本文
          </label>
          <div className="inline-flex rounded-2xl border border-blue-100 bg-white p-1 text-xs">
            {(['plain', 'html'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBodyMode(mode)}
                className={`rounded-xl px-3 py-1.5 font-semibold ${
                  bodyMode === mode ? 'bg-rose-100 text-rose-700' : 'text-slate-500'
                }`}
              >
                {mode === 'plain' ? '通常テキスト' : 'HTML'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          通常テキストは改行を保ったままメール用HTMLに変換します。細かく整えたい場合だけHTMLに切り替えてください。
        </p>
        <textarea
          id="broadcast-main"
          value={bodyContent}
          onChange={(e) => setBodyContent(e.target.value)}
          rows={14}
          spellCheck={false}
          className={`w-full font-mono text-sm rounded-2xl border border-blue-100 bg-white px-4 py-3 text-slate-700 ${ADMIN_FOCUS_RING}`}
          placeholder={
            bodyMode === 'plain'
              ? `お世話になっております。\n\n新しいお知らせをご案内します。`
              : `<p>お世話になっております。</p>\n<p>…</p>`
          }
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="space-y-2">
          <label htmlFor="broadcast-test" className="text-sm font-medium text-slate-600">
            テスト送信先
          </label>
          <div className="flex gap-2">
            <input
              id="broadcast-test"
              type="email"
              value={testEmailTo}
              onChange={(e) => setTestEmailTo(e.target.value)}
              placeholder="test@example.com"
              className={`min-w-0 flex-1 rounded-2xl border border-blue-100 bg-white px-4 py-2.5 text-slate-700 text-sm ${ADMIN_FOCUS_RING}`}
            />
            <button
              type="button"
              onClick={() => void testSend()}
              disabled={busyAction === 'test'}
              className={ADMIN_BTN_OUTLINE}
            >
              <Mail className="h-4 w-4" aria-hidden />
              {busyAction === 'test' ? '送信中…' : 'テスト送信'}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="broadcast-schedule" className="text-sm font-medium text-slate-600">
            予約日時
          </label>
          <input
            id="broadcast-schedule"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className={`w-full rounded-2xl border border-blue-100 bg-white px-4 py-2.5 text-slate-700 text-sm ${ADMIN_FOCUS_RING}`}
          />
        </div>
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
          onClick={() => void preview()}
          disabled={busyAction === 'preview'}
          className={ADMIN_BTN_OUTLINE}
        >
          <Eye className="h-4 w-4" aria-hidden />
          プレビュー
        </button>
        <button
          type="button"
          onClick={() => void saveDraft()}
          disabled={busyAction === 'draft'}
          className={ADMIN_BTN_PRIMARY}
        >
          <Save className="h-4 w-4" aria-hidden />
          {busyAction === 'draft' ? '保存中…' : '下書き保存'}
        </button>
        <button
          type="button"
          onClick={() => void schedule()}
          disabled={busyAction === 'schedule' || !scheduledAt}
          className={ADMIN_BTN_PRIMARY}
        >
          <Clock className="h-4 w-4" aria-hidden />
          {busyAction === 'schedule' ? '予約中…' : '予約送信'}
        </button>
        <button
          type="button"
          onClick={() => void send()}
          disabled={busyAction === 'send' || countLoading || recipientCount === 0 || selectedSources.length === 0}
          className={ADMIN_BTN_PINK}
        >
          <Send className="h-4 w-4" aria-hidden />
          {busyAction === 'send' ? '送信中…' : '今すぐ一斉送信'}
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

      {previewHtml && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 px-4 py-6" role="dialog" aria-modal="true">
          <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-700">メールプレビュー</h3>
              <button type="button" onClick={() => setPreviewHtml('')} className={ADMIN_BTN_OUTLINE}>
                閉じる
              </button>
            </div>
            <iframe title="メールプレビュー" srcDoc={previewHtml} className="min-h-0 flex-1 bg-white" />
          </div>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-700">下書き・予約・送信履歴</h3>
          <button type="button" onClick={() => void loadCampaigns()} className={ADMIN_BTN_OUTLINE}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            更新
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
          {campaigns.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-500">まだ配信データはありません。</p>
          ) : (
            <div className="divide-y divide-blue-50">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="grid gap-2 px-4 py-3 text-sm lg:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-700">{campaign.subject}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {campaign.status} · {campaign.bodyMode === 'plain' ? '通常テキスト' : 'HTML'} ·{' '}
                      作成 {new Date(campaign.createdAt).toLocaleString('ja-JP')}
                      {campaign.scheduledAt
                        ? ` · 予約 ${new Date(campaign.scheduledAt).toLocaleString('ja-JP')}`
                        : ''}
                      {campaign.sentAt
                        ? ` · 送信 ${new Date(campaign.sentAt).toLocaleString('ja-JP')}`
                        : ''}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      成功 {campaign.sentCount} / 全 {campaign.totalCount} / 失敗 {campaign.failedCount}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {campaign.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => void campaignAction('send_saved', campaign.id)}
                        disabled={busyAction === `send_saved:${campaign.id}`}
                        className={ADMIN_BTN_PINK}
                      >
                        送信
                      </button>
                    )}
                    {campaign.status === 'scheduled' && (
                      <button
                        type="button"
                        onClick={() => void campaignAction('cancel_schedule', campaign.id)}
                        disabled={busyAction === `cancel_schedule:${campaign.id}`}
                        className={ADMIN_BTN_OUTLINE}
                      >
                        予約取消
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
