import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-5">
          <Link
            href="/trending"
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Trending
          </Link>
          {/* Sign in — placeholder until Week 3 auth */}
          <button className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground">
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
}