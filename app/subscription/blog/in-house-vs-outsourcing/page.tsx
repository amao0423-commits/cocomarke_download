import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/in-house-vs-outsourcing";
const TITLE = "Instagram運用を内製 vs 外注、コストを本気で比較してみた";
const DESC =
  "Instagram運用を内製した場合の工数を積み上げて試算。月約76時間＝実質20万円前後の人件費に加え、機会費用・学習コスト・属人化リスクまで含めて外注と比較します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "Instagram運用を内製すると、月にどれくらいの工数がかかりますか？",
    a: "本記事の試算（週2〜3投稿・リール含む標準的な運用）では、企画・撮影・編集・投稿・分析まで含めて月約76時間が目安です。所要時間は投稿本数や習熟度で変わります。",
  },
  {
    q: "内製は本当に「月0円」ですか？",
    a: "いいえ。人件費が発生していないように見えるだけで、月約76時間を年収400万円クラスの社員が担当すれば、実質的に月15〜26万円相当の人件費がかかっています。",
  },
  {
    q: "内製と外注、どちらが安いですか？",
    a: "一概には言えません。専任者を置ける企業なら内製、置けず片手間になる企業は外注のほうが総コストで有利になりがちです。最も損をするのは片手間の内製です。",
  },
  {
    q: "ハイブリッド（一部だけ外注）はできますか？",
    a: "できます。戦略設計と分析・改善を外注し、現場の素材を活かす制作・投稿は自社で行う形が、飲食店・美容室など現場が強い業種では合理的です。",
  },
  {
    q: "将来的に内製化したい場合、外注先はどう選べばいいですか？",
    a: "「なぜその投稿にしたか」を説明し、判断根拠をレポートに残し、テンプレや管理権限を共有してくれる会社を選びましょう。ブラックボックス運用の会社だと外注から抜けられなくなります。",
  },
  {
    q: "外注は月いくらから可能ですか？",
    a: "サブスク型なら月数千円〜数万円、従来型の代理店は各社公表値で初期10〜30万円＋月額20〜50万円が目安です。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="in-house-vs-outsourcing"
      title={TITLE}
      description={DESC}
      categoryLabel="運用代行の選び方"
      categoryColor="#334155"
      published="2026-07-15"
      publishedLabel="2026年7月15日"
      readingTime="約10分"
      campaign="agency_inhouse"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/instagram-algorithm-guide", title: "【2026年版】Instagramアルゴリズムの仕組みを完全解説" },
        { href: "/subscription/blog/subscription-vs-traditional", title: "運用代行のサブスク型と従来型、どっちが得？費用比較" },
        { href: "/subscription/blog/is-agency-worth-it", title: "Instagram運用代行は意味ない？成果が出ない本当の理由" },
      ]}
    />
  );
}
