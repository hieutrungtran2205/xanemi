import Image from "next/image"
import Link from "next/link"
import { backdropUrl, formatRating, posterUrl, releaseYear } from "@/lib/tmdb/utils"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/layout/back-button"
import type { Movie } from "@/lib/tmdb/types"
import type { MoodDefinition } from "@/lib/moods/types"

interface Props {
  movie: Movie
  mood: MoodDefinition
}

export function MoodMovieHero({ movie, mood }: Props) {
  const backdrop = backdropUrl(movie.backdrop_path, "original")
  const poster = posterUrl(movie.poster_path, "w500")
  const year = releaseYear(movie.release_date)
  const rating = formatRating(movie.vote_average)

  return (
    <div className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="relative h-[60vh] min-h-80 w-full bg-surface">
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
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 via-40% to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-6">
          <BackButton />
        </div>
      </div>

      {/* Content overlapping bottom of backdrop */}
      <div className="relative -mt-44 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
            {/* Poster */}
            <Link
              href={`/movie/${movie.id}`}
              tabIndex={-1}
              aria-hidden
              className="w-32 shrink-0 sm:w-40 md:w-52"
            >
              <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface shadow-2xl ring-1 ring-white/10 transition-transform duration-200 hover:scale-[1.02]">
                {poster ? (
                  <Image
                    src={poster}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 208px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No poster
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex flex-col gap-3 pb-2 md:pb-6">
              {/* Mood badge */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/65">
                  Handpicked for your mood
                </span>
                <Badge
                  variant="outline"
                  className="h-auto gap-1.5 rounded-md px-2.5 py-1"
                  style={{
                    backgroundColor: `${mood.accent}18`,
                    color: mood.accent,
                    borderColor: `${mood.accent}35`,
                  }}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </Badge>
                <p className="text-xs italic text-muted-foreground/70">{mood.description}</p>
              </div>

              <Link href={`/movie/${movie.id}`} className="group w-fit">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground transition-opacity group-hover:opacity-80 sm:text-3xl md:text-4xl">
                  {movie.title}
                </h2>
              </Link>

              <div className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                {year && <span>{year}</span>}
                <span aria-hidden>·</span>
                <span className="text-gold">★</span>
                <span className="text-foreground font-medium">{rating}</span>
                {movie.vote_count > 0 && (
                  <span>({movie.vote_count.toLocaleString()} votes)</span>
                )}
              </div>

              {movie.overview && (
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {movie.overview}
                </p>
              )}

              <Link
                href={`/movie/${movie.id}`}
                className="mt-1 inline-flex w-fit items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
              >
                View film →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MoodMovieHeroSkeleton() {
  return (
    <div>
      <div className="h-[60vh] min-h-80 animate-pulse bg-surface" />
      <div className="relative -mt-44 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
            <div className="w-32 shrink-0 sm:w-40 md:w-52">
              <div className="aspect-2/3 animate-pulse rounded-lg bg-surface-2" />
            </div>
            <div className="flex flex-col gap-3 pb-2 md:pb-6">
              <div className="h-5 w-28 animate-pulse rounded bg-surface-2" />
              <div className="h-9 w-72 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-40 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-96 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-80 animate-pulse rounded bg-surface-2" />
              <div className="h-9 w-28 animate-pulse rounded bg-surface-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}