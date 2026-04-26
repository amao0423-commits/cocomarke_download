import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-design-primary/35 focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  primary:
    'bg-design-primary text-white shadow-design-soft hover:-translate-y-px hover:bg-design-primary-hover hover:brightness-[1.03] hover:shadow-design-soft-hover',
  secondary:
    'border border-design-border bg-design-surface text-design-text-primary shadow-design-soft hover:-translate-y-px hover:border-design-border hover:bg-design-surface-hover hover:shadow-design-soft-hover',
  outline:
    'border border-design-border bg-design-accent-blue-soft text-design-text-primary shadow-design-soft hover:-translate-y-px hover:border-design-border hover:bg-slate-200/80 hover:shadow-design-soft-hover',
};

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function CTAButton({
  href,
  variant = 'primary',
  children,
  className = '',
}: Props) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
