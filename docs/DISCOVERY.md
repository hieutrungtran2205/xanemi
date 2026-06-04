# Xanemi — Discovery & Filters

> Các "lane" khám phá phim và hệ filter. Quyết định chất lượng recommendation.
> (File này trước đây là `MOODS.md` — mood đã bị bỏ, xem mục **Legacy** cuối file + ADR-024.)

## Discovery Lanes — tổng quan

| Lane | Entry point | Query nguồn | Route | File definitions |
|---|---|---|---|---|
| Trending | Landing hero + grid, header nav | `/trending/movie/week` | `/trending` | — (endpoint) |
| Theme (genre-first) | Landing "What to Watch?" | genre IDs + params | `/theme/[slug]` | `lib/themes/definitions.ts` |
| Country (cinema-by-origin) | Landing "Cinema by Country" | `with_original_language` / `with_origin_country` | `/country/[slug]` | `lib/countries/definitions.ts` |
| Browse/Filter | Header "Browse" | filter → discover params | `/discover` | `lib/filters/*` |
| Search | Header search bar | `/search/movie?query=` | `/discover?q=` | — (endpoint) |

Tất cả lane (trừ search) đều gọi TMDB **Discover API** qua `tmdbList()` wrapper (ADR-023). Các lane có thể trả phim trùng nhau — bình thường, vì phục vụ mental model khác nhau.

## Design Principles

1. **Lane != Genre đơn lẻ**: mỗi lane là một góc khám phá có chủ đích (genre combo + quality floor + exclusions), không phải 1 genre trần.
2. **Quality filter**: mỗi definition có `vote_average.gte` + `vote_count.gte` để tránh phim rác. Niche cinema hạ `vote_count` để không rỗng.
3. **Static + server-fetched**: definitions hardcode, không DB, không state client.
4. **Restraint**: thêm lane mới chỉ khi phục vụ mental model thật sự khác — không nhân bản genre.

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

---

## Theme Lane (genre-first)

File: `lib/themes/definitions.ts` (`THEMES: ThemeDefinition[]`). Mỗi theme: `slug`, `title`, `description`, `query` (TMDB Discover params raw). Route `/theme/[slug]` → `getThemeMovies(slug, query, page)` (cache 24h, tag `theme-{slug}`), render `ThemeHero` + `MovieGrid` + pagination.

**12 themes** (slug → title):

| slug | title | Genre chính (with_genres) | Ghi chú query |
|---|---|---|---|
| `timeless-classics` | Timeless Classics | — | `release.lte 2005`, `vote_average ≥ 8.0`, `vote_count ≥ 5000` |
| `family-night` | Family Night | Family (10751) | `certification.lte PG` (US), loại Animation/Horror/Thriller/Crime |
| `date-night` | Date Night | Romance (10749) | loại Horror/Thriller/War |
| `mind-benders` | Mind Benders | Mystery/Sci-Fi/Thriller (9648,878,53) | |
| `blockbusters` | Blockbusters | Action/Adventure/Sci-Fi (28,12,878) | loại Comedy/Drama/Doc |
| `tearjerkers` | Tearjerkers | Drama (18) | loại Action/Comedy/Animation/History |
| `laugh-out-loud` | Laugh Out Loud | Comedy (35) | loại Horror/Thriller/Drama/Action/Adventure |
| `edge-of-your-seat` | Edge of Your Seat | Thriller/Mystery/Horror (53,9648,27) | loại Family/Animation/Comedy |
| `war` | War | War (10752) | loại Comedy/Animation |
| `crime-noir` | Crime & Noir | Crime (80) | `vote_average ≥ 7.0`, loại Animation/Comedy/Family |
| `horror` | Horror | Horror (27) | loại Animation/Family/Comedy |
| `animated` | Animated | Animation (16) | loại Horror/Thriller |

Default chung (trừ ghi chú): `vote_average.gte 6.0`, `vote_count.gte 1000`, `sort_by popularity.desc`.

