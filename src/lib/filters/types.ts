export type SortOption = 'popularity' | 'rating' | 'release_desc' | 'release_asc'
export type LanguageCode = 'any' | 'en' | 'ko' | 'ja' | 'fr' | 'es' | 'vi' | 'zh' | 'hi'

export const CURRENT_YEAR = new Date().getFullYear()
export const YEAR_MIN = 1970

export interface FilterParams {
  genres: number[]
  yearFrom: number
  yearTo: number
  minRating: number
  sort: SortOption
  lang: LanguageCode
}

export const DEFAULT_FILTERS: FilterParams = {
  genres: [],
  yearFrom: YEAR_MIN,
  yearTo: CURRENT_YEAR,
  minRating: 0,
  sort: 'popularity',
  lang: 'any',
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'release_desc', label: 'Newest First' },
  { value: 'release_asc', label: 'Oldest First' },
]

export const LANGUAGE_OPTIONS: { value: LanguageCode; label: string }[] = [
  { value: 'any', label: 'Any Language' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
]

export function countActiveFilters(f: FilterParams): number {
  let n = 0
  if (f.genres.length > 0) n++
  if (f.yearFrom !== YEAR_MIN || f.yearTo !== CURRENT_YEAR) n++
  if (f.minRating > 0) n++
  if (f.sort !== 'popularity') n++
  if (f.lang !== 'any') n++
  return n
}