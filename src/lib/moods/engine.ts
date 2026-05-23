import "server-only";
import { tmdbFetch } from "../tmdb/client";
import type { Movie, TMDBResponse } from "../tmdb/types";
import { MOOD_DEFINITIONS } from "./definitions";
import type { DiscoverQuery, MoodId } from "./types";

function randomPage(min = 1, max = 5): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildQueryString(query: DiscoverQuery, page: number): string {
  const params: Record<string, string> = { page: String(page) };

  if (query.with_genres) params.with_genres = query.with_genres;
  if (query.without_genres) params.without_genres = query.without_genres;
  if (query.sort_by) params.sort_by = query.sort_by;
  if (query.vote_average_gte != null)
    params["vote_average.gte"] = String(query.vote_average_gte);
  if (query.vote_count_gte != null)
    params["vote_count.gte"] = String(query.vote_count_gte);
  if (query.with_runtime_gte != null)
    params["with_runtime.gte"] = String(query.with_runtime_gte);
  if (query.with_runtime_lte != null)
    params["with_runtime.lte"] = String(query.with_runtime_lte);

  return new URLSearchParams(params).toString();
}

export async function getMoviesByMood(
  moodId: MoodId,
  page?: number
): Promise<TMDBResponse<Movie>> {
  const mood = MOOD_DEFINITIONS[moodId];
  const resolvedPage = page ?? randomPage();
  const qs = buildQueryString(mood.query, resolvedPage);

  return tmdbFetch<TMDBResponse<Movie>>(`/discover/movie?${qs}`, {
    next: { revalidate: 3600, tags: [`mood-${moodId}`] },
  });
}
