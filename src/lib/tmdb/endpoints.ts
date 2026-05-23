import { tmdbFetch } from './client'
import type { Credits, Movie, MovieDetail, TMDBResponse } from './types'

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`, {
    next: { revalidate: 3600, tags: ['trending'] },
  })
}

export async function getMovieDetail(tmdbId: number) {
  return tmdbFetch<MovieDetail>(`/movie/${tmdbId}`, {
    next: { revalidate: 86400, tags: [`movie-${tmdbId}`] },
  })
}

export async function getMovieCredits(tmdbId: number) {
  return tmdbFetch<Credits>(`/movie/${tmdbId}/credits`, {
    next: { revalidate: 86400, tags: [`movie-${tmdbId}`] },
  })
}
