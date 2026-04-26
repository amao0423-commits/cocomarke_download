"use client";

import type { ReactNode } from "react";

function IconFeed() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="1" y="1" width="6" height="6" rx="1" fill="#63b3ed" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="#63b3ed" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="#63b3ed" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#63b3ed" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="#63b3ed" strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#63b3ed" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="6" r="3" stroke="#63b3ed" strokeWidth="1.5" />
      <path
        d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
        stroke="#63b3ed"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMap() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 2C5.24 2 3 4.24 3 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" stroke="#63b3ed" strokeWidth="1.5" />
      <circle cx="8" cy="7" r="1.5" fill="#63b3ed" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M3 2h10a1 1 0 011 1v11l-5-3-5 3V3a1 1 0 011-1z"
        stroke="#63b3ed"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#63b3ed" strokeWidth="1.5" />
      <path d="M2 7h12" stroke="#63b3ed" strokeWidth="1.5" />
      <path d="M5 1v4M11 1v4" stroke="#63b3ed" strokeWidth="1.5" strokeLinecap="round" />
      <text x="8" y="12.5" textAnchor="middle" fill="#63b3ed" fontSize="5" fontWeight="600" fontFamily="system-ui, sans-serif">
        17
      </text>
    </svg>
  );
}

function IconHome() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M2 7.5L8 2.5l6 5V13a1.5 1.5 0 01-1.5 1.5H10v-4H6v4H3.5A1.5 1.5 0 012 13V7.5z"
        stroke="#63b3ed"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheers() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4.5 2.5L3 8h3.5M11.5 2.5L13 8H9.5M3 8v1a2 2 0 002 2h.5M13 8v1a2 2 0 01-2 2h-.5M5.5 11v3M10.5 11v3"
        stroke="#63b3ed"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.5 5.5L9.5 6.5" stroke="#63b3ed" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

type BandStep = {
  id: string;
  num: string;
  phase: string;
  heading: string;
  sub: string;
  icons: ReactNode;
};

const BAND_STEPS: BandStep[] = [
  {
    id: "discover",
    num: "01",
    phase: "発見",
    heading: "フィードで気になる",
    sub: "おすすめ・検索で投稿が目に止まる",
    icons: (
      <>
        <IconFeed />
        <IconSearch />
      </>
    ),
  },
  {
    id: "confirm",
    num: "02",
    phase: "確認",
    heading: "プロフィールでお店を知る",
    sub: "メニュー・雰囲気・立地を確認",
    icons: (
      <>
        <IconProfile />
        <IconMap />
      </>
    ),
  },
  {
    id: "action",
    num: "03",
    phase: "行動",
    heading: "保存・予約で一歩前へ",
    sub: "行きたいリストや予約へ進む",
    icons: (
      <>
        <IconBookmark />
        <IconCalendar />
      </>
    ),
  },
  {
    id: "visit",
    num: "04",
    phase: "来店",
    heading: "お店の入り口へ",
    sub: "来店・乾杯の体験へつながる",
    icons: (
      <>
        <IconHome />
        <IconCheers />
      </>
    ),
  },
];

/** 案 B ― 横帯リスト（タイトル直下のセクション本体） */
export function InstagramToVisitFlowSection() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className="divide-y divide-white/[0.08] overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-sm"
        role="list"
        aria-label="Instagramから来店までの4ステップ"
      >
        {BAND_STEPS.map((step) => (
          <div
            key={step.id}
            role="listitem"
            className="flex items-start gap-3 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6"
          >
            <span
              className="w-10 shrink-0 self-center tabular-nums text-2xl font-bold leading-none text-sky-300/90 sm:w-12 sm:text-3xl"
              aria-hidden
            >
              {step.num}
            </span>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="text-[10px] font-semibold tracking-wide text-sky-300/95 sm:text-xs">{step.phase}</p>
              <h3 className="mt-0.5 text-sm font-bold text-white sm:text-base">{step.heading}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-[13px] sm:leading-relaxed">{step.sub}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2.5 self-center sm:gap-3" aria-hidden>
              {step.icons}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
