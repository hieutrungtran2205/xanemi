import Link from 'next/link'
import { Suspense } from 'react'
import { getTrending } from '@/lib/tmdb/endpoints'
import { MovieGridSkeleton } from '@/components/movie/movie-grid'
import { MovieResults } from '@/components/movie/movie-results'
import { PageHeader } from '@/components/layout/page-header'
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
  return <MovieResults data={data} page={page} />
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const { period, page: pageParam } = await searchParams
  const timeWindow = period === 'week' ? 'week' : 'day'
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  return (
    <PageShell>
      <PageHeader
        title="Trending"
        actions={
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
        }
      />

      <Container className="py-10">
        <Suspense key={`${timeWindow}-${page}`} fallback={<MovieGridSkeleton count={20} />}>
          <TrendingResults timeWindow={timeWindow} page={page} />
        </Suspense>
      </Container>
    </PageShell>
  )
}
