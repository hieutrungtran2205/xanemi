const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
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

export function toSlug(title: string, releaseDate: string, imdbId: string): string {
  const year = releaseDate?.slice(0, 4) ?? ''
  const kebab = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `${kebab}-${year}-${imdbId}`
}

// Extracts imdb_id from slug — imdb_id always matches tt\d+
export function parseSlug(slug: string): { imdbId: string } | null {
  const match = slug.match(/(tt\d+)$/)
  if (!match) return null
  return { imdbId: match[1] }
}

export function releaseYear(dateString: string): string {
  return dateString?.slice(0, 4) ?? ''
}
