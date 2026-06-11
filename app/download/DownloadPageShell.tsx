'use client';

import { useCallback, useMemo, useState } from 'react';
import DownloadForm from './DownloadForm';
import type { PageDocument } from './getDownloadPageContext';

export const DEFAULT_HERO_DESCRIPTION =
  '「投稿しているのに見られない」を解決。\nInstagramを検索・発見で選ばれる導線に変える施策サービス概要をまとめた資料です。';

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
  documentId?: string;
  documentLabel?: string | null;
  initialDocuments: PageDocument[];
  thanksInUrl?: boolean;
};

export default function DownloadPageShell({
  formSlug,
  formName,
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
  const heroDesc = activeDocument?.hero_description?.trim() || DEFAULT_HERO_DESCRIPTION;
  const heroHighlights = useMemo(
    () => buildHeroHighlights(formName, heroTitle, activeDocument ?? undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formName, heroTitle, activeDocument?.hero_highlight_1, activeDocument?.hero_highlight_2,
      activeDocument?.hero_highlight_3, activeDocument?.hero_highlights_extra],
  );
  const thumbSrc = activeDocument?.hero_image_1_url?.trim() || null;

  if (thanksMode) {
    return (
      <div className="bg-[#F8FAFC]">
        <DownloadForm
          formSlug={formSlug}
          documentId={documentId}
          documentLabel={documentLabel}
          thanksInUrl={thanksInUrl}
          onSelectedDocumentChange={handleDocChange}
          onThanksModeChange={setThanksMode}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        {/* パンくず */}
        <p className="mb-4 text-xs text-[#9CA3AF]">
          <a href="/" className="hover:text-[#01408D]">お役立ち資料</a>
          {' '}／{' '}
          <span>{activeDocument?.label || '資料ダウンロード'}</span>
        </p>

        <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-2">

          {/* 左：資料情報 */}
          <div>
            <h1 className="text-[clamp(22px,3vw,30px)] font-black leading-snug text-[#01408D]">
              {heroTitle}
            </h1>
            <p className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-[#64748B]">
              {heroDesc}
            </p>

            {/* サムネイル */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
              <div className="aspect-[16/10] bg-[#F4F6F9]">
                {thumbSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbSrc} alt={heroTitle} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#94A3B8]">
                    PDF
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2.5 border-t border-[#E2E8F0] px-4 py-3.5 text-[13px] text-[#64748B]">
                <span className="rounded-full bg-[#E6EFFA] px-2.5 py-0.5 text-[11px] font-bold text-[#01408D]">PDF</span>
                <span>無料ダウンロード・約5分で読了</span>
              </div>
            </div>

            {/* この資料でわかること */}
            <div className="mt-6">
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-[#01408D]">
                この資料でわかること
              </h2>
              <ul className="flex flex-col gap-2.5">
                {heroHighlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="relative mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#E6EFFA]">
                      <svg className="h-3 w-3 stroke-[#2563A8]" viewBox="0 0 12 12" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-[#1F2937]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右：フォーム */}
          <div>
            <DownloadForm
              formSlug={formSlug}
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
