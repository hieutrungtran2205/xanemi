# Xanemi — Architecture

> Tên cũ: **Moodflix** (working name). Đã rebrand → **Xanemi** (xem ADR-019). Deploy `xanemi.vercel.app`.

## Vision

Xanemi giải quyết painpoint "không biết xem gì" bằng **multi-lane discovery** — nhiều cách vào khám phá phim, mỗi cái phục vụ một mental model khác nhau:

- **Trending** — phim đang hot (hero slider + grid ở landing).
- **Theme** (genre-first) — "muốn xem phim chiến tranh / hài / kinh dị". Route `/theme/[slug]`.
- **Country** (cinema-by-origin) — "muốn xem phim Hàn / Pháp / Nhật". Route `/country/[slug]`.
- **Browse/Filter** — power search theo genre/year/rating/sort/country. Route `/discover`.
- **Search** — tìm theo tên phim (header autocomplete → `/discover?q=`).

Sau đó: xem trailer + biết xem ở đâu (watch providers) + lưu watchlist.

> **Lưu ý hướng đi**: bản đầu lấy **mood-first** làm differentiator (chọn cảm xúc → phim curated). Hướng này **đã bị bỏ** (ADR-024) — mood nông và trùng vai với theme/genre, poster phim thật kéo thị giác mạnh hơn mood chip. Code mood còn sót lại trong source là **orphan/tech-debt** (xem ROADMAP → Bug & Tech Debt Log).

**Differentiator** vs Letterboxd/IMDB/TMDB: gom nhiều "lane" khám phá nhẹ, đẹp, nhanh trong một UI premium minimal — không bắt user search mù hay cuộn vô định.

**Inspiration**: Letterboxd (discovery), Mubi (aesthetic), JustWatch (watch providers).

## Tech Stack — Lý do

| Layer | Choice | Lý do |
|---|---|---|
| Framework | Next.js 16 App Router | SEO mạnh (SSR/ISR), RSC giảm bundle, streaming UI |
| Language | TypeScript strict | Type-safe TMDB response |
| Styling | Tailwind v4 + shadcn/ui | Velocity, dark theme, component ownership |
| State server | RSC + Next fetch cache | Native, no extra lib |
| State client | Zustand (nếu cần) | Nhẹ — hiện chưa dùng |
| State URL | nuqs | Filter/search/pagination params, SEO-friendly |
| Auth | Auth.js v5 + Google OAuth | Free, control, học flow |
| DB | Neon Postgres | Free 0.5GB, serverless |
| ORM | Drizzle | Type-safe, lightweight |
| Video | lite-youtube-embed | Performance, lazy load |
| PWA | next manifest + custom SW register | Installable, $0 (ADR-026) |
| Deploy | Vercel Hobby | Free, optimized Next.js |

> Stack thực tế (package.json): Next 16.2, React 19.2, next-auth 5 beta, drizzle-orm, @neondatabase/serverless, nuqs, embla-carousel (qua shadcn Carousel), radix-ui, lucide-react.

## Architecture Overview

```
Client Browser (installable PWA)
    | (HTML + minimal JS)
Vercel Edge (Next.js)
    |- RSC fetch -> TMDB API (cached via next.revalidate + tags)
    |- Route Handlers /api -> search proxy + Neon DB (Drizzle)
    |- proxy.ts (edge cookie-gate) + (user)/layout.tsx (auth())
External:
    |- TMDB API (movie metadata)
    |- YouTube (trailer embed)
    |- Neon Postgres (user data)
```

## Scope: MVP vs V2

### MVP (đã build) — Movie only
- **Discovery lanes**: trending (hero slider + grid), theme (genre-first, 12), country (cinema-by-origin, 12).
- **Browse/Filter** tại `/discover`: genre, year range, min rating, sort, **country of origin** (5 filter). nuqs URL state, Apply pattern.
- **Search by title**: header autocomplete dropdown (5 preview + "See more") → `/discover?q=`.
- **Movie detail**: synopsis, director(s), cast (link → person), trailer (lite-youtube), watch providers, similar.
- **Person detail**: bio + Known For + filmography (`/person/[slug]`).
- **Numbered pagination** (RSC + nuqs) ở `/discover` và `/trending`.
- **Auth** Google OAuth (database session, Neon).
- **Watchlist** add/remove (protected route, optimistic UI).
- **PWA** installable (manifest + service worker register).
- **SEO foundation** một phần: slug human-readable + tmdb_id. (metadata API/sitemap/JSON-LD/OG — xem ROADMAP Week 2, phần lớn chưa làm.)

