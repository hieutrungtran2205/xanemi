import Image from "next/image";
import {
  backdropUrl,
  calcAge,
  formatDate,
  profileUrl,
} from "@/lib/tmdb/utils";
import { SectionHeading } from "@/components/layout/section-heading";
import { BiographyText } from "@/components/person/biography-text";
import { Skeleton } from "@/components/ui/skeleton";
import type { PersonDetail } from "@/lib/tmdb/types";

interface Props {
  person: PersonDetail;
  // Backdrop pulled from the person's most popular movie (full path from TMDB).
  // null → render the hero without a backdrop image.
  backdropPath: string | null;
}

export function PersonHero({ person, backdropPath }: Props) {
  const backdrop = backdropUrl(backdropPath, "original");
  const photo = profileUrl(person.profile_path, "h632");
  const born = formatDate(person.birthday);
  const died = formatDate(person.deathday);
  const age = calcAge(person.birthday, person.deathday);
  const facts: string[] = [];
  if (born) facts.push(`Born ${born}`);
  if (died) facts.push(`Died ${died}${age !== null ? ` (age ${age})` : ""}`);
  else if (age !== null) facts.push(`Age ${age}`);
  if (person.place_of_birth) facts.push(person.place_of_birth);

  return (
    <section>
      {/* Backdrop — falls back to surface when there's no movie image */}
      <div className="relative h-[50vh] min-h-80 w-full overflow-hidden bg-surface">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 via-40% to-background/10" />
      </div>

      {/* Photo + info overlapping backdrop bottom */}
      <div className="relative -mt-32 md:-mt-48">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-10">
            <div className="w-36 shrink-0 sm:w-48 md:w-60">
              <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface shadow-2xl">
                {photo ? (
                  <Image
                    src={photo}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 240px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No photo
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 pb-2 md:pb-4">
              <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {person.name}
              </h1>

              {person.known_for_department && (
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {person.known_for_department}
                </p>
              )}

              {facts.length > 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {facts.map((f, i) => (
                    <span key={i}>
                      {i > 0 && <span aria-hidden className="mx-2">·</span>}
                      {f}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {person.biography && (
            <section className="mt-12 max-w-3xl">
              <SectionHeading title="Biography" className="mb-4 text-lg" />
              <BiographyText text={person.biography} />
            </section>
          )}
        </div>
      </div>
    </section>
  );
}

export function PersonHeroSkeleton() {
  return (
    <section>
      <Skeleton className="h-[50vh] min-h-72 w-full rounded-none bg-surface" />

      <div className="relative -mt-32 md:-mt-48">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-10">
            <div className="w-36 shrink-0 sm:w-48 md:w-60">
              <Skeleton className="aspect-2/3 rounded-lg" />
            </div>

            <div className="min-w-0 flex-1 pb-2 md:pb-4">
              <Skeleton className="h-12 w-3/4 rounded sm:h-14 md:h-16" />
              <Skeleton className="mt-4 h-3 w-28 rounded" />
              <Skeleton className="mt-4 h-4 w-2/3 rounded" />
            </div>
          </div>

          <div className="mt-12 max-w-3xl space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
