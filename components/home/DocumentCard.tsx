import type { HomeDocument } from '@/lib/homeDocuments';

/** 出典ロゴ（COCOマーケ アイコン: app/icon.png → /icon.png 配信） */
const LOGO_URL = '/icon.png';

type Props = {
  document: HomeDocument;
  href: string;
  /** バッジ下の説明文（カテゴリ説明など） */
  description?: string;
};

export function DocumentCard({ document: doc, href, description }: Props) {
  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8EBF0] bg-white transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,.2)]">
      <a href={href} style={{ display: 'contents' }}>
        {/* ヘッダー：左に出典ロゴ（現状維持）、右に拡大したサムネイル */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF1F5] bg-[#F8FAFC] px-4 pb-3 pt-4">
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="COCOマーケ"
              className="h-8 w-8 shrink-0 rounded-md object-contain"
            />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold leading-tight text-[#1F2937]">
                COCOマーケ
              </p>
              <p className="text-[10px] leading-tight text-[#9CA3AF]">資料</p>
            </div>
          </div>

          <div className="relative aspect-[16/10] w-full max-w-[150px] overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#E2E8F0]">
            {doc.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doc.thumbnailUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        </div>

        {/* 本文：タグ・タイトル・説明・ボタン */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-4 pt-3.5">
          <span className="inline-block w-fit rounded-full bg-[#E6EFFA] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#0C447C]">
            {doc.category}
          </span>

          <h4 className="text-sm font-bold leading-snug tracking-[.005em] text-[#1F2937] line-clamp-2 sm:text-[14.5px]">
            {doc.title}
          </h4>

          {description && (
            <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-[#6B7280]">
              {description}
            </p>
          )}

          <div className="mt-auto pt-2.5">
            <span className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#2563A8] py-2.5 text-[13px] font-bold text-white transition group-hover:bg-[#1d5390]">
              ダウンロード
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
