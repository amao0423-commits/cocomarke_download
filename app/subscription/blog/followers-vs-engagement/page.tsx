import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";
import ArticleDiagnosisBanners from "../../_components/ArticleDiagnosisBanners";
import { AuthorBox, AUTHOR } from "../../_components/AuthorBox";

const PUBLISHED = "2026-07-07";
const URL = "https://www.cocomake-guide.com/subscription/blog/followers-vs-engagement";
const SUBSCRIPTION_URL = "/subscription";
const BLOG_URL = "/subscription/blog";
const DIAGNOSIS_URL = "https://www.cocomake-guide.com/shindan.html?utm_source=blog&utm_medium=referral&utm_campaign=engagement";

export const metadata: Metadata = {
  title: "フォロワー1万人でも売れない？「数」より「反応」で伸ばすInstagram運用の考え方",
  description:
    "フォロワーを増やせば集客できる、という思い込みには落とし穴があります。フォロワー数より大切な「エンゲージメント（反応）」の考え方と、来店・売上につながる運用の順番を解説します。",
  keywords: ["インスタ フォロワー", "エンゲージメント", "インスタ集客", "SNS運用", "反応"],
  alternates: { canonical: URL },
  openGraph: {
    title: "フォロワー1万人でも売れない？「数」より「反応」で伸ばすInstagram運用の考え方",
    description:
      "フォロワー数より大切な「エンゲージメント（反応）」の考え方と、来店・売上につながる運用の順番を解説します。",
    url: URL,
    type: "article",
    publishedTime: PUBLISHED,
  },
};

