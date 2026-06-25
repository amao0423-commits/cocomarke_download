import Link from "next/link";
import { loadHomeDocumentsFlat } from "@/lib/homeDocuments";
import { SITE_SNS_LINKS } from "@/lib/siteSns";
import { DocumentLibrary } from "@/components/home/DocumentLibrary";
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
      <div className="relative overflow-hidden border-b border-[#E8EBF0] bg-white">
        {/* 装飾グラデーション */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
          style={{
            background: [
              "radial-gradient(ellipse 60% 50% at 88% 8%, rgba(16,185,129,.07) 0%, transparent 60%)",
              "radial-gradient(ellipse 70% 60% at 8% 92%, rgba(1,64,141,.06) 0%, transparent 62%)",
            ].join(", "),
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-[88px] sm:py-[80px]">
          <div className="max-w-[760px]">
            {/* Eyebrow */}
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#01408D]">
              <span className="h-0.5 w-6 bg-[#2563A8]" aria-hidden />
              Instagram Marketing Library
            </span>

            {/* H1 */}
            <h1 className="mt-0 font-black leading-[1.3] tracking-[.01em] text-[#01408D]"
              style={{ fontSize: "clamp(30px, 5vw, 54px)" }}>
              <span className="relative whitespace-nowrap">
                お役立ち資料
                <span
                  className="pointer-events-none absolute -inset-x-0.5 bottom-[6px] -z-[1] h-3 rounded-sm"
                  style={{ background: "rgba(16,185,129,.22)" }}
                  aria-hidden
                />
              </span>
            </h1>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/#document-categories"
                className="inline-flex items-center gap-2 rounded-full bg-[#01408D] px-7 py-[15px] text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#013066] hover:shadow-[0_10px_24px_-8px_rgba(1,64,141,.5)]"
              >
                資料一覧を見る
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
                </svg>
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#9CA3AF]">
                <b className="font-bold text-[#10B981]">全資料無料</b>・今すぐDL可能
              </span>
            </div>

            {/* SNS */}
            <nav className="mt-8 flex gap-3" aria-label="SNS">
              {SITE_SNS_LINKS.map(({ href, label, src }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#E8EBF0] bg-white transition hover:border-[#01408D]/30">
                  <Image src={src} alt="" width={20} height={20} className="h-5 w-5 object-contain" aria-hidden />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ===== Library（アップロード順のフラット一覧） ===== */}
      <section
        id="document-categories"
        className="scroll-mt-4 bg-white pb-10 pt-10 sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14"
        aria-labelledby="library-heading"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          <h2
            id="library-heading"
            className="mb-6 text-xl font-bold tracking-tight text-[#01408D] sm:text-2xl"
          >
            資料一覧
          </h2>
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
