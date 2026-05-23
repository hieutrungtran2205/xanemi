import { MovieCard, MovieCardSkeleton } from "./movie-card";
import type { Movie } from "@/lib/tmdb/types";

interface Props {
  movies: Movie[];
  priority?: boolean;
}

export function MovieGrid({ movies, priority = false }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie, i) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          priority={priority && i < 4}
        />
      ))}
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
