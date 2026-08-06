'use client';

import { useCallback, useMemo, useState } from 'react';
import DownloadForm from './DownloadForm';
import type { PageDocument } from './getDownloadPageContext';
import { getRelatedServiceCta } from '@/lib/relatedServiceCta';

export const DEFAULT_HERO_DESCRIPTION =
  '「投稿しているのに見られない」を解決。\nInstagramを検索・発見で選ばれる導線に変える施策サービス概要をまとめた資料です。';

/** ヒーロー説明文が未指定のとき、資料タイトルから自動生成する */
export function defaultHeroDescription(title: string) {
  const t = title?.trim() || 'この資料';
  return `「${t}」の内容をまとめた資料です。\n下記フォームにご記入いただくと、その場ですぐにダウンロードできます。`;
}

/** 管理画面の DocumentsTab が参照するため export を維持 */
export const DEFAULT_HIGHLIGHT_2 = '検索・発見タブを活用した非フォロワー獲得施策';

export function HeroSummaryCheckIcon({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const glyph = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  return (
    <span className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-sky-400/15 ring-1 ring-sky-400/35 ${box} ${className}`}>
      <svg className={`${glyph} text-sky-400`} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
      </svg>
    </span>
  );
}
export const DOCUMENT_SUMMARY_HEADING = '資料概要';
export function defaultHeroHighlight1(_documentLabel: string) {
  return 'Instagram運用の「露出」に特化した最新アルゴリズム戦略';
}
export function defaultHeroHighlight3(_formName: string) {
  return 'アカウント設計から運用改善まで一貫した支援内容';
}

const WIREFRAME_DEFAULT_HIGHLIGHTS = [
  defaultHeroHighlight1(''),
  DEFAULT_HIGHLIGHT_2,
  defaultHeroHighlight3(''),
  '自社アカウントに足りていない改善ポイントが明確になる',
] as const;

export type HeroHighlightFields = {
  hero_highlight_1?: string | null;
  hero_highlight_2?: string | null;
  hero_highlight_3?: string | null;
  hero_highlights_extra?: string | null;
};

export function buildHeroHighlights(
  _formName: string,
  _documentLabel: string,
  doc?: HeroHighlightFields | null,
) {
  const extra = (doc?.hero_highlights_extra ?? '')
    .split('\n').map(l => l.trim()).filter(Boolean);
  const h1 = doc?.hero_highlight_1?.trim();
  const h2 = doc?.hero_highlight_2?.trim();
  const h3 = doc?.hero_highlight_3?.trim();
  if (!h1 && !h2 && !h3 && extra.length === 0) return [...WIREFRAME_DEFAULT_HIGHLIGHTS];
  return [
    h1 || WIREFRAME_DEFAULT_HIGHLIGHTS[0],
    h2 || WIREFRAME_DEFAULT_HIGHLIGHTS[1],
    h3 || WIREFRAME_DEFAULT_HIGHLIGHTS[2],
    ...extra,
  ];
}

type DownloadPageShellProps = {
  formSlug: string;
  formName: string;
  templateId?: string | null;
  documentId?: string;
  documentLabel?: string | null;
  initialDocuments: PageDocument[];
  thanksInUrl?: boolean;
};

export default function DownloadPageShell({
  formSlug,
  formName,
  templateId,
  documentId,
  documentLabel,
  initialDocuments,
  thanksInUrl = false,
}: DownloadPageShellProps) {
  const docMap = useMemo(
    () => new Map(initialDocuments.map(d => [d.id, d])),
    [initialDocuments],
  );

  const initialActive: PageDocument | null =
    (documentId ? docMap.get(documentId) : undefined) ??
    (documentId && documentLabel ? { id: documentId, label: documentLabel } : (initialDocuments[0] ?? null));

  const [activeDocument, setActiveDocument] = useState<PageDocument | null>(initialActive);
  const [thanksMode, setThanksMode] = useState(false);

  const handleDocChange = useCallback(
    (doc: { id: string; label: string } | null) => {
      setActiveDocument(doc ? (docMap.get(doc.id) ?? doc) : null);
    },
    [docMap],
  );

  const heroTitle = activeDocument?.title?.trim() || activeDocument?.label || 'COCOマーケサービス資料';
  const heroDesc = activeDocument?.hero_description?.trim() || defaultHeroDescription(heroTitle);
  const heroHighlights = useMemo(
    () => buildHeroHighlights(formName, heroTitle, activeDocument ?? undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formName, heroTitle, activeDocument?.hero_highlight_1, activeDocument?.hero_highlight_2,
      activeDocument?.hero_highlight_3, activeDocument?.hero_highlights_extra],
  );
  const thumbSrc = activeDocument?.hero_image_1_url?.trim() || null;
  const relatedCta = getRelatedServiceCta(heroTitle);

  return (
    <div className={`bg-[#F8FAFC] ${thanksMode ? '' : 'py-10 sm:py-14'}`}>
      <div className={thanksMode ? '' : 'mx-auto max-w-[1200px] px-5'}>
        {!thanksMode && (
          <p className="mb-4 text-xs text-[#9CA3AF]">
            <a href="/" className="hover:text-[#0D3B75]">お役立ち資料</a>
            {' '}／{' '}
            <span>{activeDocument?.label || '資料ダウンロード'}</span>
          </p>
        )}

        {/*
          DownloadForm は thanksMode に関わらず同じ位置に置く。
          React がコンポーネントを再マウントすると state がリセットされ
          サンクス画面が消えるため、DOM ツリー上の位置を変えてはいけない。
        */}
        <div className={thanksMode ? '' : 'grid grid-cols-1 items-start gap-11 lg:grid-cols-[1.12fr_1fr]'}>

          {/* 左：資料情報（thanksMode 時は非表示） */}
          {!thanksMode && (
            <div>
              <h1 className="text-[clamp(22px,3vw,30px)] font-black leading-snug text-[#0D3B75]">
                {heroTitle}
              </h1>
              <p className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-[#64748B]">
                {heroDesc}
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
                {thumbSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbSrc} alt={heroTitle} className="block w-full" />
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#F4F6F9] text-xs font-bold text-[#94A3B8]">
                    PDF
                  </div>
                )}
                <div className="flex items-center gap-2.5 border-t border-[#E2E8F0] px-4 py-3.5 text-[13px] text-[#64748B]">
                  <span className="rounded-full bg-[#E6EFFA] px-2.5 py-0.5 text-[11px] font-bold text-[#0D3B75]">PDF</span>
                  <span>無料ダウンロード・約5分で読了</span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[#0D3B75]">
                  この資料でわかること
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {heroHighlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="relative mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#E6EFFA]">
                        <svg className="h-3 w-3 stroke-[#0D3B75]" viewBox="0 0 12 12" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-[#1F2937]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 関連サービスCTA（資料ごとに誘導先を出し分け） */}
              <div className="mt-8 overflow-hidden rounded-2xl border-[1.5px] border-cta/60 bg-white shadow-[0_4px_16px_rgba(224,96,58,.1)]">
                <div className="p-6 sm:p-7">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-4 w-0.5 bg-cta" aria-hidden />
                    <span className="text-[11px] font-bold text-cta">{relatedCta.badge}</span>
                  </div>
                  <h3 className="text-[17px] font-bold leading-snug text-[#17233A]">
                    {relatedCta.heading}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#4A5871]">
                    {relatedCta.description}
                  </p>
                  <a
                    href={relatedCta.href}
                    target={relatedCta.href.startsWith('http') ? '_blank' : undefined}
                    rel={relatedCta.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cta px-5 py-3 text-[13.5px] font-bold text-white shadow-[0_3px_10px_rgba(224,96,58,.28)] transition hover:bg-cta-hover"
                  >
                    {relatedCta.ctaLabel}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 右：フォーム（常にここに置いて state を保持） */}
          <div>
            <DownloadForm
              formSlug={formSlug}
              templateId={templateId}
              documentId={documentId}
              documentLabel={documentLabel}
              thanksInUrl={thanksInUrl}
              onSelectedDocumentChange={handleDocChange}
              onThanksModeChange={setThanksMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
