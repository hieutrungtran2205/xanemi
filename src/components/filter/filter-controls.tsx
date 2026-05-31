'use client'

import {
  SORT_OPTIONS,
  LANGUAGE_OPTIONS,
  YEAR_MIN,
  CURRENT_YEAR,
  type FilterParams,
} from '@/lib/filters/types'
import type { Genre } from '@/lib/tmdb/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
              <label
                key={g.id}
                htmlFor={`genre-${g.id}`}
                className="flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  id={`genre-${g.id}`}
                  checked={checked}
                  onCheckedChange={(c) =>
                    setLocal((prev) => ({
                      ...prev,
                      genres: c
                        ? [...prev.genres, g.id]
                        : prev.genres.filter((id) => id !== g.id),
                    }))
                  }
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
        <Slider
          min={0}
          max={9}
          step={0.5}
          value={[local.minRating]}
          onValueChange={([v]) => setLocal((p) => ({ ...p, minRating: v }))}
          className="**:data-[slot=slider-track]:h-2 **:data-[slot=slider-thumb]:size-4"
        />
        <div className="mt-1 flex justify-between text-[12px] text-muted-foreground">
          <span>Any</span>
          <span>9+</span>
        </div>
      </section>

      <section className="py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sort By
        </h3>
        <Select
          value={local.sort}
          onValueChange={(v) =>
            setLocal((p) => ({ ...p, sort: v as FilterParams['sort'] }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Language
        </h3>
        <Select
          value={local.lang}
          onValueChange={(v) =>
            setLocal((p) => ({ ...p, lang: v as FilterParams['lang'] }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    <Select
      value={String(value)}
      onValueChange={(v) => onChange(parseInt(v, 10))}
    >
      <SelectTrigger className="flex-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
