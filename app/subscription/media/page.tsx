import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

export const metadata: Metadata = {
  title: "メディア掲載実績｜サブスク型インスタ運用代行 JEMIA",
  description:
    "サブスク型インスタ運用代行「JEMIA」のメディア掲載実績をご紹介します。各種メディア・プレスリリースサイトで取り上げられた情報を掲載しています。",
  alternates: { canonical: "https://www.cocomake-guide.com/subscription/media" },
  openGraph: {
    title: "メディア掲載実績｜サブスク型インスタ運用代行 JEMIA",
    description:
      "JEMIAが各種メディア・プレスリリースサイトで紹介された掲載実績の一覧です。",
    url: "https://www.cocomake-guide.com/subscription/media",
    type: "website",
  },
};

// ── 掲載実績データ（今後増やすたびに追記するだけ） ──────────────
type MediaItem = {
  media: string; // メディア名
  date: string; // 掲載日（表示用）
  dateISO: string; // 構造化データ用
  title: string; // 掲載タイトル（先方指定があればそのまま）
  url: string; // 掲載ページURL
  siteUrl?: string; // メディアのトップURL（任意）
  note?: string; // 補足（任意）
};

const mediaItems: MediaItem[] = [
  {
    media: "Growth Marketing ブログ",
    date: "2026.07.16",
    dateISO: "2026-07-16",
    title:
      "インスタのフォロワーを増やす方法｜運用サブスクで伸ばす手順と失敗しないやり方【2026年】",
    url: "https://www.nishinippon-adv.jp/blog/instagram-followers-subscription.html",
    siteUrl: "https://www.nishinippon-adv.jp",
    note: "Webメディア「Growth Marketing ブログ」で、月額固定・契約縛りなしのInstagram運用サブスクとして紹介されました。",
  },
  {
    media: "PRESSNOW（プレスナウ）",
    date: "2026.06.27",
    dateISO: "2026-06-27",
    title:
      "Instagram運用サブスク「JEMIA」提供開始〜月額固定・契約縛りなしでInstagram運用をサポート",
    url: "https://pressnow.jp/2026/06/27/cocomake-guide/",
    siteUrl: "https://pressnow.jp",
    note: "プレスリリースサイト「PRESSNOW プレスナウ」に掲載されました。",
  },
  {
    media: "リップルマーク・ヘアー",
    date: "2026.08.20",
    dateISO: "2026-08-20",
    title:
      "床屋が上手い理容室の選び方徹底ガイド！カット技術と口コミで失敗しないコツ | 上三川町で床屋なら幅広いお客様に対応の理容室リップルマーク・ヘアー",
    url: "https://www.ripplemarks-hair.com/news/555100.html",
    siteUrl: "https://www.ripplemarks-hair.com/",
    note: "上三川町の理容室「リップルマーク・ヘアー」様のサイトでご紹介いただきました。",
  },
];

// メディア掲載実績の構造化データ（信頼性の補強）
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "メディア掲載実績｜JEMIA",
  url: "https://www.cocomake-guide.com/subscription/media",
  hasPart: mediaItems.map((m) => ({
    "@type": "NewsArticle",
    headline: m.title,
    datePublished: m.dateISO,
    url: m.url,
    publisher: { "@type": "Organization", name: m.media },
  })),
};

export default function MediaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <JemiaHeader />

      <div className="bg-white text-slate-800">
        {/* ── Hero ───────────────────────────────────── */}
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:py-20">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/subscription" className="hover:text-slate-600">JEMIA</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">メディア掲載実績</span>
            </nav>
            <span className="inline-block rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-medium tracking-wide text-[#2D7A4F]">
              Media
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              メディア掲載実績
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-loose text-slate-600">
              サブスク型インスタ運用代行「JEMIA」が各種メディア・プレスリリースサイトで紹介された掲載実績をご紹介します。
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          {/* ── 掲載実績カード一覧 ──────────────────────── */}
          <ul className="space-y-5">
            {mediaItems.map((m) => (
              <li
                key={m.url}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="rounded-full bg-[#2D7A4F] px-3 py-1 text-xs font-medium text-white">
                    {m.media}
                  </span>
                  <time dateTime={m.dateISO} className="text-xs text-slate-400">
                    {m.date}
                  </time>
                </div>

                <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900">
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-[#2D7A4F]"
                  >
                    {m.title}
                  </a>
                </h2>

                {m.note && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.note}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {/* 掲載記事へのリンク（通常リンク＝nofollowを付けない） */}
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener"
                    className="font-medium text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]"
                  >
                    掲載ページを見る →
                  </a>
                  {m.siteUrl && (
                    <a
                      href={m.siteUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-slate-500 underline underline-offset-4 hover:text-slate-700"
                    >
                      {m.media}のサイト →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* ── CTA ───────────────────────────────────── */}
          <section className="mt-16 overflow-hidden rounded-3xl bg-[#2D7A4F] px-7 py-12 text-center text-white">
            <h2 className="text-2xl font-bold text-white">サブスク型インスタ運用で必要な機能だけ。</h2>
            <p className="mx-auto mt-4 max-w-md leading-loose text-[#E8F5ED]">
              月額固定・契約縛りなしで、Instagram運用をまるごと代行します。まずはお気軽にご相談ください。
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/subscription#contact" className="rounded-xl bg-white px-7 py-3 font-bold text-[#2D7A4F] transition hover:bg-[#E8F5ED]">
                無料で相談する →
              </a>
              <a href="/subscription" className="rounded-xl border border-[#4CAF75]/60 px-7 py-3 font-bold text-white transition hover:bg-[#4CAF75]">
                サービスを見る →
              </a>
            </div>
          </section>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