### Bỏ khỏi scope (từng có trong plan)
- **Mood-based discovery** — bỏ (ADR-024). Code orphan chờ gỡ.

### V2 (Defer)
- TV series support
- Watched + rating (1-10) + `/watched` page
- Comment system / personal review (MDX)
- Curated collections
- Filter Tier 2 (runtime, keywords, cast/crew, watch-provider filter) + quick filter chips
- i18n (multi-language)
- Personalized recommendations từ watched history

## ADR Log

### ADR-001: Next.js App Router
**Decision**: Next.js App Router thay vì Vite SPA / Pages Router.
**Why**: SEO là mục tiêu học chính → cần SSR/ISR. App Router chuẩn 2026.
**Trade-off**: RSC learning curve, lean về Vercel.

### ADR-002: TMDB as single source of truth
**Decision**: Không sync movie data vào DB. Lưu `tmdbId + snapshot (jsonb)` trong user tables.
**Why**: DB free tier nhẹ, không cần sync job, data luôn fresh.
**Trade-off**: Cần TMDB online; watchlist page lazy load.

### ADR-003: Mood-based discovery as signature (superseded by ADR-024)
**Decision**: Mood picker là landing experience chính. Trending là secondary.
**Why**: Differentiator vs IMDB/Letterboxd. Painpoint thật.
**Trade-off**: Quality phụ thuộc mood mappings.
→ **Đã bỏ**: mood không còn là signature, thay bằng multi-lane discovery (theme/country/trending). Xem ADR-024.

### ADR-004: Drop pirate embed, use trailer + watch providers
**Decision**: KHÔNG embed full movie. Chỉ YouTube trailer + link đến Netflix/Amazon qua TMDB watch/providers.
**Why**: Pháp lý (DMCA), Vercel TOS, học SEO không bị penalty.
**Trade-off**: User không xem full phim → giá trị phụ thuộc curation/discovery quality.

### ADR-005: Server Component default
**Decision**: RSC default, `'use client'` chỉ khi cần interactivity/hooks/browser API.
**Why**: Bundle nhỏ, SEO tốt, TMDB key bảo mật.
**Trade-off**: Phải nắm RSC boundary; vài lib chưa hỗ trợ.

### ADR-006: Curated mappings v1, no LLM in MVP (mood phần đã bỏ — xem ADR-024)
**Decision**: Discovery lane hardcode TMDB Discover query params. LLM-powered free-form ở V2.
**Why**: MVP ship nhanh, free, no vendor lock-in.
**Trade-off**: Cùng query → same result (mitigate bằng cache + sort). Áp dụng giờ cho theme/country definitions.

### ADR-007: Vercel subdomain cho MVP, defer custom domain
**Decision**: Deploy `xanemi.vercel.app`, không mua domain ở MVP.
**Why**: $0 cost, dễ rebrand.
**Trade-off**: SEO weaker hơn custom domain (chấp nhận để học).

### ADR-008: MVP với Claude Code review-first
**Decision**: Rule: review mọi code Claude Code generate trước khi merge. Không yolo.
**Why**: Học thật, không chỉ ship sản phẩm rỗng.
**Trade-off**: Chậm hơn yolo.

### ADR-009: Drop "Cinemood", chọn "Moodflix" (superseded by ADR-019)
**Decision**: Working name = Moodflix.
→ Đã rebrand thành **Xanemi**, xem ADR-019.

### ADR-010: MVP movie-only, TV series defer V2
**Decision**: Chỉ build movie. KHÔNG build TV series trong MVP.
**Why**: Giảm scope, ít edge case (season/episode), ship nhanh.
**Trade-off**: User không discover TV shows ở MVP.

