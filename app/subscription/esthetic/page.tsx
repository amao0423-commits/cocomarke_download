import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// ⚠️ 差し替え必須: 既存サイトの共通コンポーネントのパスに合わせてください。
// ────────────────────────────────────────────────────────────────
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import CtaButtons from "@/components/CtaButtons";

export const metadata: Metadata = {
  title: "エステ・ネイルサロンのインスタ集客を月額固定で代行｜新規客を増やすSNS運用｜JEMIA",
  description:
    "エステ・ネイルサロン専門のインスタ運用代行サブスク。発見タブ最適化とエリア×メニューのハッシュタグ攻略で、新規のお客様に見つけてもらい来店につなげます。月額固定・解約自由。ブライダルエステ・小顔矯正・アートメイク・ネイルの集客実績多数。無料相談受付中。",
  alternates: {
    canonical: "https://www.cocomake-guide.com/subscription/esthetic",
  },
  openGraph: {
    title: "エステ・ネイルサロンのインスタ集客を月額固定で代行｜JEMIA",
    description:
      "発見タブ最適化とメニュー別ハッシュタグ攻略で、サロンを探しているお客様に見つけてもらえるサロンへ。月額固定・解約自由。",
    url: "https://www.cocomake-guide.com/subscription/esthetic",
    type: "website",
  },
};

const faqItems = [
  {
    q: "本当に新規のお客様につながりますか？",
    a: "発見タブやエリア×メニューのハッシュタグ経由で、これまで届かなかった見込み客にサロンを見せられるようになります。プロフィールに予約導線（ホットペッパービューティー・公式LINE・電話など）を整えることで、認知から来店予約への流れを設計します。",
  },
  {
    q: "得意メニューの強みは打ち出せますか？",
    a: "はい。小顔矯正・ブライダルエステ・アートメイク・ニュアンスネイルなど、サロンの得意分野に合わせたキーワード設計と投稿戦略を組み立て、その悩みや目的を持つお客様に届くよう運用します。",
  },
  {
    q: "ビフォーアフターの投稿も活かせますか？",
    a: "はい。施術前後の写真やリールは発見タブで反応を得やすい強力な素材です。見せ方や投稿のタイミングを最適化し、保存・シェアにつながる運用でリーチを伸ばします。",
  },
  {
    q: "エステ・ネイルサロンでもアカウント凍結のリスクはありませんか？",
    a: "アカウント保護設定のもと、1日あたりの上限を守って安全に運用します。専任担当が業種ごとの適切な運用を行うため、リスクを最小限に抑えています。",
  },
  {
    q: "個人サロンや自宅サロンでも利用できますか？",
    a: "はい。個人サロン・自宅サロンから多店舗展開のサロンまで対応しています。月額固定・解約自由なので、小規模でも予算を読みながら始められます。",
  },
];

const achievementKeywords = [
  "ブライダルエステ",
  "小顔矯正",
  "アートメイク",
  "ネイルサロン",
  "姿勢改善",
  "韓国式足裏角質ケア",
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
          name: "エステ・ネイル向け",
          item: "https://www.cocomake-guide.com/subscription/esthetic",
        },
      ],
    },
  ],
};

