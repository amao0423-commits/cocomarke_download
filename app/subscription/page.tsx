import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "サブスク型インスタ運用代行｜月額固定で代行・フォロワー増・おすすめ・発見タブ最適化｜JEMIA",
  description: "インスタ運用をプロにまるごとお任せできる月額サブスク。いいね代行・おすすめ・発見タブ最適化・LINE相談まで対応。契約縛りなし・解約自由で、平均3倍のフォロワー増加。導入3000アカウント突破。無料相談受付中。",
  alternates: {
    canonical: "https://www.cocomake-guide.com/subscription",
  },
};

const BASE = "https://www.cocomake-guide.com";

/* 構造化データ用（SubscriptionClient の表示内容と一致させること） */
const PLANS = [
  { name: "いいね代行プラン", price: 9800, desc: "ターゲット層への自動いいねで認知を拡大。フォロワーへの返しいいねも対応。アカウント保護設定付き。" },
  { name: "発見表示ブーストプラン", price: 19800, desc: "投稿の初速エンゲージメントを高め、おすすめ・発見タブへの掲載確率を劇的に向上。新規リーチを最大化。" },
  { name: "セットプラン", price: 24800, desc: "いいね代行と発見ブーストを同時運用し、相乗効果で成果を最大化。最もコスパが良い組み合わせ。" },
  { name: "リスト上位表示プラン", price: 29800, desc: "狙ったキーワード検索でアカウントが上位表示されるよう最適化。地域×業種キーワードの独占を目指す。" },
  { name: "プレミアムプラン", price: 49800, desc: "全プランの機能に加え、専任コンサルタントが戦略立案から実行まで伴走。最短で最大の成果を狙う。" },
];

const FAQS = [
  { q: "いつでも解約できますか？", a: "はい、月単位での契約ですので翌月分から解約が可能です。違約金や解約手数料は一切かかりません。" },
  { q: "効果が出るまでどれくらいかかりますか？", a: "多くのお客様で1〜2ヶ月以内に数値の改善が見られます。特におすすめ・発見タブへの掲載は早いケースで2〜3週間で効果が出始めます。" },
  { q: "アカウントが凍結されるリスクはありませんか？", a: "Instagramのガイドラインに準拠した安全な手法のみを使用しています。過去3000件以上の導入で凍結事例はゼロです。" },
  { q: "支払い方法は何に対応していますか？", a: "クレジットカード（VISA・Mastercard・JCB）および銀行振込に対応しています。" },
  { q: "個人アカウントでも利用できますか？", a: "はい、個人・法人を問わずご利用いただけます。ビジネスアカウントへの切り替えを推奨しています（無料でサポートします）。" },
  { q: "上位表示を保証してくれますか？", a: "成果保証は一切しておりません。これはインスタグラムによるアルゴリズム（検索順位決定の仕様）で順位が決定されていく為、保証は不可能である為です。また、上位表示を達成したとしても、アルゴリズム変動によって順位変動する可能性は常に存在します。そのため、常にインスタグラムのアルゴリズムおよび、SEO状況の現状把握と変動時の対応を続けていく必要があることをご理解ください。" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "サブスク型インスタ運用代行", item: `${BASE}/subscription` },
      ],
    },
    {
      // Google はレビュー/評価を Service 型では認識しないため Product 型で表現
      "@type": "Product",
      "@id": `${BASE}/subscription#product`,
      name: "サブスク型インスタ運用代行 JEMIA",
      description: "月額固定でインスタ運用をまるごとお任せできるサブスク。いいね代行・おすすめ・発見タブ最適化・リスト上位表示・LINE相談まで対応。契約縛りなし・解約自由。",
      url: `${BASE}/subscription`,
      image: [`${BASE}/ogp.png`],
      brand: { "@type": "Brand", name: "JEMIA" },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "20",
        bestRating: "5",
        worstRating: "1",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "JPY",
        lowPrice: Math.min(...PLANS.map((p) => p.price)),
        highPrice: Math.max(...PLANS.map((p) => p.price)),
        offerCount: PLANS.length,
        offers: PLANS.map((p) => ({
          "@type": "Offer",
          name: p.name,
          description: p.desc,
          price: p.price,
          priceCurrency: "JPY",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: p.price,
            priceCurrency: "JPY",
            unitText: "月",
            billingDuration: "P1M",
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function SubscriptionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubscriptionClient />
    </>
  );
}
