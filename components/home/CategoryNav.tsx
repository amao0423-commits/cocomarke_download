'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HomeSection } from '@/lib/homeDocuments';

type Props = {
  sections: HomeSection[];
};

/** スクロール位置から、いま画面で主に読んでいるカテゴリを推定（ジャンプナビの選択表示用） */
function pickActiveCategory(sections: HomeSection[]): string {
  if (sections.length === 0) return '';
  const anchorY = 160;
  let active = sections[0].categoryId;
  for (const s of sections) {
    const el = document.getElementById(`genre-section-${s.categoryId}`);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= anchorY) {
      active = s.categoryId;
    }
  }
  return active;
}

export function CategoryNav({ sections }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    () => sections[0]?.categoryId ?? ''
  );

  useEffect(() => {
    if (sections.length === 0) return;
    setActiveCategoryId((prev) =>
      sections.some((s) => s.categoryId === prev) ? prev : sections[0].categoryId
    );
  }, [sections]);

  useEffect(() => {
    if (sections.length === 0) return;

    let rafId: number | undefined;
    const update = () => {
      if (rafId !== undefined) return;
      rafId = requestAnimationFrame(() => {
        setActiveCategoryId(pickActiveCategory(sections));
        rafId = undefined;
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [sections]);

  const scrollTo = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    document
      .getElementById(`genre-section-${categoryId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (sections.length === 0) return null;

  return (
    <div className="py-20">
      <nav
        className="border-none bg-transparent p-0 shadow-none"
        aria-labelledby="library-heading"
      >
        <h2
          id="library-heading"
          className="mb-4 text-center font-sans font-bold tracking-tight text-black"
        >
          資料カテゴリー
        </h2>

        <div className="flex flex-wrap justify-center gap-1.5 lg:gap-3">
          {sections.map((s) => {
            const active = activeCategoryId === s.categoryId;
            return (
              <button
                key={s.categoryId}
                type="button"
                onClick={() => scrollTo(s.categoryId)}
                aria-current={active ? 'true' : undefined}
                className={[
                  'inline-flex w-auto shrink-0 items-center justify-center rounded-full border font-medium transition',
                  'whitespace-nowrap py-1 px-3 text-sm',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#01408D]/20 focus-visible:ring-offset-2',
                  'lg:min-h-[48px] lg:rounded-2xl lg:px-5 lg:py-2.5 lg:leading-snug',
                  active
                    ? 'border-[#01408D] bg-[#01408D] text-white'
                    : 'border-slate-200 bg-transparent text-slate-500 hover:border-[#01408D]/40 hover:text-[#01408D]',
                ].join(' ')}
              >
                {s.categoryName}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
