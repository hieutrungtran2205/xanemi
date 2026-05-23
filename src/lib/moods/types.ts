export type MoodId =
  | "cozy"
  | "mind-bending"
  | "edge-of-seat"
  | "laugh"
  | "good-cry"
  | "escape"
  | "date-night"
  | "adrenaline"
  | "dark-gritty"
  | "curious";

export interface DiscoverQuery {
  with_genres?: string;
  without_genres?: string;
  sort_by?: string;
  vote_average_gte?: number;
  vote_count_gte?: number;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
}

export interface MoodDefinition {
  id: MoodId;
  label: string;
  emoji: string;
  description: string;
  accent: string;
  query: DiscoverQuery;
}
