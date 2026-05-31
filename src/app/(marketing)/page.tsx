import { Suspense } from 'react'
import { getTrending } from '@/lib/tmdb/endpoints'
import { MovieGrid, MovieGridSkeleton } from '@/components/movie/movie-grid'
import { HeroBanner } from '@/components/layout/hero-banner'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'
import { SectionHeading } from '@/components/layout/section-heading'
import { ThemeCard, ThemeCardSkeleton } from '@/components/movie/theme-card'
import { THEMES } from '@/lib/themes/definitions'

async function TrendingSection() {
  const data = await getTrending()
  return <MovieGrid movies={data.results} priority />
}

export default async function HomePage() {
  return (
    <PageShell>
      <HeroBanner />

      <Container>
        <section className="py-16 sm:py-20">
          <SectionHeading title="Trending" href="/trending" />
          <Suspense fallback={<MovieGridSkeleton count={10} />}>
            <TrendingSection />
          </Suspense>
        </section>

        <section id="themes" className="pb-16 sm:pb-20">
          <SectionHeading title="What to Watch?" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((theme, i) => (
              <Suspense key={theme.slug} fallback={<ThemeCardSkeleton />}>
                <ThemeCard theme={theme} priority={i < 3} />
              </Suspense>
            ))}
          </div>
        </section>
      </Container>
    </PageShell>
  )
}
