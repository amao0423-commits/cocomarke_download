'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS,
  DOWNLOAD_REQUEST_PURPOSE_OPTIONS,
} from '@/lib/downloadRequestShared';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type DownloadFormProps = {
  templateId?: string | null;
  formSlug?: string;
  documentId?: string;
  documentLabel?: string | null;
  thanksInUrl?: boolean;
  onSelectedDocumentChange?: (doc: { id: string; label: string } | null) => void;
  onThanksModeChange?: (isThanks: boolean) => void;
};

/* ── スタイル定数 ── */
const fieldClass =
  'w-full h-12 rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-sm text-[#1F2937] placeholder:text-[#CBD5E1] transition-[border-color,box-shadow] focus:border-[#2563A8] focus:outline-none focus:ring-[3px] focus:ring-[#2563A8]/12 disabled:opacity-60';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-[#1F2937]';

const reqClass = 'text-[10.5px] font-bold text-[#E24B4A]';
const optClass = 'text-[10.5px] font-medium text-[#94A3B8]';

const pillBase =
  'cursor-pointer select-none rounded-full border px-3.5 py-2 text-[13px] transition-[border-color,background,color] focus-visible:ring-2 focus-visible:ring-[#2563A8]/30 disabled:opacity-60';
const pillOn = 'border-[#01408D] bg-[#01408D] font-bold text-white';
const pillOff = 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563A8]';

