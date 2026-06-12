'use client';

import { useMemo, useState } from 'react';
import type { HomeFlatDocument } from '@/lib/homeDocuments';
import { DocumentGrid } from '@/components/home/DocumentGrid';
import { DocumentCard } from '@/components/home/DocumentCard';

type Props = {
  documents: HomeFlatDocument[];
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
          ? 'border-[#01408D] bg-[#01408D] text-white'
          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563A8] hover:text-[#2563A8]'
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

export function DocumentLibrary({ documents }: Props) {
  /** 出現順にカテゴリと件数を集計 */
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of documents) {
      counts.set(d.category, (counts.get(d.category) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [documents]);

  const [active, setActive] = useState<string>('all');

  const filtered =
    active === 'all' ? documents : documents.filter((d) => d.category === active);

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
        <DocumentGrid className="mt-8">
          {filtered.map((doc) => (
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
  );
}
