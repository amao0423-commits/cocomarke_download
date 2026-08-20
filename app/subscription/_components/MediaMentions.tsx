// ────────────────────────────────────────────────────────────────
// メディア掲載実績セクション
//
// 設置場所: /subscription ページの「Reviews（利用者の声）」の直後、
//           「FAQ」の前に挿入するのがおすすめです。
//           （個人の口コミ → 第三者メディアの信頼、と並べると効果的）
//
// ⚠️ PRESSNOW へのリンクには rel="nofollow" を付けないでください
//    （相互リンクのSEO価値を双方に渡せるようにするため）
// ────────────────────────────────────────────────────────────────

type MediaItem = {
  media: string;
  date: string;
  dateISO: string;
  title: string;
  url: string;
  siteUrl?: string;
  note?: string;
  // note 本文中の noteLinkText の箇所をインラインリンク（dofollow）にする
  noteLinkText?: string;
  noteLinkUrl?: string;
};

// note を描画する。noteLinkText / noteLinkUrl があれば、その語だけをインラインリンクにする。
// ※ rel に nofollow は付けない（相互リンクのSEO価値を双方に渡すため）
export function renderNote(m: Pick<MediaItem, "note" | "noteLinkText" | "noteLinkUrl">, linkClassName: string) {
  if (!m.note) return null;
  if (!m.noteLinkText || !m.noteLinkUrl || !m.note.includes(m.noteLinkText)) return m.note;
  const [before, ...rest] = m.note.split(m.noteLinkText);
  return (
    <>
      {before}
      <a href={m.noteLinkUrl} target="_blank" rel="noopener" className={linkClassName}>
        {m.noteLinkText}
      </a>
      {rest.join(m.noteLinkText)}
    </>
  );
}

export const mediaItems: MediaItem[] = [
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
    noteLinkText: "リップルマーク・ヘアー",
    noteLinkUrl: "https://www.ripplemarks-hair.com/",
  },
];

export default function MediaMentions() {
  return (
    <section id="media" className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      {/* セクション見出し */}
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-[#2D7A4F]">Media</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          メディア掲載実績
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-loose text-slate-600">
          JEMIAは各種メディア・プレスリリースサイトで紹介されています。
        </p>
      </div>

      {/* 掲載カード */}
      <ul className="mx-auto mt-10 max-w-2xl space-y-5">
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

            <a
              href={m.url}
              target="_blank"
              rel="noopener"
              className="mt-4 block text-base font-bold leading-snug text-slate-900 hover:text-[#2D7A4F]"
            >
              {m.title}
            </a>

            {m.note && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {renderNote(m, "font-medium text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]")}
              </p>
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

      {/* 掲載実績が増えたら一覧ページへ誘導 */}
      <div className="mt-8 text-center">
        <a href="/subscription/media" className="text-sm font-medium text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
          メディア掲載実績の一覧を見る →
        </a>
      </div>
    </section>
  );
}
