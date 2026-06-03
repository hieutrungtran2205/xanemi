'use client'

import Link from 'next/link'
import { Bookmark, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet'
import { signInWithGoogle, signOutAction } from '@/lib/auth-actions'
import { Logo } from './logo'
import type { SessionUser } from './user-dropdown'

const NAV_LINKS = [
  { href: '/discover', label: 'Browse' },
  { href: '/trending', label: 'Trending' },
]

function getInitials(user: SessionUser): string {
  const source = user.name ?? user.email ?? '?'
  return source.trim().charAt(0).toUpperCase()
}

export function MobileNav({ user }: { user?: SessionUser }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-72 flex-col bg-background p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="px-6 pt-6">
          <Logo />
        </div>

        <nav className="mt-6 flex flex-col px-3">
          {NAV_LINKS.map(({ href, label }) => (
            <SheetClose key={href} asChild>
              <Link
                href={href}
                className="rounded-md px-3 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                {label}
              </Link>
            </SheetClose>
          ))}
          {user ? (
            <SheetClose asChild>
              <Link
                href="/watchlist"
                className="flex items-center gap-2 rounded-md px-3 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <Bookmark size={18} />
                Watchlist
              </Link>
            </SheetClose>
          ) : null}
        </nav>

        <div className="mt-auto border-t border-border px-6 py-6">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? ''} />
                  ) : null}
                  <AvatarFallback>{getInitials(user)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.name ?? 'Account'}
                  </p>
                  {user.email ? (
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" className="w-full">
                  <LogOut />
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <form action={signInWithGoogle}>
              <Button type="submit" variant="outline" className="w-full">
                Sign in
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
