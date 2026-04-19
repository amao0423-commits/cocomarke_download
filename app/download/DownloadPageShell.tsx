'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import DownloadForm from './DownloadForm';
import type { PageDocument } from './page';

export const DEFAULT_HERO_DESCRIPTION =
  'COCOマーケの支援内容や考え方を、短時間で把握しやすい形にまとめたご案内です。必要事項をご入力いただくと、すぐに確認できます。';

/** 左カラム・グレー枠内の見出し（固定文言） */
export const DOCUMENT_SUMMARY_HEADING = '資料概要';

export const DEFAULT_HIGHLIGHT_2 =
  '支援内容や進め方を、社内で共有しやすい形で整理しています。';

export function defaultHeroHighlight1(documentLabel: string) {
  return `${documentLabel}の概要を短時間で把握できます。`;
}

export function defaultHeroHighlight3(formName: string) {
  return `${formName}の比較検討に必要な要点をまとめています。`;
}

export type HeroHighlightFields = {
  hero_highlight_1?: string | null;
  hero_highlight_2?: string | null;
  hero_highlight_3?: string | null;
  /** 4行目以降。1行につき1項目（空行は無視） */
  hero_highlights_extra?: string | null;
};

/** 左カラム見出し下の箇条書き（1〜3行は空欄時に既定文、4行目以降は任意追加） */
export function buildHeroHighlights(
  formName: string,
  documentLabel: string,
  doc?: HeroHighlightFields | null,
) {
  const base = [
    doc?.hero_highlight_1?.trim() || defaultHeroHighlight1(documentLabel),
    doc?.hero_highlight_2?.trim() || DEFAULT_HIGHLIGHT_2,
    doc?.hero_highlight_3?.trim() || defaultHeroHighlight3(formName),
  ];
  const extra = (doc?.hero_highlights_extra ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return [...base, ...extra];
}

type PreviewDocument = PageDocument;

type DownloadPageShellProps = {
  formSlug: string;
  formName: string;
  documentId?: string;
  documentLabel?: string | null;
  initialDocuments: PreviewDocument[];
};

function CheckIcon() {
  return (
    <span
      className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#01408D] text-white shadow-sm"
      aria-hidden
    >
      <svg
        className="h-2.5 w-2.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function ImageSlot({
  url,
  alt,
  className = '',
}: {
  url?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-0 overflow-hidden rounded-lg border border-white/18 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)] ${className}`}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 22rem, 50vw"
        />
      ) : (
        <div className="h-full min-h-[48px] w-full bg-white/10" />
      )}
    </div>
  );
}

/** 資料カードは常に2枚、同じ比率・同じ幅で横1列 */
function DocumentHeroPreview({
  heroTitle,
  heroImage1,
  heroImage2,
}: {
  heroTitle: string;
  heroImage1?: string | null;
  heroImage2?: string | null;
}) {
  return (
    <div className="mx-auto grid min-h-0 w-full max-w-xl grid-cols-2 items-stretch gap-4">
      <ImageSlot
        url={heroImage1}
        alt={`${heroTitle} 画像1`}
        className="aspect-[4/3] w-full min-w-0 self-stretch"
      />
      <ImageSlot
        url={heroImage2}
        alt={`${heroTitle} 画像2`}
        className="aspect-[4/3] w-full min-w-0 self-stretch"
      />
    </div>
  );
}

export default function DownloadPageShell({
  formSlug,
  formName,
  documentId,
  documentLabel,
  initialDocuments,
}: DownloadPageShellProps) {
  const docMap = useMemo(
    () => new Map(initialDocuments.map((d) => [d.id, d])),
    [initialDocuments],
  );

  const initialActive: PreviewDocument | null =
    (documentId ? docMap.get(documentId) : undefined) ??
    (documentId && documentLabel
      ? { id: documentId, label: documentLabel }
      : (initialDocuments[0] ?? null));

  const [activeDocument, setActiveDocument] = useState<PreviewDocument | null>(initialActive);

  const handleDocChange = useCallback(
    (doc: { id: string; label: string } | null) => {
      if (!doc) {
        setActiveDocument(null);
        return;
      }
      setActiveDocument(docMap.get(doc.id) ?? doc);
    },
    [docMap],
  );

  const heroTitle = activeDocument?.label ?? 'COCOマーケサービス資料';
  const heroDescription =
    activeDocument?.hero_description?.trim() || DEFAULT_HERO_DESCRIPTION;

  const heroHighlights = useMemo(
    () => buildHeroHighlights(formName, heroTitle, activeDocument ?? undefined),
    [
      formName,
      heroTitle,
      activeDocument?.hero_highlight_1,
      activeDocument?.hero_highlight_2,
      activeDocument?.hero_highlight_3,
      activeDocument?.hero_highlights_extra,
    ],
  );

  const [thanksMode, setThanksMode] = useState(false);

  return (
    <div className="bg-white">
      <section
        className={
          thanksMode
            ? "bg-white"
            : "mx-auto max-w-6xl bg-white px-4 py-10 sm:px-5 sm:py-12 lg:px-8"
        }
      >
        <div
          className={
            thanksMode
              ? ''
              : 'grid min-h-0 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch lg:gap-6'
          }
        >
          {!thanksMode && (
          <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_26px_70px_-42px_rgba(15,23,42,0.28),inset_-10px_0_24px_-18px_rgba(15,23,42,0.06)]">
            <div className="relative isolate flex min-h-0 flex-1 flex-col gap-8 overflow-hidden bg-gradient-to-b from-[#01408D] to-[#001A3D] px-10 py-8 text-white sm:gap-10 sm:px-12 sm:py-10">
              <div className="pointer-events-none absolute inset-y-0 left-[-12%] hidden w-[64%] -skew-x-[24deg] bg-white/[0.07] lg:block" />
              <header className="relative z-10 mx-auto w-full min-w-0 max-w-xl shrink-0">
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <h1 className="text-base font-extrabold leading-tight tracking-tight text-white sm:text-[17px]">
                    {heroTitle}
                  </h1>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-white/[0.88] sm:text-sm sm:leading-relaxed">
                    {heroDescription}
                  </p>
                </div>
              </header>

              <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col justify-center py-2 sm:py-3">
                <DocumentHeroPreview
                  heroTitle={heroTitle}
                  heroImage1={activeDocument?.hero_image_1_url}
                  heroImage2={activeDocument?.hero_image_2_url}
                />
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 shrink-0 flex-col border-t border-slate-100/90 bg-white px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex w-full min-w-0 flex-col gap-1.5 rounded-xl bg-slate-50 p-3 sm:p-4">
                <div className="min-w-0 shrink-0">
                  <h2 className="text-sm font-bold leading-tight text-[#01408D] sm:text-[15px]">
                    {DOCUMENT_SUMMARY_HEADING}
                  </h2>
                </div>

                <ul className="flex min-h-0 w-full min-w-0 flex-col gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 p-2.5 shadow-sm sm:p-3">
                  {heroHighlights.map((item, idx) => (
                    <li
                      key={`hero-hl-${idx}`}
                      className="flex min-w-0 w-full items-start gap-2 text-xs leading-snug text-slate-600 sm:text-sm sm:leading-snug"
                    >
                      <CheckIcon />
                      <span className="min-w-0 flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          )}

          <div
            className={
              thanksMode
                ? ''
                : 'flex h-full min-h-0 flex-col gap-3 lg:mx-auto lg:w-full lg:max-w-[800px]'
            }
          >
            <div className={thanksMode ? '' : 'flex h-full min-h-0 flex-1 flex-col'}>
              <DownloadForm
                formSlug={formSlug}
                documentId={documentId}
                documentLabel={documentLabel}
                onSelectedDocumentChange={handleDocChange}
                onThanksModeChange={setThanksMode}
              />
            </div>

            {!thanksMode && (
              <div className="shrink-0 pl-1">
                <Link
                  href="/"
                  className="text-sm font-medium text-cocomarke-teal underline-offset-2 transition hover:underline"
                >
                  ← トップページに戻る
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
