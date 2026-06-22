import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// ⚠️ 差し替え必須: 既存サイトの共通コンポーネントのパスに合わせてください。
// ────────────────────────────────────────────────────────────────
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

const ARTICLE = {
  url: "https://www.cocomake-guide.com/subscription/blog/agency-guide",
  title: "インスタ運用代行の選び方｜料金相場と失敗しない比較ポイント",
  description:
    "インスタ運用代行の料金相場、サービス内容、失敗しない選び方を解説。自分で運用する場合との比較、契約形態や成果指標のチェックポイントまで、店舗やサロンが依頼前に知っておきたい情報をまとめました。",
  datePublished: "2026-06-22",
  dateModified: "2026-06-22",
  author: "JEMIA編集部",
  readingTime: "約7分",
};

export const metadata: Metadata = {
  title: "インスタ運用代行の選び方｜料金相場と失敗しない比較ポイント【2026年版】",
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
  { id: "what", label: "インスタ運用代行とは" },
  { id: "self-vs", label: "自分で運用 vs 代行を比較" },
  { id: "price", label: "料金相場の目安" },
  { id: "checkpoints", label: "失敗しない7つの選び方" },
  { id: "ng", label: "避けたい業者の特徴" },
  { id: "pro", label: "JEMIAという選択肢" },
  { id: "faq", label: "よくある質問" },
];

// 料金相場の表データ
const priceRows = [
  { plan: "投稿代行のみ", price: "月 3〜10万円", scope: "投稿作成・予約投稿が中心" },
  { plan: "運用代行（標準）", price: "月 10〜30万円", scope: "戦略設計・投稿・分析・改善まで" },
  { plan: "フルサポート", price: "月 30万円〜", scope: "撮影・広告運用・コンサルを含む" },
  { plan: "サブスク型", price: "月 1万円前後〜", scope: "機能を絞り月額固定で継続しやすい" },
];

const checkpoints = [
  { title: "目的に合うサービス範囲か", body: "「投稿だけ」なのか「戦略から分析まで」なのかで料金も成果も大きく変わります。自店が何を任せたいかを先に決めましょう。" },
  { title: "同業種・近い規模の実績があるか", body: "飲食店、美容室など、自店と近い業種での実績は再現性の目安になります。具体的な事例を見せてもらいましょう。" },
  { title: "成果指標（KPI）が明確か", body: "フォロワー数だけでなく、保存・発見タブ流入・来店や問い合わせなど、何を成果とするかを事前にすり合わせます。" },
  { title: "契約期間と解約条件", body: "長期契約の縛りがあると、成果が出なくても続けざるを得ません。解約条件は必ず確認しましょう。" },
  { title: "レポートと連絡体制", body: "毎月の成果レポートがあるか、相談しやすい連絡手段（LINE等）があるかは、運用の質に直結します。" },
  { title: "アカウントの安全性への配慮", body: "過度な自動ツールの使用は凍結リスクを高めます。安全な運用方針を取っているか確認します。" },
  { title: "料金の内訳が明確か", body: "「一式いくら」ではなく、何にいくらかかるのかが明示されている業者は信頼できます。追加費用の有無も確認を。" },
];

const ngItems = [
  "「フォロワー〇万人保証」など、数だけを過度に強調する",
  "実績や事例を具体的に見せられない",
  "長期契約を急かし、解約条件が不透明",
  "料金の内訳がはっきりしない",
  "フォロワー購入など規約違反の手法を使う",
];

