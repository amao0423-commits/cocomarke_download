import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アカウント分析 | cocomarke ポータル",
  description:
    "ログイン不要・完全無料でInstagramアカウントを即座にスコア化。診断結果をもとに改善案を提案します。",
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