### ADR-011: Filter tách khỏi discovery lane — `/discover` page riêng
**Decision**: Filter (genre, year, rating, sort, country) sống tại `/discover`, KHÔNG nhúng vào theme/country pages. Theme/country pages giữ nguyên: hero + grid + pagination, không filter. URL state via nuqs. Apply button — không live update.
**Why**: Filter và lane khám phá là 2 entry point độc lập. Lane = curation; filter = power search. Gộp chung làm loãng cả hai.
**Trade-off**: User muốn filter trong context một lane phải ra `/discover` tay.
> Bối cảnh gốc của ADR này là "filter tách khỏi mood"; sau khi bỏ mood, nguyên tắc vẫn đúng cho theme/country.

### ADR-015: Search by title tách biệt filter
**Decision**: Search (`/search/movie`) và filter (`/discover/movie`) là 2 mode riêng tại `/discover`. Khi có `?q=`, ẩn filter panel và dùng search endpoint. Không cho phép combine.
**Why**: TMDB API giới hạn cứng — `/search/movie` không nhận genre/rating/sort params; `/discover/movie` không nhận text query. Combine ở client tạo UX giả và kết quả sai.
**Trade-off**: User không thể vừa search tên vừa filter genre cùng lúc.
**Autocomplete (header)**: Search bar có dropdown preview 5 results qua route handler `/api/search/movies` (proxy `searchMovies()` server-only). Debounce 500ms + `AbortController`. "See more" / Enter không highlight → push `/discover?q=`. Bar mirror URL `?q=` qua render-time sync (`urlQ !== prevUrlQ`) — clear link reset bar tự động.

### ADR-016: Theme system — genre-first discovery lane
**Decision**: `/theme/[slug]` map trực tiếp tới TMDB genre IDs. (Khác mood cũ: mood map tới cảm xúc — nhiều genre + params phức tạp hơn.)
**Why**: Một số user biết rõ muốn xem gì ("phim chiến tranh") hơn là cảm xúc. Genre-first là UX quen thuộc, dễ onboard.
**Data**: `lib/themes/definitions.ts` — mảng `THEMES[]` với `slug`, `title`, `description`, `query` (TMDB Discover params). Không DB, không state client — static + server-fetched.
**Route**: `app/theme/[slug]/page.tsx` dùng `getThemeMovies()` + `ThemeHero` + `MovieGrid`.
**Themes hiện tại (12)**: Family Night, Date Night, Mind Benders, Blockbusters, Timeless Classics, Tearjerkers, Laugh Out Loud, Edge of Your Seat, War, Crime & Noir, Horror, Animated.

### ADR-017: Country system — cinema-by-origin discovery lane
**Decision**: `/country/[slug]` song song với `/theme/[slug]`. Filter theo `with_original_language` và/hoặc `with_origin_country` (ISO 3166-1) của TMDB Discover API.
**Why**: Một số user discover phim theo nền điện ảnh ("phim Hàn", "phim Pháp") — mental model khác hẳn genre.
**Data**: `lib/countries/definitions.ts` — `COUNTRIES[]` với `slug`, `title`, `description`, `language` (ISO 639-1, metadata), `query`.
**Route**: `app/country/[slug]/page.tsx` dùng `getCountryMovies()`, reuse `ThemeHero` (`label="Cinema"`) + `MovieGrid`.
**vote_count threshold**: chỉnh theo độ phổ biến từng nền — Hollywood 5000, niche (VN, IT, DE) xuống 50-500 để tránh rỗng.
**Countries hiện tại (12)**: American (US), British (GB), Korean, French, Spanish & Latino, Japanese, Italian, Bollywood (IN), Chinese (CN), Thai (TH), German, Vietnamese (VN).

### ADR-012: Feature-sliced development
**Decision**: Build theo vertical slices 1-4h mỗi cái. Mỗi slice: plan → code → review → test → commit → roadmap update.
**Why**: Code reviewable, bug phát hiện sớm, học từng concept, git history clean.
**Trade-off**: Planning overhead; cần discipline không skip review.

### ADR-013: Design Direction — Premium Minimal
**Decision**: Dark-only theme, premium minimal (Mubi/A24 vibe). Base shadcn/ui ít custom. Typography Space Grotesk + Inter. Logo text wordmark CSS. Reference: Letterboxd + Mubi. Chi tiết tokens ở docs/DESIGN.md.
**Why**: Minimal = ít rủi ro "AI-generated look". Content (poster) tỏa sáng. Nhanh, $0.
**Trade-off**: Ít differentiation visual; cần user actively review output design.
> Hệ "mood accent (10 màu)" trong bản đầu **không được implement** (globals.css không có token mood) và đã bỏ cùng mood. Accent hiện dùng neutral của shadcn.

