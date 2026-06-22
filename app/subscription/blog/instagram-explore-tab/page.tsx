import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// ⚠️ 差し替え必須: 既存サイトの共通コンポーネントのパスに合わせてください。
//    （下のパスは仮置きです。実際のファイル名・場所に書き換えてください）
// ────────────────────────────────────────────────────────────────
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// ── 記事メタ情報（更新時はここを編集） ──────────────────────────
const ARTICLE = {
  url: "https://www.cocomake-guide.com/subscription/blog/instagram-explore-tab",
  title: "インスタの発見タブに載る方法｜仕組みと最適化の7つのコツ",
  description:
    "インスタの発見タブに載る方法を、仕組みから具体策まで解説。表示される投稿の条件、載らない原因、エンゲージメントを高める7つのコツを紹介します。フォロワー以外の見込み客にリーチしたい店舗・サロン運用者は必見。",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  author: "JEMIA編集部",
  readingTime: "約7分",
};

export const metadata: Metadata = {
  title: "インスタの発見タブに載る方法｜仕組みと最適化の7つのコツ【2026年版】",
  description: ARTICLE.description,
  alternates: { canonical: ARTICLE.url },
  openGraph: {
    title: ARTICLE.title,
    description: ARTICLE.description,
    url: ARTICLE.url,
    type: "article",
    publishedTime: ARTICLE.datePublished,
    modifiedTime: ARTICLE.dateModified,
  },
};

// ── 目次（本文の H2 と id を対応させる） ──────────────────────────
const toc = [
  { id: "what-is", label: "発見タブとは？" },
  { id: "what-shows", label: "どんな投稿が表示される？" },
  { id: "vs-google", label: "発見タブとGoogle検索の違い" },
  { id: "tips", label: "発見タブに載るための7つのコツ" },
  { id: "why-not", label: "「載らない」よくある原因" },
  { id: "hard", label: "自力での運用が難しい理由" },
  { id: "pro", label: "プロに任せるという選択肢" },
  { id: "faq", label: "よくある質問" },
];

const tips = [
  {
    title: "保存される投稿をつくる",
    body: "「役に立つ」「後で見返したい」と思われる投稿は保存されやすく、保存はエンゲージメントの中でも特に評価が高い指標です。ノウハウ・まとめ・比較など、保存したくなる切り口を意識します。",
  },
  {
    title: "最初の数時間のエンゲージメントを高める",
    body: "投稿直後の反応の速さが、発見タブ掲載の大きな判断材料になります。フォロワーが見ている時間帯に投稿し、初速を上げることが重要です。",
  },
  {
    title: "適切なハッシュタグを設計する",
    body: "ビッグキーワード（投稿数が多い）だけでなく、ミドル・スモールキーワードを組み合わせます。「渋谷カフェ」のようなエリア×ジャンルのタグは、見込み客に届きやすい狙い目です。",
  },
  {
    title: "ジャンルを一貫させる",
    body: "アカウントのテーマがブレると、Instagramが「誰に見せるべきか」を判断しづらくなります。投稿ジャンルを絞ることで、興味関心の合うユーザーに届きやすくなります。",
  },
  {
    title: "リール（動画）を活用する",
    body: "リールは発見タブやリールタブで露出されやすく、新規リーチを伸ばしやすいフォーマットです。冒頭の数秒で離脱されない構成を意識します。",
  },
  {
    title: "コメント・シェアを促す",
    body: "問いかけや「保存してね」「友達にシェアしてね」といった一言で、エンゲージメントを後押しできます。コメントへの返信も反応の活性化につながります。",
  },
  {
    title: "投稿を継続する",
    body: "発見タブ掲載は、一度の投稿で決まるものではありません。一定の頻度で投稿を続け、反応の良いパターンを蓄積していくことが、安定した掲載につながります。",
  },
];

