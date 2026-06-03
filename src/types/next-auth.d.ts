import type { DefaultSession } from 'next-auth'

// Database session strategy populates user.id at runtime; surface it in types
// so we can read session.user.id without `as`/`any`.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
