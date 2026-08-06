const CONTACT_URL = "https://www.cocomarke.com/contact";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-[#0D3B75] py-14 sm:py-16"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[.16em] text-white/65">
            <span className="h-0.5 w-5 bg-white/50" aria-hidden />
            Contact
          </span>
          <h2
            id="contact-heading"
            className="font-bold leading-snug text-white"
            style={{ fontSize: "clamp(20px, 2.5vw, 26px)" }}
          >
            各種お問い合わせはこちら
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            資料内容やサービスに関するご質問は、こちらからお気軽にお問い合わせください。
          </p>
        </div>
        <a
          href={CONTACT_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-[15px] text-[15px] font-bold text-[#0D3B75] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          お問い合わせ
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
