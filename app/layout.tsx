import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import HeaderShell from "@/components/HeaderShell";
import { Footer } from "@/components/navigation/Footer";
import { DiagnosisOverlay } from "@/components/DiagnosisOverlay";
import ChromeSwitch from "@/components/ChromeSwitch";
import "./globals.css";

const META_PIXEL_ID = "3571994076297031";

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
  title: "COCOマーケ お役立ち資料",
  description: "アカウント分析・サービス資料のポータル",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${notoSansJp.variable} min-h-screen font-sans`}>
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
