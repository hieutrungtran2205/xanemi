import Image from "next/image";
import Link from "next/link";
import { profileUrl, toPersonSlug } from "@/lib/tmdb/utils";

interface Props {
  id: number;
  name: string;
  profilePath: string | null;
  // Role label under the name — "character" for cast, "job" for crew.
  role: string;
}

export function PersonCreditCard({ id, name, profilePath, role }: Props) {
  const photo = profileUrl(profilePath, "w185");

  return (
    <Link
      href={`/person/${toPersonSlug({ id, name })}`}
      className="group flex flex-col gap-1.5"
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 640px) 20vw, (max-width: 768px) 14vw, 10vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            —
          </div>
        )}
      </div>
      <p className="truncate text-xs font-semibold leading-tight text-foreground">
        {name}
      </p>
      <p className="truncate text-xs leading-tight text-muted-foreground">
        {role}
      </p>
    </Link>
  );
}
