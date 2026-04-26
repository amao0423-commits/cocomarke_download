'use client';

import { useState } from 'react';

type Step = {
  step: number;
  title: string;
  detail: string;
};

const STEPS: Step[] = [
  {
    step: 1,
    title: '検索・おすすめで投稿を発見',
    detail:
      'ハッシュタグや位置情報検索、おすすめフィードから発見してもらう入口。写真クオリティと投稿頻度が鍵。',
  },
  {
    step: 2,
    title: 'プロフィールでメニュー・雰囲気を確認',
    detail: 'ハイライトや固定投稿の整理が信頼感につながる。',
  },
  {
    step: 3,
    title: 'ストーリー・DM・予約リンクで行動',
    detail: '導線がわかりやすいほどコンバージョンが上がる。',
  },
  {
    step: 4,
    title: '来店・リピートへ',
    detail: 'UGCやリポストがさらなる集客につながる。',
  },
];

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

const STEP_ICONS = [IconSearch, IconGrid, IconSend, IconHome] as const;

type InstagramFlowProps = {
  /** 見出し（省略時はデフォルト文言） */
  heading?: string;
  className?: string;
};

export function InstagramFlow({
  heading = 'Instagramから来店までの流れ',
  className = '',
}: InstagramFlowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = STEPS[activeIndex]!;

  return (
    <section className={`w-full ${className}`} aria-labelledby="instagram-flow-heading">
      <h2
        id="instagram-flow-heading"
        className="mb-4 text-center text-base font-semibold text-design-text-primary sm:text-lg"
      >
        {heading}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item, index) => {
          const Icon = STEP_ICONS[index]!;
          const isActive = index === activeIndex;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'flex min-h-[140px] w-full flex-col rounded-2xl border p-4 text-left shadow-design-soft transition-colors duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instagram-blue',
                isActive
                  ? 'border-instagram-blue bg-sky-50/90 text-instagram-blue shadow-design-soft-hover'
                  : 'border-design-border bg-design-surface text-design-text-primary hover:border-slate-300 hover:bg-design-surface-hover',
              ].join(' ')}
            >
              <span
                className={[
                  'mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]',
                  isActive ? 'text-instagram-blue' : 'text-design-text-muted',
                ].join(' ')}
              >
                STEP {item.step}
              </span>
              <span
                className={[
                  'mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  isActive
                    ? 'border-instagram-blue/30 bg-white text-instagram-blue'
                    : 'border-design-border bg-design-surface-soft text-design-text-secondary',
                ].join(' ')}
              >
                <Icon className="shrink-0" />
              </span>
              <span
                className={[
                  'text-sm font-medium leading-snug',
                  isActive ? 'text-slate-900' : 'text-design-text-primary',
                ].join(' ')}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="mt-4 rounded-2xl border border-design-border bg-design-surface-soft px-4 py-4 sm:px-5"
        role="region"
        aria-live="polite"
        aria-label="選択中のステップの詳細"
      >
        <p className="text-sm font-semibold text-design-text-primary">{active.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-design-text-secondary">{active.detail}</p>
      </div>
    </section>
  );
}
