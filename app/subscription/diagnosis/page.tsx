import type { Metadata } from "next";
import DiagnosisClient from "./DiagnosisClient";

export const metadata: Metadata = {
  title: "かんたんプランニング｜JEMIA",
  description: "5つの質問に答えるだけで、あなたのInstagramアカウントに合ったJEMIAのプランをご提案。サービス資料・お申し込みのご案内もお届けします。",
};

export default function DiagnosisPage() {
  return <DiagnosisClient />;
}
