import 'server-only'

const BASE_URL = 'https://api.themoviedb.org/3'

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}

export async function tmdbFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_API_KEY is not set')

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', apiKey)

  const res = await fetch(url.toString(), options)

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}
