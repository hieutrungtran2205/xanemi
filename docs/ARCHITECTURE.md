# Moodflix — Architecture

## Vision

Moodflix giải quyết painpoint "không biết xem gì" bằng **mood-first discovery**. User chọn mood → nhận 5-10 phim curated phù hợp tâm trạng → xem trailer + biết xem ở đâu.

**Differentiator** vs Letterboxd/IMDB/TMDB: mood là entry point chính, không phải genre/search.

**Inspiration**: Letterboxd (discovery), Mubi (aesthetic), JustWatch (watch providers), Spotify (mood-based UX).

## Tech Stack — Lý do

| Layer | Choice | Lý do |
|---|---|---|
| Framework | Next.js 15 App Router | SEO mạnh (SSR/ISR), RSC giảm bundle, streaming UI |
| Language | TypeScript strict | Type-safe TMDB response |
| Styling | Tailwind v4 + shadcn/ui | Velocity, dark theme, component ownership |
| State server | RSC + Next fetch cache | Native, no extra lib |
| State client | Zustand (nếu cần) | Nhẹ |
| State URL | nuqs | Filter/search params, SEO-friendly |
| Auth | Auth.js v5 | Free, control, học flow |
| DB | Neon Postgres | Free 0.5GB, serverless |
| ORM | Drizzle | Type-safe, lightweight |
| Video | lite-youtube-embed | Performance, lazy load |
| Deploy | Vercel Hobby | Free, optimized Next.js |

## Architecture Overview

```
Client Browser
    | (HTML + minimal JS)
Vercel Edge (Next.js)
    |- RSC fetch -> TMDB API (cached via next.revalidate)
    |- Route Handlers /api -> Neon DB (Drizzle)
    |- Middleware -> Auth check
External:
    |- TMDB API (movie metadata)
    |- YouTube (trailer embed)
    |- Neon Postgres (user data)
```

## Scope: MVP vs V2

### MVP (Week 1-3) — Movie only
- Mood-based discovery (10 moods)
- Trending movies section
- Movie detail (synopsis, cast, trailer, watch providers, similar)
- Filter V1 (genre, year, rating, sort, language) — tại `/discover`, không phải mood pages
- Search by title — global search bar trong header, navigate tới `/discover?q=`
- Auth (Google OAuth)
- Watchlist (add/remove)
- Watched + rating (1-10)
- SEO foundation (metadata, sitemap, JSON-LD, slug)
- Performance basics

### V2 (Defer)
- TV series support
- Comment system
- Personal review/blog (MDX)
- LLM-powered free-form mood input
- Curated collections
- Filter Tier 2 (runtime, country, keywords, cast/crew, watch-provider filter)
- Quick filter chips
- i18n (multi-language)
- Personalized recommendations từ watched history

## ADR Log

### ADR-001: Next.js App Router
**Decision**: Next.js 15 App Router thay vì Vite SPA / Pages Router.
**Why**: SEO là mục tiêu học chính → cần SSR/ISR. App Router chuẩn 2026.
**Trade-off**: RSC learning curve, lean về Vercel.

### ADR-002: TMDB as single source of truth
**Decision**: Không sync movie data vào DB. Lưu `tmdbId + snapshot (jsonb)` trong user tables.
**Why**: DB free tier nhẹ, không cần sync job, data luôn fresh.
**Trade-off**: Cần TMDB online; watchlist page lazy load.

### ADR-003: Mood-based discovery as signature
**Decision**: Mood picker là landing experience chính. Trending là secondary (below fold).
**Why**: Differentiator vs IMDB/Letterboxd. Painpoint thật.
**Trade-off**: Quality phụ thuộc mood mappings — cần invest curate effort.

### ADR-004: Drop pirate embed, use trailer + watch providers
**Decision**: KHÔNG embed full movie. Chỉ YouTube trailer + link đến Netflix/Amazon qua TMDB watch/providers.
**Why**: Pháp lý (DMCA), Vercel TOS, học SEO không bị penalty.
**Trade-off**: User không xem full phim → giá trị phụ thuộc curation/discovery quality.

