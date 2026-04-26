import { loadTopDocuments } from '@/lib/homeDocuments';
import { DocumentCard } from '@/components/home/DocumentCard';

/** ダウンロード数は後で差し替え（モック） */
const MOCK_DL_LABELS = ['1,200 DL', '980 DL', '756 DL'] as const;

export async function TopDocuments() {
  const documents = await loadTopDocuments();

  if (documents.length === 0) {
    return null;
  }

  return (
    <section
      id="top3"
      className="coco-section-top3 scroll-mt-4 border-b border-design-border/60 bg-white pb-8 pt-8 sm:pb-10 sm:pt-10 lg:pb-12 lg:pt-12"
      aria-labelledby="top3-heading"
    >
      <div className="coco-section-inner mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2
          id="top3-heading"
          className="text-xl font-bold tracking-tight text-design-text-primary sm:text-2xl"
        >
          人気資料 TOP 3
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {documents.map((doc, index) => {
            const href = `/download?documentId=${encodeURIComponent(doc.id)}`;
            const dlLabel =
              MOCK_DL_LABELS[index] ?? MOCK_DL_LABELS[MOCK_DL_LABELS.length - 1];
            return (
              <li key={doc.id} className="min-w-0">
                <DocumentCard
                  document={doc}
                  href={href}
                  description={dlLabel}
                  badge={null}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
