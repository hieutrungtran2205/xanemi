import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsStringLiteral,
  createSearchParamsCache,
} from 'nuqs/server'
import { CURRENT_YEAR, YEAR_MIN } from './types'

const SORT_VALUES = ['popularity', 'rating', 'release_desc', 'release_asc'] as const
const LANG_VALUES = ['any', 'en', 'ko', 'ja', 'fr', 'es', 'vi', 'zh', 'hi'] as const

// shallow: false → URL change triggers server re-render (data updates)
// clearOnDefault: true → default values are omitted from the URL
const opts = { shallow: false, clearOnDefault: true } as const

export const filterParsers = {
  genres: parseAsArrayOf(parseAsInteger, ',').withDefault([]).withOptions(opts),
  yearFrom: parseAsInteger.withDefault(YEAR_MIN).withOptions(opts),
  yearTo: parseAsInteger.withDefault(CURRENT_YEAR).withOptions(opts),
  minRating: parseAsFloat.withDefault(0).withOptions(opts),
  sort: parseAsStringLiteral(SORT_VALUES).withDefault('popularity').withOptions(opts),
  lang: parseAsStringLiteral(LANG_VALUES).withDefault('any').withOptions(opts),
}

export const filterParamsCache = createSearchParamsCache(filterParsers)
