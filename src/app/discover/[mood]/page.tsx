import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { MOOD_DEFINITIONS } from '@/lib/moods/definitions'
import { getMoviesByMood } from '@/lib/moods/engine'
import { MovieGrid, MovieGridSkeleton } from '@/components/movie/movie-grid'
import { MoodMovieHero, MoodMovieHeroSkeleton } from '@/components/movie/mood-movie-hero'
import { Pagination } from '@/components/movie/pagination'
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
    <main className="min-h-screen bg-background">
      {/* Hero + results */}
      <Suspense
        key={page}
        fallback={
          <>
            <MoodMovieHeroSkeleton />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
              <MovieGridSkeleton count={19} />
            </div>
          </>
        }
      >
        <MoodResults moodId={moodDef.id} moodDef={moodDef} page={page} />
      </Suspense>
    </main>
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

  const totalPages = Math.min(data.total_pages, 50)

  return (
    <>
      <MoodMovieHero movie={heroMovie} mood={moodDef} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          More films for this mood
        </p>
        <MovieGrid movies={restMovies} />
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </>
  )
}
