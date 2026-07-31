import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import HeaderShell from "@/components/HeaderShell";
import { Footer } from "@/components/navigation/Footer";
import { DiagnosisOverlay } from "@/components/DiagnosisOverlay";
import ChromeSwitch from "@/components/ChromeSwitch";
import AttributionTracker from "@/components/AttributionTracker";
import ClarityAnalytics from "@/components/ClarityAnalytics";
import "./globals.css";

const META_PIXEL_ID = "1232285451938211";
const GA4_ID = "G-CV0JM0KPN9";

function HeaderFallback() {
  return (
    <div
      className="sticky top-0 z-50 min-h-[4rem] !bg-white shadow-none transition-all duration-300"
      aria-hidden
    />
  );
}

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cocomake-guide.com"),
  title: "COCOマーケ お役立ち資料",
  description: "アカウント分析・サービス資料のポータル",
  verification: {
    google: "SV9FeVtPztdkWh-8WnmZaeMgQxUE0dRDHYbzzhNuVN8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${notoSansJp.variable} min-h-screen font-sans`}>
        {/* アプリ内ブラウザ（iOS WKWebView）等が注入するスクリプトが投げる
            `window.webkit.messageHandlers` 未定義エラーだけを握りつぶす。
            サイト自身のエラーは対象外（他のエラーは一切抑制しない）。 */}
        <Script id="webkit-error-guard" strategy="beforeInteractive">{`
          (function(){
            function isWebkitBridgeError(msg){
              return typeof msg === 'string' &&
                (msg.indexOf('webkit.messageHandlers') !== -1 ||
                 msg.indexOf("evaluating 'window.webkit") !== -1);
            }
            window.addEventListener('error', function(e){
              if (isWebkitBridgeError(e && e.message)) {
                e.preventDefault();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                return true;
              }
            }, true);
            window.addEventListener('unhandledrejection', function(e){
              var r = e && e.reason;
              var msg = r && (r.message || (typeof r === 'string' ? r : ''));
              if (isWebkitBridgeError(msg)) e.preventDefault();
            });
          })();
        `}</Script>
        {/* Google Analytics 4（gtag.js） */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
        `}</Script>
        {/* Microsoft Clarity（/admin は除外） */}
        <ClarityAnalytics />
        {/* 流入元（UTM・参照元）を初回訪問時に記録 */}
        <AttributionTracker />
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${META_PIXEL_ID}');
          fbq('track','PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <ChromeSwitch
          header={
            <Suspense fallback={<HeaderFallback />}>
              <HeaderShell />
            </Suspense>
          }
          footer={<Footer />}
          overlay={<DiagnosisOverlay />}
        >
          {children}
        </ChromeSwitch>
      </body>
    </html>
  );
}