### ADR-005: Server Component default
**Decision**: RSC default, `'use client'` chỉ khi cần interactivity/hooks/browser API.
**Why**: Bundle nhỏ, SEO tốt, TMDB key bảo mật.
**Trade-off**: Phải nắm RSC boundary; vài lib chưa hỗ trợ.

### ADR-006: Curated mood mappings v1 (no LLM in MVP)
**Decision**: 10 moods hardcoded với TMDB Discover query params. LLM-powered free-form ở V2.
**Why**: MVP ship nhanh, free, no vendor lock-in.
**Trade-off**: Cùng mood -> same query (mitigate bằng random page 1-5).

### ADR-007: Vercel subdomain cho MVP, defer custom domain
**Decision**: Deploy `moodflix.vercel.app`, không mua domain ở MVP.
**Why**: $0 cost, dễ rebrand.
**Trade-off**: SEO weaker hơn custom domain (chấp nhận để học).

### ADR-008: 3-week MVP với Claude Code review-first
**Decision**: 3-week timeline. Rule: review mọi code Claude Code generate trước khi merge. Không yolo.
**Why**: Học thật, không chỉ ship sản phẩm rỗng. SEO cần thời gian validate.
**Trade-off**: Chậm hơn yolo ~1.5 tuần.

### ADR-009: Drop "Cinemood", chọn "Moodflix"
**Decision**: Working name = Moodflix, deploy `*.vercel.app`. Naming decision deferred (không critical cho personal project).
**Why**: Cinemood/Feelm bị market saturation. Naming không đáng tốn bandwidth ở MVP phase.
**Trade-off**: Có thể rebrand sau.

### ADR-010: MVP movie-only, TV series defer V2
**Decision**: Chỉ build movie. KHÔNG build TV series trong MVP.
**Why**: Giảm scope, ít edge case (season/episode), ship nhanh hơn ~1-2 ngày.
**Trade-off**: User không discover TV shows ở MVP.

### ADR-011: Filter tách khỏi mood — `/discover` page riêng
**Decision**: Filter (genre, year, rating, sort, language) sống tại `/discover`, KHÔNG phải `/discover/[mood]`. Mood pages giữ nguyên: hero + grid + pagination, không filter. Home page có filter panel inline (navigate mode) để user vào thẳng `/discover`. URL state via nuqs. Apply button — không live update.
**Why**: Filter và mood là 2 entry point độc lập. Mood = curation; filter = power search. Gộp chung làm loãng cả hai.
**Trade-off**: User muốn filter trong mood context phải ra `/discover` tay.

### ADR-015: Search by title tách biệt filter
**Decision**: Search (`/search/movie`) và filter (`/discover/movie`) là 2 mode riêng tại `/discover`. Khi có `?q=`, ẩn filter panel và dùng search endpoint. Không cho phép combine.
**Why**: TMDB API giới hạn cứng — `/search/movie` không nhận genre/rating/sort params; `/discover/movie` không nhận text query. Không thể combine ở server, combine ở client tạo UX giả và kết quả sai.
**Trade-off**: User không thể vừa search tên vừa filter genre cùng lúc.

### ADR-012: Feature-sliced development
**Decision**: Build theo vertical slices 1-4h mỗi cái. Mỗi slice: plan -> code -> review -> test -> commit -> roadmap update.
**Why**: Code reviewable, bug phát hiện sớm, học từng concept, git history clean.
**Trade-off**: Planning overhead ~10 phút/slice; cần discipline không skip review.

### ADR-013: Design Direction — Premium Minimal
**Decision**: Dark-only theme. Style premium minimal (Mubi/A24 vibe). Base shadcn/ui ít custom. Mood accent (10 màu) dùng tiết chế chỉ ở 3 chỗ (chip active, discover header, focus ring). Typography Space Grotesk + Inter. Logo text wordmark CSS. Reference: Letterboxd + Mubi. Chi tiết tokens ở docs/DESIGN.md.
**Why**: Minimal = ít rủi ro "AI-generated look" (chỗ vibe coding yếu nhất). Content (poster) tỏa sáng. Nhanh, $0, vẫn có cá tính qua mood accent + typography. Hợp mục tiêu học (không sa đà design).
**Trade-off**: Ít differentiation visual so với design cá tính mạnh; cần user actively review output design vì Claude Code không tự biết khi nào làm xấu.

