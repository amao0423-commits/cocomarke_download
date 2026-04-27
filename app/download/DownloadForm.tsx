'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { documentDownloadCtaClassName } from '@/components/home/DocumentDownloadCta';
import {
  DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS,
  DOWNLOAD_REQUEST_PURPOSE_OPTIONS,
} from '@/lib/downloadRequestShared';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export type DownloadFormProps = {
  /**
   * このフォームで使うメールテンプレの ID（指定時は formSlug より優先）
   */
  templateId?: string | null;
  /**
   * 管理画面の「資料請求フォーム」で設定したスラッグ（未指定時は default）
   */
  formSlug?: string;
  /** 資料請求の対象（URL クエリ経由で渡す想定） */
  documentId?: string;
  /** 表示用タイトル（サーバで解決済み） */
  documentLabel?: string | null;
  /** 現在の URL に ?thanks=1 がある（別資料・メニュー遷移時に success 状態を解除する） */
  thanksInUrl?: boolean;
  /** 左側の案内表示を同期する */
  onSelectedDocumentChange?: (document: FormDoc | null) => void;
  /** 送信完了（Thanks）表示に切り替わったとき、親でレイアウト（左カラム非表示・中央寄せなど）を変える */
  onThanksModeChange?: (isThanks: boolean) => void;
};

type FormDoc = { id: string; label: string; thumbnailUrl?: string | null };

const fieldControlClass =
  'w-full min-h-[44px] rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base leading-snug text-slate-900 placeholder:text-sm placeholder:text-slate-400 transition-colors sm:min-h-0 sm:py-2 sm:text-sm focus:border-[#185FA5] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 disabled:opacity-60';

const labelClass =
  'mb-1.5 block text-sm font-medium leading-tight text-slate-600 sm:mb-1 sm:text-xs';

const requiredBadgeClass =
  'ml-1.5 align-middle text-[10px] font-medium leading-none text-[#E24B4A]';

const optionalBadgeClass =
  'ml-1.5 align-middle text-[10px] font-normal leading-none text-slate-500';

const pillBaseClass =
  'min-h-10 rounded-full border px-3 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]/35 disabled:opacity-60 sm:min-h-0 sm:py-1.5';

