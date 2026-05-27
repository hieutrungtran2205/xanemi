import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  href?: string
  className?: string
}

export function SectionHeading({ title, href, className }: SectionHeadingProps) {
  if (href) {
    return (
      <div className={cn('mb-6 flex items-center justify-between', className)}>
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          Show more →
        </Link>
      </div>
    )
  }

  return (
    <h2 className={cn('mb-4 font-heading text-xl font-semibold tracking-tight text-foreground', className)}>
      {title}
    </h2>
  )
}
