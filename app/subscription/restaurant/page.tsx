import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// ⚠️ 差し替え必須: 既存サイトの共通コンポーネントのパスに合わせてください。
//    （下のパスは仮置きです。実際のファイル名・場所に書き換えてください）
// ────────────────────────────────────────────────────────────────
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import CtaButtons from "@/components/CtaButtons"; // 「無料で相談する / プラン診断」ボタン群

export const metadata: Metadata = {
  title: "飲食店のインスタ集客を月額固定で代行｜来店につなげるSNS運用｜JEMIA",
  description:
    "飲食店専門のインスタ運用代行サブスク。発見タブ最適化と地域ハッシュタグ攻略で「近くのお店」として見つけてもらい、来店予約につなげます。月額固定・解約自由。居酒屋・カフェ・レストランの集客実績多数。無料相談受付中。",
  alternates: {
    canonical: "https://www.cocomake-guide.com/subscription/restaurant",
  },
  openGraph: {
    title: "飲食店のインスタ集客を月額固定で代行｜JEMIA",
    description:
      "発見タブ最適化と地域ハッシュタグ攻略で、近くのお客様に見つけてもらえるお店へ。月額固定・解約自由。",
    url: "https://www.cocomake-guide.com/subscription/restaurant",
    type: "website",
  },
};

const faqItems = [
  {
    q: "本当に来店や予約につながりますか？",
    a: "発見タブや地域ハッシュタグ経由で、これまで届かなかった近隣の見込み客にお店を見せられるようになります。プロフィールに予約導線（ホットペッパー・食べログ・電話・公式LINEなど）を整えることで、認知から来店への流れを設計します。",
  },
  {
    q: "飲食店でもアカウント凍結のリスクはありませんか？",
    a: "アカウント保護設定のもと、1日あたりの上限を守って安全に運用します。専任担当が業種ごとの適切な運用を行うため、リスクを最小限に抑えています。",
  },
  {
    q: "更新の手間はかかりますか？",
    a: "初期設定から日々の運用まで専任担当が代行します。オーナー様の作業は基本的に不要で、料理と接客に集中いただけます。",
  },
  {
    q: "個人経営の小さなお店でも利用できますか？",
    a: "はい。個人店から多店舗展開のお店まで対応しています。月額固定・解約自由なので、小規模店でも予算を読みながら始められます。",
  },
  {
    q: "どのプランが合うか分かりません。",
    a: "30秒のプラン診断、または無料相談でお店の状況をうかがい、最適なプランをご提案します。まずはお気軽にご相談ください。",
  },
];

const achievementKeywords = [
  "新宿ランチ",
  "渋谷カフェ",
  "大宮居酒屋",
  "川越カフェ",
  "中目黒グルメ",
  "札幌グルメ",
  "すすきのカフェ",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
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
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://www.cocomake-guide.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "インスタ運用サブスク",
          item: "https://www.cocomake-guide.com/subscription",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "飲食店向け",
          item: "https://www.cocomake-guide.com/subscription/restaurant",
        },
      ],
    },
  ],
};

