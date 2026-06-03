'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, TrendingUp, Bookmark, User, LogOut } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { signOutAction } from '@/lib/auth-actions'
import type { SessionUser } from './user-dropdown'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/discover', icon: Compass, label: 'Browse' },
  { href: '/trending', icon: TrendingUp, label: 'Trending' },
  { href: '/watchlist', icon: Bookmark, label: 'Watchlist' },
]

function getInitials(user: SessionUser): string {
  const source = user.name ?? user.email ?? '?'
  return source.trim().charAt(0).toUpperCase()
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] transition-colors ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
      <span>{label}</span>
    </Link>
  )
}

export function BottomNavClient({ user }: { user?: SessionUser }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ href, icon, label }) => (
          <NavItem key={href} href={href} icon={icon} label={label} active={isActive(href)} />
        ))}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none">
              <Avatar className="h-[22px] w-[22px]">
                {user.image ? <AvatarImage src={user.image} alt={user.name ?? ''} /> : null}
                <AvatarFallback className="text-[10px]">{getInitials(user)}</AvatarFallback>
              </Avatar>
              <span>Account</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="mb-2 w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-foreground">
                  {user.name ?? 'Account'}
                </span>
                {user.email ? (
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                ) : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={signOutAction}>
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full cursor-pointer">
                    <LogOut />
                    Sign out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] transition-colors ${
              isActive('/login') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User size={22} strokeWidth={1.5} />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
