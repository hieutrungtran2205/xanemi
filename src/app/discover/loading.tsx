import { MovieGridSkeleton } from '@/components/movie/movie-grid'

export default function DiscoverLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
          <div className="h-7 w-40 animate-pulse rounded bg-surface-2" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Filter sidebar skeleton */}
          <div className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-surface-2" />
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <MovieGridSkeleton count={20} />
          </div>
        </div>
      </div>
    </main>
  )
}