### ADR-014: No blocking modal (superseded by ADR-018)
**Context**: Thiết kế ban đầu có modal chọn mood khi vào landing → (1) Google interstitial penalty, (2) first-load friction.
**Decision**: Bỏ blocking modal. Nguyên tắc "no blocking modal / no CLS" vẫn giữ.
→ Landing hero sau đó đổi sang trending slider (ADR-018), không còn MoodPicker/Mood of the Day.

### ADR-018: Landing hero — Trending banner slider (supersedes ADR-014)
**Context**: Sau khi build theme + country (định hướng tốt, có chiều sâu), mood lộ ra **nông và trùng vai**; poster phim thật kéo thị giác mạnh hơn mood chip.
**Decision**: Thay mood hero ở landing bằng **trending banner slider**. `components/movie/hero-slider.tsx` (Server: fetch top 5 trending có backdrop + genre map) + `hero-carousel.tsx` (Client: Embla qua shadcn Carousel). Manual nav (mũi tên + dots, loop) — **KHÔNG auto-rotate**. Mỗi slide: "Trending #N" + title + meta + overview + "View details".
**Consequences**:
- (+) Landing "content first" — đúng ADR-013.
- (+) Theme/country gánh vai trò định hướng.
- (+) Giữ cam kết SEO/CLS: height cố định `h-[65vh]`, chỉ slide đầu `priority` (LCP), manual.
- Đây là bước đầu hạ mood; ADR-024 sau đó bỏ hẳn mood lane. Chi tiết UI: docs/DESIGN.md → "Hero Slider (Landing)".

### ADR-019: Rebrand "Moodflix" → "Xanemi" (supersedes ADR-009)
**Context**: "Moodflix" chỉ là working name, "-flix" bị bão hòa (Netflix-clone vibe).
**Decision**: Đổi tên thành **Xanemi** — chơi chữ đọc ngược "Cinema". Lạ, độc nhất, gần như zero competition SEO.
**Logo**: wordmark "Xanemi" (Space Grotesk semibold), dấu chấm chữ "i" cuối thay bằng **nút play**. Chi tiết ở docs/DESIGN.md → "Logo".
**Consequences**:
- (+) Tên độc, brandable, SEO-friendly.
- (−) Rủi ro phát âm chữ "X" → giữ wordmark đọc rõ tên, KHÔNG biến X thành mark trừu tượng.
- **Đã rebrand**: logo, manifest PWA (`name: "Xanemi"`), tagline "The cinema, in your room", docs titles. Còn lại (favicon final, OG image, metadata `<title>` toàn site) gắn với SEO Week 2 — phần lớn chưa làm.

### ADR-020: Auth — Auth.js v5 + Google OAuth + database sessions (Neon/Drizzle)
**Context**: Cần đăng nhập làm nền cho watchlist/watched. Chốt full DB ngay (không JWT-only) để có sẵn `user.id`.
**Decision**: `next-auth@5 (beta)` + `@auth/drizzle-adapter`, **database session strategy**, provider **Google OAuth only**.
- `src/auth.ts` export `{ handlers, auth, signIn, signOut }`. Route handler `src/app/api/auth/[...nextauth]/route.ts` re-export `handlers`.
- DB: `src/lib/db/client.ts` (Neon HTTP driver + `server-only`) + `src/lib/db/schema.ts`.
- **Schema = 4 bảng chuẩn Auth.js**: `user`, `account`, `session`, `verificationToken` — tên do adapter quy định. `user.id` = `text` + `$defaultFn(crypto.randomUUID)`.
- **Migration = push-based** (`drizzle-kit push`), chưa sinh migration files. Scripts: `db:generate`/`db:push`/`db:studio`. `drizzle.config.ts` load `.env.local` qua `dotenv`.

**Env** (`.env.local`, set y hệt trên Vercel vì gitignore): `AUTH_SECRET`, `DATABASE_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`. Auth.js v5 auto-đọc `AUTH_GOOGLE_*`. `AUTH_URL` không cần (Vercel auto-detect).

