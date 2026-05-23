import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="opacity-40">/</span>}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="transition-colors duration-200 hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
