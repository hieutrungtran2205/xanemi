import { Container } from './container'

interface PageHeaderProps {
  title: React.ReactNode
  /** Slot rendered to the right of the title on sm+ screens */
  actions?: React.ReactNode
  /** Slot rendered below the title row (e.g. search sub-links) */
  children?: React.ReactNode
}

export function PageHeader({ title, actions, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border">
      <Container className="py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {actions}
        </div>
        {children}
      </Container>
    </div>
  )
}
