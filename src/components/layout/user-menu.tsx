import { signInWithGoogle } from '@/lib/auth-actions'
import { Button } from '@/components/ui/button'
import { UserDropdown, type SessionUser } from './user-dropdown'

export function UserMenu({ user }: { user?: SessionUser }) {
  if (!user) {
    return (
      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" size="sm">
          Sign in
        </Button>
      </form>
    )
  }

  return <UserDropdown user={user} />
}
