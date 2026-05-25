import 'server-only'
import { tmdbFetch } from '../tmdb/client'
import type { Movie, TMDBResponse } from '../tmdb/types'
import { MOOD_DEFINITIONS } from './definitions'
import type { MoodId } from './types'
import type { FilterParams } from '../filters/types'
import { DEFAULT_FILTERS } from '../filters/types'
import { buildQueryWithFilters } from '../filters/query-builder'

function randomPage(min = 1, max = 5): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function getMoviesByMood(
  moodId: MoodId,
  page?: number,
  filters?: FilterParams
): Promise<TMDBResponse<Movie>> {
  const mood = MOOD_DEFINITIONS[moodId]
  const resolvedPage = page ?? randomPage()
  const resolvedFilters = filters ?? DEFAULT_FILTERS

  const params = buildQueryWithFilters(mood, resolvedFilters, resolvedPage)
  const qs = new URLSearchParams(params).toString()

  return tmdbFetch<TMDBResponse<Movie>>(`/discover/movie?${qs}`, {
    next: { revalidate: 3600, tags: [`mood-${moodId}`] },
  })
}