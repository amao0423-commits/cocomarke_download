import Link, { type LinkProps } from 'next/link';
import { Download, Mail } from 'lucide-react';

const ctaBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

/** 資料カード・ダウンロード導線で共通のネイビーグラデーションCTA（カプセル型） */
export const documentDownloadCtaClassName =
  `${ctaBase} bg-gradient-to-r from-[#01408D] to-[#001A3D] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg focus-visible:ring-[#01408D]/50`;

/** ネイビー背景上で使う白地・ネイビー文字のCTA */
const documentDownloadCtaLightClassName =
  `${ctaBase} bg-white text-[#01408D] shadow-sm hover:bg-slate-50 focus-visible:ring-white/50`;

type DocumentDownloadLinkProps = Omit<LinkProps, 'className'> & {
  className?: string;
  variant?: 'default' | 'light';
  label?: string;
  icon?: 'download' | 'mail';
};

export function DocumentDownloadLink({
  className = '',
  variant = 'default',
  label = '資料ダウンロード',
  icon = 'download',
  ...props
}: DocumentDownloadLinkProps) {
  const base = variant === 'light' ? documentDownloadCtaLightClassName : documentDownloadCtaClassName;
  const Icon = icon === 'mail' ? Mail : Download;
  return (
    <Link className={`${base} ${className}`.trim()} {...props}>
      {label}
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
    </Link>
  );
}
