import { ThemeHeroSkeleton } from '@/components/movie/theme-hero'
import { MovieGridSkeleton } from '@/components/movie/movie-grid'
import { Container } from '@/components/layout/container'
import { PageShell } from '@/components/layout/page-shell'

export default function ThemeDetailLoading() {
  return (
    <PageShell>
      <ThemeHeroSkeleton />
      <Container className="relative -mt-20 py-10 sm:py-12">
        <MovieGridSkeleton count={20} />
      </Container>
    </PageShell>
  )
}
