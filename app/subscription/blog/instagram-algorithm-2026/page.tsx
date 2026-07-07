import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";
import ArticleDiagnosisBanners from "../../_components/ArticleDiagnosisBanners";
import { AuthorBox, AUTHOR } from "../../_components/AuthorBox";

const PUBLISHED = "2026-07-07";
const URL = "https://www.cocomake-guide.com/subscription/blog/instagram-algorithm-2026";
const SUBSCRIPTION_URL = "/subscription";
const BLOG_URL = "/subscription/blog";
const DIAGNOSIS_URL = "https://www.cocomake-guide.com/shindan.html?utm_source=blog&utm_medium=referral&utm_campaign=algo2026";

export const metadata: Metadata = {
  title: "【2026年最新】Instagramアルゴリズムの変化〜「保存」から「送信」へ。いま伸ばすべき5つの指標",
  description:
    "2026年のInstagramアルゴリズムは大きく変化しています。保存から送信（シェア）へ、そしてAIによるコンテンツ理解へ。おすすめ・発見タブに載るために、いま本当に見るべき指標を最新情報をもとに整理します。",
  keywords: ["Instagramアルゴリズム", "2026", "おすすめ・発見タブ", "保存", "シェア", "インスタ運用"],
  alternates: { canonical: URL },
  openGraph: {
    title: "【2026年最新】Instagramアルゴリズムの変化〜「保存」から「送信」へ。いま伸ばすべき5つの指標",
    description:
      "2026年のInstagramアルゴリズムの変化と、おすすめ・発見タブに載るためにいま見るべき5つの指標を整理します。",
    url: URL,
    type: "article",
    publishedTime: PUBLISHED,
  },
};

