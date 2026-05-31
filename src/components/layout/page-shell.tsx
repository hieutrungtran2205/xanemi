import { BackToTop } from '@/components/layout/back-to-top'

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      {children}
      <BackToTop />
    </main>
  )
}
