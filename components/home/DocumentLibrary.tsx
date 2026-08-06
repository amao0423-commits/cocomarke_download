'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { HomeFlatDocument } from '@/lib/homeDocuments';
import { DocumentGrid } from '@/components/home/DocumentGrid';
import { DocumentCard } from '@/components/home/DocumentCard';
import { canOptimizeImage } from '@/lib/imageOptimization';

/** 注目資料（一覧トップの大きな1枚カード） */
function FeaturedCard({ doc, href }: { doc: HomeFlatDocument; href: string }) {
  return (
    <a
      href={href}
      className="group mb-7 grid overflow-hidden rounded-2xl border border-[#E4E9F0] bg-white shadow-[0_1px_3px_rgba(13,59,117,.05)] transition hover:shadow-[0_10px_30px_-14px_rgba(13,59,117,.25)] md:grid-cols-[minmax(0,400px)_1fr]"
    >
      <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden bg-[#0D3B75]">
        {doc.thumbnailUrl ? (
          canOptimizeImage(doc.thumbnailUrl) ? (
            <Image src={doc.thumbnailUrl} alt="" fill sizes="(max-width:768px) 100vw, 400px" className="object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doc.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )
        ) : (
          <span className="font-mono text-[10.5px] text-white/60">資料表紙 16:9</span>
        )}
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-9">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="rounded bg-cta px-2 py-0.5 text-[10.5px] font-bold text-white">注目資料</span>
          <span className="text-[11.5px] font-medium text-[#7A879C]">{doc.category}</span>
        </div>
        <h3 className="text-xl font-bold leading-snug text-[#17233A] sm:text-2xl">{doc.title}</h3>
        {doc.description && (
          <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#4A5871] line-clamp-2">
            {doc.description}
          </p>
        )}
        <div className="mt-6 flex items-center gap-5">
          <span className="inline-flex items-center justify-center rounded-full bg-[#0D3B75] px-6 py-3 text-sm font-bold text-white transition group-hover:bg-[#0A2E5C]">
            無料ダウンロード
          </span>
          <span className="text-xs text-[#7A879C]">PDF・約5分</span>
        </div>
      </div>
    </a>
  );
}

type Props = {
  documents: HomeFlatDocument[];
  /** カテゴリの表示順（管理画面の並び替え順）。タブの並びに使用 */
  categoryOrder?: string[];
};

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-bold transition ${
        active
          ? 'border-[#0D3B75] bg-[#0D3B75] text-white'
          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#0D3B75] hover:text-[#0D3B75]'
      }`}
    >
      {label}
      <span
        className={`ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
          active ? 'bg-white/25 text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export function DocumentLibrary({ documents, categoryOrder = [] }: Props) {
  /** カテゴリと件数を集計し、管理画面の並び順（categoryOrder）で並べる */
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of documents) {
      counts.set(d.category, (counts.get(d.category) ?? 0) + 1);
    }
    const rank = (name: string) => {
      const i = categoryOrder.indexOf(name);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return Array.from(counts, ([name, count]) => ({ name, count })).sort(
      (a, b) => rank(a.name) - rank(b.name),
    );
  }, [documents, categoryOrder]);

  const [active, setActive] = useState<string>('all');

  const filtered =
    active === 'all' ? documents : documents.filter((d) => d.category === active);

  // 「すべて」表示時は「COCOマーケ サービス概要」を注目カードとして最上部に。
  // 見つからなければ先頭資料をフォールバックに。残りをグリッドへ。
  const featured =
    active === 'all' && filtered.length > 0
      ? (filtered.find((d) => /サービス概要/.test(d.title)) ?? filtered[0])
      : null;
  const gridDocs = featured ? filtered.filter((d) => d.id !== featured.id) : filtered;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterTab
          label="すべて"
          count={documents.length}
          active={active === 'all'}
          onClick={() => setActive('all')}
        />
        {categories.map((c) => (
          <FilterTab
            key={c.name}
            label={c.name}
            count={c.count}
            active={active === c.name}
            onClick={() => setActive(c.name)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[#9CA3AF]">
          該当する資料がありません。
        </p>
      ) : (
        <div className="mt-8">
          {featured && (
            <FeaturedCard
              doc={featured}
              href={`/download?documentId=${encodeURIComponent(featured.id)}`}
            />
          )}
          {gridDocs.length > 0 && (
            <DocumentGrid>
              {gridDocs.map((doc) => (
                <li key={doc.id}>
                  <DocumentCard
                    document={doc}
                    href={`/download?documentId=${encodeURIComponent(doc.id)}`}
                    description={doc.description}
                  />
                </li>
              ))}
            </DocumentGrid>
          )}
        </div>
      )}
    </div>
  );
}
