import { notFound } from "next/navigation";
import {
  getPersonDetail,
  getPersonMovieCredits,
} from "@/lib/tmdb/endpoints";
import { parseSlug } from "@/lib/tmdb/utils";
import type { Movie, PersonMovieCastCredit } from "@/lib/tmdb/types";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { MovieGrid } from "@/components/movie/movie-grid";
import { PersonHero } from "@/components/person/person-hero";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const KNOWN_FOR_COUNT = 5;
// Hide the Known For section for people with short filmographies — the full
// grid already fits on screen, so a separate section would just duplicate cards.
const KNOWN_FOR_MIN_FILMOGRAPHY = 15;

// Cast can contain the same movie multiple times (multiple credits per person).
// Keep the first occurrence — that's typically the primary role.
function dedupeById(credits: PersonMovieCastCredit[]): PersonMovieCastCredit[] {
  const seen = new Set<number>();
  const out: PersonMovieCastCredit[] = [];
  for (const c of credits) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

function pickKnownFor(credits: PersonMovieCastCredit[], n: number): PersonMovieCastCredit[] {
  return [...credits]
    .filter((c) => c.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, n);
}

// Hero backdrop = most popular movie that has one. Returns null when no credit qualifies.
function pickHeroBackdrop(credits: PersonMovieCastCredit[]): string | null {
  return (
    [...credits]
      .filter((c) => c.backdrop_path)
      .sort((a, b) => b.popularity - a.popularity)[0]?.backdrop_path ?? null
  );
}

// Sort by release_date desc, empty dates pushed to the end.
function sortByReleaseDesc(credits: PersonMovieCastCredit[]): PersonMovieCastCredit[] {
  return [...credits].sort((a, b) => {
    const ad = a.release_date || "";
    const bd = b.release_date || "";
    if (!ad && !bd) return 0;
    if (!ad) return 1;
    if (!bd) return -1;
    return bd.localeCompare(ad);
  });
}

export default async function PersonPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { tmdbId } = parsed;

  const [person, credits] = await Promise.all([
    getPersonDetail(tmdbId).catch(() => null),
    getPersonMovieCredits(tmdbId).catch(() => null),
  ]);

  if (!person) notFound();

  const allCast = credits ? dedupeById(credits.cast) : [];
  const filmography = sortByReleaseDesc(allCast);
  const showKnownFor = allCast.length >= KNOWN_FOR_MIN_FILMOGRAPHY;
  const knownFor = showKnownFor ? pickKnownFor(allCast, KNOWN_FOR_COUNT) : [];
  const heroBackdrop = pickHeroBackdrop(allCast);

  return (
    <PageShell>
      <PersonHero person={person} backdropPath={heroBackdrop} />

      <Container className="py-12">
        {knownFor.length > 0 && (
          <section>
            <SectionHeading title="Known For" />
            <MovieGrid movies={knownFor as Movie[]} />
          </section>
        )}

        {filmography.length > 0 && (
          <section className={knownFor.length > 0 ? "mt-16" : undefined}>
            <SectionHeading title={`Filmography (${filmography.length})`} />
            <MovieGrid movies={filmography as Movie[]} />
          </section>
        )}
      </Container>
    </PageShell>
  );
}
