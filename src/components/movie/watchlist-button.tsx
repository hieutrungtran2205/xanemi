'use client'

import { useState, useTransition } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { addToWatchlist, removeFromWatchlist } from '@/lib/watchlist/actions'
import { signInWithGoogleTo } from '@/lib/auth-actions'
import type { MovieSnapshot } from '@/lib/watchlist/types'

interface Props {
  tmdbId: number
  snapshot: MovieSnapshot
  initialInWatchlist: boolean
  isAuthed: boolean
  movieSlug: string
}

export function WatchlistButton({
  tmdbId,
  snapshot,
  initialInWatchlist,
  isAuthed,
  movieSlug,
}: Props) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)

  function toggle() {
    if (!isAuthed) {
      setDialogOpen(true)
      return
    }
    const next = !inWatchlist
    setInWatchlist(next) // optimistic
    startTransition(async () => {
      try {
        if (next) await addToWatchlist({ tmdbId, snapshot })
        else await removeFromWatchlist(tmdbId)
      } catch {
        setInWatchlist(!next) // revert on failure
      }
    })
  }

  const callbackUrl = `/movie/${movieSlug}`
  const signInAction = signInWithGoogleTo.bind(null, callbackUrl)

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant={inWatchlist ? 'secondary' : 'outline'}
        className="w-fit"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={isAuthed ? inWatchlist : undefined}
      >
        {inWatchlist && isAuthed ? <BookmarkCheck /> : <Bookmark />}
        {inWatchlist && isAuthed ? 'In watchlist' : 'Add to watchlist'}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in to save movies</DialogTitle>
            <DialogDescription>
              Create a free account to build your watchlist and track what you&apos;ve seen.
            </DialogDescription>
          </DialogHeader>
          <form action={signInAction} className="mt-2">
            <Button type="submit" className="w-full">
              Continue with Google
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
