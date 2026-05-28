const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280'
): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function profileUrl(
  path: string | null,
  size: 'w185' | 'h632' | 'original' = 'w185'
): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function toSlug(movie: { title: string; release_date: string; id: number }): string {
  const year = movie.release_date?.slice(0, 4)
  const kebab = movie.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return year ? `${kebab}-${year}-${movie.id}` : `${kebab}-${movie.id}`
}

export function toPersonSlug(person: { name: string; id: number }): string {
  const kebab = person.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `${kebab}-${person.id}`
}

// Extracts tmdb_id from slug — always the last hyphen-separated segment
export function parseSlug(slug: string): { tmdbId: number } | null {
  const parts = slug.split('-')
  const tmdbId = parseInt(parts[parts.length - 1], 10)
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) return null
  return { tmdbId }
}

export function logoUrl(
  path: string | null,
  size: 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original' = 'w92'
): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function formatRating(voteAverage: number): string {
  if (!voteAverage || isNaN(voteAverage)) return '—'
  return voteAverage.toFixed(1)
}

export function releaseYear(dateString: string): string {
  return dateString?.slice(0, 4) ?? ''
}

export function formatDate(dateString: string | null): string | null {
  if (!dateString) return null
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Returns age in whole years between two ISO dates (YYYY-MM-DD). End defaults to today.
export function calcAge(birthday: string | null, deathday: string | null = null): number | null {
  if (!birthday) return null
  const birth = new Date(birthday)
  const end = deathday ? new Date(deathday) : new Date()
  if (isNaN(birth.getTime()) || isNaN(end.getTime())) return null
  let age = end.getFullYear() - birth.getFullYear()
  const m = end.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--
  return age >= 0 ? age : null
}