export default function DownloadForm({
  templateId: templateIdProp,
  formSlug = 'default',
  documentId: documentIdProp,
  documentLabel,
  thanksInUrl = false,
  onSelectedDocumentChange,
  onThanksModeChange,
}: DownloadFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const navSyncRef = useRef<{ doc?: string; slug: string; thanks: boolean } | null>(null);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [requestPurpose, setRequestPurpose] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  // templateId はサーバー（getDownloadPageContext）で解決済みの値が props で渡るため、
  // クライアントからの追加フェッチは不要。
  const [resolvedTemplateId, setResolvedTemplateId] = useState<string | null>(
    templateIdProp?.trim() || null
  );
  const configReady = true;
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    setResolvedTemplateId(templateIdProp?.trim() || null);
  }, [templateIdProp]);

  useEffect(() => {
    if (state !== 'success') setDownloadUrl(null);
  }, [state]);

  useEffect(() => {
    onThanksModeChange?.(state === 'success');
  }, [state, onThanksModeChange]);

  useLayoutEffect(() => {
    if (state !== 'success') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [state]);

  useEffect(() => {
    if (!onSelectedDocumentChange) return;
    if (documentIdProp?.trim()) {
      onSelectedDocumentChange({ id: documentIdProp.trim(), label: documentLabel?.trim() || 'ご指定の資料' });
    } else {
      onSelectedDocumentChange(null);
    }
  }, [documentIdProp, documentLabel, onSelectedDocumentChange]);

  useEffect(() => {
    const doc = documentIdProp?.trim() || undefined;
    const slug = formSlug;
    const thanks = thanksInUrl === true;
    if (!navSyncRef.current) { navSyncRef.current = { doc, slug, thanks }; return; }
    const prev = navSyncRef.current;
    if (
      (prev.doc !== doc || prev.slug !== slug || (prev.thanks === true && !thanks)) &&
      (state === 'success' || state === 'error')
    ) {
      setState('idle');
      setErrorMessage('');
      setDownloadUrl(null);
    }
    navSyncRef.current = { doc, slug, thanks };
  }, [documentIdProp, formSlug, thanksInUrl, state]);

  useEffect(() => {
    if (state !== 'success' || typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    if (p.get('thanks') === '1') return;
    p.set('thanks', '1');
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }, [state, router, pathname]);

  const jobSelected = (DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS as readonly string[]).includes(department);

  const canSubmit =
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    company.trim().length > 0 &&
    email.trim().length > 0 &&
    jobSelected &&
    requestPurpose.length > 0 &&
    privacyConsent &&
    configReady;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || state === 'submitting') return;
    setState('submitting');
    setErrorMessage('');
    try {
      const body: Record<string, unknown> = {
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        department: department.trim(),
        requestPurpose,
        questions: '',
        privacyConsent: true,
      };
      if (resolvedTemplateId) body.templateId = resolvedTemplateId;
      if (documentIdProp?.trim()) body.documentId = documentIdProp.trim();
      if (documentLabel?.trim()) body.documentTitle = documentLabel.trim();

      const res = await fetch('/api/download-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error ?? '送信に失敗しました。もう一度お試しください。');
        setState('error');
        return;
      }
      // Meta Pixel: 資料ダウンロード（コンバージョン）計測
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: documentLabel?.trim() || documentIdProp?.trim() || 'document_download',
          content_category: 'document_download',
        });
      }
      setDownloadUrl(typeof data.downloadUrl === 'string' ? data.downloadUrl : null);
      setState('success');
    } catch {
      setErrorMessage('送信中にエラーが発生しました。もう一度お試しください。');
      setState('error');
    }
  };

  const triggerDownload = useCallback(() => {
    if (!downloadUrl) return;
    // 新規タブで開く（PDF はタブ内で表示・保存できる）
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  }, [downloadUrl]);

  /* ── サンクス画面 ── */
  if (state === 'success') {
    const docName = documentLabel?.trim() || 'ご請求の資料';
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-[520px] rounded-3xl border border-[#E2E8F0] bg-white px-8 py-12 text-center shadow-[0_16px_40px_-22px_rgba(15,23,42,.2)] sm:px-10">
          {/* チェックアイコン */}
          <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E6EFFA]">
            <svg className="h-9 w-9 stroke-[#2563A8]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-2xl font-black leading-snug text-[#01408D]">
            お申込みありがとうございます
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
            下のボタンより資料をすぐにダウンロードできます。
          </p>

          {/* 資料名 */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F4F6F9] px-4 py-3.5">
            <svg className="h-[18px] w-[18px] shrink-0 stroke-[#2563A8]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <span className="text-[13.5px] font-bold text-[#1F2937] line-clamp-2">{docName}</span>
          </div>

          {/* ダウンロードボタン */}
          {downloadUrl ? (
            <button
              type="button"
              onClick={triggerDownload}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#2563A8] px-4 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1d5390] hover:shadow-[0_12px_26px_-10px_rgba(37,99,168,.5)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
              </svg>
              資料をダウンロード
            </button>
          ) : (
            <p className="mt-6 text-sm text-[#64748B]">
              準備が完了次第、ダウンロードが始まります。
            </p>
          )}
          {downloadUrl && (
            <p className="mt-3 text-xs text-[#94A3B8]">
              ダウンロードが始まらない場合はボタンをもう一度押してください。
            </p>
          )}

          {/* リンク */}
          <div className="mt-8 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 rounded-full border border-[#E2E8F0] py-3 text-[13.5px] font-bold text-[#64748B] transition hover:border-[#01408D] hover:text-[#01408D]"
            >
              ← 他の資料を見る
            </Link>
            <a
              href="https://www.cocomarke.com/contact"
              target="_blank"
              rel="noreferrer"
              className="text-[13.5px] font-bold text-[#01408D]"
            >
              サービスについて相談する
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── フォーム ── */
  return (
    <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-7 shadow-[0_10px_30px_-18px_rgba(15,23,42,.15)] sm:p-8">
      <p className="mb-5 text-[13.5px] leading-relaxed text-[#64748B]">
        必要事項をご入力ください。入力後、この場で資料をすぐにダウンロードできます。
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-[18px]">
        {/* 姓名 */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="lastName" className={labelClass}>
              姓 <span className={reqClass}>必須</span>
            </label>
            <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)}
              placeholder="山田" autoComplete="family-name" disabled={state === 'submitting'} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="firstName" className={labelClass}>
              名 <span className={reqClass}>必須</span>
            </label>
            <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
              placeholder="太郎" autoComplete="given-name" disabled={state === 'submitting'} className={fieldClass} />
          </div>
        </div>

        {/* 会社名 */}
        <div>
          <label htmlFor="company" className={labelClass}>
            会社名 <span className={reqClass}>必須</span>
          </label>
          <input id="company" type="text" value={company} onChange={e => setCompany(e.target.value)}
            placeholder="株式会社〇〇" autoComplete="organization" disabled={state === 'submitting'} className={fieldClass} />
        </div>

        {/* 役職（ラジオチップ） */}
        <div>
          <div id="job-label" className={labelClass}>
            役職 <span className={reqClass}>必須</span>
          </div>
          <div role="radiogroup" aria-labelledby="job-label" className="flex flex-wrap gap-2">
            {DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS.map(opt => (
              <button key={opt} type="button" role="radio" aria-checked={department === opt}
                disabled={state === 'submitting'}
                onClick={() => setDepartment(opt)}
                className={`${pillBase} ${department === opt ? pillOn : pillOff}`}
              >{opt}</button>
            ))}
          </div>
        </div>

        {/* 電話 */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            電話番号 <span className={optClass}>任意</span>
          </label>
          <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="03-1234-5678" autoComplete="tel" disabled={state === 'submitting'} className={fieldClass} />
        </div>

        {/* メール */}
        <div>
          <label htmlFor="email" className={labelClass}>
            メールアドレス <span className={reqClass}>必須</span>
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="example@company.com" autoComplete="email" disabled={state === 'submitting'} className={fieldClass} />
        </div>

        {/* 目的（ラジオチップ） */}
        <div>
          <div id="purpose-label" className={labelClass}>
            資料請求の目的 <span className={reqClass}>必須</span>
          </div>
          <div role="radiogroup" aria-labelledby="purpose-label" className="flex flex-wrap gap-2">
            {DOWNLOAD_REQUEST_PURPOSE_OPTIONS.map(opt => (
              <button key={opt} type="button" role="radio" aria-checked={requestPurpose === opt}
                disabled={state === 'submitting'}
                onClick={() => setRequestPurpose(opt)}
                className={`${pillBase} ${requestPurpose === opt ? pillOn : pillOff}`}
              >{opt}</button>
            ))}
          </div>
        </div>

        {/* 同意 */}
        <label className="flex cursor-pointer items-start gap-2.5 pt-1">
          <input type="checkbox" checked={privacyConsent} onChange={e => setPrivacyConsent(e.target.checked)}
            disabled={state === 'submitting'}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#01408D]" />
          <span className="text-[13px] leading-relaxed text-[#1F2937]">
            <a href="https://www.cocomarke.com/privacy" target="_blank" rel="noreferrer"
              className="font-bold text-[#01408D] underline">
              プライバシーポリシー
            </a>
            に同意する <span className={reqClass}>必須</span>
          </span>
        </label>

        {state === 'error' && errorMessage && (
          <p role="alert" className="text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <button type="submit" disabled={!canSubmit || state === 'submitting'}
          className="mt-1 w-full rounded-full bg-[#2563A8] py-[15px] text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-[#1d5390] disabled:cursor-not-allowed disabled:bg-[#B8C4D6]">
          {state === 'submitting' ? '送信中...' : !configReady ? '準備中...' : '資料ダウンロード'}
        </button>

        <p className="text-center">
          <Link href="/" className="text-[13px] font-bold text-[#01408D]">
            ← トップページに戻る
          </Link>
        </p>
      </form>
    </div>
  );
}
