import Image from "next/image";
import { backdropUrl, posterUrl, releaseYear } from "@/lib/tmdb/utils";
import type { MovieDetail } from "@/lib/tmdb/types";

interface Props {
  movie: MovieDetail;
}

function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function MovieHero({ movie }: Props) {
  const backdrop = backdropUrl(movie.backdrop_path, "w1280");
  const poster = posterUrl(movie.poster_path, "w500");
  const year = releaseYear(movie.release_date);
  const rating = movie.vote_average.toFixed(1);
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Poster + info overlapping the backdrop bottom */}
      <div className="relative -mt-24 md:-mt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
            {/* Poster */}
            <div className="w-32 flex-shrink-0 sm:w-44 md:w-56">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface shadow-2xl">
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

              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
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
      <div className="h-[50vh] min-h-80 animate-pulse bg-surface" />
      <div className="relative -mt-24 md:-mt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
            <div className="w-32 flex-shrink-0 sm:w-44 md:w-56">
              <div className="aspect-[2/3] animate-pulse rounded-lg bg-surface-2" />
            </div>
            <div className="flex flex-col gap-3 pb-2 md:pb-10">
              <div className="h-8 w-64 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-40 animate-pulse rounded bg-surface-2" />
              <div className="flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded bg-surface-2" />
                <div className="h-6 w-20 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
