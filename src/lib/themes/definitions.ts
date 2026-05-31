export interface ThemeDefinition {
  slug: string
  title: string
  description: string
  query: Record<string, string | number>
}

// TMDB genre IDs reference:
// 12=Adventure, 16=Animation, 18=Drama, 27=Horror, 28=Action, 35=Comedy
// 36=History, 53=Thriller, 80=Crime, 99=Documentary, 878=Sci-Fi
// 9648=Mystery, 10749=Romance, 10751=Family, 10752=War

export const THEMES: ThemeDefinition[] = [
    {
    slug: 'timeless-classics',
    title: 'Timeless Classics',
    description: 'Iconic films that shaped cinema history',
    query: {
      'primary_release_date.lte': '2005-12-31',
      without_genres: '99',                  // no Documentary
      'vote_average.gte': 8.0,
      'vote_count.gte': 5000,
      sort_by: 'vote_average.desc',
    },
  },
  {
    slug: 'family-night',
    title: 'Family Night',
    description: 'Safe, warm picks the whole family can enjoy together',
    query: {
      with_genres: '10751',                  // Family
      without_genres: '16,27,53,80',         // no Animation, Horror, Thriller, Crime
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      certification_country: 'US',
      'certification.lte': 'PG',
      sort_by: 'popularity.desc',
      include_adult: 'false',
    },
  },
  {
    slug: 'date-night',
    title: 'Date Night',
    description: 'Romantic films for a perfect evening together',
    query: {
      with_genres: '10749',                  // Romance
      without_genres: '27,53,10752',         // no Horror, Thriller, War
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
      include_adult: 'true',
    },
  },
  {
    slug: 'mind-benders',
    title: 'Mind Benders',
    description: 'Twisty, thought-provoking films that stay with you',
    query: {
      with_genres: '9648,878,53',            // Mystery, Sci-Fi, Thriller
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'blockbusters',
    title: 'Blockbusters',
    description: 'Big-budget action and adventure spectacles',
    query: {
      with_genres: '28,12,878',              // Action, Adventure, Sci-Fi
      without_genres: '35,18,99',            // no Comedy, Drama, Documentary
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'tearjerkers',
    title: 'Tearjerkers',
    description: 'Emotional dramas that touch the heart',
    query: {
      with_genres: '18',                     // Drama
      without_genres: '28,35,16,36',         // no Action, Comedy, Animation, History
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'laugh-out-loud',
    title: 'Laugh Out Loud',
    description: 'Pure comedy to lift your mood',
    query: {
      with_genres: '35',                     // Comedy
      without_genres: '27,53,18,28,12',      // no Horror, Thriller, Drama, Action, Adventure
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'edge-of-your-seat',
    title: 'Edge of Your Seat',
    description: 'Suspenseful thrillers that keep you guessing',
    query: {
      with_genres: '53,9648,27',             // Thriller, Mystery, Horror
      without_genres: '10751,16,35',         // no Family, Animation, Comedy
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'war',
    title: 'War',
    description: 'Gripping stories of conflict, sacrifice, and survival',
    query: {
      with_genres: '10752',                  // War
      without_genres: '35,16',               // no Comedy, Animation
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'crime-noir',
    title: 'Crime & Noir',
    description: 'Gripping crime dramas, heists, and gangster epics',
    query: {
      with_genres: '80',                     // Crime
      without_genres: '16,35,10751',         // no Animation, Comedy, Family
      'vote_average.gte': 7.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'horror',
    title: 'Horror',
    description: 'Frightening films that get under your skin',
    query: {
      with_genres: '27',                     // Horror
      without_genres: '16,10751,35',         // no Animation, Family, Comedy
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'animated',
    title: 'Animated',
    description: 'Beloved animated films for all ages',
    query: {
      with_genres: '16',                     // Animation
      without_genres: '27,53',               // no Horror, Thriller
      'vote_average.gte': 6.0,
      'vote_count.gte': 1000,
      sort_by: 'popularity.desc',
      include_adult: 'false',
    },
  },
]
