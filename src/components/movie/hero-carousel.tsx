'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

export interface HeroSlide {
  id: number
  title: string
  slug: string
  backdrop: string | null
  year: string
  rating: string
  voteCount: number
  overview: string
  genres: string[]
  rank: number
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    // Embla starts at index 0, matching the initial state — only subscribe to changes.
    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <section aria-label="Featured trending movies">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="ml-0">
          {slides.map((slide, i) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-[65vh] min-h-85 w-full overflow-hidden bg-surface">
                {slide.backdrop && (
                  <Image
                    src={slide.backdrop}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    className="object-cover object-top"
                  />
                )}
                {/* Bottom + left fade so title/meta stays readable on any backdrop */}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 via-35% to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 pb-12 sm:pb-16">
                  <Container>
                    <div className="max-w-2xl">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Trending #{slide.rank}
                      </span>
                      <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        {slide.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        {slide.year && <span>{slide.year}</span>}
                        <span aria-hidden>·</span>
                        <span className="text-gold">★</span>
                        <span className="text-foreground">{slide.rating}</span>
                        {slide.voteCount > 0 && (
                          <span>({slide.voteCount.toLocaleString()})</span>
                        )}
                        {slide.genres.length > 0 && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{slide.genres.join(' · ')}</span>
                          </>
                        )}
                      </div>
                      {slide.overview && (
                        <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                          {slide.overview}
                        </p>
                      )}
                      <Button asChild size="lg" className="mt-6">
                        <Link href={`/movie/${slide.slug}`}>View details</Link>
                      </Button>
                    </div>
                  </Container>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Center via top (not -translate-y-1/2) so the Button's active:translate-y-px press doesn't clobber centering */}
        <CarouselPrevious className="left-4 top-[calc(50%-1rem)] hidden translate-y-0 sm:inline-flex" />
        <CarouselNext className="right-4 top-[calc(50%-1rem)] hidden translate-y-0 sm:inline-flex" />

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selected}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-200',
                i === selected
                  ? 'w-6 bg-foreground'
                  : 'w-1.5 bg-foreground/40 hover:bg-foreground/60'
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
