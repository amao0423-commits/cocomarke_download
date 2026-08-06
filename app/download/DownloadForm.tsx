'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  'w-full h-12 rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-sm text-[#1F2937] placeholder:text-[#CBD5E1] transition-[border-color,box-shadow] focus:border-[#0D3B75] focus:outline-none focus:ring-[3px] focus:ring-[#0D3B75]/12 disabled:opacity-60';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-[#1F2937]';

const reqClass = 'text-[10.5px] font-bold text-[#E24B4A]';
const optClass = 'text-[10.5px] font-medium text-[#94A3B8]';

const pillBase =
  'cursor-pointer select-none rounded-full border px-3.5 py-2 text-[13px] transition-[border-color,background,color] focus-visible:ring-2 focus-visible:ring-[#0D3B75]/30 disabled:opacity-60';
const pillOn = 'border-[#0D3B75] bg-[#0D3B75] font-bold text-white';
const pillOff = 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#0D3B75]';

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

  useEffect(() => {
    setResolvedTemplateId(templateIdProp?.trim() || null);
  }, [templateIdProp]);

  useEffect(() => {
    onThanksModeChange?.(state === 'success');
  }, [state, onThanksModeChange]);

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
      state === 'error'
    ) {
      setState('idle');
      setErrorMessage('');
    }
    navSyncRef.current = { doc, slug, thanks };
  }, [documentIdProp, formSlug, thanksInUrl, state]);

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
      // ダウンロード情報をサンクスページへ引き継ぐ（別ルートで download ボタンに使う）
      try {
        sessionStorage.setItem(
          'cocomarke:download',
          JSON.stringify({
            downloadUrl: typeof data.downloadUrl === 'string' ? data.downloadUrl : null,
            docName: documentLabel?.trim() || 'ご請求の資料',
          })
        );
      } catch {
        /* noop */
      }
      // サンクス専用URL（/download/thanks）へ遷移。
      // URL を /download と分離することで Meta のURLベース・カスタムコンバージョンを設定できる。
      const q = documentIdProp?.trim()
        ? `?documentId=${encodeURIComponent(documentIdProp.trim())}`
        : '';
      router.push(`/download/thanks${q}`);
    } catch {
      setErrorMessage('送信中にエラーが発生しました。もう一度お試しください。');
      setState('error');
    }
  };

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
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#0D3B75]" />
          <span className="text-[13px] leading-relaxed text-[#1F2937]">
            <a href="https://www.cocomarke.com/privacy" target="_blank" rel="noreferrer"
              className="font-bold text-[#0D3B75] underline">
              プライバシーポリシー
            </a>
            に同意する <span className={reqClass}>必須</span>
          </span>
        </label>

        {state === 'error' && errorMessage && (
          <p role="alert" className="text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <button type="submit" disabled={!canSubmit || state === 'submitting'}
          className="mt-1 w-full rounded-full bg-[#0D3B75] py-[15px] text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-[#0A2E5C] disabled:cursor-not-allowed disabled:bg-[#B8C4D6]">
          {state === 'submitting' ? '送信中...' : !configReady ? '準備中...' : '資料ダウンロード'}
        </button>

        <p className="text-center">
          <Link href="/" className="text-[13px] font-bold text-[#0D3B75]">
            ← トップページに戻る
          </Link>
        </p>
      </form>
    </div>
  );
}
