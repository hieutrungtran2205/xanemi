export type SortOption = 'popularity' | 'rating' | 'release_desc' | 'release_asc'
export type CountryCode = 'any' | 'US' | 'GB' | 'KR' | 'JP' | 'FR' | 'ES' | 'IN' | 'CN' | 'IT' | 'DE'

export const CURRENT_YEAR = new Date().getFullYear()
export const YEAR_MIN = 1970

export interface FilterParams {
  genres: number[]
  yearFrom: number
  yearTo: number
  minRating: number
  sort: SortOption
  country: CountryCode
}

export const DEFAULT_FILTERS: FilterParams = {
  genres: [],
  yearFrom: YEAR_MIN,
  yearTo: CURRENT_YEAR,
  minRating: 0,
  sort: 'popularity',
  country: 'any',
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'release_desc', label: 'Newest First' },
  { value: 'release_asc', label: 'Oldest First' },
]

export const COUNTRY_OPTIONS: { value: CountryCode; label: string }[] = [
  { value: 'any', label: 'Any Country' },
  { value: 'US', label: 'USA' },
  { value: 'GB', label: 'UK' },
  { value: 'KR', label: 'South Korea' },
  { value: 'JP', label: 'Japan' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'IT', label: 'Italy' },
  { value: 'DE', label: 'Germany' },
]

export function countActiveFilters(f: FilterParams): number {
  let n = 0
  if (f.genres.length > 0) n++
  if (f.yearFrom !== YEAR_MIN || f.yearTo !== CURRENT_YEAR) n++
  if (f.minRating > 0) n++
  if (f.sort !== 'popularity') n++
  if (f.country !== 'any') n++
  return n
}