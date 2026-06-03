import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { Container } from "./container";
import { UserMenu } from "./user-menu";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="flex items-center gap-4 py-3">
        <Logo />
        {/* useSearchParams in SearchBar needs a Suspense boundary for static prerender (e.g. /_not-found) */}
        <Suspense
          fallback={
            <div className="ml-auto h-8.5 w-36 rounded-md border border-border bg-surface sm:w-52" />
          }
        >
          <SearchBar />
        </Suspense>
        <nav className="hidden items-center gap-4 sm:flex">
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
          <UserMenu user={user} />
        </nav>
      </Container>
    </header>
  );
}
