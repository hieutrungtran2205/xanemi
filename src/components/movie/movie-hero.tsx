import Image from "next/image";
import { Play } from "lucide-react";
import { backdropUrl, formatRating, posterUrl, releaseYear } from "@/lib/tmdb/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { MovieDetail } from "@/lib/tmdb/types";

interface Props {
  movie: MovieDetail;
  /** Slot rendered next to the "Watch Now" button (e.g. watchlist toggle) */
  action?: React.ReactNode;
}

function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function MovieHero({ movie, action }: Props) {
  const backdrop = backdropUrl(movie.backdrop_path, "original");
  const poster = posterUrl(movie.poster_path, "w500");
  const year = releaseYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const runtime = formatRuntime(movie.runtime);

  return (
    <section>
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-80 w-full overflow-hidden bg-surface">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 via-35% to-transparent" />
      </div>

      {/* Poster + info overlapping the backdrop bottom */}
      <div className="relative -mt-24 md:-mt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
            {/* Poster */}
            <div className="w-32 shrink-0 sm:w-44 md:w-56">
              <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface shadow-2xl">
                {poster ? (
                  <Image
                    src={poster}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, 224px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No poster
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 pb-2 md:pb-10">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {year && <span>{year}</span>}
                {runtime && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{runtime}</span>
                  </>
                )}
                {movie.production_countries.length > 0 && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{movie.production_countries.map((c) => c.name).join(', ')}</span>
                  </>
                )}
                <span aria-hidden>·</span>
                <span className="text-gold">★</span>
                <span className="text-foreground">{rating}</span>
                {movie.vote_count > 0 && (
                  <span>({movie.vote_count.toLocaleString()})</span>
                )}
              </div>

              {movie.tagline && (
                <p className="text-sm italic text-muted-foreground">
                  {movie.tagline}
                </p>
              )}

              {(movie.imdb_id || action) && (
                <div className="flex flex-wrap items-center gap-3">
                  {movie.imdb_id && (
                    <Button asChild size="lg" className="w-fit">
                      <a
                        href={`https://www.playimdb.com/title/${movie.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play />
                        Watch Now
                      </a>
                    </Button>
                  )}
                  {action}
                </div>
              )}

              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <Badge
                      key={g.id}
                      variant="outline"
                      className="h-auto rounded-md bg-surface px-2.5 py-1 text-muted-foreground"
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>
              )}

              {movie.production_companies.length > 0 && (
                <p className="text-xs text-muted-foreground/60">
                  {movie.production_companies.map((c) => c.name).join(' · ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MovieHeroSkeleton() {
  return (
    <section>
      <Skeleton className="h-[50vh] min-h-80 rounded-none bg-surface" />
      <div className="relative -mt-24 md:-mt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
            <div className="w-32 shrink-0 sm:w-44 md:w-56">
              <Skeleton className="aspect-2/3 rounded-lg" />
            </div>
            <div className="flex flex-col gap-3 pb-2 md:pb-10">
              <Skeleton className="h-8 w-64 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
