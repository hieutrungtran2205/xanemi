import Image from 'next/image'
import Link from 'next/link'
import { getCountryMovies } from '@/lib/tmdb/endpoints'
import { backdropUrl } from '@/lib/tmdb/utils'
import type { CountryDefinition } from '@/lib/countries/definitions'

interface Props {
  country: CountryDefinition
  priority?: boolean
}

export async function CountryCard({ country, priority = false }: Props) {
  const data = await getCountryMovies(country.slug, country.query, 1)
  const backdrop = backdropUrl(data.results[0]?.backdrop_path ?? null, 'w1280')

  return (
    <Link
      href={`/country/${country.slug}`}
      className="group relative block aspect-video overflow-hidden rounded-xl"
    >
      {backdrop ? (
        <Image
          src={backdrop}
          alt={country.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-surface-2" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-heading text-xl font-bold text-white">{country.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-white/65">{country.description}</p>
      </div>
    </Link>
  )
}

export function CountryCardSkeleton() {
  return <div className="aspect-video animate-pulse rounded-xl bg-surface-2" />
}
