import type { HomeDocument } from '@/lib/homeDocuments';
import { DocumentThumbnail } from '@/components/home/DocumentThumbnail';

type BadgeKind = 'pickup' | 'recommended';

type Props = {
  document: HomeDocument;
  href: string;
  description?: string;
  badge?: BadgeKind | null;
};

export function DocumentCard({ document: doc, href, description, badge }: Props) {
  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E8EBF0] bg-white transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,.2)]">
      <a href={href} style={{ display: 'contents' }}>
        {/* サムネイル 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-[#E8EBF0] bg-[#F4F6F9]">
          <DocumentThumbnail src={doc.thumbnailUrl} alt={doc.title} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3.5">
          {badge === 'pickup' ? (
            <span className="mb-2 inline-block w-fit rounded-full bg-[#F2EEFF] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#5b46b8]">
              ピックアップ
            </span>
          ) : badge === 'recommended' ? (
            <span className="mb-2 inline-block w-fit rounded-full bg-[#E6EFFA] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#01408D]">
              おすすめ
            </span>
          ) : null}

          <h4 className="text-sm font-bold leading-snug tracking-[.005em] text-[#1F2937] line-clamp-2 sm:text-[14.5px]">
            {doc.title}
          </h4>

          {description && (
            <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[#6B7280]">
              {description}
            </p>
          )}

          <div className="mt-3 shrink-0">
            <span className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#2563A8] py-2.5 text-[13px] font-bold text-white transition group-hover:bg-[#1d5390]">
              ダウンロード
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
