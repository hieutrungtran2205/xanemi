import Image from "next/image";
import { getTrending } from "@/lib/tmdb/endpoints";
import { backdropUrl } from "@/lib/tmdb/utils";
import { MoodPicker } from "@/components/mood/mood-picker";
import { Container } from "./container";

export async function HeroBanner() {
  const trending = await getTrending();
  const featured = trending.results.find((m) => m.backdrop_path);
  const backdrop = backdropUrl(featured?.backdrop_path ?? null, "original");

  return (
    <section className="relative flex min-h-[60vh] items-end pb-12 sm:min-h-[75vh] sm:pb-16">
      {backdrop && (
        <Image
          src={backdrop}
          alt={featured?.title ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-transparent" />

      <Container className="relative z-10 w-full">
        <h1 className="mb-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What&apos;s your mood tonight?
        </h1>
        <p className="mb-8 text-base text-white/70">
          Pick a feeling. We&apos;ll find the film.
        </p>
        <MoodPicker variant="hero" />
      </Container>
    </section>
  );
}