const faqItems = [
  {
    q: "発見タブに載るまでどれくらいかかりますか？",
    a: "アカウントの状況によりますが、投稿の質と頻度を改善してから数週間〜数ヶ月で変化が見え始めるケースが多いです。一度の投稿で決まるものではなく、継続的な運用が前提になります。",
  },
  {
    q: "フォロワーが少なくても発見タブに載れますか？",
    a: "はい。発見タブはフォロワー数よりも投稿への反応を重視するため、フォロワーが少なくても、エンゲージメントの高い投稿は掲載される可能性があります。",
  },
  {
    q: "一度載った後も載り続けますか？",
    a: "継続して反応の良い投稿を出せれば掲載は安定しやすくなりますが、投稿が途絶えたり反応が落ちると載りにくくなります。継続が鍵です。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      headline: ARTICLE.title,
      description: ARTICLE.description,
      datePublished: ARTICLE.datePublished,
      dateModified: ARTICLE.dateModified,
      author: { "@type": "Organization", name: ARTICLE.author },
      publisher: {
        "@type": "Organization",
        name: "JEMIA",
        url: "https://www.cocomake-guide.com/subscription",
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": ARTICLE.url },
      inLanguage: "ja",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.cocomake-guide.com/subscription" },
        { "@type": "ListItem", position: 2, name: "お役立ち記事", item: "https://www.cocomake-guide.com/subscription/blog" },
        { "@type": "ListItem", position: 3, name: ARTICLE.title, item: ARTICLE.url },
      ],
    },
  ],
};

