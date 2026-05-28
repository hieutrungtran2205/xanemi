'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet'
import { Logo } from './logo'

const NAV_LINKS = [
  { href: '/discover', label: 'Browse' },
  { href: '/trending', label: 'Trending' },
]

export function MobileNav() {
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
        </nav>

        <div className="mt-auto border-t border-border px-6 py-6">
          <Button variant="outline" className="w-full">
            Sign in
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
