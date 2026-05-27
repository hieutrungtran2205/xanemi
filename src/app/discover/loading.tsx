import { MovieGridSkeleton } from '@/components/movie/movie-grid'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'

export default function DiscoverLoading() {
  return (
    <PageShell>
      <div className="border-b border-border">
        <Container className="py-6">
          <div className="h-7 w-40 animate-pulse rounded bg-surface-2" />
        </Container>
      </div>

      <Container className="py-10">
        <MovieGridSkeleton count={20} />
      </Container>
    </PageShell>
  )
}
