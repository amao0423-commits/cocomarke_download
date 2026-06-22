import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// ⚠️ 差し替え必須: 既存サイトの共通コンポーネントのパスに合わせてください。
// ────────────────────────────────────────────────────────────────
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

const ARTICLE = {
  url: "https://www.cocomake-guide.com/subscription/blog/increase-followers",
  title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ",
  description:
    "インスタのフォロワーを増やす方法を、小手先のテクニックではなく続く土台づくりの視点で解説。プロフィール設計・投稿の一貫性・ハッシュタグ・継続の仕組みまで、店舗やサロンが実践できる9ステップを紹介します。",
  datePublished: "2026-06-22",
  dateModified: "2026-06-22",
  author: "JEMIA編集部",
  readingTime: "約8分",
};

export const metadata: Metadata = {
  title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ【2026年版】",
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

const toc = [
  { id: "why", label: "なぜフォロワーが増えないのか" },
  { id: "foundation", label: "増やす前に整える3つの土台" },
  { id: "steps", label: "フォロワーを増やす9つのステップ" },
  { id: "ng", label: "やってはいけないNG行動" },
  { id: "hard", label: "続けるのが難しい理由" },
  { id: "pro", label: "プロに任せるという選択肢" },
  { id: "faq", label: "よくある質問" },
];

const foundations = [
  {
    title: "プロフィールを「3秒で伝わる」形に",
    body: "訪問者の多くはプロフィールを見て数秒でフォローするか決めます。何のアカウントか・誰に役立つかが一目で分かる名前と説明文、そして導線（予約・問い合わせ）を整えることが最初の一歩です。",
  },
  {
    title: "発信ジャンルを1つに絞る",
    body: "あれもこれも投稿するとアカウントの軸がぼやけ、フォローする理由が伝わりません。ジャンルを絞ることで「この情報が欲しいからフォローする」という動機が生まれます。",
  },
  {
    title: "フォローしたくなる「価値」を決める",
    body: "役立つ情報、共感できる世界観、お得な特典など、フォローし続けるメリットを明確にします。価値が定まると、投稿の方向性も自然に決まります。",
  },
];

const steps = [
  { title: "プロフィールを最適化する", body: "アカウント名に検索されたいキーワードを含め、説明文で「誰に何を届けるか」を明示。ハイライトで実績や事例をまとめます。" },
  { title: "投稿のジャンルとトーンを統一する", body: "色味・文字フォント・話し方を揃えると、フィードに統一感が生まれ、プロフィール訪問時の信頼につながります。" },
  { title: "保存される投稿をつくる", body: "ノウハウ・まとめ・比較など「後で見返したい」と思われる投稿は保存され、リーチが伸びてフォローにつながります。" },
  { title: "リールで新規リーチを広げる", body: "リールはフォロワー外に届きやすいフォーマット。冒頭2秒で内容を伝え、最後まで見てもらう構成を意識します。" },
  { title: "ハッシュタグを戦略的に設計する", body: "投稿数の多い大タグだけでなく、エリアやニッチの中・小タグを混ぜることで、見込み客に届きやすくなります。" },
  { title: "投稿の頻度とタイミングを安定させる", body: "フォロワーが見ている時間帯に、一定の頻度で投稿を継続。アルゴリズムにアカウントを正しく評価してもらえます。" },
  { title: "ストーリーズで接点を増やす", body: "日常やお店の様子、質問スタンプなどでフォロワーとの距離を縮め、関係を深めることで離脱を防ぎます。" },
  { title: "コメント・DMに丁寧に反応する", body: "反応への返信はエンゲージメントを高め、ファン化を促進します。コミュニケーションの積み重ねが定着率を上げます。" },
  { title: "数字を振り返り改善を続ける", body: "インサイトで保存数・リーチ・プロフィール遷移を確認し、伸びた投稿の傾向を次に活かします。改善の継続が成長の鍵です。" },
];

const ngItems = [
  "フォロワーを購入する（休眠アカウントが増え、エンゲージメント率がむしろ低下）",
  "相互フォロー狙いの大量フォロー（アカウント評価が下がり凍結リスクも）",
  "ジャンルがバラバラの投稿（フォローする理由が伝わらない）",
  "投稿が不定期で止まりがち（アルゴリズムに評価されにくい）",
];

const faqItems = [
  {
    q: "フォロワーは何ヶ月で増えますか？",
    a: "アカウントの状況や投稿の質・頻度によって異なりますが、土台を整えて継続的に運用することで、数ヶ月単位で変化を感じられるケースが多いです。短期間で急増させるより、ファンとして定着する増やし方が結果的に成果につながります。",
  },
  {
    q: "フォロワーを買うのはダメですか？",
    a: "おすすめしません。購入したフォロワーは投稿に反応しないため、エンゲージメント率が下がり、アルゴリズム評価にも悪影響です。結果として本当に届けたい層に届きにくくなります。",
  },
  {
    q: "フォロワーが少なくても集客できますか？",
    a: "はい。フォロワー数よりも、見込み客に届いているか・反応があるかが重要です。発見タブや保存を意識した運用で、少ないフォロワーでも来店や問い合わせにつなげることは可能です。",
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
      publisher: { "@type": "Organization", name: "JEMIA", url: "https://www.cocomake-guide.com/subscription" },
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

export default function IncreaseFollowersArticle() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <JemiaHeader />

      <article className="bg-white text-slate-800">
        <header className="border-b border-slate-100 bg-gradient-to-b from-cyan-50/60 to-white">
          <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/subscription" className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href="/subscription/blog" className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">フォロワーを増やす方法</span>
            </nav>
            <p className="mb-3 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium tracking-wide text-cyan-800">
              集客・運用
            </p>
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              インスタのフォロワーを増やす方法
              <span className="mt-1 block text-lg font-medium text-cyan-700 sm:text-xl">
                土台から作る9つのステップ
              </span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>{ARTICLE.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={ARTICLE.dateModified}>最終更新 2026.06.22</time>
              <span aria-hidden>·</span>
              <span>{ARTICLE.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
          <p className="text-[1.05rem] leading-loose text-slate-700">
            「投稿しているのにフォロワーが増えない」——その多くは、投稿テクニック以前にアカウントの土台が整っていないことが原因です。この記事では、小手先の小技ではなく、フォロワーが自然に増え続ける土台づくりを9つのステップで解説します。
          </p>

          <nav aria-label="目次" className="my-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
            <p className="mb-4 text-sm font-bold tracking-wide text-slate-700">目次</p>
            <ol className="space-y-2.5">
              {toc.map((t, i) => (
                <li key={t.id} className="flex gap-3 text-sm leading-snug">
                  <span className="font-mono text-xs text-cyan-500">{String(i + 1).padStart(2, "0")}</span>
                  <a href={`#${t.id}`} className="text-slate-600 underline-offset-4 hover:text-cyan-700 hover:underline">
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            <section id="why" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">なぜフォロワーが増えないのか</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  フォロワーが増えない原因は、投稿の量ではなく「フォローする理由が伝わっていない」ことにあります。たまたま投稿を見た人がプロフィールを訪れたとき、何のアカウントで、フォローすると何が得られるのかが一目で分からなければ、その人は離れてしまいます。
                </p>
                <p>
                  つまり、フォロワーを増やすには「投稿を見られる」工夫と「見た人がフォローしたくなる」設計の両方が必要です。次の章から、その土台を順に整えていきます。
                </p>
              </div>
            </section>

            <section id="foundation" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">増やす前に整える3つの土台</h2>
              <div className="mt-6 space-y-4">
                {foundations.map((f) => (
                  <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="font-bold text-slate-900">{f.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-600">{f.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="steps" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">フォロワーを増やす9つのステップ</h2>
              <ol className="mt-6 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{s.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-slate-600">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="ng" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">やってはいけないNG行動</h2>
              <div className="mt-4 leading-loose text-slate-700">
                <ul className="space-y-3">
                  {ngItems.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-500">✕</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">数字だけを追うと、かえって遠回りになります。ファンとして定着する増やし方を選びましょう。</p>
              </div>
            </section>

            <section id="hard" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">続けるのが難しい理由</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  ここまでのステップは、どれも一度やって終わりではなく、続けることで効果が出るものです。投稿の企画・撮影・分析・改善を回し続けるのは、本業を持つ店舗オーナーやサロン経営者にとって大きな負担になります。
                </p>
                <p>多くの方が「やり方は分かったが、時間がなくて続かない」という壁にぶつかります。</p>
              </div>
            </section>

            <section id="pro" className="scroll-mt-20">
              <div className="overflow-hidden rounded-3xl bg-cyan-700 px-7 py-10 text-white">
                <h2 className="text-xl font-bold">プロに任せるという選択肢</h2>
                <p className="mt-4 leading-loose text-cyan-50">
                  JEMIAのインスタ運用サブスクなら、プロフィール設計から投稿戦略、発見タブ最適化、分析改善まで専任担当が代行します。土台づくりも日々の運用もまるごとお任せいただけます。
                </p>
                <p className="mt-3 leading-loose text-cyan-50">
                  月額固定・解約自由で、成果が出なければいつでも解約できます。フォロワーを本気で増やしたい方は、まずは無料相談からどうぞ。
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a href="/subscription" className="rounded-xl bg-white px-6 py-3 text-center font-bold text-cyan-700 transition hover:bg-cyan-50">
                    インスタ運用サブスクを見る →
                  </a>
                  <a href="/subscription#contact" className="rounded-xl border border-cyan-300/60 px-6 py-3 text-center font-bold text-white transition hover:bg-cyan-600">
                    無料で相談する →
                  </a>
                </div>
              </div>
            </section>

            <section id="faq" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">よくある質問</h2>
              <div className="mt-5 divide-y divide-slate-200">
                {faqItems.map((item) => (
                  <details key={item.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-800">
                      <span>{item.q}</span>
                      <span aria-hidden className="text-cyan-500 transition group-open:rotate-45">＋</span>
                    </summary>
                    <p className="mt-3 leading-loose text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="mt-14 rounded-2xl border border-slate-100 bg-slate-50/80 p-6">
            <p className="text-sm font-bold text-slate-700">あわせて読みたい</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="/subscription/blog/instagram-explore-tab" className="text-cyan-700 underline-offset-4 hover:underline">
                  インスタの発見タブに載る方法｜仕組みと最適化のコツ →
                </a>
              </li>
              <li>
                <a href="/subscription/blog/agency-guide" className="text-cyan-700 underline-offset-4 hover:underline">
                  インスタ運用代行の選び方｜料金相場と失敗しない比較ポイント →
                </a>
              </li>
              <li>
                <a href="/subscription" className="text-cyan-700 underline-offset-4 hover:underline">
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
