'use client'

import { useState } from 'react'
import { useQueryState } from 'nuqs'
import { parseAsInteger } from 'nuqs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Props {
  page: number
  totalPages: number
}

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const left = Math.max(2, current - 2)
  const right = Math.min(total - 1, current + 2)
  const pages: (number | '...')[] = [1]
  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

export function Pagination({ page, totalPages }: Props) {
  const [, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false, clearOnDefault: true, scroll: false }),
  )
  const [inputVal, setInputVal] = useState(String(page))
  const [syncedPage, setSyncedPage] = useState(page)

  if (syncedPage !== page) {
    setSyncedPage(page)
    setInputVal(String(page))
  }

  if (totalPages <= 1) return null

  function goToPage(p: number) {
    const clamped = Math.max(1, Math.min(p, totalPages))
    void setPage(clamped === 1 ? null : clamped)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleJump(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    const p = parseInt(inputVal, 10)
    if (!isNaN(p)) goToPage(p)
  }

  const pages = getPageRange(page, totalPages)

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex size-9 select-none items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'ghost'}
            size="icon"
            onClick={() => goToPage(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>

      {totalPages > 10 && (
        <>
          <Separator orientation="vertical" className="mx-2 h-5" />
          <div className="flex items-center overflow-hidden rounded-md border border-border bg-surface transition-colors focus-within:border-foreground/40">
            <input
              type="text"
              inputMode="numeric"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleJump}
              onFocus={(e) => e.target.select()}
              aria-label="Go to page"
              className="w-11 bg-transparent px-2 py-1.5 text-center text-sm text-foreground outline-none"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const p = parseInt(inputVal, 10)
                if (!isNaN(p)) goToPage(p)
              }}
              className="rounded-l-none border-l border-border"
            >
              Go
            </Button>
          </div>
        </>
      )}
    </div>
  )
}