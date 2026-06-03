import { auth } from '@/auth'
import { BottomNavClient } from './bottom-nav-client'

export async function BottomNav() {
  const session = await auth()
  return <BottomNavClient user={session?.user} />
}
