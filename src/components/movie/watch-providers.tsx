import Image from "next/image";
import type { WatchProvidersRegion } from "@/lib/tmdb/types";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w92";

interface Props {
  providers: WatchProvidersRegion;
}

function ProviderGroup({
  label,
  items,
}: {
  label: string;
  items: WatchProvidersRegion["flatrate"];
}) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <div
            key={p.provider_id}
            title={p.provider_name}
            className="relative h-9 w-9 overflow-hidden rounded-md"
          >
            <Image
              src={`${IMAGE_BASE}${p.logo_path}`}
              alt={p.provider_name}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatchProviders({ providers }: Props) {
  const hasAny =
    providers.flatrate?.length ||
    providers.rent?.length ||
    providers.buy?.length;

  if (!hasAny) return null;

  return (
    <div className="flex flex-col gap-4">
      <ProviderGroup label="Stream" items={providers.flatrate} />
      <ProviderGroup label="Rent" items={providers.rent} />
      <ProviderGroup label="Buy" items={providers.buy} />
    </div>
  );
}