---

## Country Lane (cinema-by-origin)

File: `lib/countries/definitions.ts` (`COUNTRIES: CountryDefinition[]`). Mỗi country: `slug`, `title`, `description`, `language` (ISO 639-1, metadata), `query`. Route `/country/[slug]` → `getCountryMovies(slug, query, page)` (cache 24h, tag `country-{slug}`), reuse `ThemeHero` (`label="Cinema"`) + `MovieGrid`.

**TMDB params dùng**:
- `with_original_language` — ngôn ngữ gốc (ISO 639-1: en, ko, fr, ja, vi...)
- `with_origin_country` — quốc gia sản xuất (ISO 3166-1: US, CN, TH, VN...). Dùng `|` để OR nhiều nước.
- Kết hợp cả hai khi cần tách rõ (VD: Chinese = `zh` + `CN` để loại HK/TW).
- Tất cả loại Documentary (`without_genres: 99`).

**12 countries** (slug → title, threshold điều chỉnh theo độ phổ biến để tránh rỗng):

| slug | title | language | origin_country | vote_avg / vote_count |
|---|---|---|---|---|
| `american` | American Cinema | en | US | 7.0 / 5000 |
| `british` | British Cinema | en | GB | 6.5 / 1000 |
| `korean` | Korean Cinema | ko | — | 6.5 / 1000 |
| `french` | French Cinema | fr | — | 6.5 / 1000 |
| `spanish` | Spanish & Latino | es | — | 6.5 / 1000 |
| `japanese` | Japanese Cinema | ja | — | 6.5 / 1000 |
| `italian` | Italian Cinema | it | — | 6.5 / 1000 |
| `indian` | Bollywood | hi | — | 6.0 / 300 |
| `chinese` | Chinese Cinema | zh | CN | 5.0 / 300 |
| `thai` | Thai Cinema | th | TH | 5.0 / 100 |
| `german` | German Cinema | de | — | 6.0 / 500 |
| `vietnamese` | Vietnamese Cinema | vi | VN | 5.0 / — |

---

## Trending Lane

Endpoint `getTrending('week', page)` (cache 1h, tag `trending`). Dùng ở:
- Landing: hero slider (top 5 có backdrop) + grid (`results.slice(5, 15)`).
- `/trending`: full grid + numbered pagination (giới hạn 50 trang — data đổi liên tục, trang cao vô nghĩa).

---

## Search Lane

Endpoint `searchMovies(query, page)` → `/search/movie` (cache 1h, tag `search`).

- **Header autocomplete**: route handler `/api/search/movies` proxy `searchMovies()` (server-only), trả 5 results đầu + `total_results`. Guard `q < 2` → mảng rỗng. Client `search-bar.tsx`: debounce 500ms, `AbortController` cancel inflight, keyboard nav (↑/↓/Enter/Esc).
- **"See more" / Enter (no highlight)** → push `/discover?q=`.
- Search và filter **không combine** (giới hạn cứng TMDB — ADR-015). Có `?q=` → `/discover` ẩn filter panel, dùng search mode.

---

# Filter System (V1 MVP)

Filter sống tại `/discover` (power search độc lập, không nhúng vào lane khác — ADR-011). URL state qua **nuqs** (single source of truth). **Apply button** pattern — không live update.

## V1 Filters (5 cái)

### 1. Genre (multi-select)
- 18 genre checkboxes, OR logic. TMDB: `with_genres=18,10749`.
- Genre list từ TMDB `/genre/movie/list` (cache 30 ngày, fallback hardcode nếu API fail).

### 2. Year Range (dual slider)
- Range: `YEAR_MIN` (1970) → `CURRENT_YEAR`. TMDB: `primary_release_date.gte` + `.lte`.

### 3. Min Rating (single slider)
- 0 → 10. TMDB: `vote_average.gte`. Khi `> 0`, kèm `vote_count.gte=100` (tránh phim 1 vote điểm cao).

