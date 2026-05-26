import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { MOOD_DEFINITIONS } from '@/lib/moods/definitions'
import { getMoviesByMood } from '@/lib/moods/engine'
import { MovieGrid, MovieGridSkeleton } from '@/components/movie/movie-grid'
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
      {/* Mood hero */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div style={{ borderLeftColor: moodDef.accent }} className="border-l-[3px] pl-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{moodDef.emoji}</span>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {moodDef.label}
              </h1>
            </div>
            <p className="mt-2 text-base text-muted-foreground">{moodDef.description}</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <Suspense key={page} fallback={<MovieGridSkeleton count={20} />}>
          <MoodResults moodId={moodDef.id} page={page} />
        </Suspense>
      </div>
    </main>
  )
}

async function MoodResults({ moodId, page }: { moodId: MoodId; page: number }) {
  const data = await getMoviesByMood(moodId, page)

  if (data.results.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">No films found for this mood.</p>
      </div>
    )
  }

  const totalPages = Math.min(data.total_pages, 500)

  return (
    <>
      <MovieGrid movies={data.results} />
      <Pagination page={page} totalPages={totalPages} />
    </>
  )
}

