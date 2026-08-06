import type { HomeFlatDocument } from '@/lib/homeDocuments';

/** 上位3資料をファン状に重ねた表紙カード（ヒーロー右）。design doc 案1a 準拠 */
const PALETTE = [
  { from: '#2A5FB8', to: '#153B7A' }, // ブルー（左）
  { from: '#26324A', to: '#111A2B' }, // ダーク（中央・前面）
  { from: '#D24438', to: '#9E2A22' }, // レッド（右）
] as const;

const POSITION = [
  'left-0 top-9 -rotate-[9deg] z-10',
  'left-1/2 top-0 -translate-x-1/2 z-20',
  'right-0 top-11 rotate-[9deg] z-0',
] as const;

export function HeroCoverStack({ documents }: { documents: HomeFlatDocument[] }) {
  const top = documents.slice(0, 3);
  if (top.length === 0) return null;

  return (
    <div className="relative mx-auto hidden h-[340px] w-full max-w-[380px] lg:block" aria-hidden>
      {top.map((doc, i) => {
        const c = PALETTE[i % PALETTE.length];
        return (
          <div
            key={doc.id}
            className={`absolute flex h-[280px] w-[208px] flex-col rounded-2xl border border-white/10 p-5 shadow-[0_22px_44px_-14px_rgba(13,59,117,.45)] ${POSITION[i] ?? ''}`}
            style={{ background: `linear-gradient(160deg, ${c.from}, ${c.to})` }}
          >
            <span className="font-mono text-[9px] font-bold uppercase tracking-[.12em] text-white/60 line-clamp-1">
              {doc.category}
            </span>
            <span className="mt-7 text-[15px] font-bold leading-[1.55] text-white line-clamp-4">
              {doc.title}
            </span>
            <span className="mt-auto text-[9px] font-medium text-white/55">COCOマーケ 資料</span>
          </div>
        );
      })}
    </div>
  );
}
