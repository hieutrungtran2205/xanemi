import { Suspense } from "react";
import { getTrending } from "@/lib/tmdb/endpoints";
import { MovieGrid, MovieGridSkeleton } from "@/components/movie/movie-grid";
import { HeroBanner } from "@/components/layout/hero-banner";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";

async function TrendingSection() {
  const data = await getTrending();
  return <MovieGrid movies={data.results} priority />;
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
      </Container>
    </PageShell>
  );
}
