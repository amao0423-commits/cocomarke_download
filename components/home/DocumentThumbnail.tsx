'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

type Props = {
  src: string | null;
  alt: string;
  className?: string;
};

function Placeholder() {
  return (
    <div
      className="flex h-40 w-full flex-col items-center justify-center gap-1.5 bg-design-bg-sub text-design-text-muted"
      aria-hidden
    >
      <svg
        className="h-8 w-8 opacity-40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.25}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <span className="text-xs font-medium">サムネイル未設定</span>
    </div>
  );
}

export function DocumentThumbnail({ src, alt, className = '' }: Props) {
  const [broken, setBroken] = useState(false);
  const onError = useCallback(() => setBroken(true), []);

  if (!src || broken) {
    return (
      <div className={`overflow-hidden rounded-t-[1.25rem] ${className}`}>
        <Placeholder />
      </div>
    );
  }

  return (
    <div
      className={`relative h-40 w-full shrink-0 overflow-hidden rounded-t-[1.25rem] bg-design-bg-sub ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center opacity-[0.92] saturate-[0.95]"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        unoptimized={/^https?:\/\//.test(src)}
        onError={onError}
      />
    </div>
  );
}
