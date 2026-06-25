import type { Metadata } from "next";
import { Suspense } from "react";
import DownloadClient, { DownloadSkeleton } from "./DownloadClient";

export const metadata: Metadata = {
  title: "サービス資料ダウンロード | COCOマーケ",
  description: "COCOマーケサービス資料のダウンロード",
};

/**
 * ダウンロードページは静的生成（CDN から即時配信）。
 * documentId / formSlug などのクエリはクライアント（DownloadClient）で読み、
 * 資料・フォーム情報はキャッシュ済み API (/api/download-context) から取得する。
 * これにより「about:blank → 表示」のサーバー応答待ちを解消する。
 */
export default function DownloadPage() {
  return (
    <Suspense fallback={<DownloadSkeleton />}>
      <DownloadClient />
    </Suspense>
  );
}
