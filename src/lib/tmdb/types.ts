export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  original_language: string
  popularity: number
  adult: boolean
}

export interface MovieDetail {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  original_language: string
  popularity: number
  adult: boolean
  imdb_id: string | null
  runtime: number | null
  tagline: string | null
  status: string
  budget: number
  revenue: number
  genres: Genre[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Credits {
  id: number
  cast: CastMember[]
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface VideoResult {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface VideosResponse {
  id: number
  results: VideoResult[]
}

export interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string
}

export interface WatchProvidersRegion {
  flatrate?: WatchProvider[]
  buy?: WatchProvider[]
  rent?: WatchProvider[]
}

export interface WatchProvidersResponse {
  id: number
  results: Partial<Record<string, WatchProvidersRegion>>
}
