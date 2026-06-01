'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { posterUrl, releaseYear, formatRating, toSlug } from '@/lib/tmdb/utils'
import type { Movie } from '@/lib/tmdb/types'

type NavItem = { kind: 'movie'; movie: Movie } | { kind: 'more' }

const MIN_QUERY = 2
const DEBOUNCE_MS = 500
const MAX_PREVIEW = 5

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQ = searchParams.get('q') ?? ''
  const [q, setQ] = useState(urlQ)
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ)
  const [debouncedQ, setDebouncedQ] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLFormElement>(null)

  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ)
    setQ(urlQ)
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    if (debouncedQ.length < MIN_QUERY) return
    const controller = new AbortController()

    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/search/movies?q=${encodeURIComponent(debouncedQ)}`,
          { signal: controller.signal }
        )
        const data: { results: Movie[]; total_results: number } = res.ok
          ? await res.json()
          : { results: [], total_results: 0 }
        setResults(data.results)
        setTotalResults(data.total_results)
        setHighlightedIndex(-1)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setResults([])
        setTotalResults(0)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [debouncedQ])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const navItems = useMemo<NavItem[]>(() => {
    if (results.length === 0) return []
    const items: NavItem[] = results.map((m) => ({ kind: 'movie', movie: m }))
    if (totalResults > results.length) items.push({ kind: 'more' })
    return items
  }, [results, totalResults])

  function close() {
    setIsOpen(false)
    setFocused(false)
  }

  function goToDiscover() {
    const trimmed = q.trim()
    if (!trimmed) return
    close()
    router.push(`/discover?q=${encodeURIComponent(trimmed)}`)
  }

  function goToMovie(movie: Movie) {
    close()
    router.push(`/movie/${toSlug(movie)}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    goToDiscover()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      inputRef.current?.blur()
      return
    }
    if (!isOpen || navItems.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => (i + 1) % navItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => (i <= 0 ? navItems.length - 1 : i - 1))
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      const item = navItems[highlightedIndex]
      if (item.kind === 'movie') goToMovie(item.movie)
      else goToDiscover()
    }
  }

  const expanded = focused || isOpen
  const trimmedQ = q.trim()
  const showDropdown = isOpen && trimmedQ.length > 0
  const extra = totalResults - results.length

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 rounded-md border bg-surface px-3 py-1.5 transition-[width,border-color] duration-200 ${
        expanded
          ? 'border-ring flex-1 min-w-0 sm:ml-auto sm:w-72 sm:flex-none'
          : 'border-border ml-auto w-36 sm:w-52'
      }`}
    >
      <Search size={13} className="shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => {
          setFocused(true)
          setIsOpen(true)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search movies…"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls="search-results"
      />
      {q && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setQ('')
            setHighlightedIndex(-1)
            inputRef.current?.focus()
          }}
          className="size-5 shrink-0"
          aria-label="Clear search"
        >
          <X size={12} />
        </Button>
      )}

      {showDropdown && (
        <div
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
        >
          {trimmedQ.length < MIN_QUERY ? (
            <p className="px-3 py-3 text-xs text-muted-foreground">
              Type at least {MIN_QUERY} characters…
            </p>
          ) : loading ? (
            <ul className="divide-y divide-border/50">
              {Array.from({ length: MAX_PREVIEW }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="aspect-2/3 w-12 shrink-0 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                  </div>
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-xs text-muted-foreground">
              No results found
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {results.map((movie, i) => {
                const poster = posterUrl(movie.poster_path, 'w154')
                const year = releaseYear(movie.release_date)
                const rating = formatRating(movie.vote_average)
                const highlighted = i === highlightedIndex
                return (
                  <li key={movie.id} role="option" aria-selected={highlighted}>
                    <Link
                      href={`/movie/${toSlug(movie)}`}
                      onClick={close}
                      onMouseEnter={() => setHighlightedIndex(i)}
                      className={`flex items-center gap-3 px-3 py-2.5 outline-none transition-colors ${
                        highlighted ? 'bg-muted' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded bg-muted">
                        {poster ? (
                          <Image
                            src={poster}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {movie.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {year || '—'} · <span className="text-gold">★</span> {rating}
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })}
              {extra > 0 && (
                <li role="option" aria-selected={highlightedIndex === results.length}>
                  <button
                    type="button"
                    onClick={goToDiscover}
                    onMouseEnter={() => setHighlightedIndex(results.length)}
                    className={`flex w-full items-center justify-center px-3 py-2 text-xs font-medium text-foreground transition-colors ${
                      highlightedIndex === results.length ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                  >
                    See {extra}+ more results
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </form>
  )
}
