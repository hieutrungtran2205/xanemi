import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo size="sm" />
            <p className="mt-2 text-sm text-muted-foreground">
              Find movies that match your mood.
            </p>
          </div>

          {/* TMDB attribution — required by TMDB API terms */}
          <div className="flex flex-col gap-2 sm:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB"
              width={64}
              height={14}
              className="opacity-70"
            />
            <p className="max-w-xs text-xs text-muted-foreground sm:text-right">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}