const toc = [
  { id: "whats-new", label: "2026年、何が変わったのか" },
  { id: "save-to-send", label: "「保存」から「送信（シェア）」へ" },
  { id: "ai-understanding", label: "AIが投稿の「中身」を見る時代へ" },
  { id: "five-metrics", label: "いま伸ばすべき5つの指標" },
  { id: "how-to", label: "では、明日から何をすればいいのか" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "【2026年最新】Instagramアルゴリズムの変化〜「保存」から「送信」へ。いま伸ばすべき5つの指標",
  description:
    "2026年のInstagramアルゴリズムの変化と、おすすめ・発見タブに載るためにいま見るべき5つの指標を整理します。",
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
        <header className="bg-gradient-to-b from-emerald-50 to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href={SUBSCRIPTION_URL} className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href={BLOG_URL} className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">おすすめ・発見タブ・アルゴリズム</span>
            </nav>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium tracking-wide text-emerald-700">
              おすすめ・発見タブ・アルゴリズム
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl sm:leading-tight">
              【2026年最新】Instagramアルゴリズムの変化〜「保存」から「送信」へ。いま伸ばすべき5つの指標
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={PUBLISHED}>2026年7月7日</time>
              <span aria-hidden>・</span>
              <span>約7分</span>
              <span aria-hidden>・</span>
              <span>執筆：{AUTHOR.byline}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <p className="leading-loose text-slate-700">
            「去年までのやり方が、なんだか通用しなくなってきた」——そう感じているインスタ運用者の方は少なくないはずです。実際、2026年のInstagramアルゴリズムは、評価される指標が確実に変化しています。この記事では、いま本当に伸ばすべき指標と、その背景にある考え方を整理します。
          </p>

          <nav aria-label="目次" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-900">目次</p>
            <ol className="mt-3 space-y-2 text-sm">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-emerald-700 underline underline-offset-4 hover:text-emerald-800">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="mt-12">
            <section id="whats-new" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">2026年、何が変わったのか</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  まず押さえておきたいのは、Instagramのアルゴリズムは一つではない、ということです。フィード、ストーリーズ、リール、おすすめ・発見タブ——それぞれ別々のロジックで動いています。なかでも、まだ自分を知らない人に届けられる入口が、おすすめ・発見タブとリール。ここはコンテンツそのものの質と反応が、表示を大きく左右します。
                </p>
                <p>
                  そのうえで、2026年の大きな変化は三つあります。一つ目は、評価指標が「閲覧数（ビュー）」に統一される流れが進んだこと。二つ目は、これまで最重要とされた「保存」に加えて、「送信（シェア）」やリーチ拡大が強いシグナルになったこと。そして三つ目が、AIによるコンテンツ理解の深化です。
                </p>
              </div>
            </section>

            <section id="save-to-send" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">「保存」から「送信（シェア）」へ</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  これまで、おすすめ・発見タブに載る鍵は「保存」だと言われてきました。あとで見返したくなる価値のある投稿をつくる、という考え方自体はいまも有効です。
                </p>
                <p>
                  ただ2026年は、これに加えて「送信」——つまりDMで直接誰かに共有される投稿が、より強く評価されるようになりました。Instagramは「人と人をつなぐこと」を重要視しています。誰かに教えたくなる投稿ほど、拡散する価値があると判断されるのです。保存が「自分のための価値」だとすれば、送信は「誰かに教えたい価値」。この一段深い価値をつくれるかが、伸びの分かれ目になっています。
                </p>
              </div>
            </section>

            <section id="ai-understanding" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">AIが投稿の「中身」を見る時代へ</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  もう一つの大きな変化が、AIによるコンテンツ理解です。かつてInstagramは、ハッシュタグやキャプションのテキストを中心に投稿を分類していました。ところが現在は、画像や動画の内容そのものをAIが解析し、何が写っていてどんな場面かまで理解して、レコメンドに反映します。
                </p>
                <p>
                  この変化により、ハッシュタグを大量に付けて分類を狙う手法の効果は薄まりました。いまは関連性の高いタグを絞って使うのが主流です。それ以上に大切なのが「投稿のジャンルを一貫させること」。毎回バラバラなジャンルを繰り返すとAIの分類が不安定になり、おすすめ・発見タブに載りにくくなります。「このアカウントは◯◯の専門だ」とAIに明確に伝わる状態をつくることが、これまで以上に重要になっています。
                </p>
              </div>
            </section>

            <section id="five-metrics" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">いま伸ばすべき5つの指標</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  ここまでを踏まえ、2026年に注目すべき指標を整理します。まず①送信数（シェア）——誰かに教えたくなる投稿かどうかの最重要指標。次に②保存率——後で見返したくなるかどうか。そして③初速のエンゲージメント——投稿直後の反応が、その後の拡散を左右します。
                </p>
                <p>
                  加えて④フォロワー外リーチの割合。すでに新規に届いている投稿は、おすすめ・発見タブでも強くなります。最後に⑤ジャンルの一貫性——数値では表れませんが、AIに正しく分類してもらう土台です。この5つを意識するだけで、投稿の設計は大きく変わります。
                </p>
              </div>
            </section>

            <section id="how-to" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900 sm:text-2xl">では、明日から何をすればいいのか</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  考え方はシンプルです。「保存されるだけ」に加えて、「誰かに送りたくなる価値」を投稿に入れること。たとえば、友だちに教えたくなる裏技や豆知識、シェアしたくなる意外な事実を共有して、送りたくなる動機を一つ入れるだけで、送信は増えます。
                </p>
                <p>
                  そして、ジャンルを絞って一貫して発信し、投稿直後の初速をストーリーズなどで後押しする。地道ですが、これがいまのアルゴリズムに沿った近道です。
                </p>
              </div>
            </section>

            <section className="mt-16 scroll-mt-20 rounded-3xl bg-emerald-950 px-7 py-12 text-center text-white">
              <h2 className="text-xl font-bold text-white sm:text-2xl">変化に追いつく運用を、プロと一緒に</h2>
              <p className="mx-auto mt-4 max-w-md leading-loose text-emerald-100">
                アルゴリズムは毎年のように変わります。最新の指標に合わせて運用を続けるのは大変——そんなときは、まず60秒の無料診断で現状をチェックしてみてください。
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={DIAGNOSIS_URL} target="_blank" rel="noopener" className="rounded-xl bg-emerald-500 px-7 py-3 font-bold text-white transition hover:bg-emerald-400">
                  60秒で無料診断する →
                </a>
                <a href={SUBSCRIPTION_URL} className="rounded-xl bg-white px-7 py-3 font-bold text-emerald-800 transition hover:bg-emerald-50">
                  JEMIAのサービスを見る
                </a>
              </div>
            </section>
          </article>

          <AuthorBox />

          <ArticleDiagnosisBanners campaign="algo2026" />

          <aside className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-bold text-slate-900">関連ページ</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={SUBSCRIPTION_URL} className="text-emerald-700 underline underline-offset-4 hover:text-emerald-800">サブスク型インスタ運用代行「JEMIA」の料金プランを見る</a></li>
              <li><a href="/subscription/blog/followers-vs-engagement" className="text-emerald-700 underline underline-offset-4 hover:text-emerald-800">フォロワー1万人でも売れない？「数」より「反応」の運用術</a></li>
              <li><a href="/subscription/blog/jemia-interview" className="text-emerald-700 underline underline-offset-4 hover:text-emerald-800">運営者インタビュー：おすすめ・発見タブ重視の運用にこだわる理由</a></li>
            </ul>
          </aside>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
