import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/followers-vs-engagement";
const TITLE = "フォロワー1万人でも売れない？「数」より「反応」で伸ばすInstagram運用【2026年】";
const DESC =
  "Instagramは投稿をフォロワー数ではなく反応（保存・シェア・視聴時間）で評価します。公式の主要シグナルを踏まえ、フォロワー数の代わりに追うべきKPIと反応の増やし方を出典つきで解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "フォロワー数は多いほど有利ではないのですか？",
    a: "母数としての意味はありますが、Instagramは投稿を一つひとつの反応で評価するため、フォロワー数が直接の表示要因ではありません。反応率が低ければフォロワーが多くても表示は伸びにくいです。",
  },
  {
    q: "エンゲージメントの中で最も重要な指標は？",
    a: "目的によります。新規リーチを広げたいならシェア（送信）と保存、リールの表示を伸ばすなら視聴時間が重要です。2025年の公式見解では視聴時間・いいね・送信が主要シグナルとされています。",
  },
  {
    q: "フォロワーを買うのは効果がありますか？",
    a: "逆効果です。反応の伴わない数字は反応率を下げ、表示が伸びにくくなるうえ、規約違反で凍結リスクもあります。",
  },
  {
    q: "平均エンゲージメント率の目安はありますか？",
    a: "第三者調査では2025年のInstagram全体平均は約0.48%とされます。ただし業種で差が大きいため、他社比較より自分のアカウントの改善傾向を見るほうが実務的です。",
  },
  {
    q: "反応を増やすのに一番効くのは？",
    a: "「保存・シェアしたくなる中身」を作ることです。手順・比較・チェックリストなど後で見返す価値のある情報や、人に教えたくなる情報を投稿に入れましょう。",
  },
  {
    q: "数と反応、両方を伸ばすには？",
    a: "まず反応率（保存・シェア）を上げ、その濃いコンテンツをリールで新規に広げる順番が効率的です。数は反応の結果としてついてきます。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="followers-vs-engagement"
      title={TITLE}
      description={DESC}
      categoryLabel="集客・運用"
      categoryColor="#155E75"
      published="2026-07-16"
      publishedLabel="2026年7月16日"
      readingTime="約10分"
      campaign="engagement"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/instagram-algorithm-2026", title: "【2026年最新】Instagramアルゴリズムの変化と5つの指標" },
        { href: "/subscription/blog/increase-followers", title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ" },
        { href: "/subscription/blog/agency-guide", title: "Instagram運用代行の選び方｜費用相場・失敗しない比較ポイント" },
      ]}
    />
  );
}
