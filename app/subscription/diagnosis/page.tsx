import type { Metadata } from "next";
import DiagnosisClient from "./DiagnosisClient";

export const metadata: Metadata = {
  title: "どのプランが正解？プラン診断｜JEMIA",
  description: "かんたんな質問に答えるだけで、あなたのInstagramアカウントに最適なJEMIAのプランが30秒でわかります。",
};

export default function DiagnosisPage() {
  return <DiagnosisClient />;
}
