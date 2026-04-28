import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アカウント簡易分析 | COCOマーケ",
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
