import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { MOOD_DEFINITIONS } from '@/lib/moods/definitions'
import { getMoviesByMood } from '@/lib/moods/engine'
import { MovieGridSkeleton } from '@/components/movie/movie-grid'
import { MovieResults } from '@/components/movie/movie-results'
import { MoodMovieHero, MoodMovieHeroSkeleton } from '@/components/movie/mood-movie-hero'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'
import type { MoodId } from '@/lib/moods/types'

interface PageProps {
  params: Promise<{ mood: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DiscoverPage({ params, searchParams }: PageProps) {
  const { mood: moodSlug } = await params
  const moodDef = MOOD_DEFINITIONS[moodSlug as MoodId]
  if (!moodDef) notFound()

  const rawParams = await searchParams
  const page = Math.max(1, parseInt((rawParams.page as string) ?? '1', 10) || 1)

  return (
    <PageShell>
      <Suspense
        key={page}
        fallback={
          <>
            <MoodMovieHeroSkeleton />
            <Container className="py-10">
              <MovieGridSkeleton count={19} />
            </Container>
          </>
        }
      >
        <MoodResults moodId={moodDef.id} moodDef={moodDef} page={page} />
      </Suspense>
    </PageShell>
  )
}

async function MoodResults({
  moodId,
  moodDef,
  page,
}: {
  moodId: MoodId
  moodDef: (typeof MOOD_DEFINITIONS)[MoodId]
  page: number
}) {
  const data = await getMoviesByMood(moodId, page)

  if (data.results.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">No films found for this mood.</p>
      </div>
    )
  }

  const heroMovie = data.results[0]
  const restMovies = data.results.slice(1)

  return (
    <>
      <MoodMovieHero movie={heroMovie} mood={moodDef} />

      <Container className="py-10">
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          More films for this mood
        </p>
        <MovieResults
          data={{ results: restMovies, total_pages: data.total_pages }}
          page={page}
        />
      </Container>
    </>
  )
}
