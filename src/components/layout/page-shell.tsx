import { BackToTop } from '@/components/layout/back-to-top'
import { BackButton } from '@/components/layout/back-button'

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <BackButton />
      {children}
      <BackToTop />
    </main>
  )
}
