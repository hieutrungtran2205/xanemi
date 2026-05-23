# Moodflix — Moods & Filters

> Core differentiator. Mappings này quyết định quality của recommendation.

## Design Principles

1. **Mood != Genre**: Mood là trạng thái cảm xúc; genre chỉ là 1 parameter.
2. **Variety**: Cùng mood, mỗi lần fetch random page 1-5 để không boring.
3. **Quality filter**: Default `vote_count.gte: 500` tránh phim ít vote.
4. **Iterate**: Mappings v1 sẽ adjust dựa trên mood_log analytics (V2).

## TMDB Genre ID Reference

| ID | Genre | ID | Genre |
|---|---|---|---|
| 28 | Action | 14 | Fantasy |
| 12 | Adventure | 36 | History |
| 16 | Animation | 27 | Horror |
| 35 | Comedy | 10402 | Music |
| 80 | Crime | 9648 | Mystery |
| 99 | Documentary | 10749 | Romance |
| 18 | Drama | 878 | Science Fiction |
| 10751 | Family | 53 | Thriller |
| | | 10752 | War |
| | | 37 | Western |

## 10 Moods v1

### 1. Cozy & Comforting — emoji 😌 — accent #F59E0B (amber)
Description: "Warm, low-stakes stories to wrap yourself in."
```
with_genres: [10751, 35, 10749]   // Family, Comedy, Romance
without_genres: [27, 10752, 53]   // exclude Horror, War, Thriller
vote_average.gte: 6.5
vote_count.gte: 500
sort_by: popularity.desc
```

### 2. Mind-Bending — 🧠 — accent #06B6D4 (cyan)
Description: "Films that twist your perception of reality."
```
with_genres: [9648, 878, 53]      // Mystery, Sci-Fi, Thriller
vote_average.gte: 7.0
vote_count.gte: 1000
sort_by: vote_average.desc
// Future: with_keywords plot-twist / psychological
```

### 3. Edge of Seat — 😰 — accent #EF4444 (red)
Description: "Tense, gripping rides that grab and hold."
```
with_genres: [53, 80]             // Thriller, Crime
vote_average.gte: 6.5
vote_count.gte: 500
with_runtime.lte: 150
sort_by: popularity.desc
```

### 4. Laugh Out Loud — 😂 — accent #FACC15 (yellow)
Description: "Pure comedy. No baggage, just laughs."
```
with_genres: [35]                 // Comedy
without_genres: [18, 27]          // exclude heavy Drama, Horror
vote_average.gte: 6.5
vote_count.gte: 500
sort_by: popularity.desc
```

### 5. Good Cry — 😢 — accent #EC4899 (pink)
Description: "The kind of sad that feels somehow good."
```
with_genres: [18, 10749]          // Drama, Romance
vote_average.gte: 7.0
vote_count.gte: 1000
sort_by: vote_average.desc
```

### 6. Escape Reality — 🌌 — accent #A855F7 (purple)
Description: "Big worlds, bigger imaginations. Take me somewhere else."
```
with_genres: [14, 12, 878]        // Fantasy, Adventure, Sci-Fi
vote_average.gte: 6.5
vote_count.gte: 1000
with_runtime.gte: 100
sort_by: popularity.desc
```

### 7. Date Night — 💕 — accent #F43F5E (rose)
Description: "Chemistry, charm, and just enough heart."
```
with_genres: [10749, 35]          // Romance, Comedy
vote_average.gte: 6.5
vote_count.gte: 500
with_runtime.lte: 130
sort_by: popularity.desc
```

### 8. Adrenaline Rush — 💥 — accent #F97316 (orange)
Description: "Action that pins you to the seat."
```
with_genres: [28, 12]             // Action, Adventure
vote_average.gte: 6.5
vote_count.gte: 1000
sort_by: popularity.desc
```

### 9. Dark & Gritty — 🌑 — accent #991B1B (deep red)
Description: "Noir, crime, and the shadows in between."
```
with_genres: [80, 18, 53]         // Crime, Drama, Thriller
vote_average.gte: 7.0
vote_count.gte: 500
sort_by: vote_average.desc
```

