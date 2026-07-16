import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/instagram-algorithm-2026";
const TITLE = "【2026年最新】Instagramアルゴリズムの変化｜いま伸ばすべき5つの指標";
const DESC =
  "Instagramは面ごとに別のランキング系統を持ちます。評価の重心が「いいね」から「保存・送信（シェア）」へ移るなか、発見タブ・リールで伸ばすためにいま追うべき5つの指標を、公式の出典つきで解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "Instagramのアルゴリズムは1つですか？",
    a: "いいえ。フィード・ストーリーズ・発見タブ・リールがそれぞれ別のランキング系統で動いています。狙う場所によって効く指標が異なります。",
  },
  {
    q: "2026年にいちばん重要な指標は？",
    a: "目的によりますが、新規リーチでは送信（シェア）と保存、リール表示では視聴時間が重要です。2025年の公式見解では視聴時間・いいね・送信が主要シグナルとされています。",
  },
  {
    q: "毎日投稿しないと表示が下がりますか？",
    a: "投稿頻度そのものより、一貫性と各投稿の反応が重要です。無理な毎日投稿で質が下がるほうがマイナスになり得ます。",
  },
  {
    q: "ハッシュタグは多いほど良いですか？",
    a: "数より関連性です。投稿内容に合った数個で十分で、無関係なタグの乱用はむしろ逆効果になり得ます。",
  },
  {
    q: "フォロワーが少ないと発見タブに載りませんか？",
    a: "発見タブはフォロワー以外に届ける場で、フォロワー数より投稿への反応（保存・シェア）が重要です。少なくても載る可能性は十分あります。",
  },
  {
    q: "アルゴリズム対策より大事なことは？",
    a: "「保存・シェアしたくなる中身」を作ることです。仕様は変わっても、人が反応する良いコンテンツという本質は変わりません。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="instagram-algorithm-2026"
      title={TITLE}
      description={DESC}
      categoryLabel="おすすめ・発見タブ・アルゴリズム"
      categoryColor="#047857"
      published="2026-07-16"
      publishedLabel="2026年7月16日"
      readingTime="約11分"
      campaign="algorithm"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/instagram-explore-tab", title: "インスタのおすすめ・発見タブに載る方法｜仕組みと最適化の7つのコツ" },
        { href: "/subscription/blog/followers-vs-engagement", title: "フォロワー1万人でも売れない？「数」より「反応」の運用術" },
        { href: "/subscription/blog/increase-followers", title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ" },
      ]}
    />
  );
}
