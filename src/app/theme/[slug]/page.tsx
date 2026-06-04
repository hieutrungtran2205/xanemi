import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getThemeMovies } from '@/lib/tmdb/endpoints'
import { THEMES } from '@/lib/themes/definitions'
import { ThemeHero } from '@/components/movie/theme-hero'
import { MovieGrid } from '@/components/movie/movie-grid'
import { Pagination } from '@/components/movie/pagination'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const theme = THEMES.find((t) => t.slug === slug)
  if (!theme) return { title: 'Not Found' }
  return {
    title: `${theme.title} — Xanemi`,
    description: theme.description,
  }
}

export default async function ThemeDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: rawPage } = await searchParams

  const theme = THEMES.find((t) => t.slug === slug)
  if (!theme) notFound()

  const page = Math.min(Math.max(parseInt(rawPage ?? '1', 10) || 1, 1), 500)

  const moviesData = await getThemeMovies(slug, theme.query, page)
  const totalPages = Math.min(moviesData.total_pages, 500)

  if (totalPages > 0 && page > totalPages) {
    redirect(`/theme/${slug}?page=${totalPages}`)
  }

  const backdropPath = moviesData.results[0]?.backdrop_path ?? null

  return (
    <PageShell>
      <ThemeHero
        backdropPath={backdropPath}
        title={theme.title}
        description={theme.description}
      />
      <Container className="relative -mt-20 py-10 sm:py-12">
        <MovieGrid movies={moviesData.results} priority={page === 1} />
        <Pagination page={page} totalPages={totalPages} />
      </Container>
    </PageShell>
  )
}
