import { MovieGridSkeleton } from '@/components/movie/movie-grid'
import { FilterPanelSkeleton } from '@/components/filter/filter-panel'
import { Skeleton } from '@/components/ui/skeleton'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'

export default function DiscoverLoading() {
  return (
    <PageShell>
      <div className="border-b border-border">
        <Container className="py-6">
          <Skeleton className="h-7 w-40 rounded" />
        </Container>
      </div>

      <Container className="py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <FilterPanelSkeleton />
          <div className="min-w-0 flex-1">
            <MovieGridSkeleton count={20} />
          </div>
        </div>
      </Container>
    </PageShell>
  )
}
