import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { watchlist } from '@/lib/db/schema'

export async function getWatchlist(userId: string) {
  return db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(desc(watchlist.addedAt))
}

export async function isInWatchlist(userId: string, tmdbId: number): Promise<boolean> {
  const rows = await db
    .select({ id: watchlist.id })
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.tmdbId, tmdbId)))
    .limit(1)
  return rows.length > 0
}
