import type { Metadata } from "next";
import ThanksClient from "./ThanksClient";

export const metadata: Metadata = {
  title: "ダウンロードありがとうございます | COCOマーケ",
  description: "資料ダウンロードのお申し込みを受け付けました。",
  robots: { index: false, follow: false },
};

/**
 * 資料ダウンロード完了（サンクス）専用ページ。
 * URL を /download とは分離（/download/thanks）して Meta のURLベース・
 * カスタムコンバージョンを設定できるようにする。静的生成。
 */
export default function DownloadThanksPage() {
  return <ThanksClient />;
}
