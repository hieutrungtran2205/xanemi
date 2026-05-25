import { Suspense } from "react";
import { getTrending } from "@/lib/tmdb/endpoints";
import { MovieGrid, MovieGridSkeleton } from "@/components/movie/movie-grid";
import { HeroBanner } from "@/components/layout/hero-banner";

async function TrendingSection() {
  const data = await getTrending();
  return <MovieGrid movies={data.results} priority />;
}

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroBanner />

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <section className="py-16 sm:py-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Trending
            </h2>
            <a
              href="/trending"
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              Show more →
            </a>
          </div>
          <Suspense fallback={<MovieGridSkeleton count={10} />}>
            <TrendingSection />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
