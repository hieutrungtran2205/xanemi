import { Suspense } from 'react'
import Link from 'next/link'
import { getDiscoverMovies, searchMovies, getGenreList } from '@/lib/tmdb/endpoints'
import { filterParamsCache } from '@/lib/filters/parsers'
import type { FilterParams } from '@/lib/filters/types'
import { MovieGrid, MovieGridSkeleton } from '@/components/movie/movie-grid'
import { FilterPanel } from '@/components/filter/filter-panel'
import { ActiveFilterChips } from '@/components/filter/active-filter-chips'
import { Pagination } from '@/components/movie/pagination'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DiscoverPage({ searchParams }: PageProps) {
  const rawParams = await searchParams
  const filters = filterParamsCache.parse(rawParams)
  const q = typeof rawParams.q === 'string' ? rawParams.q.trim() : ''
  const page = Math.max(1, parseInt((rawParams.page as string) ?? '1', 10) || 1)

  const genres = await getGenreList()

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
          <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {q ? `"${q}"` : 'Browse Movies'}
          </h1>
          {q && (
            <p className="mt-1 text-sm text-muted-foreground">
              <Link href="/discover" className="underline-offset-4 hover:underline hover:text-foreground">
                clear search
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {!q && <FilterPanel genres={genres} />}

          <div className="min-w-0 flex-1">
            {!q && <ActiveFilterChips genres={genres} />}
            <Suspense key={`${q}-${page}-${JSON.stringify(filters)}`} fallback={<MovieGridSkeleton count={20} />}>
              <MovieResults filters={filters} q={q} page={page} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

async function MovieResults({
  filters,
  q,
  page,
}: {
  filters: FilterParams
  q: string
  page: number
}) {
  const data = await (q ? searchMovies(q, page) : getDiscoverMovies(filters, page))

  if (data.results.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">
          {q ? 'No movies found.' : 'No films match these filters.'}
        </p>
        <Link
          href="/discover"
          className="mt-4 inline-block text-sm text-foreground underline underline-offset-4"
        >
          {q ? 'Browse all' : 'Clear filters'}
        </Link>
      </div>
    )
  }

  const totalPages = Math.min(data.total_pages, 500)

  return (
    <>
      {q && (
        <p className="mb-4 text-sm text-muted-foreground">
          {data.total_results.toLocaleString()} results
        </p>
      )}
      <MovieGrid movies={data.results} />
      {data.results.length > 0 && <Pagination page={page} totalPages={totalPages} />}
    </>
  )
}
