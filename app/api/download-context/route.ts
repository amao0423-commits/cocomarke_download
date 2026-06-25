import { NextRequest, NextResponse } from "next/server";
import { getDownloadPageContext } from "@/app/download/getDownloadPageContext";

/**
 * 公開: ダウンロードページ（静的）がクライアントから資料・フォーム情報を取得するためのAPI。
 * 中身は getDownloadPageContext（unstable_cache）なので、通常は Supabase を叩かずキャッシュを返す。
 */
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const documentId = sp.get("documentId")?.trim() || undefined;
    const formSlug = sp.get("formSlug")?.trim() || "default";
    const ctx = await getDownloadPageContext(documentId, formSlug);
    return NextResponse.json(ctx);
  } catch (e) {
    console.error("download-context GET:", e);
    return NextResponse.json(
      { formName: "COCOマーケ資料ダウンロード", requestedDocumentLabel: null, templateId: null, documents: [] },
      { status: 200 }
    );
  }
}