const toc = [
  { id: "trap", label: "フォロワー数という「過去の数字」の落とし穴" },
  { id: "engagement", label: "本当に見るべきは「エンゲージメント」" },
  { id: "quality-follower", label: "「誰に届いているか」がすべて" },
  { id: "order", label: "成果が出るアカウントの「正しい順番」" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "フォロワー1万人でも売れない？「数」より「反応」で伸ばすInstagram運用の考え方",
  description:
    "フォロワー数より大切な「エンゲージメント（反応）」の考え方と、来店・売上につながる運用の順番を解説します。",
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
        <header className="bg-gradient-to-b from-cyan-50 to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href={SUBSCRIPTION_URL} className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href={BLOG_URL} className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">集客・運用</span>
            </nav>
            <span className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium tracking-wide text-cyan-700">
              集客・運用
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl sm:leading-tight">
              フォロワー1万人でも売れない？「数」より「反応」で伸ばすInstagram運用の考え方
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={PUBLISHED}>2026年7月7日</time>
              <span aria-hidden>・</span>
              <span>約6分</span>
              <span aria-hidden>・</span>
              <span>執筆：{AUTHOR.byline}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <p className="leading-loose text-slate-700">
            「フォロワーを増やせば、集客できるはず」——多くの方がそう考えます。ところが、フォロワーが1万人いても売上につながらないアカウントは、実はめずらしくありません。この記事では、なぜ数だけでは足りないのか、そして本当に見るべき指標について解説します。
          </p>

          <nav aria-label="目次" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-900">目次</p>
            <ol className="mt-3 space-y-2 text-sm">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-cyan-700 underline underline-offset-4 hover:text-cyan-800">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="mt-12">
            <section id="trap" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">フォロワー数という「過去の数字」の落とし穴</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  フォロワー数は、これまでの活動の「累積」です。つまり過去の実績であって、いまの影響力とは必ずしも一致しません。1年前にバズって増えたフォロワーが、いまはまったく反応していない、ということは普通に起こります。
                </p>
                <p>
                  Instagramのアルゴリズムは、フォロワーの数そのものではなく、投稿にどれだけ濃い反応があるかを見ています。フォロワーが多くても反応が薄ければおすすめ・発見タブには載りにくく、逆にフォロワーが少なくてもコアなファンがしっかり反応すれば、新しい人へと届いていきます。
                </p>
              </div>
            </section>

            <section id="engagement" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">本当に見るべきは「エンゲージメント」</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  エンゲージメントとは、いいね・コメント・保存・送信（シェア）といったユーザーの反応のことです。近年はここに「滞在時間」も加わります。要するに、どれだけ心を動かせたかの指標です。
                </p>
                <p>
                  Instagramは投稿直後の反応の初速を見て、その投稿を他の人にも見せるべきかを判断します。だからこそ目指すべきは「反応される投稿をつくること」であって、フォロワーを増やすことそのものではありません。順番を間違えると、いくら数を追っても集客にはつながらないのです。
                </p>
              </div>
            </section>

            <section id="quality-follower" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">「誰に届いているか」がすべて</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  もう一つ大切なのが、フォロワーの「質」です。1万人のフォロワーがいても、その大半が商品やサービスに関心のない層なら、売上にはつながりません。逆に、500人でも全員が見込み客なら、そのほうがずっと強いアカウントです。
                </p>
                <p>
                  だからこそ、フォロワーを増やすときも「誰に来てほしいか」を先に決めることが重要です。エリアや興味関心を絞り、その層に届く投稿をつくる。数を追う前に「届ける相手」を定める——遠回りに見えて、実は集客への最短ルートです。
                </p>
              </div>
            </section>

            <section id="order" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">成果が出るアカウントの「正しい順番」</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  うまくいくアカウントには、共通した「展開の順番」があります。まず誰に届けるかを決める。次に、その層が反応する投稿をつくる。そして反応（エンゲージメント）を高め、おすすめ・発見タブに載せて新規に届ける。最後に、増えたファンが来店や購入につながる、という流れです。
                </p>
                <p>
                  この順番で回すと、フォロワー数は「結果」として後からついてきます。逆に、数を追うことから始めると、反応の薄いフォロワーばかりが増えて、いつまでも集客につながりません。大切なのは、数を目的にしないことです。
                </p>
              </div>
            </section>

            <section className="mt-16 scroll-mt-20 rounded-3xl bg-cyan-950 px-7 py-12 text-center text-white">
              <h2 className="text-xl font-bold text-white sm:text-2xl">「反応」から運用する仕組みにする</h2>
              <p className="mx-auto mt-4 max-w-md leading-loose text-cyan-100">
                反応を高め、おすすめ・発見タブに載せて新規に届ける——この一連の流れを、まるごと任せられるのがJEMIAです。まずは60秒の無料診断で、あなたのアカウントの現状を確認してみましょう。
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={DIAGNOSIS_URL} target="_blank" rel="noopener" className="rounded-xl bg-cyan-500 px-7 py-3 font-bold text-white transition hover:bg-cyan-400">
                  60秒で無料診断する →
                </a>
                <a href={SUBSCRIPTION_URL} className="rounded-xl bg-white px-7 py-3 font-bold text-cyan-800 transition hover:bg-cyan-50">
                  JEMIAのサービスを見る
                </a>
              </div>
            </section>
          </article>

          <AuthorBox />

          <ArticleDiagnosisBanners campaign="engagement" />

          <aside className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-bold text-slate-900">関連ページ</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={SUBSCRIPTION_URL} className="text-cyan-700 underline underline-offset-4 hover:text-cyan-800">サブスク型インスタ運用代行「JEMIA」の料金プランを見る</a></li>
              <li><a href="/subscription/blog/instagram-algorithm-2026" className="text-cyan-700 underline underline-offset-4 hover:text-cyan-800">【2026年最新】Instagramアルゴリズムの変化と5つの指標</a></li>
              <li><a href="/subscription/blog/restaurant-instagram-guide" className="text-cyan-700 underline underline-offset-4 hover:text-cyan-800">飲食店のインスタ集客〜予約につながる来店導線の作り方</a></li>
            </ul>
          </aside>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
