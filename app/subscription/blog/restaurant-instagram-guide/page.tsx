import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/restaurant-instagram-guide";
const TITLE = "飲食店のInstagram集客｜週2投稿で予約につなげる「来店導線」の作り方【2026年】";
const DESC =
  "若年層の飲食店探しはInstagramが1位（Z世代38.9%・大学生63.5%）。発見される投稿・プロフィール導線・位置情報の3点で、週2投稿でも来店・予約につなげる方法を、出典つきで解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "飲食店はInstagramを毎日投稿すべきですか？",
    a: "毎日である必要はありません。発見用のリール週1本＋信頼用のカルーセル週1本の「週2本」を安定して続けるほうが、質を保てて継続もしやすいです。",
  },
  {
    q: "フォロワーが少なくても来店は増えますか？",
    a: "増えます。飲食店はエリアビジネスのため、来店可能圏の人に保存・発見されれば十分です。全国的なフォロワー数より、地元での見つけやすさと予約導線が重要です。",
  },
  {
    q: "リールと写真、どちらを優先すべきですか？",
    a: "新規リーチはリール、来店の後押し（場所・価格・予約）は写真カルーセルが得意です。役割が違うため、両方を週1本ずつが理想です。",
  },
  {
    q: "常連さんに投稿してもらうのは問題ありますか？",
    a: "自発的な投稿は問題ありません。ただし飲食代の割引などの対価を渡して依頼する場合は広告に当たり、PR表示がないとステマ規制違反になり得ます。依頼時は必ず広告と分かる表示を求めてください。",
  },
  {
    q: "予約につながっているか、どう測ればいいですか？",
    a: "プロフィールアクセス数、リンク（予約ページ／地図）のクリック数、DMの予約相談数を追いましょう。フォロワー数だけでは来店効果は測れません。",
  },
  {
    q: "自分で運用する時間がありません。",
    a: "撮影だけ現場で行い、企画・投稿・分析を外注する「ハイブリッド」が飲食店には向きます。費用相場や依頼先の選び方は運用代行の選び方の記事を参照してください。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="restaurant-instagram-guide"
      title={TITLE}
      description={DESC}
      categoryLabel="業種別ノウハウ"
      categoryColor="#B45309"
      published="2026-07-16"
      publishedLabel="2026年7月16日"
      readingTime="約11分"
      campaign="restaurant"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/agency-guide", title: "Instagram運用代行の選び方｜費用相場・失敗しない比較ポイント" },
        { href: "/subscription/blog/followers-vs-engagement", title: "フォロワー1万人でも売れない？「数」より「反応」の運用術" },
        { href: "/subscription/blog/instagram-algorithm-2026", title: "【2026年最新】Instagramアルゴリズムの変化と5つの指標" },
      ]}
    />
  );
}
