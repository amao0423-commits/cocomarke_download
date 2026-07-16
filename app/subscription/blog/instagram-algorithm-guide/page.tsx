import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/instagram-algorithm-guide";
const TITLE = "【2026年版】Instagramアルゴリズムの仕組みを完全解説｜公式発言から読み解く伸びる投稿の条件";
const DESC =
  "Instagramに単一のアルゴリズムは存在しません。フィード・ストーリーズ・リール・発見タブそれぞれの評価軸を、アダム・モッセーリ氏の公式発言など一次情報だけで整理。2026年に伸びる投稿の条件を解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "Instagramのアルゴリズムは1つですか？",
    a: "いいえ。フィード・ストーリーズ・リール・発見タブがそれぞれ別の目的を持ち、別々のランキング系統で動いています。狙う面によって効くシグナルが異なります。",
  },
  {
    q: "2026年に最も重視される指標は何ですか？",
    a: "面によります。リールでは特にDMでのシェア（送信）と視聴時間、フィード・発見タブでは保存とシェアが重要です。受け身のいいねより、能動的な反応が効きます。",
  },
  {
    q: "ハッシュタグは何個付ければいいですか？",
    a: "3〜5個で十分です。ハッシュタグはかつてほどリーチを増やさないため、30個貼るより、その工数をキャプションや投稿設計に回すほうが効果的です。",
  },
  {
    q: "フォロワーを増やせば表示されるようになりますか？",
    a: "いいえ。Instagramは推薦型に移行し、投稿を一つひとつの反応で評価します。フォロワー数は直接の表示要因ではなく、保存・シェアされる投稿かどうかが重要です。",
  },
  {
    q: "動画（リール）ばかり優遇されているのですか？",
    a: "誤解です。Instagramは形式ではなく反応で評価します。リールは新規リーチに強い一方、カルーセルは保存されやすく、役割が違います。両方を使い分けるのが効果的です。",
  },
  {
    q: "投稿頻度は多いほどいいですか？",
    a: "頻度そのものより、一貫性と各投稿の質・反応が重要です。無理な連続投稿で質が落ちるより、続けられるペースで反応される投稿を出すほうが伸びます。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="instagram-algorithm-guide"
      title={TITLE}
      description={DESC}
      categoryLabel="おすすめ・発見タブ・アルゴリズム"
      categoryColor="#047857"
      published="2026-07-15"
      publishedLabel="2026年7月15日"
      readingTime="約13分"
      campaign="algorithm_guide"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/subscription-vs-traditional", title: "運用代行のサブスク型と従来型、どっちが得？費用比較" },
        { href: "/subscription/blog/is-agency-worth-it", title: "Instagram運用代行は意味ない？成果が出ない本当の理由" },
        { href: "/subscription/blog/in-house-vs-outsourcing", title: "内製 vs 外注、Instagram運用のコストを本気で比較" },
      ]}
    />
  );
}
