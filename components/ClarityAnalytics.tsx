'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const CLARITY_ID = 'xchju8gu8g';

/**
 * Microsoft Clarity。管理画面(/admin 配下)は観察対象に含めないため、
 * admin パスでは読み込まない（一般ユーザーのページのみ計測）。
 */
export default function ClarityAnalytics() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">{`
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_ID}");
    `}</Script>
  );
}
