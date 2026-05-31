'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FilterControls } from './filter-controls'
import { useFilterPanel } from './use-filter-panel'
import type { Genre } from '@/lib/tmdb/types'

interface Props {
  genres: Genre[]
}

export function FilterPanel({ genres }: Props) {
  const { local, setLocal, activeCount, isOpen, setIsOpen, isPending, handleApply, handleClear } = useFilterPanel()

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
            {isPending ? 'Loading…' : 'Apply'}
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
