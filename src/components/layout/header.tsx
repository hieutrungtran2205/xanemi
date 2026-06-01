import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="flex items-center gap-4 py-3">
        <Logo />
        <div className="flex-1" />
        {/* useSearchParams in SearchBar needs a Suspense boundary for static prerender (e.g. /_not-found) */}
        <Suspense
          fallback={
            <div className="h-8.5 w-36 rounded-md border border-border bg-surface sm:w-52" />
          }
        >
          <SearchBar />
        </Suspense>
        <nav className="flex items-center gap-4">
          <Link
            href="/discover"
            className="hidden text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground sm:block"
          >
            Browse
          </Link>
          <Link
            href="/trending"
            className="hidden text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground sm:block"
          >
            Trending
          </Link>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
        </nav>
        <MobileNav />
      </Container>
    </header>
  );
}
