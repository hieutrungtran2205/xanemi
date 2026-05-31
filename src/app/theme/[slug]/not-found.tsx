import Link from 'next/link'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/layout/container'
import { buttonVariants } from '@/components/ui/button'

export default function ThemeNotFound() {
  return (
    <PageShell>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <p className="text-5xl">🎬</p>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Theme not found</h1>
          <p className="mt-2 text-muted-foreground">
            This theme doesn&apos;t exist. Browse our curated themes on the home page.
          </p>
        </div>
        <Link href="/#themes" className={buttonVariants({ variant: 'outline' })}>
          Back to themes
        </Link>
      </Container>
    </PageShell>
  )
}
