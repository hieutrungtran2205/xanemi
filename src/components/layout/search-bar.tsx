'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = q.trim()
    if (!trimmed) return
    router.push(`/discover?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 rounded-md border bg-surface px-3 py-1.5 transition-[width,border-color] duration-200 ${
        focused ? 'border-ring w-52 sm:w-72' : 'border-border w-36 sm:w-52'
      }`}
    >
      <Search size={13} className="shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search movies…"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      {q && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => { setQ(''); inputRef.current?.focus() }}
          className="size-5 shrink-0"
        >
          <X size={12} />
        </Button>
      )}
    </form>
  )
}
