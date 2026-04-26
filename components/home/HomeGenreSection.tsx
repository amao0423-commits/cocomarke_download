'use client';

import { Fragment } from 'react';
import type { HomeSection } from '@/lib/homeDocuments';
import { getHomeCategoryCopy } from '@/lib/homeCategoryCopy';
import { DocumentGrid } from '@/components/home/DocumentGrid';
import { DocumentCard } from '@/components/home/DocumentCard';
import { DiagnosisBanner } from '@/components/DiagnosisBanner';

type Props = {
  sections: HomeSection[];
  /** ピックアップと重なるカードには「ピックアップ」バッジ */
  featuredIds: Set<string>;
};

export function HomeGenreSection({ sections, featuredIds }: Props) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {sections.map((s) => {
        const fallback = getHomeCategoryCopy(s.categoryName);
        const headline = s.headline ?? fallback.headline;
        const description = s.description ?? fallback.description;
        return (
          <Fragment key={s.categoryId}>
            <section
              id={`genre-section-${s.categoryId}`}
              className="scroll-mt-32"
              aria-labelledby={`category-heading-${s.categoryId}`}
            >
              <div className="border-b border-design-border pb-6">
                <h3
                  id={`category-heading-${s.categoryId}`}
                  className="font-bold tracking-tight text-design-text-primary"
                >
                  {headline}
                </h3>
                <p className="mt-2 max-w-2xl text-design-text-secondary">
                  {description}
                </p>
              </div>

              {s.documents.length === 0 ? (
                <p className="mt-6 text-sm text-design-text-secondary">
                  このカテゴリに該当する資料はまだありません。
                </p>
              ) : (
                <DocumentGrid className="mt-8">
                  {s.documents.map((d, index) => {
                    const href = `/download?documentId=${encodeURIComponent(d.id)}`;
                    let badge: 'pickup' | 'recommended' | null = null;
                    if (featuredIds.has(d.id)) {
                      badge = 'pickup';
                    } else if (index === 0) {
                      badge = 'recommended';
                    }
                    return (
                      <li key={d.id}>
                        <DocumentCard
                          document={d}
                          href={href}
                          description={description}
                          badge={badge}
                        />
                      </li>
                    );
                  })}
                </DocumentGrid>
              )}
            </section>
            {s.categoryName === 'Instagram運用のノウハウ集' ? (
              <DiagnosisBanner />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
