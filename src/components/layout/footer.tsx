import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./container";

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Browse" },
  { href: "/trending", label: "Trending" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <Container className="py-14">
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Discover and explore films you&apos;ll love
            </p>
          </div>

          {/* TMDB attribution — required by TMDB API terms */}
          <div className="flex flex-col gap-3 md:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB"
              width={72}
              height={16}
              className="opacity-70"
            />
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground md:text-right">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