### 10. Curious Mind — 🔍 — accent #10B981 (green)
Description: "Real stories, real people, real perspectives."
```
with_genres: [99, 36]             // Documentary, History
vote_average.gte: 7.0
vote_count.gte: 200
sort_by: vote_average.desc
```

## Mood Engine Behavior

- **Random page**: page 1-5 random mỗi request → variety
- **Pagination "Show more"**: request next page (deterministic)
- **Fallback**: nếu < 6 kết quả, broaden filter (giảm vote_count)
- **Quality**: luôn giữ `vote_count.gte >= 200` để tránh phim rác

## SEO Per-Mood URLs

| Mood ID | URL | Target keyword |
|---|---|---|
| cozy | `/discover/cozy` | "cozy movies", "comfort films" |
| mind-bending | `/discover/mind-bending` | "mind bending movies" |
| edge-of-seat | `/discover/edge-of-seat` | "edge of your seat thrillers" |
| laugh | `/discover/laugh` | "funny movies", "best comedies" |
| good-cry | `/discover/good-cry` | "tear jerkers", "sad movies" |
| escape | `/discover/escape` | "escapist films", "fantasy adventure" |
| date-night | `/discover/date-night` | "date night movies", "rom coms" |
| adrenaline | `/discover/adrenaline` | "best action movies" |
| dark-gritty | `/discover/dark-gritty` | "dark gritty films", "noir movies" |
| curious | `/discover/curious` | "best documentaries" |

---

# Filter System (V1 MVP)

Filter áp dụng ở `/discover/[mood]` để **refine** mood results.

## Mood + Filter Interaction: REFINE (not REPLACE)

Mood query = base. Filter = additional constraints ON TOP.
- VD: Cozy + Year 2020-2024 = Cozy movies từ 2020-2024
- Nếu user clear hết genre → fallback về mood's default genres

## V1 Filters (CHỈ 5 cái, không thêm)

### 1. Genre (multi-select)
- 18 genre checkboxes, OR logic
- TMDB: `with_genres=18,10749`
- Default: inherit từ mood

### 2. Year Range (dual slider)
- Range: 1970 → currentYear
- TMDB: `primary_release_date.gte` + `primary_release_date.lte`

### 3. Min Rating (single slider)
- 0 → 10, step 0.5
- TMDB: `vote_average.gte`
- Default: 6.5

### 4. Sort By (dropdown)
- Popularity (default) / Rating high-low / Release newest / Release oldest
- TMDB: `sort_by=popularity.desc | vote_average.desc | primary_release_date.desc | primary_release_date.asc`

### 5. Original Language (dropdown)
- Any (default), English, Korean, Japanese, French, Spanish, Vietnamese, Chinese, Hindi
- TMDB: `with_original_language`

## Filter UX Rules

- **URL state** via nuqs — single source of truth
- **Apply button** pattern (NOT live update)
- **Mobile**: bottom sheet drawer (shadcn Sheet)
- **Desktop**: collapsible sidebar bên trái
- **Active filter chips** at top of results (click X để remove)
- **Clear All**: reset về `/discover/[mood]` clean URL
- **Empty result**: suggest relax filters + clear button
- **Vote count**: hardcode default 500 (KHÔNG expose user trong V1)

## URL Example

```
/discover/cozy?genres=18,10749&yearFrom=2020&yearTo=2024&minRating=7&sort=popularity&lang=en
```

Default values omit khỏi URL để gọn (yearFrom=1970, minRating=0, sort=popularity, lang=any).

## Genre List Fetching

- TMDB `/genre/movie/list`, cache 30 ngày
- Hardcode fallback list nếu API fail

## Filter Details Deferred (chốt khi build Week 2)

Những điểm này quyết định khi tới Slice filter, không cần lock bây giờ:
- Default language: Any vs English
- Year range max: currentYear vs currentYear+1
- Genre auto-check from mood: pre-check vs empty
- Apply button micro-UX: preview count, disabled state
- Edge case messaging chi tiết

## V2 Filter Improvements

- Runtime, Country filters
- Quick filter chips (preset combos)
- Keywords / Cast / Crew filters
- Watch provider filter (with region)
- `/browse` page (filter không cần mood)
- LLM free-form mood input
- Context modifiers (alone/couple/family), time budget
- A/B test mood mappings dùng mood_log data
