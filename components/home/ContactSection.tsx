import { DocumentDownloadLink } from "@/components/home/DocumentDownloadCta";

const CONTACT_PAGE_URL = "https://www.cocomarke.com/contact";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-4 overflow-hidden rounded-t-[40px] pb-14 font-sans sm:pb-16 md:rounded-t-[80px] md:pb-20 lg:rounded-t-[120px] lg:pb-24"
      aria-labelledby="contact-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#01408D] to-[#001A3D]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-[-12%] z-[1] hidden w-[64%] -skew-x-[24deg] bg-white/[0.07] lg:block"
        aria-hidden
      />
      <div className="coco-section-inner relative z-10 mx-auto max-w-[1200px] px-5 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="contact-heading"
            className="font-extrabold tracking-tight text-white"
          >
            各種お問い合わせはこちら
          </h2>
          <p className="mt-4 text-white/80 md:whitespace-nowrap">
            資料内容やサービスに関するご質問はこちらからお気軽にお問い合わせください。
          </p>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <DocumentDownloadLink
            href={CONTACT_PAGE_URL}
            variant="light"
            label="お問い合わせ"
            icon="mail"
            className="min-w-[min(100%,18rem)] px-8 py-3.5 text-sm sm:px-10 sm:py-4"
          />
        </div>
      </div>
    </section>
  );
}
