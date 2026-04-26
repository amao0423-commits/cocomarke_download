import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans_JP } from "next/font/google";
import HeaderShell from "@/components/HeaderShell";
import { Footer } from "@/components/navigation/Footer";
import { DiagnosisOverlay } from "@/components/DiagnosisOverlay";
import "./globals.css";

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
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "cocomarke ポータル",
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
        <Suspense fallback={<HeaderFallback />}>
          <HeaderShell />
        </Suspense>
        <main>{children}</main>
        <Footer />
        <DiagnosisOverlay />
      </body>
    </html>
  );
}
