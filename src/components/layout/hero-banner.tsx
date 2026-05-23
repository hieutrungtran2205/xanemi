import Image from "next/image";
import { getTrending } from "@/lib/tmdb/endpoints";
import { backdropUrl } from "@/lib/tmdb/utils";
import { MoodPicker } from "@/components/mood/mood-picker";

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
      {/* base darkening layer */}
      <div className="absolute inset-0 bg-black/70" />
      {/* directional gradient — heavier at bottom where text sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8">
        <h1 className="mb-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What&apos;s your mood tonight?
        </h1>
        <p className="mb-8 text-base text-white/70">
          Pick a feeling. We&apos;ll find the film.
        </p>
        <MoodPicker variant="hero" />
      </div>
    </section>
  );
}