export default function InstagramExploreTabArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <JemiaHeader />

      <article className="bg-white text-slate-800">
        {/* ── Hero ───────────────────────────────────────── */}
        <header className="border-b border-slate-100 bg-gradient-to-b from-emerald-50/60 to-white">
          <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/subscription" className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href="/subscription/blog" className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">発見タブに載る方法</span>
            </nav>

            <p className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium tracking-wide text-emerald-700">
              Instagram運用ガイド
            </p>
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              インスタの発見タブに載る方法
              <span className="mt-1 block text-lg font-medium text-emerald-700 sm:text-xl">
                仕組みと最適化の7つのコツ
              </span>
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>{ARTICLE.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={ARTICLE.dateModified}>最終更新 2026.06.19</time>
              <span aria-hidden>·</span>
              <span>{ARTICLE.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
          {/* ── リード文 ─────────────────────────────────── */}
          <p className="text-[1.05rem] leading-loose text-slate-700">
            「フォロワーは少しずつ増えているのに、投稿が伸びない」——その原因の多くは、発見タブに載れていないことにあります。発見タブは、まだあなたをフォローしていない見込み客に投稿を届ける、Instagram最大の入口です。この記事では、発見タブの仕組みから、載るための具体的なコツまでを解説します。
          </p>

          {/* ── 目次 ───────────────────────────────────────── */}
          <nav
            aria-label="目次"
            className="my-10 rounded-2xl border border-slate-150 bg-slate-50/80 p-6"
            style={{ borderColor: "rgb(226 232 240)" }}
          >
            <p className="mb-4 text-sm font-bold tracking-wide text-slate-700">目次</p>
            <ol className="space-y-2.5">
              {toc.map((t, i) => (
                <li key={t.id} className="flex gap-3 text-sm leading-snug">
                  <span className="font-mono text-xs text-emerald-500">{String(i + 1).padStart(2, "0")}</span>
                  <a href={`#${t.id}`} className="text-slate-600 underline-offset-4 hover:text-emerald-700 hover:underline">
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 本文共通スタイル: section ごとに余白・見出し */}
          <div className="space-y-12">
            {/* 発見タブとは */}
            <section id="what-is" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">発見タブとは？</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  発見タブ（Explore）は、Instagramの虫めがねアイコンから開く、おすすめ投稿が並ぶ画面です。ここに表示される投稿は、ユーザーがフォローしていないアカウントのものがほとんど。つまり、発見タブに載るということは、フォロワー以外の新しい層に投稿が届くということです。
                </p>
                <p>
                  通常のフィードはフォロワーにしか届きません。一方、発見タブはInstagramが「この人が好きそう」と判断したユーザーへ自動的に投稿を見せてくれます。フォロワーの数に関係なく、新規リーチを一気に広げられるのが最大の魅力です。
                </p>
              </div>
            </section>

            {/* どんな投稿が表示される */}
            <section id="what-shows" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">発見タブにはどんな投稿が表示される？</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>Instagramは、ユーザー一人ひとりの興味関心に合わせて発見タブの中身を出し分けています。表示されやすいのは、おおまかに次のような投稿です。</p>
                <ul className="space-y-3">
                  {[
                    "似た投稿に「いいね」や「保存」をしたユーザーの興味に合致している",
                    "公開直後から短時間でエンゲージメント（いいね・保存・コメント・シェア）が集まっている",
                    "保存やシェアされている（=「後で見返したい」「人に教えたい」と思われている）",
                    "過去に同じジャンルの投稿が反応を得ている",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  ポイントは、Instagramが「投稿の質」を、ユーザーの反応の速さと深さで判断していることです。いいねよりも保存やシェアのほうが重視される傾向があります。
                </p>
              </div>
            </section>

            {/* Google検索との違い */}
            <section id="vs-google" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">発見タブとGoogle検索の違い</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  SEOに馴染みがある方は、発見タブを「Instagram版の検索結果」とイメージすると分かりやすいです。Googleがキーワードとの関連性でページを並べるのに対し、発見タブはユーザーの行動履歴と投稿への反応をもとに、一人ひとりに最適化して投稿を並べます。
                </p>
                <p>どちらも共通しているのは、「見つけてもらうための最適化」が必要だということ。やみくもに投稿するだけでは載りません。</p>
              </div>
            </section>

            {/* 7つのコツ */}
            <section id="tips" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">発見タブに載るための7つのコツ</h2>
              <ol className="mt-6 space-y-5">
                {tips.map((tip, i) => (
                  <li key={tip.title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{tip.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-slate-600">{tip.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 載らない原因 */}
            <section id="why-not" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">発見タブに「載らない」よくある原因</h2>
              <div className="mt-4 leading-loose text-slate-700">
                <ul className="space-y-3">
                  {[
                    "投稿頻度が低く、Instagramがアカウントを評価できていない",
                    "ジャンルがバラバラで、誰に見せるべきか判断されにくい",
                    "エンゲージメントが伸びず、質の高い投稿と認識されていない",
                    "ハッシュタグがビッグキーワードに偏り、埋もれている",
                    "過度な自動ツールの使用などで、アカウントの評価が下がっている",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">思い当たる項目があれば、まずはそこから改善していくのが近道です。</p>
              </div>
            </section>

            {/* 自力が難しい */}
            <section id="hard" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">自力での運用が難しい理由</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  ここまで読んで、「やることが多くて続けられる気がしない」と感じた方も多いはずです。発見タブ対策は、投稿の質・頻度・タイミング・分析を継続して回し続ける必要があり、本業を抱える店舗オーナーやサロン経営者には大きな負担になります。
                </p>
                <p>実際、多くのアカウントが「正しいやり方は分かったが、リソースがなく続かない」という壁にぶつかります。</p>
              </div>
            </section>

            {/* CTA: プロに任せる */}
            <section id="pro" className="scroll-mt-20">
              <div className="overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white px-7 py-10">
                <h2 className="text-xl font-bold text-emerald-800">プロに任せるという選択肢</h2>
                <p className="mt-4 leading-loose text-slate-600">
                  JEMIAのインスタ運用サブスクなら、発見タブ最適化を専任担当がまるごと代行します。投稿戦略の設計、エンゲージメント向上、ハッシュタグ設計、月次レポートまで対応し、フォロワー以外の見込み客へのリーチを増やします。
                </p>
                <p className="mt-3 leading-loose text-slate-600">
                  月額固定・解約自由で、成果が出なければいつでも解約できます。発見タブからの集客を本気で伸ばしたい方は、まずは無料相談からどうぞ。
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/subscription"
                    className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-bold text-white transition hover:bg-emerald-700"
                  >
                    インスタ運用サブスクを見る →
                  </a>
                  <a
                    href="/subscription#contact"
                    className="rounded-xl border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    無料で相談する →
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-20">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-xl font-bold text-slate-900">よくある質問</h2>
              <div className="mt-5 divide-y divide-slate-150" style={{ borderColor: "rgb(226 232 240)" }}>
                {faqItems.map((item) => (
                  <details key={item.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-800">
                      <span>{item.q}</span>
                      <span aria-hidden className="text-emerald-500 transition group-open:rotate-45">＋</span>
                    </summary>
                    <p className="mt-3 leading-loose text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* 関連リンク（内部リンク強化） */}
          <aside className="mt-14 rounded-2xl border border-slate-100 bg-slate-50/80 p-6">
            <p className="text-sm font-bold text-slate-700">あわせて読みたい</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="/subscription/restaurant" className="text-emerald-700 underline-offset-4 hover:underline">
                  飲食店のインスタ集客を月額固定で代行する方法 →
                </a>
              </li>
              <li>
                <a href="/subscription/salon" className="text-emerald-700 underline-offset-4 hover:underline">
                  美容室のインスタ集客で新規客を増やすには →
                </a>
              </li>
              <li>
                <a href="/subscription" className="text-emerald-700 underline-offset-4 hover:underline">
                  インスタ運用サブスクの料金・プランを見る →
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </article>

      <JemiaFooter />
    </>
  );
}
