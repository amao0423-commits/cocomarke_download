import Link from "next/link";
import { loadHomeDocumentsFlat } from "@/lib/homeDocuments";
import { SITE_SNS_LINKS } from "@/lib/siteSns";
import { DocumentLibrary } from "@/components/home/DocumentLibrary";
import { HeroCoverStack } from "@/components/home/HeroCoverStack";
import { ContactSection } from "@/components/home/ContactSection";
import { FloatingNavigator } from "@/components/navigation/floating-navigator";
import Image from "next/image";

// ISR: 静的生成して CDN から即時配信（about:blank フラッシュ／TTFB 遅延を解消）。
// データは unstable_cache(tags:['documents']) 済みで、管理画面の編集時に
// revalidateTag('documents') が走るため、編集内容は即座に反映される。
export const revalidate = 3600;

export default async function Home() {
  const { documents, categoryOrder } = await loadHomeDocumentsFlat();

  return (
    <div>
      {/* ===== Hero ===== */}
      <div className="relative overflow-hidden border-b border-[#E4E9F0] bg-gradient-to-b from-[#F7F9FC] to-white">
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_360px]">
          <div>
            {/* Eyebrow */}
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#0D3B75]">
              <span className="h-0.5 w-6 bg-[#0D3B75]" aria-hidden />
              Instagram Marketing Library
            </span>

            {/* H1 */}
            <h1 className="font-black leading-[1.35] tracking-[.01em] text-[#17233A]"
              style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
              お役立ち資料
            </h1>

            {/* Lead */}
            <p className="mt-4 max-w-[520px] text-[15px] leading-[1.9] text-[#4A5871]">
              Instagram運用の設計から改善までを、現場で使える単位にまとめました。全{documents.length}点・すべて無料、フォーム入力後その場でダウンロードできます。
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/#document-categories"
                className="inline-flex items-center gap-2 rounded-full bg-[#0D3B75] px-7 py-[15px] text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0A2E5C] hover:shadow-[0_10px_24px_-8px_rgba(1,64,141,.5)]"
              >
                資料一覧を見る
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>
                </svg>
              </Link>
              <span className="text-[13px] text-[#7A879C]">
                全資料無料・登録1分
              </span>
            </div>

            {/* SNS */}
            <nav className="mt-8 flex gap-3" aria-label="SNS">
              {SITE_SNS_LINKS.map(({ href, label, src }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#E8EBF0] bg-white transition hover:border-[#0D3B75]/30">
                  <Image src={src} alt="" width={20} height={20} className="h-5 w-5 object-contain" aria-hidden />
                </a>
              ))}
            </nav>
          </div>

          {/* 右：資料表紙スタック（上位3資料） */}
          <HeroCoverStack documents={documents} />
        </div>
      </div>

      {/* ===== Library（アップロード順のフラット一覧） ===== */}
      <section
        id="document-categories"
        className="scroll-mt-4 bg-white pb-10 pt-10 sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14"
        aria-labelledby="library-heading"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2
              id="library-heading"
              className="text-xl font-bold tracking-tight text-[#17233A] sm:text-2xl"
            >
              資料一覧
              <span className="ml-2.5 align-middle font-mono text-[13px] font-medium text-[#7A879C]">
                {documents.length} 件
              </span>
            </h2>
            <span className="text-[12.5px] text-[#7A879C]">新着順</span>
          </div>
          {documents.length === 0 ? (
            <p className="mt-6 text-sm text-[#6B7280]">公開中の資料はまだありません。</p>
          ) : (
            <DocumentLibrary documents={documents} categoryOrder={categoryOrder} />
          )}
        </div>
      </section>

      <ContactSection />
      <FloatingNavigator />
    </div>
  );
}
