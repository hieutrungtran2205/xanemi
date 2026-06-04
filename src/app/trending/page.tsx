import Link from 'next/link'
import { getTrending } from '@/lib/tmdb/endpoints'
import { MovieGrid } from '@/components/movie/movie-grid'
import { Pagination } from '@/components/movie/pagination'
import { ThemeHero } from '@/components/movie/theme-hero'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'

interface PageProps {
  searchParams: Promise<{ period?: string; page?: string }>
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const { period, page: pageParam } = await searchParams
  const timeWindow = period === 'week' ? 'week' : 'day'
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const data = await getTrending(timeWindow, page)
  const totalPages = Math.min(data.total_pages, 10)
  const backdropPath = data.results[0]?.backdrop_path ?? null

  return (
    <PageShell>
      <ThemeHero
        backdropPath={backdropPath}
        label="Trending"
        title="What's Hot Right Now"
        description="The movies everyone's watching — updated daily."
      >
        <div className="relative z-10 flex w-full gap-1 rounded-md border border-border bg-surface/60 p-1 sm:w-auto">
          <Link
            href="/trending"
            className={`flex-1 whitespace-nowrap rounded px-3 py-2 text-center text-sm font-medium transition-colors duration-200 sm:flex-initial sm:py-1.5 ${
              timeWindow === 'day'
                ? 'bg-surface-2 text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Today
          </Link>
          <Link
            href="/trending?period=week"
            className={`flex-1 whitespace-nowrap rounded px-3 py-2 text-center text-sm font-medium transition-colors duration-200 sm:flex-initial sm:py-1.5 ${
              timeWindow === 'week'
                ? 'bg-surface-2 text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            This week
          </Link>
        </div>
      </ThemeHero>

      <Container className="relative -mt-20 py-10 sm:py-12">
        <MovieGrid movies={data.results} priority={page === 1} />
        <Pagination page={page} totalPages={totalPages} />
      </Container>
    </PageShell>
  )
}
