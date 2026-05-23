import { MovieHeroSkeleton } from "@/components/movie/movie-hero";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <MovieHeroSkeleton />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        {/* Synopsis skeleton */}
        <section className="mb-12">
          <div className="mb-4 h-6 w-24 animate-pulse rounded bg-surface-2" />
          <div className="max-w-3xl space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-surface-2" />
          </div>
        </section>

        {/* Cast skeleton */}
        <section>
          <div className="mb-4 h-6 w-16 animate-pulse rounded bg-surface-2" />
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="aspect-2/3 animate-pulse rounded-lg bg-surface-2" />
                <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-surface-2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