**Consequences**:
- (−) **Toàn site thành dynamic**: `auth()` trong root Header đọc cookies → mọi route mất full-route static cache. TMDB data cache (revalidate) vẫn chạy. SEO (Week 2) cần tách auth khỏi static path nếu muốn static lại.
- (−) `auth()` query DB mỗi request (đánh đổi của database strategy). Chấp nhận ở MVP.
- Multi-provider sẵn sàng: thêm provider = thêm row `account` cùng `user.id`, không sửa schema.

**Google OAuth thực tế**: app ở **Testing** + chỉ non-sensitive scopes (`openid email profile`) → Gmail bất kỳ vẫn login được (không document chính thức) → nên Publish cho ổn định, basic-scope không cần Google verification. Redirect URI giữ đồng thời local + `https://xanemi.vercel.app/api/auth/callback/google`.

### ADR-021: Watchlist — protected routes (2-layer gating) + `/login` page
**Decision**:
- **Gating 2 lớp**:
  - `src/proxy.ts` (Next 16, export `proxy` + `config.matcher`) — gate UX ở edge, **chỉ check tồn tại session cookie**, KHÔNG import `@/auth`/adapter. Thiếu → redirect `/login?callbackUrl=<path>`.
  - `src/app/(user)/layout.tsx` — **nguồn chân lý**: `await auth()` validate session thật với DB. Mọi route private nằm trong group `(user)`.
- **Có trang `/login`** (`src/app/login/page.tsx`) — **thay phần "Không có trang /login" của ADR-020**. Server Component đọc `?callbackUrl`, sanitize (chỉ path relative, chặn open-redirect), form gọi `signInWithGoogleTo`. Header/mobile-nav vẫn dùng `signInWithGoogle()` (về trang hiện tại).
- **Bảng `watchlist`**: `id`/`userId`(FK cascade)/`tmdbId`/`snapshot` jsonb/`addedAt`, unique `(userId, tmdbId)`. `snapshot` = `{ title, posterPath, releaseDate, voteAverage }` → render `/watchlist` không gọi lại TMDB.
- **Server actions** `src/lib/watchlist/actions.ts` (`addToWatchlist`/`removeFromWatchlist`, guard `session.user.id`, add dùng `onConflictDoNothing`, `revalidatePath('/watchlist')`). Queries `src/lib/watchlist/queries.ts` (`server-only`).
- **UI**: `WatchlistButton` (detail hero, optimistic `useTransition`; chưa login → link `/login?callbackUrl`); `WatchlistCard` (trang /watchlist, MovieCard + remove overlay optimistic). `MovieCard` prop narrow xuống `Pick<Movie, ...>`. Link "Watchlist" trong user-dropdown + mobile-nav (khi logged in).
- `src/types/next-auth.d.ts` augment `Session['user'].id`.
**Consequences**: proxy chỉ gate UX (không verify chữ ký) → bảo mật thật ở `(user)/layout.tsx` + guard trong server actions. Watchlist data = no-store.

### ADR-022: Numbered Pagination — RSC + nuqs, không TanStack Query
> (Renumbered — trước đây trùng số với ADR-016.)
**Decision**: Pagination dùng RSC + nuqs, không client-side data fetching. `page` sống ở URL (`?page=N`). Server Component đọc `searchParams`, fetch TMDB, render `<MovieGrid>` + `<Pagination>`. `<Pagination>` là Client Component dùng nuqs `useQueryState('page')`.

**`<Pagination>`** (`components/movie/pagination.tsx`):
- Prev/Next + numbered pages với ellipsis (`1 … 5 [6] 7 … 500`).
- Jump-to-page input + Go (chỉ hiện khi totalPages > 10), inline cùng row.
- Scroll to top (smooth) khi đổi trang. Mọi navigation qua nuqs `setPage`.

**Skeleton khi filter/page đổi**: `key={...filters...page}` vào `<Suspense>` bọc `MovieResults` → unmount boundary cũ, show `<MovieGridSkeleton>` trong khi stream data mới. Filter sidebar giữ nguyên.

**Page limits**: Discover = 500 (TMDB hard cap). Trending = 50 (data đổi liên tục).
**Why**: Giữ kiến trúc RSC — `page` ở URL = shareable, bookmarkable, SEO-friendly. nuqs đủ mạnh.
**Trade-off**: Mỗi lần đổi trang là full server round-trip. Chấp nhận được (data cache).

