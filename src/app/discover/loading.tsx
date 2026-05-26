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
        <MovieGridSkeleton count={20} />
      </div>
    </main>
  )
}
