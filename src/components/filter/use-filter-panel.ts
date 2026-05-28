'use client'

import { useState, useTransition } from 'react'
import { useQueryState, useQueryStates } from 'nuqs'
import { parseAsInteger } from 'nuqs'
import { filterParsers } from '@/lib/filters/parsers'
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  type FilterParams,
} from '@/lib/filters/types'

export function useFilterPanel() {
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
    startTransition(() => {
      setUrlFilters(local, { scroll: false })
      setPage(null, { shallow: false, scroll: false })
    })
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50)
  }

  function handleClear() {
    setLocal(DEFAULT_FILTERS)
    setUrlFilters(DEFAULT_FILTERS, { scroll: false })
    setPage(null, { shallow: false, scroll: false })
    setIsOpen(false)
  }

  return {
    local,
    setLocal,
    activeCount,
    isOpen,
    setIsOpen,
    isPending,
    handleApply,
    handleClear,
  }
}
