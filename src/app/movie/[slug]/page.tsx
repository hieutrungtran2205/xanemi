import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getMovieWatchProviders,
  getMovieSimilar,
} from "@/lib/tmdb/endpoints";
import { profileUrl } from "@/lib/tmdb/utils";
import { MovieHero } from "@/components/movie/movie-hero";
import { MovieGrid } from "@/components/movie/movie-grid";
import { TrailerEmbed } from "@/components/player/trailer-embed";
import { WatchProviders } from "@/components/movie/watch-providers";
import { BackButton } from "@/components/layout/back-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MoviePage({ params }: PageProps) {
  const { slug } = await params;
  const tmdbId = Number(slug);
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) notFound();

  const [movie, credits, videos, watchProviders, similar] = await Promise.all([
    getMovieDetail(tmdbId).catch(() => null),
    getMovieCredits(tmdbId).catch(() => null),
    getMovieVideos(tmdbId).catch(() => null),
    getMovieWatchProviders(tmdbId).catch(() => null),
    getMovieSimilar(tmdbId).catch(() => null),
  ]);

  if (!movie) notFound();

  const cast = credits?.cast.slice(0, 10) ?? [];

  // Prefer official YouTube trailer, fall back to any YouTube trailer
  const trailer =
    videos?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ?? videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  const usProviders = watchProviders?.results?.["US"] ?? null;

  return (
    <main className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-6">
          <BackButton />
        </div>
        <MovieHero movie={movie} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        {/* Synopsis + Watch Providers row */}
        <div className="mb-12 flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Synopsis */}
          {movie.overview && (
            <section className="min-w-0 flex-1">
              <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight text-foreground">
                Synopsis
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {movie.overview}
              </p>
            </section>
          )}

          {/* Watch Providers */}
          {usProviders && (
            <section className="lg:w-52 lg:shrink-0">
              <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight text-foreground">
                Where to Watch
              </h2>
              <WatchProviders providers={usProviders} />
            </section>
          )}
        </div>

        {/* Trailer */}
        {trailer && (
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight text-foreground">
              Trailer
            </h2>
            <div className="max-w-3xl">
              <TrailerEmbed videoKey={trailer.key} title={movie.title} />
            </div>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight text-foreground">
              Cast
            </h2>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10">
              {cast.map((member) => {
                const photo = profileUrl(member.profile_path, "w185");
                return (
                  <div key={member.id} className="flex flex-col gap-1.5">
                    <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 20vw, (max-width: 768px) 14vw, 10vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          —
                        </div>
                      )}
                    </div>
                    <p className="truncate text-xs font-semibold leading-tight text-foreground">
                      {member.name}
                    </p>
                    <p className="truncate text-xs leading-tight text-muted-foreground">
                      {member.character}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {/* Similar Movies */}
        {similar && similar.results.length > 0 && (
          <section>
            <h2 className="mb-6 font-heading text-xl font-semibold tracking-tight text-foreground">
              Similar Movies
            </h2>
            <MovieGrid movies={similar.results.slice(0, 10)} />
          </section>
        )}
      </div>
    </main>
  );
}
