'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { db } from '@/lib/db/client'
import { watchlist } from '@/lib/db/schema'
import type { MovieSnapshot } from './types'

async function requireUserId(): Promise<string> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function addToWatchlist(input: { tmdbId: number; snapshot: MovieSnapshot }) {
  const userId = await requireUserId()
  await db
    .insert(watchlist)
    .values({ userId, tmdbId: input.tmdbId, snapshot: input.snapshot })
    .onConflictDoNothing({ target: [watchlist.userId, watchlist.tmdbId] })
  revalidatePath('/watchlist')
}

export async function removeFromWatchlist(tmdbId: number) {
  const userId = await requireUserId()
  await db
    .delete(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, tmdbId)))
  revalidatePath('/watchlist')
}
