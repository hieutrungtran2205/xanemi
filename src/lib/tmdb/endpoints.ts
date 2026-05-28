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

function fetchMovieResource<T>(tmdbId: number, subPath: string): Promise<T> {
  return tmdbFetch<T>(`/movie/${tmdbId}${subPath ? `/${subPath}` : ''}`, {
    next: { revalidate: 86400, tags: [`movie-${tmdbId}`] },
  })
}

export async function getMovieDetail(tmdbId: number) {
  return fetchMovieResource<MovieDetail>(tmdbId, '')
}

export async function getMovieCredits(tmdbId: number) {
  return fetchMovieResource<Credits>(tmdbId, 'credits')
}

export async function getMovieVideos(tmdbId: number) {
  return fetchMovieResource<VideosResponse>(tmdbId, 'videos')
}

export async function getMovieWatchProviders(tmdbId: number) {
  return fetchMovieResource<WatchProvidersResponse>(tmdbId, 'watch/providers')
}

export async function getMovieSimilar(tmdbId: number) {
  return fetchMovieResource<TMDBResponse<Movie>>(tmdbId, 'similar')
}

export async function tmdbList<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  options?: { tag?: string; revalidate?: number }
): Promise<TMDBResponse<T>> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString()
  return tmdbFetch<TMDBResponse<T>>(`${path}?${qs}`, {
    next: {
      revalidate: options?.revalidate ?? 3600,
      tags: options?.tag ? [options.tag] : [],
    },
  })
}

export async function getDiscoverMovies(
  filters: FilterParams,
  page: number
): Promise<TMDBResponse<Movie>> {
  return tmdbList<Movie>('/discover/movie', buildDiscoverQuery(filters, page), { tag: 'discover' })
}

export async function searchMovies(query: string, page: number): Promise<TMDBResponse<Movie>> {
  return tmdbList<Movie>('/search/movie', { query, page, include_adult: 'false' }, { tag: 'search' })
}
