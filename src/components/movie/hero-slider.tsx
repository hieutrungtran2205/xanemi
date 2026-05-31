import { getGenreList, getTrending } from '@/lib/tmdb/endpoints'
import { backdropUrl, formatRating, releaseYear, toSlug } from '@/lib/tmdb/utils'
import { HeroCarousel, type HeroSlide } from './hero-carousel'

const MAX_GENRES = 3

export async function HeroSlider() {
  const [{ results }, genres] = await Promise.all([getTrending(), getGenreList()])
  const genreName = new Map(genres.map((g) => [g.id, g.name]))

  const slides: HeroSlide[] = results
    .map((movie, i) => ({ movie, rank: i + 1 }))
    .filter(({ movie }) => movie.backdrop_path)
    .slice(0, 5)
    .map(({ movie, rank }) => ({
      id: movie.id,
      title: movie.title,
      slug: toSlug(movie),
      backdrop: backdropUrl(movie.backdrop_path, 'original'),
      year: releaseYear(movie.release_date),
      rating: formatRating(movie.vote_average),
      voteCount: movie.vote_count,
      overview: movie.overview,
      genres: movie.genre_ids
        .map((id) => genreName.get(id))
        .filter((name): name is string => Boolean(name))
        .slice(0, MAX_GENRES),
      rank,
    }))

  if (slides.length === 0) return null

  return <HeroCarousel slides={slides} />
}

export function HeroSliderSkeleton() {
  return <div className="h-[65vh] min-h-85 w-full animate-pulse bg-surface" />
}
