import type { ReactNode } from "react";
import Script from "next/script";

/**
 * /subscription 専用レイアウト。
 * Meta ピクセル（ベースコード）をこのページにのみ読み込む。
 * Next.js では <head> へ直書きする代わりに next/script で注入する。
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
      {/* Meta Pixel Code */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','3571994076297031');fbq('track','PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=3571994076297031&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}
      {children}
    </>
  );
}
