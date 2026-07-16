import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/agency-guide";
const TITLE = "Instagram運用代行の選び方｜費用相場・失敗しない比較ポイント【2026年】";
const DESC =
  "Instagram運用代行の費用相場（各社の公表値）、依頼できる業務、代理店・フリーランス・サブスク型の違い、失敗しない選び方チェックリストを整理。自社が代行すべきか、どのタイプに頼むべきかを判断できます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "Instagram運用代行の費用相場は？",
    a: "依頼先のタイプで大きく異なります。各社の公表値では、代理店で月20〜50万円、フリーランスで月5〜10万円、サブスク型で月数千円〜数万円が目安です。いずれも自己申告値で、業務範囲により変動します。",
  },
  {
    q: "代理店・フリーランス・サブスク型の違いは？",
    a: "代理店はフルカスタムで大規模施策に強く費用も高め、フリーランスは柔軟だが品質が担当者依存、サブスク型は業務を枠で固定して月額固定・始めやすいのが特徴です。中小・店舗・個人事業主にはサブスク型が向きやすいです。",
  },
  {
    q: "「運用代行は意味がない」と聞きますが本当ですか？",
    a: "戦略設計・制作・分析・改善の4工程がそろい、依頼側も適切に関与した場合にのみ意味があります。制作だけを丸投げし、KPIをフォロワー数にすると成果は出にくくなります。",
  },
  {
    q: "依頼から運用開始までどれくらいかかりますか？",
    a: "ヒアリング・契約・初期設定を経て、一般に数日〜2週間ほどです。サブスク型では初期設定を担当が行い、最短で翌日〜数日で開始できる場合もあります。",
  },
  {
    q: "契約期間の縛りはありますか？",
    a: "代理店は半年〜1年契約が多く、サブスク型は月単位・最短1ヶ月から始められるものが一般的です。契約前に最低契約期間と解約条件を必ず確認してください。",
  },
  {
    q: "どんなKPIで成果を測るべきですか？",
    a: "フォロワー数だけでなく、保存・シェア・プロフィールアクセス・リンククリック・問い合わせ数まで含めるべきです。これらが売上につながる指標です。",
  },
  {
    q: "自社（内製）と外注、どちらが得ですか？",
    a: "内製は工数を積み上げると実質的な人件費が発生します。SNS専任がおらず、担当者の本業のほうが価値が高いなら外注が合理的です。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="agency-guide"
      title={TITLE}
      description={DESC}
      categoryLabel="運用代行の選び方"
      categoryColor="#334155"
      published="2026-07-15"
      publishedLabel="2026年7月15日"
      readingTime="約11分"
      campaign="agency"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/subscription-vs-traditional", title: "【比較】Instagram運用代行の「サブスク型」と「従来型」どっちが得？費用相場を検証" },
        { href: "/subscription/blog/is-agency-worth-it", title: "Instagram運用代行は意味ない？成果が出ない本当の理由" },
        { href: "/subscription/blog/in-house-vs-outsourcing", title: "内製 vs 外注、Instagram運用のコストを本気で比較" },
      ]}
    />
  );
}
