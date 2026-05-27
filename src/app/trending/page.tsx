import Link from 'next/link'
import { Suspense } from 'react'
import { getTrending } from '@/lib/tmdb/endpoints'
import { MovieGrid, MovieGridSkeleton } from '@/components/movie/movie-grid'
import { Pagination } from '@/components/movie/pagination'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'

interface PageProps {
  searchParams: Promise<{ period?: string; page?: string }>
}

async function TrendingResults({
  timeWindow,
  page,
}: {
  timeWindow: 'day' | 'week'
  page: number
}) {
  const data = await getTrending(timeWindow, page)
  const totalPages = Math.min(data.total_pages, 50)

  return (
    <>
      <MovieGrid movies={data.results} />
      {data.results.length > 0 && <Pagination page={page} totalPages={totalPages} />}
    </>
  )
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const { period, page: pageParam } = await searchParams
  const timeWindow = period === 'week' ? 'week' : 'day'
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  return (
    <PageShell>
      <div className="border-b border-border">
        <Container className="py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Trending
            </h1>

            <div className="flex gap-1 rounded-md border border-border bg-surface p-1">
              <Link
                href="/trending"
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  timeWindow === 'day'
                    ? 'bg-surface-2 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Today
              </Link>
              <Link
                href="/trending?period=week"
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  timeWindow === 'week'
                    ? 'bg-surface-2 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                This week
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <Suspense key={`${timeWindow}-${page}`} fallback={<MovieGridSkeleton count={20} />}>
          <TrendingResults timeWindow={timeWindow} page={page} />
        </Suspense>
      </Container>
    </PageShell>
  )
}