### 4. Sort By (dropdown)
- Most Popular (default) / Highest Rated / Newest First / Oldest First.
- TMDB: `popularity.desc | vote_average.desc | primary_release_date.desc | primary_release_date.asc`.

### 5. Country of Origin (dropdown) — *thay cho "Original Language" (ADR-025)*
- Any (default), USA, UK, South Korea, Japan, France, Spain, India, China, Italy, Germany.
- TMDB: `with_origin_country` (ISO 3166-1). `CountryCode` union trong `lib/filters/types.ts`.

## Filter UX Rules

- **URL state** via nuqs — single source of truth. Đổi UI control KHÔNG được đổi logic ghi URL.
- **Apply button** (NOT live update).
- **Mobile**: bottom sheet drawer (shadcn Sheet). **Desktop**: collapsible sidebar.
- **Active filter chips** ở đầu results (`active-filter-chips.tsx`, click X để remove).
- **Clear All**: reset về `/discover` clean URL.
- **Empty result**: suggest relax filters + clear button.
- **Default values omit khỏi URL** cho gọn (yearFrom=1970, yearTo=CURRENT_YEAR, minRating=0, sort=popularity, country=any).

## URL Example

```
/discover?genres=18,10749&yearFrom=2020&yearTo=2024&minRating=7&sort=rating&country=KR
```

Serialize qua `filtersToUrlParams()`; parse qua `lib/filters/parsers.ts`; build TMDB query qua `buildDiscoverQuery()` (`lib/filters/query-builder.ts`).

## V2 Filter Improvements

- Runtime, keywords, cast/crew filters
- Quick filter chips (preset combos)
- Watch provider filter (with region)
- LLM free-form input
- Context modifiers (alone/couple/family), time budget

---

# Legacy: Mood (deprecated — ADR-024)

> Bản đầu của sản phẩm lấy **mood-first discovery** làm differentiator: user chọn 1 trong 10 cảm xúc → nhận phim curated. Hướng này **đã bỏ** — mood nông và trùng vai với theme (đều ra phim theo genre/params), và poster phim thật dẫn dắt landing tốt hơn mood chip.
>
> Code mood còn sót (orphan, chờ gỡ — xem ROADMAP → Bug & Tech Debt Log): `lib/moods/*`, `components/mood/*`, `components/movie/mood-movie-hero.tsx`, `components/layout/hero-banner.tsx`, route `/discover/[mood]`, nhánh `buildQueryWithFilters(mood,...)`.

**10 moods v1 (lịch sử)** — mapping cảm xúc → TMDB Discover params. Giữ lại để tham khảo nếu sau này muốn làm lại mood bằng cách khác (VD LLM free-form ở V2):

| Mood | Genres chính | Tinh thần query |
|---|---|---|
| Cozy & Comforting | Family/Comedy/Romance, loại Horror/War/Thriller | `vote_average ≥ 6.5` |
| Mind-Bending | Mystery/Sci-Fi/Thriller | `vote_average ≥ 7.0`, `vote_count ≥ 1000` |
| Edge of Seat | Thriller/Crime | `with_runtime.lte 150` |
| Laugh Out Loud | Comedy, loại Drama/Horror | popularity |
| Good Cry | Drama/Romance | `vote_average ≥ 7.0`, sort rating |
| Escape Reality | Fantasy/Adventure/Sci-Fi | `with_runtime.gte 100` |
| Date Night | Romance/Comedy | `with_runtime.lte 130` |
| Adrenaline Rush | Action/Adventure | popularity |
| Dark & Gritty | Crime/Drama/Thriller | `vote_average ≥ 7.0`, sort rating |
| Curious Mind | Documentary/History | `vote_count ≥ 200` |

Nguyên lý cũ: random page 1-5 mỗi request (variety), fallback broaden filter nếu < 6 kết quả. Mappings đầy đủ cũ xem git history (`docs/MOODS.md` trước rename).
</content>
