import type { HomeDocument } from '@/lib/homeDocuments';
import { DocumentThumbnail } from '@/components/home/DocumentThumbnail';
import { DocumentDownloadLink } from '@/components/home/DocumentDownloadCta';

type BadgeKind = 'pickup' | 'recommended';

type Props = {
  document: HomeDocument;
  href: string;
  description?: string;
  badge?: BadgeKind | null;
};

export function DocumentCard({ document: doc, href, description, badge }: Props) {
  return (
    <article
      className="group relative flex h-full min-w-0 w-full flex-col overflow-hidden rounded-[1.25rem] border border-slate-100 bg-white shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.06),0_4px_10px_rgba(15,23,42,0.04)]"
    >
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col">
        <div className="relative shrink-0 overflow-hidden rounded-t-[inherit]">
          <DocumentThumbnail src={doc.thumbnailUrl} alt={doc.title} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] opacity-0 mix-blend-soft-light transition-opacity duration-200 ease-out group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(125deg, transparent 25%, rgba(255,255,255,0.65) 48%, rgba(255,255,255,0.2) 55%, transparent 72%)',
            }}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3">
          {badge === 'pickup' ? (
            <span className="inline-block w-fit rounded-full border border-transparent bg-design-accent-lavender-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-design-text-primary">
              ピックアップ
            </span>
          ) : null}
          {badge === 'recommended' ? (
            <span className="inline-block w-fit rounded-full border border-transparent bg-design-accent-mint-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-design-text-primary">
              おすすめ
            </span>
          ) : null}
          <h4
            className={`text-[18px] font-bold leading-[27px] tracking-tight text-design-text-primary ${badge ? 'mt-1' : ''}`}
          >
            {doc.title}
          </h4>
          {description ? (
            <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-design-text-secondary">
              {description}
            </p>
          ) : (
            <div className="min-h-0 flex-1" aria-hidden />
          )}
          <div className="mt-auto shrink-0 pt-2">
            <DocumentDownloadLink href={href} className="text-xs sm:text-sm" />
          </div>
        </div>
      </div>
    </article>
  );
}
