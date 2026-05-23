import { Suspense } from "react";
import { getTrending } from "@/lib/tmdb/endpoints";
import { MovieGrid, MovieGridSkeleton } from "@/components/movie/movie-grid";
import { MoodPicker } from "@/components/mood/mood-picker";

async function TrendingSection() {
  const data = await getTrending();
  return <MovieGrid movies={data.results} priority />;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Mood picker */}
        <section className="py-16 sm:py-20">
          <h1 className="mb-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What&apos;s your mood?
          </h1>
          <p className="mb-10 text-base text-muted-foreground">
            Pick a feeling. We&apos;ll find the film.
          </p>
          <MoodPicker />
        </section>

        {/* Trending */}
        <section className="pb-20">
          <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight text-foreground">
            Trending
          </h2>
          <Suspense fallback={<MovieGridSkeleton count={10} />}>
            <TrendingSection />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
