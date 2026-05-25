'use client'

import { useQueryState, useQueryStates } from 'nuqs'
import { parseAsInteger } from 'nuqs'
import { X } from 'lucide-react'
import { filterParsers } from '@/lib/filters/parsers'
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  LANGUAGE_OPTIONS,
  YEAR_MIN,
  CURRENT_YEAR,
} from '@/lib/filters/types'
import type { Genre } from '@/lib/tmdb/types'

interface Props {
  genres: Genre[]
}

export function ActiveFilterChips({ genres }: Props) {
  const [filters, setFilters] = useQueryStates(filterParsers)
  const [, setPage] = useQueryState('page', parseAsInteger)

  const chips: { key: string; label: string; onRemove: () => void }[] = []

  for (const id of filters.genres) {
    const name = genres.find((g) => g.id === id)?.name ?? String(id)
    chips.push({
      key: `genre-${id}`,
      label: name,
      onRemove: () => {
        setFilters({ genres: filters.genres.filter((g) => g !== id) })
        setPage(null, { shallow: false })
      },
    })
  }

  if (filters.yearFrom !== YEAR_MIN || filters.yearTo !== CURRENT_YEAR) {
    chips.push({
      key: 'year',
      label: `${filters.yearFrom}–${filters.yearTo}`,
      onRemove: () => {
        setFilters({ yearFrom: DEFAULT_FILTERS.yearFrom, yearTo: DEFAULT_FILTERS.yearTo })
        setPage(null, { shallow: false })
      },
    })
  }

  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating}+ ★`,
      onRemove: () => { setFilters({ minRating: 0 }); setPage(null, { shallow: false }) },
    })
  }

  if (filters.sort !== 'popularity') {
    const label = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? ''
    chips.push({
      key: 'sort',
      label,
      onRemove: () => { setFilters({ sort: 'popularity' }); setPage(null, { shallow: false }) },
    })
  }

  if (filters.lang !== 'any') {
    const label = LANGUAGE_OPTIONS.find((o) => o.value === filters.lang)?.label ?? ''
    chips.push({
      key: 'lang',
      label,
      onRemove: () => { setFilters({ lang: 'any' }); setPage(null, { shallow: false }) },
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground transition-colors duration-200 hover:border-muted-foreground hover:bg-surface-2"
        >
          {chip.label}
          <X size={11} className="text-muted-foreground" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={() => { setFilters(DEFAULT_FILTERS); setPage(null, { shallow: false }) }}
          className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}