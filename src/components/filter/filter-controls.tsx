'use client'

import {
  SORT_OPTIONS,
  LANGUAGE_OPTIONS,
  YEAR_MIN,
  CURRENT_YEAR,
  type FilterParams,
} from '@/lib/filters/types'
import type { Genre } from '@/lib/tmdb/types'

interface FilterControlsProps {
  genres: Genre[]
  local: FilterParams
  setLocal: React.Dispatch<React.SetStateAction<FilterParams>>
}

export function FilterControls({ genres, local, setLocal }: FilterControlsProps) {
  return (
    <>
      <section className="py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Genre
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {genres.map((g) => {
            const checked = local.genres.includes(g.id)
            return (
              <label key={g.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setLocal((prev) => ({
                      ...prev,
                      genres: checked
                        ? prev.genres.filter((id) => id !== g.id)
                        : [...prev.genres, g.id],
                    }))
                  }
                  className="size-3.5 rounded-sm border-border accent-foreground"
                />
                <span className="text-sm text-foreground">{g.name}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section className="py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Year Range
        </h3>
        <div className="flex items-center gap-2">
          <YearSelect
            value={local.yearFrom}
            min={YEAR_MIN}
            max={local.yearTo}
            onChange={(v) => setLocal((p) => ({ ...p, yearFrom: v }))}
          />
          <span className="text-xs text-muted-foreground">to</span>
          <YearSelect
            value={local.yearTo}
            min={local.yearFrom}
            max={CURRENT_YEAR}
            onChange={(v) => setLocal((p) => ({ ...p, yearTo: v }))}
          />
        </div>
      </section>

      <section className="py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Min Rating
          </h3>
          <span className="text-sm font-medium text-foreground">
            {local.minRating === 0 ? 'Any' : `${local.minRating}+`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={9}
          step={0.5}
          value={local.minRating}
          onChange={(e) =>
            setLocal((p) => ({ ...p, minRating: parseFloat(e.target.value) }))
          }
          className="w-full cursor-pointer accent-foreground"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>Any</span>
          <span>9+</span>
        </div>
      </section>

      <section className="py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sort By
        </h3>
        <select
          value={local.sort}
          onChange={(e) =>
            setLocal((p) => ({ ...p, sort: e.target.value as FilterParams['sort'] }))
          }
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </section>

      <section className="py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Language
        </h3>
        <select
          value={local.lang}
          onChange={(e) =>
            setLocal((p) => ({ ...p, lang: e.target.value as FilterParams['lang'] }))
          }
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        >
          {LANGUAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </section>
    </>
  )
}

function YearSelect({
  value,
  min,
  max,
  onChange,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  const years = Array.from({ length: max - min + 1 }, (_, i) => max - i)
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      className="flex-1 rounded-md border border-border bg-surface px-2 py-2 text-sm text-foreground outline-none focus:border-ring"
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}
