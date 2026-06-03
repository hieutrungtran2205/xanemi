import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import { signInWithGoogleTo } from '@/lib/auth-actions'

export const metadata: Metadata = {
  title: 'Sign in',
}

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

// Only allow same-site relative paths to avoid open-redirect via ?callbackUrl=
function safeCallbackUrl(raw: string | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams
  const redirectTo = safeCallbackUrl(callbackUrl)
  const signIn = signInWithGoogleTo.bind(null, redirectTo)

  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <Container className="flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Sign in to save movies
          </h1>
          <p className="text-sm text-muted-foreground">
            Build your watchlist and pick up where you left off, on any device.
          </p>
        </div>
        <form action={signIn} className="w-full">
          <Button type="submit" size="lg" className="w-full">
            Continue with Google
          </Button>
        </form>
      </Container>
    </main>
  )
}
