import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function DocumentGrid({ children, className = '' }: Props) {
  return (
    <ul
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>li]:min-w-0 ${className}`}
    >
      {children}
    </ul>
  );
}
