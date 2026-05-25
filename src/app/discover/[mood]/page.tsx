import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOOD_DEFINITIONS } from '@/lib/moods/definitions'
import { getMoviesByMood } from '@/lib/moods/engine'
import { MovieGrid } from '@/components/movie/movie-grid'
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

  const data = await getMoviesByMood(moodDef.id, page)

  const hasMore = page < Math.min(data.total_pages, 10)
  const showMoreHref = buildShowMoreHref(moodDef.id, page + 1)

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
        {data.results.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground">No films found for this mood.</p>
          </div>
        ) : (
          <>
            <MovieGrid movies={data.results} />

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Link
                  href={showMoreHref}
                  className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-2"
                >
                  Show more
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

function buildShowMoreHref(moodId: string, nextPage: number): string {
  return nextPage > 1 ? `/discover/${moodId}?page=${nextPage}` : `/discover/${moodId}`
}
