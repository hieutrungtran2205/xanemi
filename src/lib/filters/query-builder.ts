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