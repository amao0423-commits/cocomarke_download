import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  /** 例: 背景透明でテキストのみ（ヒーロー下など） */
  className?: string;
};

export function Breadcrumbs({ items, className = "" }: Props) {
  return (
    <nav
      aria-label="パンくず"
      className={["text-sm text-design-text-secondary", className].filter(Boolean).join(" ")}
    >
      <ol className="flex flex-wrap items-center gap-1.5 bg-transparent">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-design-border" aria-hidden>
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-design-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-design-text-primary">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
