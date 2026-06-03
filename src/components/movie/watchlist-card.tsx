'use client'

import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { MovieCard } from './movie-card'
import { Button } from '@/components/ui/button'
import { removeFromWatchlist } from '@/lib/watchlist/actions'
import type { Movie } from '@/lib/tmdb/types'

type CardMovie = Pick<
  Movie,
  'id' | 'title' | 'poster_path' | 'release_date' | 'vote_average'
>

export function WatchlistCard({ movie }: { movie: CardMovie }) {
  const [removed, setRemoved] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (removed) return null

  function remove() {
    setRemoved(true) // optimistic
    startTransition(async () => {
      try {
        await removeFromWatchlist(movie.id)
      } catch {
        setRemoved(false) // revert on failure
      }
    })
  }

  return (
    <div className="relative">
      <MovieCard movie={movie} />
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        onClick={remove}
        disabled={isPending}
        aria-label={`Remove ${movie.title} from watchlist`}
        className="absolute right-2 top-2 z-10 bg-background/80 hover:bg-background"
      >
        <X />
      </Button>
    </div>
  )
}
