import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";
import ArticleDiagnosisBanners from "../../_components/ArticleDiagnosisBanners";

// ────────────────────────────────────────────────────────────────
// 運営者インタビュー記事。/subscription/blog/jemia-interview
// SEO記事: 検索流入 → サービスページ（/subscription）への回遊を狙います。
// ────────────────────────────────────────────────────────────────

const PUBLISHED = "2026-07-07";
const MODIFIED = "2026-07-07";
const URL = "https://www.cocomake-guide.com/subscription/blog/jemia-interview";
const SUBSCRIPTION_URL = "/subscription";
const BLOG_URL = "/subscription/blog";
const MEDIA_URL = "/subscription/media";
const DIAGNOSIS_URL =
  "https://www.cocomake-guide.com/shindan.html?utm_source=blog&utm_medium=referral&utm_campaign=interview";

const AUTHOR = { name: "早川 葵", org: "JEMIA運営局" };

export const metadata: Metadata = {
  title:
    "「頑張っても伸びない」を終わらせたい——インスタ運用代行JEMIA運営責任者インタビュー",
  description:
    "なぜInstagramは頑張って投稿しても伸びないのか。おすすめ・発見タブ重視の運用にこだわるインスタ運用代行サブスク「JEMIA」の運営責任者に、サービスに込めた想いや、成果を出すアカウントの共通点、向いている人について聞きました。",
  keywords: [
    "インスタ運用代行",
    "Instagram運用代行",
    "おすすめ・発見タブ",
    "インスタ集客",
    "SNSマーケティング",
    "運用代行 サブスク",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title:
      "「頑張っても伸びない」を終わらせたい——インスタ運用代行JEMIA運営責任者インタビュー",
    description:
      "おすすめ・発見タブ重視の運用にこだわるインスタ運用代行サブスク「JEMIA」。運営責任者が、サービスへの想いと成果を出すアカウントの共通点を語ります。",
    url: URL,
    type: "article",
    publishedTime: PUBLISHED,
    images: ["https://www.cocomake-guide.com/images/interview/interview-1.png"],
  },
};

const toc = [
  { id: "start", label: "「頑張っているのに報われない」をなくしたかった" },
  { id: "discover", label: "なぜおすすめ・発見タブにこだわるのか" },
  { id: "cases", label: "利用者に起きた変化" },
  { id: "who", label: "JEMIAが向いている人" },
  { id: "future", label: "これから目指すこと" },
  { id: "cta", label: "まずはアカウントの現状を知ることから" },
];

// 構造化データ（Article）
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "「頑張っても伸びない」を終わらせたい——インスタ運用代行JEMIA運営責任者インタビュー",
  description:
    "おすすめ・発見タブ重視の運用にこだわるインスタ運用代行サブスク「JEMIA」の運営責任者インタビュー。",
  image: ["https://www.cocomake-guide.com/images/interview/interview-1.png"],
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  author: { "@type": "Person", name: AUTHOR.name, affiliation: { "@type": "Organization", name: "JEMIA（株式会社ホットセラー）" } },
  publisher: {
    "@type": "Organization",
    name: "株式会社ホットセラー",
    url: "https://www.cocomake-guide.com",
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

// Q&Aブロック
function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="flex gap-3 text-base font-bold text-slate-900">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm text-white">Q</span>
        <span className="pt-0.5">{q}</span>
      </p>
      <div className="mt-4 flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D7A4F] text-sm font-bold text-white">A</span>
        <div className="space-y-4 pt-0.5 leading-loose text-slate-700">{children}</div>
      </div>
    </div>
  );
}

// 記事内の画像
function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="w-full rounded-2xl border border-slate-100" />
      <figcaption className="mt-2 text-center text-xs text-slate-400">{caption}</figcaption>
    </figure>
  );
}

