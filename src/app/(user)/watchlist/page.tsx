import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { getWatchlist } from '@/lib/watchlist/queries'
import { PageShell } from '@/components/layout/page-shell'
import { PageHeader } from '@/components/layout/page-header'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { WatchlistCard } from '@/components/movie/watchlist-card'

export const metadata: Metadata = {
  title: 'Your Watchlist',
}

export default async function WatchlistPage() {
  const session = await auth()
  // Layout guard guarantees a session, but TS needs the narrowing.
  const userId = session!.user.id
  const items = await getWatchlist(userId)

  return (
    <PageShell>
      <PageHeader title={`Your Watchlist${items.length ? ` (${items.length})` : ''}`} />
      <Container className="py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-base text-muted-foreground">
              Your watchlist is empty.
            </p>
            <Button asChild>
              <Link href="/discover">Browse movies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => (
              <WatchlistCard
                key={item.id}
                movie={{
                  id: item.tmdbId,
                  title: item.snapshot.title,
                  poster_path: item.snapshot.posterPath,
                  release_date: item.snapshot.releaseDate,
                  vote_average: item.snapshot.voteAverage,
                }}
              />
            ))}
          </div>
        )}
      </Container>
    </PageShell>
  )
}
