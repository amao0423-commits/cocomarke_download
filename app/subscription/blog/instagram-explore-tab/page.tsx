import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/instagram-explore-tab";
const TITLE = "インスタのおすすめ・発見タブに載る方法｜仕組みと最適化の7つのコツ【2026年】";
const DESC =
  "発見タブ（おすすめ）はフォロワー以外の見込み客に投稿を届ける最大の入口。フィードとは別のランキングで動く仕組みと、載るための具体的な7つのコツを、公式の出典つきで解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "発見タブとフィードは何が違いますか？",
    a: "フィードは主にフォロー中の相手との場、発見タブはまだつながっていない新しい相手に出会う場です。別々のランキング系統で動き、発見タブでは新規に反応されそうかが重視されます。",
  },
  {
    q: "フォロワーが少なくても発見タブに載りますか？",
    a: "載ります。発見タブはフォロワー数より投稿への反応（保存・シェア）を重視するため、フォロワーが少なくても反応の濃い投稿は表示される可能性があります。",
  },
  {
    q: "発見タブに載るのに一番効く指標は？",
    a: "保存とシェア（送信）です。「後で見返したい」「人に教えたい」と思わせる投稿が、似た興味の新規ユーザーへ広がります。",
  },
  {
    q: "ハッシュタグは何個付ければいいですか？",
    a: "数より関連性が重要です。投稿内容とアカウントのテーマに合ったものを数個。無関係なタグの大量付けは逆効果になり得ます。",
  },
  {
    q: "リールと写真、どちらが発見タブに載りやすい？",
    a: "どちらも載ります。リールは視聴時間とシェアで新規リーチを取りやすく、カルーセルは保存されやすい特性があります。役割を分けて両方使うのが効果的です。",
  },
  {
    q: "一度載ればずっと安定しますか？",
    a: "発見タブは投稿単位で評価されるため、継続的に反応される投稿を出し続けることが安定表示につながります。一発ではなく積み重ねが重要です。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="instagram-explore-tab"
      title={TITLE}
      description={DESC}
      categoryLabel="おすすめ・発見タブ・アルゴリズム"
      categoryColor="#047857"
      published="2026-07-16"
      publishedLabel="2026年7月16日"
      readingTime="約10分"
      campaign="explore"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/instagram-algorithm-2026", title: "【2026年最新】Instagramアルゴリズムの変化と5つの指標" },
        { href: "/subscription/blog/followers-vs-engagement", title: "フォロワー1万人でも売れない？「数」より「反応」の運用術" },
        { href: "/subscription/blog/increase-followers", title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ" },
      ]}
    />
  );
}