export default function JemiaInterviewPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <JemiaHeader />

      <div className="bg-white text-slate-800 [text-wrap:pretty]">
        {/* Hero */}
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href={SUBSCRIPTION_URL} className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href={BLOG_URL} className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">運営者インタビュー</span>
            </nav>
            <span className="inline-block rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-medium tracking-wide text-[#2D7A4F]">
              運営者インタビュー
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
              「頑張っても伸びない」を終わらせたい
            </h1>
            <p className="mt-3 text-lg font-medium text-[#1A5C37]">
              インスタ運用代行サブスク「JEMIA」運営責任者インタビュー
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={PUBLISHED}>2026年7月7日</time>
              <span aria-hidden>・</span>
              <span>執筆：{AUTHOR.name}（{AUTHOR.org}）</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          {/* リード */}
          <p className="leading-loose text-slate-700">
            「毎日投稿しているのに伸びない」「フォロワーは増えても集客につながらない」——Instagram運用のそんな悩みに、おすすめ・発見タブ重視の運用で応えるサブスク型の運用代行が「JEMIA」です。今回は、サービスを立ち上げた背景やこだわり、どんな人に向いているのかを、JEMIAの運営責任者に聞きました。
          </p>

          {/* 目次 */}
          <nav aria-label="目次" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-900">目次</p>
            <ol className="mt-3 space-y-2 text-sm">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 本文 */}
          <article className="mt-12">
            {/* 1 */}
            <section id="start" className="scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                「頑張っているのに報われない」をなくしたかった
              </h2>

              <QA q="まず、JEMIAを立ち上げた理由から教えてください。">
                <p>
                  Instagram運用の現場に長く関わるなかで、いちばん多く見てきたのが「頑張っているのに報われていない」お店や個人の方でした。毎日欠かさず投稿しているのに、反応はいつもの常連さんからのいいねだけ。フォロワーはじわじわ増えるけれど、来店や問い合わせにはつながらない。とても良い商品やサービスを持っているのに、それが届いていないんです。
                </p>
                <p>
                  もったいない、と強く感じました。伸びない原因の多くは、商品力ではなく「見せ方」と「届け方」にあります。そこさえ整えれば結果は変わる。でも、その仕組みを一人で回し続けるのは本当に大変です。だったら私たちが専門家として引き受けよう、というのがJEMIAの出発点でした。
                </p>
              </QA>

              <Figure
                src="/images/interview/interview-1.png"
                alt="インスタ運用代行JEMIAの運営責任者へのインタビューの様子"
                caption="「良いものが、ちゃんと見つけてもらえる状態をつくりたい」と語る"
              />

              <QA q="サービス名の「JEMIA」にはどんな意味があるのですか。">
                <p>
                  細かな由来はいろいろあるのですが、根っこにあるのは「埋もれている良いものが、ちゃんと見つけてもらえる世界にしたい」という想いです。運用代行というと「投稿を代わりに作る」イメージが強いのですが、私たちが本当に届けたいのは、投稿を作ることではなく「見られる状態をつくる」ことなんです。
                </p>
              </QA>
            </section>

            {/* 2 */}
            <section id="discover" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                なぜおすすめ・発見タブにこだわるのか
              </h2>

              <QA q="JEMIAは「おすすめ・発見タブ」を重視していると聞きます。なぜですか。">
                <p>
                  いまのInstagramは、ユーザーが自分で店を探す前に、おすすめとして流れてくる投稿で店を知る時代になっています。この「レコメンド」の入口が、まさにおすすめ・発見タブです。ここに載るということは、あなたをまだ知らない新しい人に投稿が届くということ。フォロワーだけに向けて投稿している限り、リーチはフォロワーの数で頭打ちになってしまいます。
                </p>
                <p>
                  だからこそ私たちは、「フォロワーを増やすこと」そのものよりも、「反応される投稿をつくっておすすめ・発見タブに載せ、新規に届ける」ことを重視しています。順番が逆になると、いくら投稿しても集客につながらないんです。
                </p>
              </QA>

              <QA q="具体的には、どんな運用をしているのでしょう。">
                <p>
                  大きく三つあります。投稿直後の初速をつくるための集中的なブースト、狙ったユーザーと効率的にアクション、コミュニケーションを続けるためのアクション活動（いいね・ストーリー閲覧など各種機能）、そして反応が伸びやすい時間帯を分析した投稿タイミングの設計です。これらを組み合わせて、「おすすめ・発見タブに載る→新規に届く→反応が増える」という流れをつくっていきます。
                </p>
                <p>
                  独自に蓄積したデータをもとにアルゴリズムを解析しているので、感覚ではなくデータに基づいて施策を選べるのが強みです。目的に合わせて、おすすめ・発見タブ露出を最大化するプランや、狙ったキーワードでの検索上位を目指すプランなどを選べるようにしています。
                </p>
                <p className="rounded-xl bg-[#E8F5ED] px-5 py-4 text-sm not-italic text-[#1A5C37]">
                  JEMIAのサービス内容・料金プランは
                  <a href={SUBSCRIPTION_URL} className="font-bold underline underline-offset-4">こちらのページ</a>
                  で詳しくご覧いただけます。
                </p>
              </QA>
            </section>

            {/* 3 */}
            <section id="cases" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                利用者に起きた変化
              </h2>

              <QA q="実際に、利用者にはどんな変化がありましたか。">
                <p>
                  よくあるのは、「フォロワーにしか届いていなかった投稿が、おすすめ・発見タブ経由で一気に新しい人に届くようになった」というケースです。導入前はいいねが十数件、保存はゼロという状態だった投稿が、おすすめ・発見タブに載ることで数千〜数万の人の目に触れ、プロフィールへのアクセスやフォローにつながっていきます。
                </p>
                <p>
                  ある店舗では、「エリア×ジャンル」の検索で自分の投稿が上位に表示されるようになり、DMからの予約相談が入るようになりました。数字が動くと運用が楽しくなって、投稿への向き合い方まで変わっていくんです。そういう変化を見るのが、いちばんうれしい瞬間ですね。
                </p>
              </QA>

              <Figure
                src="/images/interview/interview-2.png"
                alt="成果を出すアカウントの共通点について話すJEMIA運営責任者"
                caption="「目的を決めて、結果を見て、次の一手を考える。その考え方を私たちが担います」"
              />

              <QA q="うまくいくアカウントに共通点はありますか。">
                <p>
                  「目的を決めて、結果を見て、次の一手を考える」というサイクルを回せているアカウントは強いです。「流行っているからやってみる」ではなく、「この層に届けたいから、この施策を試す」という考え方ですね。JEMIAでは、その考え方の部分を私たちが担うので、オーナーさんは本業に集中したまま、成果につながる運用を続けられます。
                </p>
              </QA>
            </section>

            {/* 4 */}
            <section id="who" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                JEMIAが向いている人
              </h2>

              <QA q="どんな人にJEMIAは向いていますか。">
                <p>
                  いちばん多いのは、「Instagramが集客に大事なのは分かっているけれど、続ける時間がない」という店舗オーナーや個人事業主の方です。投稿の企画、写真の準備、ハッシュタグ選び、分析と改善——一つひとつは地味でも、毎日本業と並行して続けるのは本当に大変です。ここを丸ごと任せたい方には、とても合っていると思います。
                </p>
                <p>
                  それから、「自分でやってみたけれど伸び悩んでいる」という方。すでに頑張ってこられた方ほど、見せ方と届け方を整えるだけで結果が変わりやすいです。逆に、運用を完全に自分でコントロールしたい方には、私たちのやり方は合わないかもしれません。そこは正直にお伝えしています。
                </p>
              </QA>

              <QA q="はじめやすさについてはどうでしょう。">
                <p>
                  初期費用は0円、月額固定で契約の縛りもありません。成果が合わないと感じたら、いつでも解約できます。「まず試してみて、合わなければやめられる」という状態にしているのは、気軽に一歩を踏み出してほしいからです。運用代行はハードルが高いと思われがちですが、そのイメージを変えたいと思っています。
                </p>
              </QA>
            </section>

            {/* 5 */}
            <section id="future" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                これから目指すこと
              </h2>

              <QA q="最後に、これから目指したいことを教えてください。">
                <p>
                  大手や都心の人気店は、これまで知識やリソースを武器にSNS集客を有利に進めてきました。でも本来、お店やサービスは「商品力」で評価されるべきです。いい商品を持っているのに埋もれてしまうのは、あまりにもったいない。この「マーケティングの格差」を、私たちのサービスで少しでも埋めていきたいと考えています。
                </p>
                <p>
                  地方の隠れた名店や、こだわりを持つ個人店が、正当に評価されて集客につながっていく。そういう未来をつくることが、JEMIAの目標です。Instagramを頑張っているすべての人が、その頑張りをちゃんと結果に変えられるように、これからも支えていきたいですね。
                </p>
              </QA>
            </section>

            {/* CTA */}
            <section id="cta" className="mt-16 scroll-mt-20 rounded-3xl bg-[#123524] px-7 py-12 text-center text-white">
              <h2 className="text-xl font-bold text-white sm:text-2xl">まずは、アカウントの現状を知ることから</h2>
              <p className="mx-auto mt-4 max-w-md leading-loose text-[#E8F5ED]">
                60秒でできる無料のアカウント診断で、あなたのアカウントの伸びしろや、いま取り組むべきポイントが分かります。
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={DIAGNOSIS_URL} target="_blank" rel="noopener" className="rounded-xl bg-[#2D7A4F] px-7 py-3 font-bold text-white transition hover:bg-[#4CAF75]">
                  60秒で無料診断する →
                </a>
                <a href={SUBSCRIPTION_URL} className="rounded-xl bg-white px-7 py-3 font-bold text-[#1A5C37] transition hover:bg-[#E8F5ED]">
                  JEMIAのサービスを見る
                </a>
              </div>
            </section>
          </article>

          {/* 執筆者プロフィール */}
          <aside className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
            <p className="text-xs font-medium text-[#2D7A4F]">執筆者</p>
            <p className="mt-1 text-base font-bold text-slate-900">{AUTHOR.name}（{AUTHOR.org}）</p>
            <p className="mt-3 text-sm leading-loose text-slate-600">
              JEMIA運営局の編集・コンテンツ担当。Instagramを中心としたSNS運用支援の現場に携わり、店舗・個人事業主のアカウント改善やおすすめ・発見タブ攻略の企画・分析を担当。「良いものが正しく見つけてもらえる」運用の考え方を、できるだけわかりやすく発信することを大切にしています。
            </p>
          </aside>

          <ArticleDiagnosisBanners campaign="interview" />

          {/* 関連リンク（内部リンクでSEO回遊） */}
          <aside className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-bold text-slate-900">関連ページ</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={SUBSCRIPTION_URL} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  サブスク型インスタ運用代行「JEMIA」の料金プランを見る
                </a>
              </li>
              <li>
                <a href={BLOG_URL} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  Instagram運用のヒント記事一覧
                </a>
              </li>
              <li>
                <a href={MEDIA_URL} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  メディア掲載実績
                </a>
              </li>
            </ul>
          </aside>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
