'use client';

import Link from 'next/link';

export function DiagnosisBanner() {
  return (
    <div
      className="w-full rounded-2xl border border-blue-100/80 bg-blue-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8"
      role="region"
      aria-label="Instagram無料診断のご案内"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold tracking-tight text-design-text-primary sm:text-lg">
            自社のInstagramが今どのフェーズか、無料で診断できます
          </p>
          <p className="mt-2 text-sm text-design-text-secondary sm:text-base">
            外食・飲食で100店舗以上の支援実績をもとに分析します
          </p>
        </div>
        <div className="shrink-0 sm:self-center">
          <Link
            href="/restaurant-diagnosis"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-blue-700 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50 sm:w-auto"
          >
            無料診断はこちら →
          </Link>
        </div>
      </div>
    </div>
  );
}
