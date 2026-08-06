'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getRelatedServiceCta } from '@/lib/relatedServiceCta';

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

/** 資料を読んだ後の3つの選択肢（案3b） */
const CHOICES = [
  {
    title: 'まず自分で改善する',
    desc: 'チェックリストと最適化の手順で、社内運用のまま改善を進められます。',
    cta: 'JEMIAの内容を見る',
    href: 'https://www.cocomarke.com/',
    recommended: false,
  },
  {
    title: '自社の問題点を知る',
    desc: '1回の無料アカウント診断で、伸びていない原因と次の一手がわかります。',
    cta: '無料で診断する',
    href: '/analysis',
    recommended: true,
  },
  {
    title: '運用を任せる',
    desc: '支援内容・料金プラン・導入事例をまとめて確認できます。LINEでの相談も可能です。',
    cta: '料金と事例を見る',
    href: 'https://www.cocomarke.com/',
    recommended: false,
  },
] as const;

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
  const relatedCta = getRelatedServiceCta(docName);

  const triggerDownload = useCallback(() => {
    if (!downloadUrl) return;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  }, [downloadUrl]);

  return (
    <div className="bg-[#F7F9FC] py-12 sm:py-16">
      <div className="mx-auto max-w-[560px] px-4">
      <div className="w-full rounded-3xl border border-[#E2E8F0] bg-white px-8 py-12 text-center shadow-[0_16px_40px_-22px_rgba(15,23,42,.2)] sm:px-10">
        {/* チェックアイコン */}
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E6EFFA]">
          <svg className="h-9 w-9 stroke-[#0D3B75]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-black leading-snug text-[#0D3B75]">
          お申込みありがとうございます
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
          {downloadUrl
            ? '下のボタンより資料をすぐにダウンロードできます。'
            : '資料ダウンロードのお申し込みを受け付けました。'}
        </p>

        {/* 資料名 */}
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F4F6F9] px-4 py-3.5">
          <svg className="h-[18px] w-[18px] shrink-0 stroke-[#0D3B75]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#0D3B75] px-4 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0A2E5C] hover:shadow-[0_12px_26px_-10px_rgba(37,99,168,.5)]"
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
            className="flex items-center justify-center gap-1.5 rounded-full border border-[#E2E8F0] py-3 text-[13.5px] font-bold text-[#64748B] transition hover:border-[#0D3B75] hover:text-[#0D3B75]"
          >
            ← 他の資料を見る
          </Link>
          <a
            href="https://www.cocomarke.com/contact"
            target="_blank"
            rel="noreferrer"
            className="text-[13.5px] font-bold text-[#0D3B75]"
          >
            サービスについて相談する
          </a>
        </div>
      </div>

      {/* 関連記事／サービスCTA（ダウンロードした資料に応じて出し分け） */}
      <div className="mt-6 overflow-hidden rounded-2xl border-[1.5px] border-cta/60 bg-white shadow-[0_4px_16px_rgba(224,96,58,.1)]">
        <div className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-4 w-0.5 bg-cta" aria-hidden />
            <span className="text-[11px] font-bold text-cta">{relatedCta.badge}</span>
          </div>
          <h3 className="text-[16px] font-bold leading-snug text-[#17233A]">{relatedCta.heading}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#4A5871]">{relatedCta.description}</p>
          <a
            href={relatedCta.href}
            target={relatedCta.href.startsWith('http') ? '_blank' : undefined}
            rel={relatedCta.href.startsWith('http') ? 'noreferrer' : undefined}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cta px-5 py-3 text-[13.5px] font-bold text-white shadow-[0_3px_10px_rgba(224,96,58,.28)] transition hover:bg-cta-hover"
          >
            {relatedCta.ctaLabel}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
      </div>

      {/* ===== 資料を読んだ後の3つの選択肢（案3b） ===== */}
      <div className="mx-auto mt-12 max-w-5xl px-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#17233A] sm:text-2xl">資料を読んだ後の3つの選択肢</h2>
          <p className="mt-2 text-[13px] text-[#7A879C]">今のフェーズに近いものからお進みください。</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CHOICES.map((c, i) => {
            const external = c.href.startsWith('http');
            return (
              <a
                key={c.title}
                href={c.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className={`group relative flex flex-col rounded-2xl border bg-white p-6 transition hover:-translate-y-1 ${
                  c.recommended
                    ? 'border-[1.5px] border-cta shadow-[0_4px_16px_rgba(224,96,58,.12)]'
                    : 'border-[#E4E9F0] shadow-[0_1px_3px_rgba(13,59,117,.05)] hover:shadow-[0_10px_28px_-14px_rgba(13,59,117,.22)]'
                }`}
              >
                {c.recommended && (
                  <span className="absolute right-4 top-[-10px] rounded bg-cta px-2.5 py-0.5 text-[10px] font-bold text-white">
                    おすすめ
                  </span>
                )}
                <span className={`font-mono text-[10.5px] font-bold tracking-[.1em] ${c.recommended ? 'text-cta' : 'text-[#9AA6B8]'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-[#17233A]">{c.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#6A7789]">{c.desc}</p>
                <span
                  className={`mt-5 flex items-center justify-center rounded-lg py-3 text-[13px] font-bold transition ${
                    c.recommended
                      ? 'bg-cta text-white group-hover:bg-cta-hover'
                      : 'border-[1.5px] border-[#0D3B75] text-[#0D3B75]'
                  }`}
                >
                  {c.cta}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
