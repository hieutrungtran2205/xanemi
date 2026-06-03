'use server'

import { signIn, signOut } from '@/auth'

export async function signInWithGoogle() {
  await signIn('google')
}

// For the /login page: bind callbackUrl via .bind(null, callbackUrl) so the
// form action receives it as the first arg (FormData comes second, unused).
export async function signInWithGoogleTo(redirectTo: string) {
  await signIn('google', { redirectTo })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
