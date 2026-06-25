import type { Metadata } from "next";
import DownloadPageShell from "./DownloadPageShell";
import { getDownloadPageContext } from "./getDownloadPageContext";

export const metadata: Metadata = {
  title: "サービス資料ダウンロード | COCOマーケ",
  description: "COCOマーケサービス資料のダウンロード",
};

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ documentId?: string; formSlug?: string; thanks?: string }>;
}) {
  const sp = await searchParams;
  const documentId =
    typeof sp.documentId === "string" && sp.documentId.trim()
      ? sp.documentId.trim()
      : undefined;
  const formSlug =
    typeof sp.formSlug === "string" && sp.formSlug.trim()
      ? sp.formSlug.trim()
      : "default";
  const thanksInUrl =
    typeof sp.thanks === "string" && sp.thanks.trim() === "1";
  const { formName, requestedDocumentLabel, templateId, documents } =
    await getDownloadPageContext(documentId, formSlug);

  return (
    <DownloadPageShell
      formSlug={formSlug}
      formName={formName}
      templateId={templateId}
      documentId={documentId}
      documentLabel={requestedDocumentLabel}
      initialDocuments={documents}
      thanksInUrl={thanksInUrl}
    />
  );
}
