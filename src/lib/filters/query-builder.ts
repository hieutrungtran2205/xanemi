import type { MoodDefinition } from '../moods/types'
import type { FilterParams } from './types'
import { CURRENT_YEAR, YEAR_MIN } from './types'

const SORT_MAP: Record<FilterParams['sort'], string> = {
  popularity: 'popularity.desc',
  rating: 'vote_average.desc',
  release_desc: 'primary_release_date.desc',
  release_asc: 'primary_release_date.asc',
}

export function buildDiscoverQuery(filters: FilterParams, page: number): Record<string, string> {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: SORT_MAP[filters.sort],
  }
  if (filters.genres.length > 0) params.with_genres = filters.genres.join(',')
  if (filters.yearFrom !== YEAR_MIN) params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`
  if (filters.yearTo !== CURRENT_YEAR) params['primary_release_date.lte'] = `${filters.yearTo}-12-31`
  if (filters.minRating > 0) {
    params['vote_average.gte'] = String(filters.minRating)
    params['vote_count.gte'] = '100'
  }
  if (filters.country !== 'any') params.with_origin_country = filters.country
  return params
}

// Serializes FilterParams + optional search query into a URL query string for client navigation.
export function filtersToUrlParams(filters: FilterParams, q?: string): string {
  const params = new URLSearchParams()
  if (q?.trim()) params.set('q', q.trim())
  if (filters.genres.length) params.set('genres', filters.genres.join(','))
  if (filters.yearFrom !== YEAR_MIN) params.set('yearFrom', String(filters.yearFrom))
  if (filters.yearTo !== CURRENT_YEAR) params.set('yearTo', String(filters.yearTo))
  if (filters.minRating > 0) params.set('minRating', String(filters.minRating))
  if (filters.sort !== 'popularity') params.set('sort', filters.sort)
  if (filters.country !== 'any') params.set('country', filters.country)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

// Merges mood base query with user filter overrides into TMDB discover params.
// Filter REFINES mood (not replaces): mood's quality floor and exclusions are preserved.
export function buildQueryWithFilters(
  mood: MoodDefinition,
  filters: FilterParams,
  page: number
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(page),
  }

  // vote_count floor: always from mood definition
  if (mood.query.vote_count_gte != null) {
    params['vote_count.gte'] = String(mood.query.vote_count_gte)
  }

  // Genres: user selection overrides mood default; empty = use mood default
  if (filters.genres.length > 0) {
    params.with_genres = filters.genres.join(',')
  } else if (mood.query.with_genres) {
    params.with_genres = mood.query.with_genres
  }

  // Keep mood's genre exclusions regardless of user selection
  if (mood.query.without_genres) {
    params.without_genres = mood.query.without_genres
  }

  // Year range
  if (filters.yearFrom !== YEAR_MIN) {
    params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`
  }
  if (filters.yearTo !== CURRENT_YEAR) {
    params['primary_release_date.lte'] = `${filters.yearTo}-12-31`
  }

  // Rating: take the stricter of user filter vs mood floor
  const moodRating = mood.query.vote_average_gte ?? 0
  const effective = Math.max(filters.minRating, moodRating)
  if (effective > 0) {
    params['vote_average.gte'] = String(effective)
  }

  // Sort
  params.sort_by = SORT_MAP[filters.sort]

  // Runtime constraints from mood (not exposed as filter in V1)
  if (mood.query.with_runtime_gte != null) {
    params['with_runtime.gte'] = String(mood.query.with_runtime_gte)
  }
  if (mood.query.with_runtime_lte != null) {
    params['with_runtime.lte'] = String(mood.query.with_runtime_lte)
  }

  // Country of origin
  if (filters.country !== 'any') {
    params.with_origin_country = filters.country
  }

  return params
}