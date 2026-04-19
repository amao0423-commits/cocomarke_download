'use client';

import { useState, useCallback, useEffect } from 'react';
import { FileEdit, Mail, RotateCcw, Save } from 'lucide-react';
import {
  DEFAULT_EMAIL_TEMPLATE_BODY_HTML,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from '@/lib/email-template-defaults';
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_FOCUS_RING,
} from '@/components/admin/adminPastel';

type DefaultsResponse = {
  bodyHtml?: string;
  value?: string;
  subject?: string;
};

export function DefaultMailTemplateTab({ secretKey }: { secretKey: string }) {
  const auth = { Authorization: `Bearer ${secretKey}` };
  const [subject, setSubject] = useState(DEFAULT_EMAIL_TEMPLATE_SUBJECT);
  const [bodyHtml, setBodyHtml] = useState(DEFAULT_EMAIL_TEMPLATE_BODY_HTML);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/admin/site-settings/default-email-body', {
        headers: auth,
      });
      const data = (await res.json()) as DefaultsResponse & { error?: string };
      if (!res.ok) {
        setErrorMessage(data?.error ?? '取得に失敗しました');
        return;
      }
      const html = data.bodyHtml ?? data.value ?? DEFAULT_EMAIL_TEMPLATE_BODY_HTML;
      setBodyHtml(html);
      if (typeof data.subject === 'string' && data.subject.trim()) {
        setSubject(data.subject.trim());
      } else {
        setSubject(DEFAULT_EMAIL_TEMPLATE_SUBJECT);
      }
    } catch {
      setErrorMessage('取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/admin/site-settings/default-email-body', {
        method: 'PUT',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyHtml,
          subject: subject.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '保存に失敗しました');
        return;
      }
      setSuccessMessage(
        '保存しました。「✉️ メール作成」で新しい文面を追加するときも、この内容が出発点になります。'
      );
      await load();
    } catch {
      setErrorMessage('保存中にエラーが発生しました');
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FileEdit className="h-6 w-6 text-violet-300 shrink-0" aria-hidden />
          <h2 className="font-semibold text-slate-600">メールの下書き（共通の出発点）</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          ここで決めた題名と本文は、「✉️ メール作成」で「用意済みの本文を使う」ときの土台になります。資料のボタンはメールごとに設定するので、本文の中の{' '}
          <code className="rounded-lg bg-sky-50/80 px-1.5 py-0.5 text-[11px] text-slate-600">
            {'{{documentButtons}}'}
          </code>{' '}
          には、あとからそのメール用に選んだ資料が入ります。
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          差し込み用の記号:{' '}
          <code className="rounded bg-sky-50/80 px-1 py-0.5 text-[11px] text-slate-600">{'{{name}}'}</code>
          {' · '}
          <code className="rounded bg-sky-50/80 px-1 py-0.5 text-[11px] text-slate-600">
            {'{{documentButtons}}'}
          </code>
          {' · '}
          <code className="rounded bg-sky-50/80 px-1 py-0.5 text-[11px] text-slate-600">
            {'{{emailLogoUrl}}'}
          </code>
          （ロゴ・送信時に URL 化）
        </p>
      </div>

      {errorMessage && <p className="text-sm text-rose-500">{errorMessage}</p>}
      {successMessage && (
        <p className="text-sm font-medium text-[#388E3C]">{successMessage}</p>
      )}

      <label className="block">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Mail className="h-3.5 w-3.5 text-rose-300" aria-hidden />
          よく使う題名（件名）
        </span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`mt-1.5 w-full rounded-2xl border border-blue-100 px-3 py-2.5 text-sm text-slate-600 shadow-sm bg-white/90 ${ADMIN_FOCUS_RING}`}
        />
      </label>

      <label className="block">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <FileEdit className="h-3.5 w-3.5 text-sky-400" aria-hidden />
          よく使う本文（HTML）
        </span>
        <textarea
          value={bodyHtml}
          onChange={(e) => setBodyHtml(e.target.value)}
          rows={22}
          className={`mt-1.5 w-full rounded-2xl border border-blue-100 px-3 py-2.5 font-mono text-xs leading-relaxed text-slate-600 shadow-sm bg-white/90 ${ADMIN_FOCUS_RING}`}
          spellCheck={false}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !subject.trim()}
          className={`${ADMIN_BTN_PRIMARY} px-5 py-2.5`}
        >
          <Save className="h-4 w-4 text-[#2C657A]" aria-hidden />
          {busy ? '保存中…' : '保存する'}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          disabled={busy}
          className={`${ADMIN_BTN_SECONDARY} px-4 py-2.5`}
        >
          <RotateCcw className="h-4 w-4 text-violet-300" aria-hidden />
          再読み込み
        </button>
      </div>
    </div>
  );
}
