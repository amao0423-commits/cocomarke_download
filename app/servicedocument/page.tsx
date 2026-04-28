import type { Metadata } from "next";
import DownloadPageShell from "@/app/download/DownloadPageShell";
import { getDownloadPageContext } from "@/app/download/getDownloadPageContext";
import { getServiceOverviewDocumentId } from "@/lib/getServiceOverviewDocumentId";

export const metadata: Metadata = {
  title: "サービス資料ダウンロード | COCOマーケ",
  description: "COCOマーケサービス資料のダウンロード",
};

export default async function ServiceDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ documentId?: string; formSlug?: string; thanks?: string }>;
}) {
  const sp = await searchParams;
  const queryDocumentId =
    typeof sp.documentId === "string" && sp.documentId.trim()
      ? sp.documentId.trim()
      : undefined;
  const fallbackDocumentId = await getServiceOverviewDocumentId();
  const documentId = queryDocumentId ?? fallbackDocumentId ?? undefined;
  const formSlug =
    typeof sp.formSlug === "string" && sp.formSlug.trim()
      ? sp.formSlug.trim()
      : "default";
  const thanksInUrl =
    typeof sp.thanks === "string" && sp.thanks.trim() === "1";
  const { formName, requestedDocumentLabel, documents } =
    await getDownloadPageContext(documentId, formSlug);

  return (
    <DownloadPageShell
      formSlug={formSlug}
      formName={formName}
      documentId={documentId}
      documentLabel={requestedDocumentLabel}
      initialDocuments={documents}
      thanksInUrl={thanksInUrl}
    />
  );
}
