'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'cocomarke:download';

type StoredDownload = {
  downloadUrl: string | null;
  docName: string;
};

export default function ThanksClient() {
  const [data, setData] = useState<StoredDownload | null>(null);

  // sessionStorage に保存されたダウンロード情報を読み出す
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as StoredDownload);
    } catch {
      /* noop */
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  // Meta Pixel: サンクスページ専用URLでの PageView（URLベースのカスタムコンバージョン用）
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
      window.fbq('trackCustom', 'DownloadComplete');
    }
  }, []);

  const downloadUrl = data?.downloadUrl ?? null;
  const docName = data?.docName?.trim() || 'ご請求の資料';

  const triggerDownload = useCallback(() => {
    if (!downloadUrl) return;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  }, [downloadUrl]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[520px] rounded-3xl border border-[#E2E8F0] bg-white px-8 py-12 text-center shadow-[0_16px_40px_-22px_rgba(15,23,42,.2)] sm:px-10">
        {/* チェックアイコン */}
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E6EFFA]">
          <svg className="h-9 w-9 stroke-[#2563A8]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-black leading-snug text-[#01408D]">
          お申込みありがとうございます
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
          {downloadUrl
            ? '下のボタンより資料をすぐにダウンロードできます。'
            : '資料ダウンロードのお申し込みを受け付けました。'}
        </p>

        {/* 資料名 */}
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F4F6F9] px-4 py-3.5">
          <svg className="h-[18px] w-[18px] shrink-0 stroke-[#2563A8]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          <span className="text-[13.5px] font-bold text-[#1F2937] line-clamp-2">{docName}</span>
        </div>

        {/* ダウンロードボタン */}
        {downloadUrl ? (
          <>
            <button
              type="button"
              onClick={triggerDownload}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#2563A8] px-4 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1d5390] hover:shadow-[0_12px_26px_-10px_rgba(37,99,168,.5)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
              </svg>
              資料をダウンロード
            </button>
            <p className="mt-3 text-xs text-[#94A3B8]">
              ダウンロードが始まらない場合はボタンをもう一度押してください。
            </p>
          </>
        ) : (
          <p className="mt-6 text-sm text-[#64748B]">
            ご記入いただいたメールアドレス宛にもご案内をお送りします。
          </p>
        )}

        {/* リンク */}
        <div className="mt-8 flex flex-col gap-3 border-t border-[#E2E8F0] pt-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 rounded-full border border-[#E2E8F0] py-3 text-[13.5px] font-bold text-[#64748B] transition hover:border-[#01408D] hover:text-[#01408D]"
          >
            ← 他の資料を見る
          </Link>
          <a
            href="https://www.cocomarke.com/contact"
            target="_blank"
            rel="noreferrer"
            className="text-[13.5px] font-bold text-[#01408D]"
          >
            サービスについて相談する
          </a>
        </div>
      </div>
    </div>
  );
}
