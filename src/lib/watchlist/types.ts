// Minimal movie data stored on a watchlist row so /watchlist renders without
// re-fetching TMDB per item. Fields match what MovieCard reads.
export type MovieSnapshot = {
  title: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
}
