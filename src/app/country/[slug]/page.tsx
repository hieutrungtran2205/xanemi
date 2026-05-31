import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getCountryMovies } from '@/lib/tmdb/endpoints'
import { COUNTRIES } from '@/lib/countries/definitions'
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
  const country = COUNTRIES.find((c) => c.slug === slug)
  if (!country) return { title: 'Not Found' }
  return {
    title: `${country.title} — Moodflix`,
    description: country.description,
  }
}

export default async function CountryDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: rawPage } = await searchParams

  const country = COUNTRIES.find((c) => c.slug === slug)
  if (!country) notFound()

  const page = Math.min(Math.max(parseInt(rawPage ?? '1', 10) || 1, 1), 500)

  const moviesData = await getCountryMovies(slug, country.query, page)
  const totalPages = Math.min(moviesData.total_pages, 500)

  if (totalPages > 0 && page > totalPages) {
    redirect(`/country/${slug}?page=${totalPages}`)
  }

  const backdropPath = moviesData.results[0]?.backdrop_path ?? null

  return (
    <PageShell>
      <ThemeHero
        backdropPath={backdropPath}
        label="Cinema"
        title={country.title}
        description={country.description}
      />
      <Container className="relative -mt-20 py-10 sm:py-12">
        <MovieGrid movies={moviesData.results} priority={page === 1} />
        <Pagination page={page} totalPages={totalPages} />
      </Container>
    </PageShell>
  )
}
