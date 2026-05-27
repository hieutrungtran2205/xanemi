import Link from "next/link";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { Container } from "./container";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="flex items-center gap-4 py-3">
        <Logo />
        <div className="flex-1" />
        <SearchBar />
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
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </nav>
      </Container>
    </header>
  );
}
