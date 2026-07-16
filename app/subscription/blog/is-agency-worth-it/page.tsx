import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/is-agency-worth-it";
const TITLE = "Instagram運用代行は意味ない？「成果が出なかった」と言われる本当の理由";
const DESC =
  "「Instagram運用代行は意味ない」と言われる本当の理由を、代行会社側の7つの失敗パターンと依頼側の4つの原因の両面から解説。成果の出る運用代行の条件と、契約前のチェックリストを示します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "「Instagram運用代行は意味ない」というのは本当ですか？",
    a: "成果の出ない運用代行は実際に存在します。ただし手段そのものが無意味なのではなく、戦略設計・制作・分析・改善の4工程を回せない組み合わせが無意味なのです。条件を満たせば意味があります。",
  },
  {
    q: "成果が出ない運用代行に共通する特徴は？",
    a: "戦略設計・分析・改善を飛ばして制作（投稿）だけを量産することです。ほかに業界理解のないテンプレ流用、数字の羅列だけのレポート、フォロワー数偏重のKPI、転載コンテンツなどが典型です。",
  },
  {
    q: "依頼側に原因があるケースもありますか？",
    a: "あります。完全な丸投げ、目的が曖昧なままの発注、3ヶ月など短すぎる期間での見切り、フォロワー数だけでの評価は、どんな優れた代行でも成果を潰します。",
  },
  {
    q: "契約前に必ず握るべきことは？",
    a: "KPI（フォロワー数だけにしない）・役割分担・レポートの頻度と粒度（改善提案を含む）・評価のタイミング（6ヶ月時点の基準）・解約条件の5点を、書面で合意してください。",
  },
  {
    q: "成果はどれくらいの期間で判断すべきですか？",
    a: "3ヶ月では早すぎます。アカウントの成長には時間がかかるため、契約前に6ヶ月時点で何がどうなっていれば継続かを双方で定義しておくのが実務的です。",
  },
  {
    q: "良い代行会社の見分け方は？",
    a: "KPIがフォロワー数だけでない、改善提案つきのレポートを出す、オリジナルコンテンツを制作する、業界の法規制（薬機法・ステマ規制）を理解している——この4点を満たす会社を選びましょう。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="is-agency-worth-it"
      title={TITLE}
      description={DESC}
      categoryLabel="運用代行の選び方"
      categoryColor="#334155"
      published="2026-07-15"
      publishedLabel="2026年7月15日"
      readingTime="約11分"
      campaign="agency_worth"
      faq={FAQ}
      related={[
        { href: "/subscription/blog/instagram-algorithm-guide", title: "【2026年版】Instagramアルゴリズムの仕組みを完全解説" },
        { href: "/subscription/blog/subscription-vs-traditional", title: "運用代行のサブスク型と従来型、どっちが得？費用比較" },
        { href: "/subscription/blog/in-house-vs-outsourcing", title: "内製 vs 外注、Instagram運用のコストを本気で比較" },
      ]}
    />
  );
}
