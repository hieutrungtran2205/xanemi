import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { BackButton } from "@/components/layout/back-button";
import { SectionHeading } from "@/components/layout/section-heading";
import { PersonHeroSkeleton } from "@/components/person/person-hero";
import { MovieGridSkeleton } from "@/components/movie/movie-grid";

export default function Loading() {
  return (
    <PageShell>
      <div className="relative">
        <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-6">
          <BackButton />
        </div>
        <PersonHeroSkeleton />
      </div>

      <Container className="py-12">
        <section>
          <SectionHeading title="Filmography" />
          <MovieGridSkeleton count={10} />
        </section>
      </Container>
    </PageShell>
  );
}