### ADR-023: List queries delegate fetch via `tmdbList()` wrapper
> (Renumbered — trước đây trùng số với ADR-017. Bối cảnh gốc là mood engine; mood giờ orphan nhưng wrapper vẫn là chuẩn cho mọi list query.)
**Decision**: `tmdbList<T>(path, params, options?)` ở `lib/tmdb/endpoints.ts` là điểm chung cho mọi list query. `getDiscoverMovies`, `searchMovies`, `getThemeMovies`, `getCountryMovies` đều delegate vào nó (params translation riêng, fetch + cache chung).
**Consequences**:
- (+) Clean boundary: `lib/tmdb` owns fetch + cache; mỗi lane owns query translation.
- (+) Thêm list query mới reuse `tmdbList` không đụng cache logic.
- (−) Một import hop. `lib/moods/engine.ts` (`getMoviesByMood`) cũng dùng wrapper này nhưng giờ là orphan (ADR-024).

### ADR-024: Drop mood as a discovery lane (supersedes ADR-003; finalizes ADR-018)
**Context**: ADR-018 đã hạ mood khỏi landing hero. Sau khi theme + country chứng tỏ là lane khám phá đủ tốt và quen thuộc hơn, mood không còn lý do tồn tại: trùng vai với theme (đều ra phim theo genre/params), nông hơn về mental model, và không có entry point nào còn dẫn tới nó.
**Decision**: **Bỏ mood hoàn toàn khỏi hướng sản phẩm.** Không còn coi mood là feature. Landing = trending + theme + country. Header nav = Browse + Trending.
**Trạng thái code (tech debt, CHƯA gỡ)**: route `/discover/[mood]` + `lib/moods/*` (`definitions`, `engine`, `types`) + `components/mood/*` (`mood-chip`, `mood-picker`) + `components/movie/mood-movie-hero.tsx` + `components/layout/hero-banner.tsx` + nhánh `buildQueryWithFilters(mood,...)` trong `lib/filters/query-builder.ts` đều **orphan** — không UI nào link tới (route chỉ truy cập được bằng URL trực tiếp). Danh sách file cần xoá ở ROADMAP → Bug & Tech Debt Log. Việc gỡ là slice riêng (refactor, commit tách).
**Consequences**:
- (+) Hướng sản phẩm rõ ràng, không còn lane thừa.
- (−) Dead code tạm thời trong repo cho tới slice "deprecate mood".
- Tài liệu mood mappings cũ giữ ở docs/DISCOVERY.md → mục "Legacy: Mood (deprecated)" cho lịch sử.

### ADR-025: Filter — Original Language → Country of Origin
**Context**: Filter V1 ban đầu có "Original Language" (`with_original_language`). Trùng ý niệm với country lane và kém trực giác (user nghĩ theo "phim nước nào" hơn là "ngôn ngữ gốc").
**Decision**: Thay filter language bằng **Country of Origin** (`with_origin_country`, ISO 3166-1). `FilterParams.country: CountryCode`, default `'any'`. Options: US, GB, KR, JP, FR, ES, IN, CN, IT, DE (`lib/filters/types.ts`). `buildDiscoverQuery` set `with_origin_country` khi `country !== 'any'`. nuqs key `country`.
**Why**: Nhất quán với country lane, mental model rõ hơn.
**Trade-off**: Mất khả năng lọc theo ngôn ngữ gốc thuần (chấp nhận; country phủ phần lớn use case).