export default function RestaurantSubscriptionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <JemiaHeader />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <section className="text-center">
          <p className="text-sm font-medium text-emerald-700">飲食店向け｜インスタ運用サブスク</p>
          <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">
            飲食店のインスタ集客を、月額固定でまるごと代行
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-600">
            「投稿しても予約につながらない」を、JEMIAが変えます。発見タブ最適化と地域ハッシュタグ攻略で、近くのお客様に見つけてもらえるお店へ。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* 差し替え: <CtaButtons /> もしくは既存のボタンコンポーネント */}
            <a href="/subscription#contact" className="rounded-lg bg-emerald-600 px-6 py-3 text-white">
              無料で相談する →
            </a>
            <a href="/subscription/diagnosis" className="rounded-lg border border-gray-300 px-6 py-3">
              30秒でプラン診断 →
            </a>
          </div>
        </section>

        {/* 悩み */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">飲食店のインスタ、こんな悩みありませんか？</h2>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li>投稿しているのに、フォロワー以外に届かず予約につながらない</li>
            <li>営業や仕込みで忙しく、インスタを更新する時間がない</li>
            <li>「渋谷 居酒屋」などで検索されても、近隣の人気店に埋もれてしまう</li>
            <li>何を投稿すれば来店につながるのか分からない</li>
            <li>一度始めたものの、続かずに放置してしまっている</li>
          </ul>
          <p className="mt-6 leading-relaxed text-gray-600">
            飲食店のインスタ運用でつまずく原因は、味やサービスではなく「見つけてもらう仕組み」がないことです。
          </p>
        </section>

        {/* 理由 */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">JEMIAが飲食店の集客を変える3つの理由</h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold">発見タブで「近くのお店」として見つけてもらう</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Instagramの発見タブは、フォロワー以外の見込み客にお店を届ける最大の入口です。JEMIAは投稿のエンゲージメントを高め、発見タブへの掲載を狙って、来店につながる新規層へのリーチを増やします。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">地域・グルメ系ハッシュタグの攻略</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                「渋谷カフェ」「新宿ランチ」など、エリア×業種のキーワードで上位表示を狙います。お腹を空かせて「今いる場所の近くで店を探している人」に、ちょうど良いタイミングでお店を見せられます。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">簡単チャット対応</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                LINEなどのチャットで、いつでも気軽に相談・依頼ができます。サブスク制で好きな時に利用・解約が可能なので、必要な時だけ無理なく続けられます。
              </p>
            </div>
          </div>
        </section>

        {/* 実績 */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">飲食店アカウントでの実績</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            JEMIAは飲食店をはじめ3000以上のアカウントを運用してきました。地域×グルメのキーワードで多数の上位表示実績があります。
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {achievementKeywords.map((kw) => (
              <span key={kw} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800">
                {kw}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold">3倍</p>
              <p className="mt-1 text-sm text-gray-600">平均フォロワー増加（3ヶ月）</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold">340%</p>
              <p className="mt-1 text-sm text-gray-600">発見タブ リーチ増加率</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-5 text-center">
              <p className="text-2xl font-bold">4.9 / 5</p>
              <p className="mt-1 text-sm text-gray-600">顧客満足度</p>
            </div>
          </div>

          <blockquote className="mt-8 border-l-4 border-emerald-400 pl-4 text-gray-700">
            <p className="text-amber-500">★★★★★</p>
            <p className="mt-2 leading-relaxed">
              「新宿 居酒屋」での検索で表示される機会が増え、インスタ経由でのご予約が入るようになりました。以前は認知してもらう手段がなかったので助かっています。
            </p>
            <footer className="mt-2 text-sm text-gray-500">——都内・飲食店店長様（導入3ヶ月）</footer>
          </blockquote>
        </section>

        {/* 流れ */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">ご利用までの流れ</h2>
          <ol className="mt-6 space-y-5">
            <li>
              <p className="font-semibold">1. 無料相談</p>
              <p className="mt-1 text-gray-600">LINEまたはフォームから、お店の現状をヒアリング。最適なプランをご提案。</p>
            </li>
            <li>
              <p className="font-semibold">2. プラン選択・決済</p>
              <p className="mt-1 text-gray-600">ご希望のプランを選んでオンライン決済。</p>
            </li>
            <li>
              <p className="font-semibold">3. 設定・運用開始</p>
              <p className="mt-1 text-gray-600">最短翌日からスタート。初期設定はすべて担当が対応、お店側の作業は不要。</p>
            </li>
            <li>
              <p className="font-semibold">4. レポート・改善</p>
              <p className="mt-1 text-gray-600">毎月の成果レポートで、来店につながる運用へ継続改善。</p>
            </li>
          </ol>
          <div className="mt-8">
            {/* 料金は本体LPへ内部リンク（重複コンテンツ回避・料金の一元管理） */}
            <a href="/subscription#plans" className="font-medium text-emerald-700 underline">
              料金プランを見る →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">飲食店のインスタ集客でよくある質問</h2>
          <div className="mt-6 divide-y divide-gray-200">
            {faqItems.map((item) => (
              <details key={item.q} className="py-4">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="mt-3 leading-relaxed text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-2xl bg-gray-50 px-6 py-12 text-center">
          <h2 className="text-2xl font-bold">まずは無料で相談してみませんか？</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            飲食店のインスタ集客でお悩みなら、まずはフォームからお気軽にどうぞ。翌営業日以内に返信します。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/subscription#contact" className="rounded-lg bg-emerald-600 px-6 py-3 text-white">
              無料で相談する →
            </a>
            <a href="/subscription/diagnosis" className="rounded-lg border border-gray-300 px-6 py-3">
              まずプラン診断する →
            </a>
          </div>
        </section>
      </main>

      <JemiaFooter />
    </>
  );
}
