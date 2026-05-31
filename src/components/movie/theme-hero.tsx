import Image from 'next/image'
import { backdropUrl } from '@/lib/tmdb/utils'
import { BackButton } from '@/components/layout/back-button'

interface Props {
  backdropPath: string | null
  title: string
  description: string
}

export function ThemeHero({ backdropPath, title, description }: Props) {
  const backdrop = backdropUrl(backdropPath, 'original')

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[50vh] min-h-72 w-full bg-surface">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 via-40% to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-6">
          <BackButton />
        </div>
      </div>

      <div className="relative -mt-44 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-2xl pb-2 md:pb-6">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/65">
              Theme
            </span>
            <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThemeHeroSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="h-[50vh] min-h-72 animate-pulse bg-surface" />
      <div className="relative -mt-44 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-2xl pb-2 md:pb-6">
            <div className="h-3 w-14 animate-pulse rounded bg-surface-2" />
            <div className="mt-2 h-10 w-12 animate-pulse rounded bg-surface-2" />
            <div className="mt-3 h-9 w-64 animate-pulse rounded bg-surface-2" />
            <div className="mt-3 h-4 w-full max-w-sm animate-pulse rounded bg-surface-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
