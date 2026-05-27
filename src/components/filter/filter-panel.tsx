'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryState, useQueryStates } from 'nuqs'
import { parseAsInteger } from 'nuqs'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { filterParsers } from '@/lib/filters/parsers'
import { filtersToUrlParams } from '@/lib/filters/query-builder'
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  type FilterParams,
} from '@/lib/filters/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FilterControls } from './filter-controls'
import type { Genre } from '@/lib/tmdb/types'

interface Props {
  genres: Genre[]
  mode?: 'url' | 'navigate'
}

export function FilterPanel({ genres, mode = 'url' }: Props) {
  const router = useRouter()
  const [urlFilters, setUrlFilters] = useQueryStates(filterParsers)
  const [, setPage] = useQueryState('page', parseAsInteger)
  const [local, setLocal] = useState<FilterParams>(urlFilters as FilterParams)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [prevUrlKey, setPrevUrlKey] = useState(() => JSON.stringify(urlFilters))

  const urlKey = JSON.stringify(urlFilters)
  if (prevUrlKey !== urlKey) {
    setPrevUrlKey(urlKey)
    setLocal(urlFilters as FilterParams)
  }

  const activeCount = countActiveFilters(urlFilters as FilterParams)

  function handleApply() {
    setIsOpen(false)
    if (mode === 'navigate') {
      startTransition(() => router.push(`/discover${filtersToUrlParams(local)}`))
    } else {
      startTransition(() => {
        setUrlFilters(local, { scroll: false })
        setPage(null, { shallow: false, scroll: false })
      })
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50)
    }
  }

  function handleClear() {
    setLocal(DEFAULT_FILTERS)
    if (mode !== 'navigate') {
      setUrlFilters(DEFAULT_FILTERS, { scroll: false })
      setPage(null, { shallow: false, scroll: false })
    }
    setIsOpen(false)
  }

  if (mode === 'navigate') {
    return (
      <>
        {/* Desktop: full inline panel */}
        <div className="hidden lg:block rounded-md border border-border bg-surface p-5">
          <div className="divide-y divide-border">
            <FilterControls genres={genres} local={local} setLocal={setLocal} />
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button
              variant="default"
              onClick={handleApply}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? 'Loading…' : 'Browse Movies →'}
            </Button>
          </div>
        </div>

        {/* Mobile trigger */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal size={14} />
                Browse &amp; Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="flex max-h-[63vh] flex-col rounded-t-xl px-0">
              <SheetHeader className="border-b border-border px-5 pb-4">
                <SheetTitle className="text-left text-base font-semibold">Browse Movies</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-5">
                <div className="flex flex-col divide-y divide-border py-2">
                  <FilterControls genres={genres} local={local} setLocal={setLocal} />
                </div>
              </div>
              <div className="flex gap-3 border-t border-border px-5 py-4">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  variant="default"
                  onClick={handleApply}
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? 'Loading…' : 'Browse →'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </>
    )
  }

  // URL mode: desktop sidebar + mobile sheet
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col">
        <div className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden">
          <FilterHeader activeCount={activeCount} onClear={handleClear} />
          <Button
            variant="default"
            onClick={handleApply}
            disabled={isPending}
            className="mt-2 w-full"
          >
            {isPending ? 'Loading…' : 'Apply Filters'}
          </Button>
          <div className="mt-2 min-h-0 flex-1 overflow-y-auto divide-y divide-border pr-1">
            <FilterControls genres={genres} local={local} setLocal={setLocal} />
          </div>
        </div>
      </aside>

      {/* Mobile trigger */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal size={14} />
              Filters
              {activeCount > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex max-h-[90vh] flex-col overflow-hidden rounded-t-xl px-0">
            <SheetHeader className="border-b border-border px-5 pb-4">
              <SheetTitle className="text-left text-base font-semibold">Filters</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-5">
              <div className="flex flex-col divide-y divide-border py-2">
                <FilterControls genres={genres} local={local} setLocal={setLocal} />
              </div>
            </div>
            <div className="flex gap-3 border-t border-border px-5 py-4">
              <Button
                variant="outline"
                onClick={handleClear}
                className="flex-1"
              >
                Clear all
              </Button>
              <Button
                variant="default"
                onClick={handleApply}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? 'Loading…' : 'Apply'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

function FilterHeader({
  activeCount,
  onClear,
}: {
  activeCount: number
  onClear: () => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-foreground">Filters</span>
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      )}
    </div>
  )
}

export function FilterPanelSkeleton() {
  return (
    <>
      {/* Desktop sidebar — matches aside w-64 xl:w-72 shrink-0 */}
      <aside className="hidden w-64 shrink-0 lg:flex xl:w-72">
        <div className="sticky top-20 w-full">
          {/* Header row */}
          <div className="py-2">
            <Skeleton className="h-4 w-14 rounded" />
          </div>
          {/* Apply button */}
          <Skeleton className="mt-2 h-9 w-full rounded" />
          {/* Sections */}
          <div className="mt-2 divide-y divide-border">
            {/* Genre */}
            <div className="space-y-3 py-4">
              <Skeleton className="h-3 w-12 rounded" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 rounded" />
                ))}
              </div>
            </div>
            {/* Year Range */}
            <div className="space-y-3 py-4">
              <Skeleton className="h-3 w-16 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 flex-1 rounded" />
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-9 flex-1 rounded" />
              </div>
            </div>
            {/* Min Rating */}
            <div className="space-y-3 py-4">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
            {/* Sort By */}
            <div className="space-y-3 py-4">
              <Skeleton className="h-3 w-10 rounded" />
              <Skeleton className="h-9 w-full rounded" />
            </div>
            {/* Language */}
            <div className="space-y-3 py-4">
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="h-9 w-full rounded" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile trigger — matches the single button shown on small screens */}
      <div className="lg:hidden">
        <Skeleton className="h-9 w-24 rounded" />
      </div>
    </>
  )
}
