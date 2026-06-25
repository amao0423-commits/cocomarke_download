'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DownloadPageShell from './DownloadPageShell';
import type { PageDocument } from './getDownloadPageContext';

type DownloadContext = {
  formName: string;
  requestedDocumentLabel: string | null;
  templateId: string | null;
  documents: PageDocument[];
};

const FALLBACK_FORM_NAME = 'COCOマーケ資料ダウンロード';

/** レイアウトに合わせたローディング表示（about:blank の代わり） */
export function DownloadSkeleton() {
  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="mb-4 h-3 w-40 animate-pulse rounded bg-[#E2E8F0]" />
        <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-[1.12fr_1fr]">
          {/* 左：資料情報 */}
          <div className="animate-pulse">
            <div className="h-7 w-3/4 rounded bg-[#E2E8F0]" />
            <div className="mt-3.5 h-4 w-full rounded bg-[#EEF2F6]" />
            <div className="mt-2 h-4 w-5/6 rounded bg-[#EEF2F6]" />
            <div className="mt-5 aspect-[16/10] w-full rounded-2xl bg-[#EEF2F6]" />
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="h-4 w-2/3 rounded bg-[#EEF2F6]" />
              <div className="h-4 w-3/5 rounded bg-[#EEF2F6]" />
              <div className="h-4 w-1/2 rounded bg-[#EEF2F6]" />
            </div>
          </div>
          {/* 右：フォーム */}
          <div className="animate-pulse rounded-[20px] border border-[#E2E8F0] bg-white p-7 sm:p-8">
            <div className="h-4 w-2/3 rounded bg-[#EEF2F6]" />
            <div className="mt-5 h-12 w-full rounded-[10px] bg-[#F1F5F9]" />
            <div className="mt-4 h-12 w-full rounded-[10px] bg-[#F1F5F9]" />
            <div className="mt-4 h-12 w-full rounded-[10px] bg-[#F1F5F9]" />
            <div className="mt-6 h-12 w-full rounded-full bg-[#E2E8F0]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DownloadClient() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get('documentId')?.trim() || undefined;
  const formSlug = searchParams.get('formSlug')?.trim() || 'default';
  const thanksInUrl = searchParams.get('thanks')?.trim() === '1';

  const [ctx, setCtx] = useState<DownloadContext | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCtx(null);
    const params = new URLSearchParams();
    if (documentId) params.set('documentId', documentId);
    if (formSlug) params.set('formSlug', formSlug);

    fetch(`/api/download-context?${params.toString()}`)
      .then((r) => r.json())
      .then((d: DownloadContext) => {
        if (!cancelled) setCtx(d);
      })
      .catch(() => {
        if (!cancelled) {
          setCtx({
            formName: FALLBACK_FORM_NAME,
            requestedDocumentLabel: documentId ? 'ご指定の資料' : null,
            templateId: null,
            documents: [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [documentId, formSlug]);

  if (!ctx) return <DownloadSkeleton />;

  return (
    <DownloadPageShell
      formSlug={formSlug}
      formName={ctx.formName}
      templateId={ctx.templateId}
      documentId={documentId}
      documentLabel={ctx.requestedDocumentLabel}
      initialDocuments={ctx.documents}
      thanksInUrl={thanksInUrl}
    />
  );
}
