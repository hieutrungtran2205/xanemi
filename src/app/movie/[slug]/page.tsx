import { notFound } from "next/navigation";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getMovieSimilar,
} from "@/lib/tmdb/endpoints";
import { parseSlug } from "@/lib/tmdb/utils";
import { MovieHero } from "@/components/movie/movie-hero";
import { MovieGrid } from "@/components/movie/movie-grid";
import { TrailerEmbed } from "@/components/player/trailer-embed";
import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { PersonCreditCard } from "@/components/person/person-credit-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MoviePage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { tmdbId } = parsed;

  const [movie, credits, videos, similar] = await Promise.all([
    getMovieDetail(tmdbId).catch(() => null),
    getMovieCredits(tmdbId).catch(() => null),
    getMovieVideos(tmdbId).catch(() => null),
    getMovieSimilar(tmdbId).catch(() => null),
  ]);

  if (!movie) notFound();

  const cast = credits?.cast.slice(0, 10) ?? [];
  const directors = credits?.crew.filter((c) => c.job === "Director") ?? [];

  // Prefer official YouTube trailer, fall back to any YouTube trailer
  const trailer =
    videos?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ?? videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");


  return (
    <PageShell>
      <MovieHero movie={movie} />

      <Container className="py-8">
        {movie.overview && (
          <section className="mb-8 max-w-3xl">
            <SectionHeading title="Overview" />
            <p className="text-base leading-relaxed text-muted-foreground">
              {movie.overview}
            </p>
          </section>
        )}

        {trailer && (
          <section className="mb-8">
            <SectionHeading title="Trailer" />
            <div className="max-w-3xl">
              <TrailerEmbed videoKey={trailer.key} title={movie.title} />
            </div>
          </section>
        )}

        {directors.length > 0 && (
          <section className="mb-8">
            <SectionHeading
              title={directors.length > 1 ? "Directors" : "Director"}
            />
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
              {directors.map((d) => (
                <PersonCreditCard
                  key={d.credit_id}
                  id={d.id}
                  name={d.name}
                  profilePath={d.profile_path}
                  role={d.job}
                />
              ))}
            </div>
          </section>
        )}

        {cast.length > 0 && (
          <section className="mb-8">
            <SectionHeading title="Cast" />
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
              {cast.map((member) => (
                <PersonCreditCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  profilePath={member.profile_path}
                  role={member.character}
                />
              ))}
            </div>
          </section>
        )}

        {similar && similar.results.length > 0 && (
          <section>
            <SectionHeading title="More Like This" className="mb-6" />
            <MovieGrid movies={similar.results.slice(0, 10)} />
          </section>
        )}
      </Container>
    </PageShell>
  );
}
