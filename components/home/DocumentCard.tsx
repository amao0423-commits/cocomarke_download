import Image from 'next/image';
import type { HomeDocument } from '@/lib/homeDocuments';
import { canOptimizeImage } from '@/lib/imageOptimization';

/** 表紙未設定時のストライププレースホルダー */
const COVER_PLACEHOLDER = {
  background: 'repeating-linear-gradient(135deg,#F2F5F9 0 8px,#E8EDF4 8px 16px)',
} as const;

type Props = {
  document: HomeDocument;
  href: string;
  /** カテゴリ説明など */
  description?: string;
};

export function DocumentCard({ document: doc, href, description }: Props) {
  return (
    <article className="group h-full min-w-0">
      <a
        href={href}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4E9F0] bg-white shadow-[0_1px_3px_rgba(13,59,117,.05)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(13,59,117,.22)]"
      >
        {/* 表紙 16:9 */}
        <div
          className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden border-b border-[#E4E9F0]"
          style={COVER_PLACEHOLDER}
        >
          {doc.thumbnailUrl ? (
            canOptimizeImage(doc.thumbnailUrl) ? (
              <Image
                src={doc.thumbnailUrl}
                alt=""
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 380px"
                className="object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doc.thumbnailUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            )
          ) : (
            <span className="font-mono text-[10px] text-[#8C99AC]">表紙 16:9</span>
          )}
        </div>

        {/* 本文 */}
        <div className="flex min-h-0 flex-1 flex-col px-5 pt-4">
          <span className="mb-2 text-[11px] font-medium text-[#7A879C]">{doc.category}</span>
          <h4 className="text-[15px] font-bold leading-snug text-[#17233A] line-clamp-2">
            {doc.title}
          </h4>
          {description && (
            <p className="mt-2 text-xs leading-relaxed text-[#6B7280] line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* フッター */}
        <div className="mt-4 flex items-center justify-between border-t border-[#EEF1F6] px-5 py-3.5">
          <span className="text-[11.5px] text-[#9AA6B8]">PDF</span>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0D3B75] transition group-hover:gap-1.5">
            ダウンロード
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
            </svg>
          </span>
        </div>
      </a>
    </article>
  );
}
