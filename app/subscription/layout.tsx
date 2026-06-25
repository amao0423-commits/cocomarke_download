import type { ReactNode } from "react";

/**
 * /subscription 専用レイアウト。
 * Montserrat webfont を読み込む（ロゴ・数値の 900 ウェイト用）。
 * Meta ピクセルは root layout (app/layout.tsx) でサイト全体に読み込むため、ここでは持たない（二重発火防止）。
 */
export default function SubscriptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {/* Montserrat（ロゴ・数値の900ウェイト用。元LPと同じく webfont を読み込み太字を復元） */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
