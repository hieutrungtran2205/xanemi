export interface CountryDefinition {
  slug: string
  title: string
  description: string
  language: string // ISO 639-1
  query: Record<string, string | number>
}

export const COUNTRIES: CountryDefinition[] = [
  {
    slug: 'american',
    title: 'American Cinema',
    description: 'Dreams big, spends bigger, delivers every time',
    language: 'en',
    query: {
      with_original_language: 'en',
      with_origin_country: 'US',
      'vote_average.gte': 7.0,
      'vote_count.gte': 5000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'british',
    title: 'British Cinema',
    description: 'Dry wit, class tension, and quiet devastation',
    language: 'en',
    query: {
      with_origin_country: 'GB',
      'vote_average.gte': 6.5,
      'vote_count.gte': 1000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'korean',
    title: 'Korean Cinema',
    description: 'Tension, tears, and twists you never see coming',
    language: 'ko',
    query: {
      with_original_language: 'ko',
      'vote_average.gte': 6.5,
      'vote_count.gte': 1000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'french',
    title: 'French Cinema',
    description: 'Cinema as art — slow, seductive, unforgettable',
    language: 'fr',
    query: {
      with_original_language: 'fr',
      'vote_average.gte': 6.5,
      'vote_count.gte': 1000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'spanish',
    title: 'Spanish & Latino',
    description: 'Passion, chaos, and raw human stories',
    language: 'es',
    query: {
      with_original_language: 'es',
      'vote_average.gte': 6.5,
      'vote_count.gte': 1000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'japanese',
    title: 'Japanese Cinema',
    description: 'Ethereal, precise, and unlike anything else',
    language: 'ja',
    query: {
      with_original_language: 'ja',
      'vote_average.gte': 6.5,
      'vote_count.gte': 1000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'italian',
    title: 'Italian Cinema',
    description: 'Beauty, melancholy, and style in every frame',
    language: 'it',
    query: {
      with_original_language: 'it',
      'vote_average.gte': 6.5,
      'vote_count.gte': 1000,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'indian',
    title: 'Bollywood',
    description: 'Songs, emotions, and pure spectacle',
    language: 'hi',
    query: {
      with_original_language: 'hi',
      'vote_average.gte': 6.0,
      'vote_count.gte': 300,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'chinese',
    title: 'Chinese Cinema',
    description: 'Epic scale, poetic visuals, and timeless stories',
    language: 'zh',
    query: {
      with_original_language: 'zh',
      with_origin_country: 'CN',         // mainland China only
      'vote_average.gte': 5.0,
      'vote_count.gte': 300,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'thai',
    title: 'Thai Cinema',
    description: 'Wild genre swings — horror, comedy, action, heart',
    language: 'th',
    query: {
      with_original_language: 'th',
      with_origin_country: 'TH',
      'vote_average.gte': 5.0,
      'vote_count.gte': 100,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'german',
    title: 'German Cinema',
    description: 'Dark, precise, and brutally honest',
    language: 'de',
    query: {
      with_original_language: 'de',
      'vote_average.gte': 6.0,
      'vote_count.gte': 500,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
  {
    slug: 'vietnamese',
    title: 'Vietnamese Cinema',
    description: 'Hometown stories told with heart and grit',
    language: 'vi',
    query: {
      with_original_language: 'vi',
      with_origin_country: 'VN',
      'vote_average.gte': 5.0,
      without_genres: '99',              
      sort_by: 'popularity.desc',
    },
  },
]
