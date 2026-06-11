import { Suspense } from "react";
import Link from "next/link";
import { loadHomeDocumentSections } from "@/lib/homeDocuments";
import { pickFeaturedDocuments } from "@/lib/pickFeaturedDocuments";
import { SITE_SNS_LINKS } from "@/lib/siteSns";
import { CategoryNav } from "@/components/home/CategoryNav";
import { HomeGenreSection } from "@/components/home/HomeGenreSection";
import { ContactSection } from "@/components/home/ContactSection";
import { FloatingNavigator } from "@/components/navigation/floating-navigator";
import { TopDocuments } from "@/components/TopDocuments";
import Image from "next/image";

export const revalidate = 3600;

export default async function Home() {
  const { sections } = await loadHomeDocumentSections();
  const featured = pickFeaturedDocuments(sections, 3);
  const featuredIds = new Set(featured.map((d) => d.id));

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
              成果につながるInstagram資料を
              <span className="relative whitespace-nowrap">
                一本でも
                <span
                  className="pointer-events-none absolute -inset-x-0.5 bottom-[6px] -z-[1] h-3 rounded-sm"
                  style={{ background: "rgba(16,185,129,.22)" }}
                  aria-hidden
                />
              </span>
            </h1>

            {/* Lead */}
            <p className="mt-5 max-w-[30em] text-[17px] leading-relaxed text-[#6B7280]">
              アカウント設計から最新アルゴリズム対策まで、現場で使える資料をひとつの場所に集めました。登録不要のものをすぐにダウンロードできます。
            </p>

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

      {/* ===== Popular TOP 3 ===== */}
      <Suspense fallback={
        <div className="border-b border-[#E8EBF0] bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="h-6 w-36 animate-pulse rounded bg-gray-100" />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map(i => <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-100" />)}
            </div>
          </div>
        </div>
      }>
        <TopDocuments />
      </Suspense>

      {/* ===== Library ===== */}
      <section
        id="document-categories"
        className="scroll-mt-4 bg-white pb-5 pt-10 sm:pb-6 sm:pt-12 lg:pb-7 lg:pt-14"
        aria-labelledby="library-heading"
      >
        <div className="mx-auto max-w-[1200px] px-5">
          {sections.length > 0 ? (
            <CategoryNav sections={sections} />
          ) : (
            <h2 id="library-heading" className="sr-only">カテゴリー</h2>
          )}
          <HomeGenreSection sections={sections} featuredIds={featuredIds} />
        </div>
      </section>

      <ContactSection />
      <FloatingNavigator />
    </div>
  );
}
