import Link from "next/link";
import { getTrending } from "@/lib/tmdb/endpoints";
import { MovieGrid, MovieGridSkeleton } from "@/components/movie/movie-grid";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

async function Grid({ timeWindow }: { timeWindow: "day" | "week" }) {
  const data = await getTrending(timeWindow);
  return <MovieGrid movies={data.results} />;
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const { period } = await searchParams;
  const timeWindow = period === "week" ? "week" : "day";

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Trending
            </h1>

            {/* Period toggle */}
            <div className="flex gap-1 rounded-md border border-border bg-surface p-1">
              <Link
                href="/trending"
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  timeWindow === "day"
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Today
              </Link>
              <Link
                href="/trending?period=week"
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  timeWindow === "week"
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                This week
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <Suspense fallback={<MovieGridSkeleton count={20} />}>
          <Grid timeWindow={timeWindow} />
        </Suspense>
      </div>
    </main>
  );
}