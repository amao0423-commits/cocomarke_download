import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";
import ArticleDiagnosisBanners from "../../_components/ArticleDiagnosisBanners";
import { AuthorBox, AUTHOR } from "../../_components/AuthorBox";

const PUBLISHED = "2026-07-07";
const URL = "https://www.cocomake-guide.com/subscription/blog/restaurant-instagram-guide";
const SUBSCRIPTION_URL = "/subscription";
const BLOG_URL = "/subscription/blog";
const DIAGNOSIS_URL = "https://www.cocomake-guide.com/shindan.html?utm_source=blog&utm_medium=referral&utm_campaign=restaurant";

export const metadata: Metadata = {
  title: "飲食店のインスタ集客〜週2投稿で予約につながる「来店導線」の作り方",
  description:
    "飲食店を知るきっかけの第一位は、いまやInstagram。週2〜3回の投稿でも、来店・予約につながる導線を整えれば集客できます。プロフィール最適化からリール活用まで、飲食店のインスタ集客を実践的に解説します。",
  keywords: ["飲食店 インスタ 集客", "Instagram 予約", "リール", "来店", "店舗集客"],
  alternates: { canonical: URL },
  openGraph: {
    title: "飲食店のインスタ集客〜週2投稿で予約につながる「来店導線」の作り方",
    description:
      "週2〜3回の投稿でも、来店・予約につながる導線を整えれば集客できます。飲食店のインスタ集客を実践的に解説します。",
    url: URL,
    type: "article",
    publishedTime: PUBLISHED,
  },
};