const pillSelectedClass = 'border-[#185FA5] bg-[#185FA5] text-[#E6F1FB]';
const pillIdleClass =
  'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50';

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
  /** クライアント遷移後も success が残るのを防ぐ（URL の thanks / 資料 ID の変化を追跡） */
  const navSyncRef = useRef<{ doc?: string; slug: string; thanks: boolean } | null>(null);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [requestPurpose, setRequestPurpose] = useState('');
  const [questions, setQuestions] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resolvedTemplateId, setResolvedTemplateId] = useState<string | null>(null);
  const [configReady, setConfigReady] = useState(templateIdProp !== undefined);
  /**
   * サンクス画面: 今回申し込んだ資料以外で、DB上アップロード日時が新しい順の最大3件。
   * success 遷移前に API で取得済みにする（受付メッセージと同じ描画で表示）。
   * success 以外では null。
   */
  const [thanksRecommended, setThanksRecommended] = useState<FormDoc[] | null>(null);

  useEffect(() => {
    if (templateIdProp !== undefined) {
      const v =
        templateIdProp === null || templateIdProp === ''
          ? null
          : String(templateIdProp).trim() || null;
      setResolvedTemplateId(v);
      setConfigReady(true);
      return;
    }

    let cancelled = false;
    setConfigReady(false);
    (async () => {
      try {
        const res = await fetch(`/api/download-form-config?slug=${encodeURIComponent(formSlug)}`);
        const configData = await res.json();
        if (cancelled) return;
        const tid =
          typeof configData?.templateId === 'string' && configData.templateId.trim()
            ? configData.templateId.trim()
            : null;
        setResolvedTemplateId(tid);
      } catch {
        if (!cancelled) setResolvedTemplateId(null);
      } finally {
        if (!cancelled) setConfigReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [templateIdProp, formSlug]);

  useEffect(() => {
    if (state !== 'success') {
      setThanksRecommended(null);
    }
  }, [state]);

  const jobTitleSelected = (DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS as readonly string[]).includes(
    department
  );

  const canSubmit =
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    company.trim().length > 0 &&
    email.trim().length > 0 &&
    jobTitleSelected &&
    requestPurpose.length > 0 &&
    privacyConsent &&
    configReady;

  useEffect(() => {
    if (!onSelectedDocumentChange) return;
    if (documentIdProp?.trim()) {
      onSelectedDocumentChange({
        id: documentIdProp.trim(),
        label: documentLabel?.trim() || 'ご指定の資料',
      });
    } else {
      onSelectedDocumentChange(null);
    }
  }, [documentIdProp, documentLabel, onSelectedDocumentChange]);

  useEffect(() => {
    onThanksModeChange?.(state === 'success');
  }, [state, onThanksModeChange]);

  /** 送信完了後は同一ページ内のためスクロールがフォーム付近のまま。描画前に先頭へ戻す */
  useLayoutEffect(() => {
    if (state !== 'success') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [state]);

  useEffect(() => {
    const doc = documentIdProp?.trim() || undefined;
    const slug = formSlug;
    const thanks = thanksInUrl === true;

    if (!navSyncRef.current) {
      navSyncRef.current = { doc, slug, thanks };
      return;
    }

    const prev = navSyncRef.current;
    const docChanged = prev.doc !== doc;
    const slugChanged = prev.slug !== slug;
    const leftThanksUrl = prev.thanks === true && !thanks;

    if (
      (docChanged || slugChanged || leftThanksUrl) &&
      (state === 'success' || state === 'error')
    ) {
      setState('idle');
      setErrorMessage('');
      setThanksRecommended(null);
    }

    navSyncRef.current = { doc, slug, thanks };
  }, [documentIdProp, formSlug, thanksInUrl, state]);

  /** Thanks 画面とヘッダー演出を同期（?thanks=1） */
  useEffect(() => {
    if (state !== 'success' || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('thanks') === '1') return;
    params.set('thanks', '1');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : `${pathname}?thanks=1`, { scroll: false });
  }, [state, router, pathname]);

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
        phone: phone.trim() || '',
        company: company.trim(),
        department: department.trim(),
        requestPurpose,
        questions: questions.trim(),
        privacyConsent: true,
      };
      if (resolvedTemplateId) {
        body.templateId = resolvedTemplateId;
      }
      if (documentIdProp?.trim()) {
        body.documentId = documentIdProp.trim();
      }
      const label = documentLabel?.trim();
      if (label) {
        body.documentTitle = label;
      }

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

      const successIds = documentIdProp?.trim() ? [documentIdProp.trim()] : [];

      let recommendedList: FormDoc[] = [];
      try {
        const q =
          successIds.length > 0
            ? `?exclude=${successIds.map(encodeURIComponent).join(',')}`
            : '';
        const recRes = await fetch(`/api/documents/recommended${q}`);
        const recData = await recRes.json();
        recommendedList = Array.isArray(recData?.documents)
          ? recData.documents.map(
              (d: { id: string; label?: string; thumbnail_url?: string | null }) => ({
                id: d.id,
                label: typeof d.label === 'string' && d.label.trim() ? d.label.trim() : '資料',
                thumbnailUrl:
                  typeof d.thumbnail_url === 'string' && d.thumbnail_url.trim().length > 0
                    ? d.thumbnail_url.trim()
                    : null,
              })
            )
          : [];
      } catch {
        recommendedList = [];
      }

      setThanksRecommended(recommendedList);
      setState('success');
    } catch {
      setErrorMessage('送信中にエラーが発生しました。もう一度お試しください。');
      setState('error');
    }
  };

  if (state === 'success') {
    const hasRecommended =
      thanksRecommended !== null && thanksRecommended.length > 0;

    return (
      <div className="relative min-w-0 bg-white">
        {/* ① 申請完了の感謝（H1） */}
        <div className="relative z-0 min-w-0 bg-white px-4 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-12">
          <div className="mx-auto w-full min-w-0 max-w-3xl">
            <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-100/90 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
              <div className="relative z-10 min-w-0 bg-white">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#01408D]/10">
                  <svg
                    className="h-7 w-7 text-[#01408D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="min-w-0 text-balance text-xl font-extrabold leading-snug text-[#01408D] sm:text-2xl">
                  資料のご請求ありがとうございました。
                </h1>
                <div className="mx-auto mt-6 w-full min-w-0 max-w-lg break-words text-left text-sm leading-relaxed text-slate-600 sm:mt-8">
                  <p>資料はご登録いただいたメールアドレスにお送りいたしました。</p>
                  <p className="mt-3">記載のURLからダウンロードください。</p>
                  <p className="mt-4">
                    また、ぜひ一度、チャットやオンラインにて15分ほど、現在のInstagram運用の課題や疑問、弊社の運用代行サービスの説明についてお話する機会をいただけますと幸いです。
                  </p>
                  <p className="mt-4">
                    日程・ご相談につきましては以下のメールアドレスよりお問い合わせをよろしくお願いいたします。
                  </p>
                  <p className="mt-2">
                    <a
                      href="mailto:info@ccoomarke.com"
                      className="break-all font-medium text-[#01408D] underline-offset-2 hover:underline"
                    >
                      info@ccoomarke.com
                    </a>
                  </p>
                  <p className="mt-5 text-[13px] leading-relaxed">
                    万一、メールが届かない場合は【送信エラー】【ご入力内容に誤りがある】等の可能性がございます。
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed">
                    お手数をおかけしてしまい大変申し訳ございませんが、もう一度送信いただくか、お電話にてご連絡くださいませ。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ② おすすめ資料 → 直下に「お役立ち資料に戻る」 */}
        {hasRecommended && (
          <div className="relative z-0 bg-white px-4 pb-20 pt-4 sm:px-8 sm:pb-24 sm:pt-6">
            <div className="mx-auto max-w-6xl bg-white">
              <h2 className="bg-white text-center text-base font-bold text-slate-900 sm:text-lg lg:text-base">
                こちらの資料もおすすめです
              </h2>
              <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-6 lg:grid-cols-3 lg:gap-4">
                {thanksRecommended.map((doc) => (
                  <li key={doc.id} className="min-w-0">
                    <Link
                      href={`/download?documentId=${encodeURIComponent(doc.id)}`}
                      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:border-slate-200/90 hover:shadow-md lg:rounded-xl"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                        {doc.thumbnailUrl ? (
                          <Image
                            src={doc.thumbnailUrl}
                            alt={doc.label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-600">
                            PDF
                          </div>
                        )}
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:p-5 lg:gap-2 lg:p-3.5">
                        <p className="text-sm font-semibold leading-snug text-slate-800 line-clamp-2 lg:text-[13px] lg:leading-snug">
                          {doc.label}
                        </p>
                        <span
                          className={`${documentDownloadCtaClassName} mt-auto inline-flex w-full min-w-0 max-w-full shrink-0 justify-center whitespace-nowrap px-3 py-2.5 text-xs sm:px-5 sm:py-3 sm:text-sm lg:px-4 lg:py-2 lg:text-xs`}
                        >
                          資料をダウンロード
                          <Download className="h-4 w-4 shrink-0 lg:h-3.5 lg:w-3.5" strokeWidth={2} aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center bg-white px-2 pt-12 sm:pt-14">
                <Link
                  href="/"
                  className="rounded-md bg-white px-6 py-4 text-center text-sm text-slate-500 transition-colors hover:text-black"
                >
                  お役立ち資料に戻る
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ③ 無料アカウント診断CTA（ネイビー曲線） */}
        <div
          className={`relative z-10 ${hasRecommended ? '-mt-1 sm:-mt-2' : 'mt-6 sm:mt-8'}`}
          aria-labelledby="thanks-diagnosis-heading"
        >
          <div className="rounded-t-[100px] bg-gradient-to-b from-[#01408D] to-[#001A3D] px-6 pb-20 pt-14 text-center sm:px-10 sm:pb-24 sm:pt-20">
            <h2
              id="thanks-diagnosis-heading"
              className="mx-auto max-w-xl text-base font-semibold leading-snug text-white sm:text-lg"
            >
              無料アカウント診断
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/90 sm:text-[15px]">
              サービス資料を読まれた方の多くが、無料のアカウント診断ツールも合わせてご利用になっています。SNS運用の課題を可視化できます。
            </p>
            <Link
              href="/download?diagnosis=1"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#01408D] shadow-md transition hover:bg-slate-100"
            >
              アカウント診断を見る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full min-h-0 w-full flex-1 flex-col rounded-xl border border-slate-200/90 bg-white px-3.5 py-5 shadow-sm sm:px-5 sm:py-5"
      noValidate
    >
      <input
        type="hidden"
        name="templateId"
        value={resolvedTemplateId ?? ''}
        readOnly
        aria-hidden
      />
      <div className="mb-3 shrink-0">
        <p className="text-sm font-normal leading-relaxed text-slate-600 sm:text-[13px] sm:leading-snug">
          必要事項をご入力ください。内容確認後、ご案内メールをお送りします。
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
        <div className="min-h-0 space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label htmlFor="lastName" className={labelClass}>
                姓
                <span className={requiredBadgeClass}>必須</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="山田"
                required
                autoComplete="family-name"
                disabled={state === 'submitting'}
                className={fieldControlClass}
              />
            </div>
            <div>
              <label htmlFor="firstName" className={labelClass}>
                名
                <span className={requiredBadgeClass}>必須</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="太郎"
                required
                autoComplete="given-name"
                disabled={state === 'submitting'}
                className={fieldControlClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className={labelClass}>
              会社名
              <span className={requiredBadgeClass}>必須</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="株式会社〇〇"
              required
              autoComplete="organization"
              disabled={state === 'submitting'}
              className={fieldControlClass}
            />
          </div>

          <div>
            <div id="job-title-label" className={labelClass}>
              役職
              <span className={requiredBadgeClass}>必須</span>
            </div>
            <div
              role="radiogroup"
              aria-labelledby="job-title-label"
              className="flex flex-wrap gap-2"
            >
              {DOWNLOAD_REQUEST_JOB_TITLE_OPTIONS.map((opt) => {
                const selected = department === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={state === 'submitting'}
                    onClick={() => setDepartment(opt)}
                    className={`${pillBaseClass} ${selected ? pillSelectedClass : pillIdleClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              電話番号
              <span className={optionalBadgeClass}>任意</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03-1234-5678"
              autoComplete="tel"
              disabled={state === 'submitting'}
              className={fieldControlClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              メールアドレス
              <span className={requiredBadgeClass}>必須</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              required
              autoComplete="email"
              disabled={state === 'submitting'}
              className={fieldControlClass}
            />
          </div>

          <div>
            <div id="request-purpose-label" className={labelClass}>
              資料請求の目的
              <span className={requiredBadgeClass}>必須</span>
            </div>
            <div
              role="radiogroup"
              aria-labelledby="request-purpose-label"
              className="flex flex-wrap gap-2"
            >
              {DOWNLOAD_REQUEST_PURPOSE_OPTIONS.map((opt) => {
                const selected = requestPurpose === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={state === 'submitting'}
                    onClick={() => setRequestPurpose(opt)}
                    className={`${pillBaseClass} ${selected ? pillSelectedClass : pillIdleClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="questions" className={labelClass}>
              ご質問・ご要望
              <span className={optionalBadgeClass}>任意</span>
            </label>
            <textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="ご不明点やご要望があればご記入ください"
              rows={3}
              disabled={state === 'submitting'}
              className={`${fieldControlClass} min-h-[72px] resize-y`}
            />
          </div>

          <div className="border-t border-slate-200 pt-3">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                disabled={state === 'submitting'}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#185FA5] focus:ring-[#185FA5]"
              />
              <span className="text-sm font-medium leading-relaxed text-slate-600 sm:text-xs sm:leading-relaxed">
                <a
                  href="https://www.cocomarke.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#185FA5] underline underline-offset-2 hover:brightness-95"
                >
                  プライバシーポリシー
                </a>
                に同意する
                <span className={requiredBadgeClass}>必須</span>
              </span>
            </label>
          </div>
        </div>

        <div className="shrink-0 space-y-3 pt-1">
          {state === 'error' && errorMessage && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || state === 'submitting'}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#185FA5] px-4 py-2.5 text-sm font-medium text-[#E6F1FB] transition hover:bg-[#154a88] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'submitting' ? '送信中...' : !configReady ? '準備中...' : '資料ダウンロード'}
          </button>

          <p className="text-center">
            <Link
              href="/"
              className="text-xs font-medium text-[#185FA5] underline-offset-2 transition hover:underline sm:text-sm"
            >
              ← トップページに戻る
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