export default function EstheticSubscriptionPage() {
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
          <p className="text-sm font-medium text-emerald-700">エステ・ネイル向け｜インスタ運用サブスク</p>
          <h1 className="mt-3 text-3xl font-bold leading-snug sm:text-4xl">
            エステ・ネイルサロンのインスタ集客を、月額固定でまるごと代行
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-600">
            「ビフォーアフターを載せても新規予約につながらない」を、JEMIAが変えます。発見タブ最適化とメニュー別ハッシュタグ攻略で、サロンを探しているお客様に見つけてもらえるサロンへ。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          <h2 className="text-2xl font-bold">エステ・ネイルサロンのインスタ、こんな悩みありませんか？</h2>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li>施術写真やビフォーアフターを載せても、フォロワー以外に届かず新規につながらない</li>
            <li>施術や接客で手一杯で、投稿やリールを更新する時間がない</li>
            <li>「渋谷 エステ」「ネイルサロン」などで検索されても、近隣の人気店に埋もれてしまう</li>
            <li>得意メニュー（小顔矯正・ブライダルエステ・アートメイク・ニュアンスネイルなど）の強みが伝わっていない</li>
            <li>続けてはいるが、予約という成果につながっている実感がない</li>
          </ul>
          <p className="mt-6 leading-relaxed text-gray-600">
            エステ・ネイルサロンのインスタ運用でつまずく原因は、技術や仕上がりではなく「強みを見込み客に届ける仕組み」がないことです。
          </p>
        </section>

        {/* 理由 */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">JEMIAがエステ・ネイルサロンの集客を変える3つの理由</h2>
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold">発見タブで「新しいお客様」に見つけてもらう</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Instagramの発見タブは、まだフォロワーではない見込み客にサロンを届ける最大の入口です。JEMIAは投稿のエンゲージメントを高めて発見タブ掲載を狙い、来店につながる新規層へのリーチを増やします。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">エリア×メニューのハッシュタグ攻略</h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                「小顔矯正」「ブライダルエステ」「アートメイク」「ネイルサロン」など、地域と得意メニューのキーワードで上位表示を狙います。「自分の悩みや目的に合うサロンを探している人」に、ぴったりのタイミングで強みを見せられます。
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
          <h2 className="text-2xl font-bold">エステ・ネイルサロンアカウントでの実績</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            JEMIAはエステ・ネイルサロンをはじめ3000以上のアカウントを運用してきました。エリア×メニューのキーワードで多数の上位表示実績があります。
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

          {/* エステ・ネイルの利用者の声があれば差し替え */}
          <blockquote className="mt-8 border-l-4 border-emerald-400 pl-4 text-gray-700">
            <p className="text-amber-500">★★★★★</p>
            <p className="mt-2 leading-relaxed">
              フォロワー以外の方からの保存やコメントが増えてきた実感があります。発見タブからの流入が増えているのをインサイトで確認できています。
            </p>
            <footer className="mt-2 text-sm text-gray-500">——個人ブランディング中のお客様（導入2ヶ月）</footer>
          </blockquote>
        </section>

        {/* 流れ */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">ご利用までの流れ</h2>
          <ol className="mt-6 space-y-5">
            <li>
              <p className="font-semibold">1. 無料相談</p>
              <p className="mt-1 text-gray-600">LINEまたはフォームから、サロンの現状をヒアリング。最適なプランをご提案。</p>
            </li>
            <li>
              <p className="font-semibold">2. プラン選択・決済</p>
              <p className="mt-1 text-gray-600">ご希望のプランを選んでオンライン決済。</p>
            </li>
            <li>
              <p className="font-semibold">3. 設定・運用開始</p>
              <p className="mt-1 text-gray-600">最短翌日からスタート。初期設定はすべて担当が対応、サロン側の作業は不要。</p>
            </li>
            <li>
              <p className="font-semibold">4. レポート・改善</p>
              <p className="mt-1 text-gray-600">毎月の成果レポートで、新規予約につながる運用へ継続改善。</p>
            </li>
          </ol>
          <div className="mt-8">
            <a href="/subscription#plans" className="font-medium text-emerald-700 underline">
              料金プランを見る →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold">エステ・ネイルサロンのインスタ集客でよくある質問</h2>
          <div className="mt-6 divide-y divide-gray-200">
            {faqItems.map((item) => (
              <details key={item.q} className="py-4">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="mt-3 leading-relaxed text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 注意: エステ・美容医療系は薬機法・景表法に配慮。効果の断定表現を避ける運用ガイドを別途用意 */}

        {/* CTA */}
        <section className="mt-20 rounded-2xl bg-gray-50 px-6 py-12 text-center">
          <h2 className="text-2xl font-bold">まずは無料で相談してみませんか？</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            エステ・ネイルサロンのインスタ集客でお悩みなら、まずはフォームからお気軽にどうぞ。翌営業日以内に返信します。
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
