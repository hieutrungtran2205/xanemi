import { redirect } from 'next/navigation'
import { auth } from '@/auth'

// Source-of-truth auth guard for all (user) routes. proxy.ts does a cheap
// cookie pre-check; this validates the real session against the DB.
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/watchlist')
  return children
}