### ADR-026: Installable PWA
**Decision**: App là PWA cài được. `app/manifest.ts` (`MetadataRoute.Manifest`: name "Xanemi", `display: standalone`, `theme_color`/`background_color` #0A0A0B, icons 192/512). `components/layout/register-sw.tsx` đăng ký service worker phía client.
**Why**: Trải nghiệm "app-like", install lên home screen, $0 — phù hợp mục tiêu học. Không offline-first phức tạp ở MVP.
**Trade-off**: SW cache cần cẩn thận để không phục vụ data cũ; giữ scope SW tối thiểu.

## Data Model

Movie-only, không có `mediaType` field.

```
USER (1) --- (N) WATCHLIST          # đã implement
USER (1) --- (N) WATCHED            # defer V2

USER:      id, name, email (unique), emailVerified, image    # Auth.js shape (ADR-020) — KHÔNG có createdAt
WATCHLIST: id, userId, tmdbId, snapshot(jsonb: title/posterPath/releaseDate/voteAverage), addedAt, unique(userId, tmdbId)
WATCHED:   id, userId, tmdbId, rating(1-10 nullable), snapshot, watchedAt    # chưa implement
```

- `USER`/`ACCOUNT`/`SESSION`/`VERIFICATION_TOKEN` theo schema chuẩn Auth.js (ADR-020) — không thêm field tuỳ ý.
- `WATCHLIST` đã implement (ADR-021). `WATCHED` chưa — bảng mới `FK userId → user.id`.
- `MOOD_LOG` (bản đầu định track mood→click cho analytics) **bỏ** cùng mood (ADR-024).
- `snapshot` jsonb: lưu field MovieCard cần để hiển thị nhanh không gọi TMDB từng item.

## Caching Strategy

Cache value sống trong helper (`fetchMovieResource`, `fetchPersonResource`, `tmdbList`) — không khai lại per-endpoint.

| Endpoint | Helper | Revalidate | Tag |
|---|---|---|---|
| Movie detail + credits/videos/providers/similar | `fetchMovieResource` | 24h | `movie-{id}` |
| Person detail + movie_credits | `fetchPersonResource` | 24h | `person-{id}` |
| Trending | `getTrending` | 1h | `trending` |
| Discover filter (`/discover/movie`) | `tmdbList` | 1h | `discover` |
| Search (`/search/movie`) | `tmdbList` | 1h | `search` |
| Theme (`/theme/[slug]`) | `getThemeMovies` | 24h | `theme-{slug}` |
| Country (`/country/[slug]`) | `getCountryMovies` | 24h | `country-{slug}` |
| Genre list | `getGenreList` | 30 days | `genres` |
| User data (watchlist) | — | no-store | — |

> Lưu ý: per-movie sub-resource (credits/videos/providers/similar) hiện **dùng chung tag `movie-{id}` và revalidate 24h** qua `fetchMovieResource` — không tách tag riêng như bảng cache dự kiến ban đầu.

## Route Structure

```
/                          Landing (trending hero slider + trending grid + themes + countries)
/discover                  Browse/filter (genre, year, rating, sort, country) + search by title (?q=)
/theme/[slug]              Theme result (genre-first lane) — hero + grid + pagination
/country/[slug]            Country result (cinema-by-origin lane) — hero + grid + pagination
/movie/[slug]              Movie detail (director + cast cards link → /person)
/person/[slug]             Person detail (bio + Known For + filmography)
/trending                  Hot now (numbered pagination, max 50 trang)
/(user)/watchlist          Private (auth-gated)
/login                     Auth (Google OAuth)

# orphan (ADR-024, chờ gỡ): /discover/[mood]
```

URL slug:
- Movie: `{kebab-title}-{year}-{tmdb_id}` — VD `inception-2010-27205`.
- Person: `{kebab-name}-{tmdb_id}` — VD `christopher-nolan-525` (không year). `parseSlug` chung cho cả 2 (lấy `tmdb_id` từ segment cuối).

## SEO Strategy (phần lớn Week 2 — chưa làm)

- URL slug human-readable + tmdb_id suffix ✅ (đã có)
- JSON-LD Movie schema + BreadcrumbList ⬜
- Sitemap động + robots.txt ⬜
- Open Graph tags + dynamic opengraph-image ⬜
- Long-tail keywords theo theme/country (`/theme/horror`, `/country/korean`) ⬜
- **Blocker hiện tại**: `auth()` ở root Header làm toàn site dynamic (ADR-020) → cần tách auth khỏi static path trước khi đẩy SEO.

## Performance Targets

- LCP < 2.5s · INP < 200ms · CLS < 0.1 · Initial JS < 100kb · Movie detail TTFB < 800ms

## Known Constraints

- **Vercel Hobby**: 100GB bandwidth/tháng, 100k invocations/ngày → cache aggressive.
- **Neon free**: auto-suspend sau 5 phút → first cold query chậm ~2s.
- **TMDB rate limit**: ~50 req/s → ISR cache giải quyết.
- **Vercel subdomain**: SEO weaker hơn custom domain (chấp nhận để học).
</content>
</invoke>