const toc = [
  { id: "why-now", label: "なぜ飲食店にInstagramなのか" },
  { id: "profile", label: "まず整えるべきは「プロフィール」という予約の入口" },
  { id: "reel", label: "リールで「シズル感」を届ける" },
  { id: "hashtag", label: "「エリア×ジャンル」で、探している人に届く" },
  { id: "minimum", label: "毎日投稿しなくていい。「週2」で回す仕組み" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "飲食店のインスタ集客〜週2投稿で予約につながる「来店導線」の作り方",
  description:
    "週2〜3回の投稿でも、来店・予約につながる導線を整えれば集客できます。飲食店のインスタ集客を実践的に解説します。",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { "@type": "Person", name: AUTHOR.name, affiliation: { "@type": "Organization", name: "JEMIA（株式会社ホットセラー）" } },
  publisher: { "@type": "Organization", name: "株式会社ホットセラー", url: "https://www.cocomake-guide.com" },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

export default function ArticlePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <JemiaHeader />

      <div className="bg-white text-slate-800 [text-wrap:pretty]">
        <header className="bg-gradient-to-b from-amber-50 to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href={SUBSCRIPTION_URL} className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href={BLOG_URL} className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">業種別ノウハウ</span>
            </nav>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium tracking-wide text-amber-700">
              業種別ノウハウ
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl sm:leading-tight">
              飲食店のインスタ集客〜週2投稿で予約につながる「来店導線」の作り方
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={PUBLISHED}>2026年7月7日</time>
              <span aria-hidden>・</span>
              <span>約8分</span>
              <span aria-hidden>・</span>
              <span>執筆：{AUTHOR.byline}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <p className="leading-loose text-slate-700">
            「次の週末、どこで食べよう？」——そう考えたとき、多くの人がまず開くのはグルメサイトではなく、Instagramの検索欄です。飲食店を知るきっかけの第一位は、いまやInstagram。この記事では、毎日投稿しなくても来店・予約につながるための「導線づくり」を、実践的に解説します。
          </p>

          <nav aria-label="目次" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-900">目次</p>
            <ol className="mt-3 space-y-2 text-sm">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-amber-700 underline underline-offset-4 hover:text-amber-800">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="mt-12">
            <section id="why-now" className="scroll-mt-20">
              <h2 className="border-l-4 border-amber-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">なぜ飲食店にInstagramなのか</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  いま、飲食店を選ぶ情報源としてInstagramが上位に立っています。特に20〜40代の層では、Google検索より先にインスタでお店や料理ジャンルを検索するのが当たり前になりました。裏を返せば、インスタ上に情報がないお店は「存在しない」も同然になりかねない、ということです。
                </p>
                <p>
                  しかもInstagramは無料で始められ、投稿は資産として残り続けます。グルメサイトの掲載料や紙のチラシと比べても、費用対効果の高い集客手段です。使わない手はありません。
                </p>
              </div>
            </section>

            <section id="profile" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-amber-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">まず整えるべきは「プロフィール」という予約の入口</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  投稿やリールで興味を持ったユーザーが必ず見るのが、プロフィールです。ここが「予約サイトの入口」になります。興味を持ってプロフィールに来た人の多くは、ほんの数秒で「行ってみる・行かない」を判断すると言われています。
                </p>
                <p>
                  整えるべきは四つ。誰向けの店か（ランチ／ディナー／デート／家族など）、何が強みか（看板メニュー・コンセプト）、どこにあるか（最寄り駅・営業時間・定休日）、どう予約するか（予約リンク・電話・DM）。自己紹介の1行目で「自分に関係のある店だ」と伝わらなければ、そのまま離脱されてしまいます。
                </p>
              </div>
            </section>

            <section id="reel" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-amber-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">リールで「シズル感」を届ける</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  いまのInstagramはリールを優遇する設計です。写真投稿のリーチがフォロワーの5〜10%程度にとどまるのに対し、リールはフォロワー外へ広く届きます。つまり、まだお店を知らない人に出会える最大の入口です。
                </p>
                <p>
                  飲食店のリールは、ここが一番の強みです。湯気の立つ料理、チーズが伸びる瞬間、ジュッと焼ける音——こうした「シズル感」は、写真より動画のほうが圧倒的に食欲を刺激します。冒頭の数秒で一番おいしそうな瞬間を見せるのがコツ。15〜30秒の短い動画から始めてみてください。
                </p>
              </div>
            </section>

            <section id="hashtag" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-amber-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">「エリア×ジャンル」で、探している人に届く</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  ハッシュタグは、多ければいいわけではありません。いまは関連性の高い3〜10個が効果的とされています。大きなタグ（#グルメ など）を1〜2個、中規模のタグ（#◯◯料理）を数個、そして「#渋谷イタリアン週末ランチ」のような「エリア×ニッチ」のタグを数個。この組み合わせが基本です。
                </p>
                <p>
                  特に効くのが、エリアと業態をかけ合わせたタグ。「いま、この辺で店を探している人」に直接届きます。あわせて投稿に位置情報を付けると、エリア検索にも引っかかりやすくなります。
                </p>
              </div>
            </section>

            <section id="minimum" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-amber-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">毎日投稿しなくていい。「週2」で回す仕組み</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  「毎日投稿しないと」と気負う必要はありません。理想はフィード週2〜3回、リール週1〜2回、ストーリーズはできる範囲で。無理に毎日続けるより、保てる頻度で質を保つほうが、結果的に成果につながります。
                </p>
                <p>
                  大切なのは、撮影・投稿を仕組み化すること。営業前の10分でまとめ撮りしておく、曜日ごとに投稿の型を決めておく——こうしてルーティンにすると、本業の合間でも続けられます。
                </p>
              </div>
            </section>

            <section className="mt-16 scroll-mt-20 rounded-3xl bg-amber-950 px-7 py-12 text-center text-white">
              <h2 className="text-xl font-bold text-white sm:text-2xl">「続ける」ところまで、まるごと任せられます</h2>
              <p className="mx-auto mt-4 max-w-md leading-loose text-amber-100">
                導線づくりも継続も、本業のかたわらで続けるのは大変です。JEMIAなら、写真を送るだけでおすすめ・発見タブ最適化から投稿制作まで代行します。まずは60秒の無料診断から。
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={DIAGNOSIS_URL} target="_blank" rel="noopener" className="rounded-xl bg-amber-500 px-7 py-3 font-bold text-white transition hover:bg-amber-400">
                  60秒で無料診断する →
                </a>
                <a href={SUBSCRIPTION_URL} className="rounded-xl bg-white px-7 py-3 font-bold text-amber-800 transition hover:bg-amber-50">
                  JEMIAのサービスを見る
                </a>
              </div>
            </section>
          </article>

          <AuthorBox />

          <ArticleDiagnosisBanners campaign="restaurant" />

          <aside className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-bold text-slate-900">関連ページ</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={SUBSCRIPTION_URL} className="text-amber-700 underline underline-offset-4 hover:text-amber-800">サブスク型インスタ運用代行「JEMIA」の料金プランを見る</a></li>
              <li><a href="/subscription/blog/followers-vs-engagement" className="text-amber-700 underline underline-offset-4 hover:text-amber-800">フォロワー1万人でも売れない？「数」より「反応」の運用術</a></li>
              <li><a href="/subscription/blog/instagram-algorithm-2026" className="text-amber-700 underline underline-offset-4 hover:text-amber-800">【2026年最新】Instagramアルゴリズムの変化と5つの指標</a></li>
            </ul>
          </aside>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
