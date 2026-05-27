import { MovieGrid } from './movie-grid'
import { Pagination } from './pagination'
import type { Movie } from '@/lib/tmdb/types'

interface MovieResultsProps {
  data: { results: Movie[]; total_pages: number }
  page: number
  /** Cap on total pages shown in pagination (default 50) */
  maxPages?: number
}

export function MovieResults({ data, page, maxPages = 50 }: MovieResultsProps) {
  const totalPages = Math.min(data.total_pages, maxPages)
  return (
    <>
      <MovieGrid movies={data.results} />
      {data.results.length > 0 && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </>
  )
}
