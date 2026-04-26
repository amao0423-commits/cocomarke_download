'use client';

import { useCallback, useMemo, useState } from 'react';
import DownloadForm from './DownloadForm';
import type { PageDocument } from './page';

export const DEFAULT_HERO_DESCRIPTION =
  '「投稿しているのに見られない」を解決。\nInstagramを検索・発見で選ばれる導線に変える施策サービス概要をまとめた資料です。';

/** 左カラム・グレー枠内の見出し（固定文言） */
export const DOCUMENT_SUMMARY_HEADING = '資料概要';

export const DEFAULT_HIGHLIGHT_2 =
  '検索・発見タブを活用した非フォロワー獲得施策';

export function defaultHeroHighlight1(_documentLabel: string) {
  return 'Instagram運用の「露出」に特化した最新アルゴリズム戦略';
}

export function defaultHeroHighlight3(_formName: string) {
  return 'アカウント設計から運用改善まで一貫した支援内容';
}

const WIREFRAME_DEFAULT_HIGHLIGHTS = [
  'Instagram運用の「露出」に特化した最新アルゴリズム戦略',
  '検索・発見タブを活用した非フォロワー獲得施策',
  'アカウント設計から運用改善まで一貫した支援内容',
  '自社アカウントに足りていない改善ポイントが明確になる',
] as const;

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
  const extra = (doc?.hero_highlights_extra ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const h1 = doc?.hero_highlight_1?.trim();
  const h2 = doc?.hero_highlight_2?.trim();
  const h3 = doc?.hero_highlight_3?.trim();
  if (!h1 && !h2 && !h3 && extra.length === 0) {
    return [...WIREFRAME_DEFAULT_HIGHLIGHTS];
  }
  const base = [
    h1 || defaultHeroHighlight1(documentLabel),
    h2 || DEFAULT_HIGHLIGHT_2,
    h3 || defaultHeroHighlight3(formName),
  ];
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

/** 資料概要リスト用（Stat「無料」と同系色の sky-400） */
export function HeroSummaryCheckIcon({
  className = '',
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md';
}) {
  const box = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const glyph = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  return (
    <span
      className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-sky-400/15 ring-1 ring-sky-400/35 ${box} ${className}`}
    >
      <svg
        className={`${glyph} text-sky-400`}
        fill="none"
        viewBox="0 0 12 12"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
      </svg>
    </span>
  );
}

function DocPreviewSlot({ url, title }: { url?: string | null; title: string }) {
  const src = url?.trim() ?? '';
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-white">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- 管理画面で任意ホストの公開URLを設定するため next/image の remotePatterns に縛らない
        <img
          src={src}
          alt={title}
          className="block h-full w-full object-contain object-top"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
          <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-[9px] font-medium leading-tight text-neutral-600">PDF</span>
        </div>
      )}
    </div>
  );
}

/** 左カラム固定見出し（ワイヤーフレーム準拠） */
export const DOWNLOAD_PAGE_SECTION_TITLE = '資料をダウンロード';

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
              : 'grid min-h-0 w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start sm:gap-5 md:gap-6 lg:gap-8'
          }
        >
          {!thanksMode && (
          <div className="relative flex h-fit min-h-0 w-full min-w-0 max-w-full flex-col self-start overflow-hidden rounded-2xl border border-white/10 shadow-lg [contain:paint]"
            style={{ background: 'linear-gradient(160deg, #1a3a6b 0%, #0d2a55 60%, #0a2040 100%)' }}
          >
            {/* 装飾グロー */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%)' }}
            />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)' }}
            />

            <div className="relative z-10 flex min-w-0 w-full max-w-full flex-col gap-3 overflow-hidden p-4 md:gap-4 md:p-6">
              {/* バッジ */}
              <div className="flex max-w-full items-center gap-1.5 self-start rounded-full border border-sky-400/35 bg-sky-400/18 px-3 py-1">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
                <span className="max-w-full break-words text-[11px] font-medium tracking-wide text-white/85">
                  お役立ち資料
                </span>
              </div>

              {/* 見出し（資料名） */}
              <h1 className="min-w-0 break-words text-base font-bold leading-snug text-white sm:text-lg">
                {heroTitle}
              </h1>

              {/* 説明文 */}
              <p className="min-w-0 whitespace-pre-line break-words text-sm font-normal leading-relaxed text-white/90 sm:text-[13px] sm:leading-snug">
                {heroDescription}
              </p>

              {/* プレビュー行（1枠＋メタ） */}
              <div className="flex min-w-0 max-w-full items-start gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2.5 sm:items-center sm:gap-3 sm:p-3">
                <div className="h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-lg sm:h-[5rem] sm:w-24 md:h-[5.5rem] md:w-28">
                  <DocPreviewSlot url={activeDocument?.hero_image_1_url} title={heroTitle} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
                  <p className="min-w-0 break-words text-xs font-bold leading-snug text-white line-clamp-3 md:text-[13px] md:line-clamp-2">
                    {heroTitle}
                  </p>
                  <p className="min-w-0 shrink-0 break-words text-[10px] font-medium text-white/85 md:text-[11px]">
                    PDF · 無料ダウンロード
                  </p>
                </div>
              </div>

              {/* 区切り */}
              <div className="h-px min-h-px w-full min-w-0 max-w-full shrink-0 bg-white/10" role="separator" />

              {/* このガイドでわかること */}
              <div className="min-w-0 max-w-full">
                <p className="mb-2 text-[13px] font-bold uppercase tracking-widest text-white">
                  {DOCUMENT_SUMMARY_HEADING}
                </p>
                <ul className="flex min-w-0 flex-col gap-2">
                  {heroHighlights.map((item, idx) => (
                    <li key={`hero-hl-${idx}`} className="flex w-full min-w-0 items-start gap-2">
                      <HeroSummaryCheckIcon />
                      <span className="min-w-0 flex-1 break-words text-sm font-normal leading-relaxed text-white/90 sm:text-[13px] sm:leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stat バー */}
              <div className="grid min-w-0 w-full max-w-full grid-cols-2 gap-2">
                {([['無料', 'ダウンロード'], ['5分', '読了目安']] as const).map(([num, label]) => (
                  <div
                    key={label}
                    className="flex min-w-0 flex-col items-center rounded-xl border border-white/8 bg-white/5 px-1 py-2.5"
                  >
                    <span className="max-w-full truncate text-center text-base font-bold text-sky-400 md:text-lg">
                      {num}
                    </span>
                    <span className="mt-0.5 max-w-full break-words text-center text-[10px] leading-tight text-white/85">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          <div
            className={
              thanksMode
                ? ''
                : 'flex w-full min-w-0 min-h-0 flex-1 flex-col gap-3'
            }
          >
            <div className={thanksMode ? '' : 'flex min-h-0 min-w-0 flex-1 flex-col'}>
              <DownloadForm
                formSlug={formSlug}
                documentId={documentId}
                documentLabel={documentLabel}
                onSelectedDocumentChange={handleDocChange}
                onThanksModeChange={setThanksMode}
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