### ADR-014: No blocking modal — Hero MoodPicker + Mood of the Day
**Context**: Thiết kế ban đầu có modal chọn mood khi vào landing. Phát hiện 2 vấn đề: (1) Google interstitial penalty — modal che content khi tải trang bị coi là intrusive interstitial, ảnh hưởng SEO ranking; (2) First-load friction — user phải dismiss modal trước khi thấy bất kỳ content nào.
**Decision**: Bỏ blocking modal. Thay bằng hero banner full-width với MoodPicker nhúng trực tiếp. Thêm "Mood of the Day" — highlight 1 mood chip dựa trên giờ trong ngày (static render server-side). Backdrop hero là 1 ảnh trending random — KHÔNG carousel, KHÔNG auto-rotate để tránh CLS.
**Consequences**:
- SEO safe: không interstitial penalty, không CLS từ carousel
- Reduced friction: mood picker visible ngay khi load, không cần dismiss
- Mood of the Day là static suggestion (không personalized), đủ để guide user mới
- Tốn thêm 1 TMDB fetch server-side cho backdrop (cache 1h, cost thấp)

## Data Model (implement Week 3)

Movie-only, không có `mediaType` field.

```
USER (1) --- (N) WATCHLIST
USER (1) --- (N) WATCHED
USER (1) --- (N) MOOD_LOG

USER:      id, email (unique), name, image, createdAt
WATCHLIST: id, userId, tmdbId, snapshot(jsonb: title/poster/year), addedAt
WATCHED:   id, userId, tmdbId, rating(1-10 nullable), moodWhenWatched, snapshot, watchedAt
MOOD_LOG:  id, userId(nullable), sessionId, mood, resultTmdbIds(jsonb), clickedTmdbId, createdAt
```

- `snapshot` jsonb: lưu title/poster/year để hiển thị watchlist nhanh không cần gọi TMDB từng item
- `MOOD_LOG`: track mood -> click-through cho analytics (improve mappings sau)

## Caching Strategy

| Endpoint | Revalidate | Tag |
|---|---|---|
| Movie detail | 24h | `movie-{id}` |
| Discover (mood) | 1h | `mood-{moodId}` |
| Trending | 1h | `trending` |
| Search (`/search/movie`) | 1h | none |
| Discover filter (`/discover/movie`) | 1h | `discover` |
| Videos (trailer) | 24h | `videos-{id}` |
| Watch providers | 6h | `providers-{id}` |
| Genre list | 30 days | `genres` |
| User data | no-store | — |

## Route Structure

```
/                          Landing (mood picker + trending + filter panel → navigate)
/discover                  Browse/filter page (genre, year, rating, sort, lang) + search by title
/discover/[mood]           Mood result (hero + grid + pagination, no filter)
/movie/[slug]              Movie detail
/trending                  Hot now
/(user)/watchlist          Private
/(user)/watched            Private
/login                     Auth
```

URL slug: `{kebab-title}-{year}-{imdb_id}` — human-readable + imdb_id để resolve.

## SEO Strategy

- URL slug human-readable + imdb_id suffix
- JSON-LD Movie schema (rating, trailer, director)
- Sitemap động cho top movies + mood pages
- Open Graph tags + dynamic opengraph-image
- Long-tail mood keywords (`/discover/cozy` -> "cozy movies", "comfort films")
- Filter URLs indexed cho long-tail (`/discover/cozy?year=2020`)
- robots.txt

## Performance Targets

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Initial JS < 100kb
- Movie detail TTFB < 800ms

## Known Constraints

- **Vercel Hobby**: 100GB bandwidth/month, 100k function invocations/day → cache aggressive, đừng để bot scrape
- **Neon free**: auto-suspend sau 5 phút inactivity → first cold query chậm ~2s
- **TMDB rate limit**: ~50 req/s → ISR cache giải quyết
- **Vercel subdomain**: SEO weaker hơn custom domain (chấp nhận để học)
