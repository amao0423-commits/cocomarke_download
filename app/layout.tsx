import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import HeaderShell from "@/components/HeaderShell";
import { Footer } from "@/components/navigation/Footer";
import { DiagnosisOverlay } from "@/components/DiagnosisOverlay";
import ChromeSwitch from "@/components/ChromeSwitch";
import AttributionTracker from "@/components/AttributionTracker";
import "./globals.css";

const META_PIXEL_ID = "1232285451938211";
const GA4_ID = "G-CV0JM0KPN9";
const CLARITY_ID = "xchju8gu8g";

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
        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}</Script>
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
