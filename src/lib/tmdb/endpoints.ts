import { tmdbFetch } from './client'
import type { Credits, Genre, Movie, MovieDetail, TMDBResponse, VideosResponse, WatchProvidersResponse } from './types'
import type { FilterParams } from '../filters/types'
import { buildDiscoverQuery } from '../filters/query-builder'

const FALLBACK_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

export async function getGenreList(): Promise<Genre[]> {
  try {
    const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list', {
      next: { revalidate: 2592000, tags: ['genres'] },
    })
    return data.genres
  } catch {
    return FALLBACK_GENRES
  }
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week', page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>(
    `/trending/movie/${timeWindow}?page=${page}`,
    { next: { revalidate: 3600, tags: ['trending'] } },
  )
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

export async function getMovieVideos(tmdbId: number) {
  return tmdbFetch<VideosResponse>(`/movie/${tmdbId}/videos`, {
    next: { revalidate: 86400, tags: [`movie-${tmdbId}`] },
  })
}

export async function getMovieWatchProviders(tmdbId: number) {
  return tmdbFetch<WatchProvidersResponse>(`/movie/${tmdbId}/watch/providers`, {
    next: { revalidate: 86400, tags: [`movie-${tmdbId}`] },
  })
}

export async function getMovieSimilar(tmdbId: number) {
  return tmdbFetch<TMDBResponse<Movie>>(`/movie/${tmdbId}/similar`, {
    next: { revalidate: 86400, tags: [`movie-${tmdbId}`] },
  })
}

export async function getDiscoverMovies(
  filters: FilterParams,
  page: number
): Promise<TMDBResponse<Movie>> {
  const params = buildDiscoverQuery(filters, page)
  return tmdbFetch<TMDBResponse<Movie>>(`/discover/movie?${new URLSearchParams(params)}`, {
    next: { revalidate: 3600, tags: ['discover'] },
  })
}

export async function searchMovies(query: string, page: number): Promise<TMDBResponse<Movie>> {
  const params = new URLSearchParams({ query, page: String(page), include_adult: 'false' })
  return tmdbFetch<TMDBResponse<Movie>>(`/search/movie?${params}`, {
    next: { revalidate: 3600, tags: ['search'] },
  })
}
