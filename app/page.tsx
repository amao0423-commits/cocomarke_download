import Image from "next/image";
import { loadHomeDocumentSections } from "@/lib/homeDocuments";
import { pickFeaturedDocuments } from "@/lib/pickFeaturedDocuments";
import { Breadcrumbs } from "@/components/home/Breadcrumbs";
import { CTAButton } from "@/components/home/CTAButton";
import { HeroSection } from "@/components/home/HeroSection";
import { SITE_SNS_LINKS } from "@/lib/siteSns";
import { CategoryNav } from "@/components/home/CategoryNav";
import { HomeGenreSection } from "@/components/home/HomeGenreSection";
import { ContactSection } from "@/components/home/ContactSection";
import { FloatingNavigator } from "@/components/navigation/floating-navigator";
import { TopDocuments } from "@/components/TopDocuments";

export default async function Home() {
  const { sections } = await loadHomeDocumentSections();
  const featured = pickFeaturedDocuments(sections, 3);
  const featuredIds = new Set(featured.map((d) => d.id));

  return (
    <div>
      <div className="bg-white text-design-text-primary">
        <section
          className="coco-section-hero relative flex min-h-[min(52vw,22rem)] flex-col overflow-hidden sm:min-h-[min(48vw,24rem)]"
          aria-label="お役立ち資料"
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/hero-useful-materials.png"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-black/[0.32]"
              aria-hidden
            />
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center translate-y-3 sm:translate-y-4">
            <HeroSection
              eyebrow="お役立ち資料"
              title={
                <span className="block text-balance">
                  <span className="block text-[clamp(1.35rem,4vw+0.35rem,2rem)] leading-snug tracking-tight">
                    無料資料を一括配布中
                  </span>
                  <span className="mt-2 block text-[clamp(0.95rem,2.5vw+0.2rem,1.25rem)] font-semibold leading-snug tracking-tight text-white/95">
                    Instagramで成果を上げるための
                  </span>
                </span>
              }
              description="全資料無料・今すぐダウンロードできます"
              heroVariant="photo"
              actions={
                <div className="flex w-full justify-center">
                  <CTAButton
                    href="/#document-categories"
                    variant="primary"
                    className="justify-center ring-offset-0 focus-visible:ring-offset-0"
                  >
                    資料一覧を見る
                  </CTAButton>
                </div>
              }
            />
          </div>
          <div className="relative z-[11] mx-auto flex w-full max-w-[1200px] shrink-0 flex-col gap-1.5 bg-transparent px-4 pb-8 pt-4 sm:gap-2 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8 lg:pb-12">
            <nav className="flex w-full justify-end gap-3 sm:gap-4" aria-label="SNS">
              {SITE_SNS_LINKS.map(({ href, label, src }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/45 backdrop-blur-sm transition-opacity duration-200 hover:opacity-90 sm:h-11 sm:w-11"
                >
                  <Image
                    src={src}
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                    aria-hidden
                  />
                </a>
              ))}
            </nav>
            <Breadcrumbs
              className="bg-transparent shadow-none text-white/90 [&_a]:text-white/95 [&_a:hover]:text-white [&_span.font-medium]:text-white [&_span[aria-hidden]]:text-white/45"
              items={[
                { label: "トップ", href: "https://www.cocomarke.com/" },
                { label: "お役立ち資料" },
              ]}
            />
          </div>
        </section>

        <TopDocuments />

        <section
          id="document-categories"
          className="coco-section-library scroll-mt-4 pt-8 sm:pt-10 lg:pt-12 pb-5 sm:pb-6 lg:pb-7"
          aria-labelledby="library-heading"
        >
          <div className="coco-section-inner mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            {sections.length > 0 ? (
              <CategoryNav sections={sections} />
            ) : (
              <h2 id="library-heading" className="sr-only">
                カテゴリー
              </h2>
            )}

            <HomeGenreSection sections={sections} featuredIds={featuredIds} />
          </div>
        </section>
      </div>

      <ContactSection />

      <FloatingNavigator />
    </div>
  );
}
