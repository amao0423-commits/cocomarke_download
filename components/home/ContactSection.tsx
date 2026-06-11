const CONTACT_URL = "https://www.cocomarke.com/contact";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="border-t border-[#E8EBF0] bg-[#F4F6F9] py-16 sm:py-20"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="grid grid-cols-1 items-center gap-6 rounded-3xl border border-[#E8EBF0] bg-white px-8 py-10 shadow-sm sm:px-11 sm:py-12 md:grid-cols-[1.4fr_auto] md:gap-8">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#01408D]">
              <span className="h-0.5 w-6 bg-[#2563A8]" aria-hidden />
              Contact
            </span>
            <h2
              id="contact-heading"
              className="font-black leading-snug text-[#01408D]"
              style={{ fontSize: "clamp(20px, 2.5vw, 26px)" }}
            >
              各種お問い合わせはこちら
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#6B7280]">
              資料内容やサービスに関するご質問は、こちらからお気軽にお問い合わせください。
            </p>
          </div>
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#01408D] px-7 py-[15px] text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#013066] hover:shadow-[0_10px_24px_-8px_rgba(1,64,141,.5)]"
          >
            お問い合わせ
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
