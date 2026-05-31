import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { PersonHeroSkeleton } from "@/components/person/person-hero";
import { MovieGridSkeleton } from "@/components/movie/movie-grid";

export default function Loading() {
  return (
    <PageShell>
      <PersonHeroSkeleton />

      <Container className="py-12">
        <section>
          <SectionHeading title="Filmography" />
          <MovieGridSkeleton count={10} />
        </section>
      </Container>
    </PageShell>
  );
}
