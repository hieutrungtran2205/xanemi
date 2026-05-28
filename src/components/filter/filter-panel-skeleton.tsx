import { Skeleton } from '@/components/ui/skeleton'

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
