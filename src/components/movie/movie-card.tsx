import Image from "next/image";
import Link from "next/link";
import { formatRating, posterUrl, releaseYear, toSlug } from "@/lib/tmdb/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/lib/tmdb/types";

interface Props {
  movie: Movie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: Props) {
  const poster = posterUrl(movie.poster_path, "w500");
  const year = releaseYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  return (
    <Link href={`/movie/${toSlug(movie)}`} className="group block">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No poster
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="truncate font-heading text-sm font-semibold leading-snug text-foreground">
          {movie.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {year} · <span className="text-gold">★</span> {rating}
        </p>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-2/3 rounded-lg" />
      <div className="mt-2 space-y-1.5 px-0.5">
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