const faqItems = [
  {
    q: "インスタ運用代行の料金相場はいくらですか？",
    a: "サービス範囲によって幅があり、投稿代行のみで月3〜10万円、戦略から分析まで含む運用代行で月10〜30万円程度が一般的です。近年は機能を絞り月額固定で続けやすいサブスク型も登場しています。",
  },
  {
    q: "自分で運用するのと、どちらが良いですか？",
    a: "時間とノウハウがあれば自分で運用する選択肢もありますが、企画・撮影・分析・改善を継続するには相応の工数がかかります。本業に集中したい場合は、その時間を時給換算すると代行のほうが結果的に効率的なケースが多いです。",
  },
  {
    q: "成果が出るまでどれくらいかかりますか？",
    a: "アカウントの状況によりますが、多くは数ヶ月単位で変化が見え始めます。短期で劇的な成果を約束する業者には注意し、継続的に改善する姿勢のある依頼先を選ぶのが安心です。",
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

export default function AgencyGuideArticle() {
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
              <span className="text-slate-500">運用代行の選び方</span>
            </nav>
            <p className="mb-3 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium tracking-wide text-cyan-800">
              集客・運用
            </p>
            <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              インスタ運用代行の選び方
              <span className="mt-1 block text-lg font-medium text-cyan-700 sm:text-xl">
                料金相場と失敗しない比較ポイント
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
            インスタ運用代行を検討するとき、まず気になるのが「料金はいくらか」「どこを選べばいいか」です。この記事では、料金相場の目安から、自分で運用する場合との比較、失敗しない選び方のチェックポイントまでを整理します。依頼前の判断材料にしてください。
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
            <section id="what" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">インスタ運用代行とは</h2>
              <div className="mt-4 space-y-4 leading-loose text-slate-700">
                <p>
                  インスタ運用代行とは、Instagramアカウントの投稿作成・戦略設計・分析・改善などを専門の業者が代わりに行うサービスです。投稿だけを請け負うものから、戦略から広告運用まで一貫して任せられるものまで、範囲はさまざまです。
                </p>
                <p>
                  忙しくて手が回らない、ノウハウがなく成果が出ない、といった店舗・サロンが、集客の仕組みづくりを外部に任せる手段として利用されています。
                </p>
              </div>
            </section>

            <section id="self-vs" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">自分で運用 vs 代行を比較</h2>
              <p className="mt-4 leading-loose text-slate-700">
                どちらが良いかは、使える時間とノウハウ次第です。自分で運用すれば費用は抑えられますが、その分の時間と学習コストがかかります。下の比較で、自店の状況に近いほうを考えてみてください。
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900">自分で運用する</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                    <li>◎ 費用を抑えられる</li>
                    <li>◎ お店の想いを直接発信できる</li>
                    <li>△ 企画・撮影・分析に時間がかかる</li>
                    <li>△ ノウハウの習得が必要</li>
                    <li>△ 継続が難しく止まりやすい</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900">代行に任せる</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                    <li>◎ 本業に集中できる</li>
                    <li>◎ プロのノウハウで成果が出やすい</li>
                    <li>◎ 継続的に運用が回る</li>
                    <li>△ 月額の費用がかかる</li>
                    <li>△ 依頼先選びが重要</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="price" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">料金相場の目安</h2>
              <p className="mt-4 leading-loose text-slate-700">
                料金はサービス範囲によって大きく変わります。おおよその目安は次のとおりです。
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">タイプ</th>
                      <th className="px-4 py-3 font-bold">月額の目安</th>
                      <th className="px-4 py-3 font-bold">主な内容</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priceRows.map((r) => (
                      <tr key={r.plan}>
                        <td className="px-4 py-3 font-medium text-slate-800">{r.plan}</td>
                        <td className="px-4 py-3 text-slate-700">{r.price}</td>
                        <td className="px-4 py-3 text-slate-600">{r.scope}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                ※ 相場は一般的な目安です。実際の料金は業者・地域・サービス内容により異なります。
              </p>
            </section>

            <section id="checkpoints" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">失敗しない7つの選び方</h2>
              <ol className="mt-6 space-y-5">
                {checkpoints.map((c, i) => (
                  <li key={c.title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{c.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-slate-600">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="ng" className="scroll-mt-20">
              <h2 className="border-l-4 border-cyan-500 pl-3 text-xl font-bold text-slate-900">避けたい業者の特徴</h2>
              <div className="mt-4 leading-loose text-slate-700">
                <ul className="space-y-3">
                  {ngItems.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-500">✕</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">これらに当てはまる業者は、契約前に慎重に見極めましょう。</p>
              </div>
            </section>

            <section id="pro" className="scroll-mt-20">
              <div className="overflow-hidden rounded-3xl bg-cyan-700 px-7 py-10 text-white">
                <h2 className="text-xl font-bold">JEMIAという選択肢</h2>
                <p className="mt-4 leading-loose text-cyan-50">
                  JEMIAのインスタ運用サブスクは、月額固定・解約自由で続けやすいのが特徴です。発見タブ最適化・いいね代行・分析改善まで専任担当が対応し、契約の縛りがないため、成果を見ながら無理なく続けられます。
                </p>
                <p className="mt-3 leading-loose text-cyan-50">
                  「高額な長期契約はハードルが高い」という店舗・サロンにこそ向いています。まずは無料相談で、自店に合うプランを確認してみてください。
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
                <a href="/subscription/blog/increase-followers" className="text-cyan-700 underline-offset-4 hover:underline">
                  インスタのフォロワーを増やす方法｜土台から作る9つのステップ →
                </a>
              </li>
              <li>
                <a href="/subscription/blog/instagram-explore-tab" className="text-cyan-700 underline-offset-4 hover:underline">
                  インスタの発見タブに載る方法｜仕組みと最適化のコツ →
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
