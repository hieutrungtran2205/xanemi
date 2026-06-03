# Moodflix — Roadmap

> Build theo **vertical slices** (1-4h mỗi cái). Mỗi slice: plan -> code -> review -> test -> commit -> check off. KHÔNG làm nhiều slice cùng lúc.

## Current Phase: Week 1 — Foundation & Core Discovery

**Goal end of Week 1**: mood-based discovery flow work end-to-end, deploy Vercel (no auth yet).

---

## Workflow Mỗi Slice

1. Plan scope với Claude (architecture chat)
2. Prompt Claude Code với scope rõ + acceptance criteria
3. Review từng file generate
4. Test manual trên browser
5. `git commit -m "feat(scope): message"`
6. Check off checkbox ở dưới
7. Next slice

---

## Week 1 Slices

### Slice 1.1: Project Setup ⬜
- [ ] `pnpm create next-app moodflix` (TS, Tailwind, App Router, no src/)
- [ ] shadcn/ui init + dark theme base
- [ ] Setup fonts (Space Grotesk + Inter via next/font)
- [ ] `.env.local` với TMDB_API_KEY
- [ ] `next.config.ts` cho image.tmdb.org
- [ ] Push GitHub + link Vercel deploy
**Acceptance**: localhost:3000 + Vercel URL show dark theme blank page

### Slice 1.1.5: Layout Shell (Header + Logo + Footer) ⬜
- [ ] `components/layout/logo.tsx` (text wordmark: "mood" bold + "flix" thin, clickable → /)
- [ ] `components/layout/header.tsx` (sticky top: logo trái + "Trending" nav + "Sign in" placeholder button)
- [ ] `components/layout/footer.tsx` (logo nhỏ + tagline + TMDB attribution + logo TMDB)
- [ ] Wire header + footer vào app/layout.tsx
- [ ] Mobile responsive (hamburger nếu cần cho nav)
**Acceptance**:
- Logo đúng style (mood bold trắng + flix thin xám), click → /
- Header sticky top, không vỡ mobile
- "Sign in" là placeholder (chưa work — wire Week 3)
- Footer có TMDB attribution text + logo (BẮT BUỘC theo TMDB terms)
- Mọi page tự động có header + footer

### Slice 1.2: TMDB Client Foundation ⬜
- [ ] `lib/tmdb/client.ts` (server-only fetch wrapper, typed)
- [ ] `lib/tmdb/types.ts` (Movie, MovieDetail, TMDBResponse)
- [ ] `lib/tmdb/endpoints.ts` (getTrending, getMovieDetail)
- [ ] `lib/tmdb/utils.ts` (image URL, slug helpers)
- [ ] Test fetch trong app/test/page.tsx (temp)
**Acceptance**: Visit /test → trending movies array logged, no `any`, key not exposed

### Slice 1.3: MovieCard Component ⬜
- [ ] `components/movie/movie-card.tsx` (poster 2:3 + title + year + rating)
- [ ] Loading skeleton variant
- [ ] Hover state (subtle, không stack effect)
**Acceptance**: Card render với TMDB data + skeleton state

### Slice 1.4: Trending Section ⬜
- [ ] TMDB getTrending wired
- [ ] `components/movie/movie-grid.tsx` (responsive grid)
- [ ] Render trending trên landing page
- [ ] Suspense loading state
**Acceptance**: Visit / → 10+ trending movies render, responsive mobile/desktop

### Slice 1.5: Mood Definitions + Engine ⬜
- [ ] `lib/moods/types.ts` (MoodDefinition, MoodId)
- [ ] `lib/moods/definitions.ts` (10 moods theo docs/MOODS.md)
- [ ] `lib/moods/engine.ts` (getMoviesByMood với random page)
- [ ] Test trong temp page
**Acceptance**: 10 moods fetch results khác nhau, có variety giữa các lần gọi

### Slice 1.6: Hero Banner + MoodPicker ⬜
> ⚠️ **Superseded**: landing hero đổi sang **trending banner slider** (`hero-slider.tsx` + `hero-carousel.tsx`, Embla manual carousel). Xem ADR-018 + DESIGN.md "Hero Slider (Landing)". MoodPicker/hero-banner.tsx giờ orphan, mood vẫn ở `/discover/[mood]`.
- [ ] `components/mood/mood-chip.tsx` (emoji + label + accent, `bg-surface/80` trong hero)
- [ ] `components/mood/mood-picker.tsx` (grid 10 chips)
- [ ] `components/layout/hero-banner.tsx` (backdrop + overlay + H1 + subtitle + MoodPicker)
- [ ] Hero backdrop: random từ trending movies (1 fetch server-side, KHÔNG carousel)
- [ ] Dark overlay: `bg-black/70` + gradient fade từ bottom lên
- [ ] Height: `70-80vh` desktop / `50vh` mobile
- [ ] MoodPicker đặt ngay trong hero, dưới H1
- [ ] Click chip → navigate `/discover/[mood]`
**Acceptance**:
- Landing hero có backdrop phim trending, H1 readable trên mọi backdrop
- 10 mood chips render trong hero, click → URL change đúng
- KHÔNG blocking modal, KHÔNG carousel, KHÔNG CLS

### Slice 1.7: Discover Page ⬜
- [ ] Route app/discover/[mood]/page.tsx
- [ ] Breadcrumb tĩnh: Home > [Mood Label]
- [ ] Hero: mood emoji + label + description + accent
- [ ] MovieGrid render mood results
- [x] Numbered pagination (prev/next + ellipsis + jump-to-page) — `components/movie/pagination.tsx`
- [ ] Empty state
- [ ] Invalid mood → 404
**Acceptance**: Click mood từ landing → 20 phim relevant, show more work, breadcrumb hiển thị đúng mood

### Slice 1.8: Movie Detail Hero ⬜
- [ ] Route app/movie/[slug]/page.tsx
- [ ] Slug parser (extract imdb_id từ slug)
- [ ] Breadcrumb tĩnh: Home > [Title] (bỏ segment "Movies")
- [ ] Back button (router.back() + fallback /)
- [ ] `components/movie/movie-hero.tsx` (backdrop + poster + meta)
- [ ] Loading + error/404 states
**Acceptance**: Click phim từ discover → detail hero với backdrop/poster/title/rating, breadcrumb + back button work

### Slice 1.9: Movie Detail Sections ⬜
- [ ] Overview/synopsis section
- [ ] Cast section (top 10, từ TMDB credits)
- [ ] Genre tags (link tương lai)
**Acceptance**: Detail page có synopsis + cast list đầy đủ

### Slice 1.10: Trailer + Watch Providers ⬜
- [ ] Install lite-youtube-embed
- [ ] `components/player/trailer-embed.tsx`
- [ ] TMDB videos endpoint (lấy YouTube trailer key)
- [ ] TMDB watch/providers endpoint
- [ ] `components/movie/watch-providers.tsx`
**Acceptance**: Trailer play được + "Available on Netflix/..." render (region US default)

### Slice 1.11: Similar Movies ⬜
- [ ] TMDB similar/recommendations endpoint
- [ ] Reuse MovieCard + MovieGrid
- [ ] Section dưới detail page
**Acceptance**: Detail page có "Similar Movies" section, click → detail khác

**END WEEK 1**: Full flow landing → mood → discover → detail → trailer. Deploy Vercel public.

---

## Week 2: SEO + Filter ⬜

### Filter Slices (chốt detail khi tới đây)
- [ ] Slice 2.1: Filter UI (sidebar desktop + drawer mobile, 5 filters)
- [ ] Slice 2.2: Filter logic (nuqs URL state + query builder + apply/clear + empty state)

### SEO Slices
- [ ] Slice 2.3: Metadata API mọi route
- [ ] Slice 2.4: Sitemap động + robots.txt
- [ ] Slice 2.5: JSON-LD Movie schema + BreadcrumbList schema
- [ ] Slice 2.6: Open Graph + opengraph-image
- [ ] Slice 2.7: Performance audit (Lighthouse LCP < 2.5s)
- [ ] Slice 2.8: Submit Google Search Console + Vercel Analytics

---

## Week 3: Auth + User Features ⬜

- [x] Slice 3.1: Neon DB + Drizzle setup → xem **Auth/Login (hoàn thành)** ✅
- [x] Slice 3.2: Drizzle schema (auth tables) — Watchlist/Watched/MoodLog defer sang 3.5+
- [x] Slice 3.3: Auth.js v5 + Google OAuth ✅
- [x] Slice 3.4: Protected routes (`proxy.ts` edge cookie-gate + `(user)/layout.tsx` guard) + trang `/login` — xem **ADR-021** ✅
- [x] Slice 3.5: Watchlist table + server actions + `WatchlistButton` trên detail ✅
- [x] Slice 3.6: `/watchlist` page (grid + remove optimistic + empty state) ✅
- [ ] Slice 3.7: Watched + rating + /watched page
- [ ] Slice 3.8: Movie card bookmark indicator + optimistic updates
- [ ] Slice 3.9: Mood log tracking (anonymous + auth)

---

## Pagination (hoàn thành) ✅

- [x] `components/movie/pagination.tsx` — numbered pages + ellipsis + jump-to-page inline
- [x] `app/discover/page.tsx` — numbered pagination, Suspense key đổi theo filter/page → skeleton đúng
- [x] `app/trending/page.tsx` — numbered pagination, giới hạn 50 trang, `getTrending` nhận `page`
- [ ] `app/discover/[mood]/page.tsx` — chưa wire (pending Slice 1.7)

## Person Detail + Director Credit (hoàn thành) ✅

Cho phép click cast/director ở movie detail → trang chi tiết về người đó (bio + filmography).

- [x] Types: `PersonDetail`, `PersonMovieCastCredit` (extends `Movie` + `character`), `PersonMovieCredits`, `CrewMember`. `Credits` mở rộng để có `crew`.
- [x] Endpoints: `getPersonDetail`, `getPersonMovieCredits` qua `fetchPersonResource` (revalidate 86400, tag `person-${id}`).
- [x] Slug person: `toPersonSlug({name, id})` → `{kebab-name}-{tmdb_id}` (không year). `parseSlug` reuse được vì lấy tmdb_id từ segment cuối.
- [x] Helpers: `formatDate`, `calcAge` (hỗ trợ deathday).
- [x] `app/person/[slug]/page.tsx` — Server Component. Logic: dedupe credits theo `id`, sort filmography theo `release_date` desc, pick Known For top 6 popularity, pick hero backdrop từ phim popularity cao nhất.
- [x] `components/person/person-hero.tsx` — backdrop cinematic + photo overlap + name lớn + facts inline.
- [x] `components/person/biography-text.tsx` — client component, line-clamp-6 + toggle Read more.
- [x] `components/person/person-credit-card.tsx` — card reusable (photo + name + role), dùng cho cả cast lẫn director ở movie detail.
- [x] `app/person/[slug]/loading.tsx` + `PersonHeroSkeleton` — skeleton match layout.
- [x] Movie detail: thêm section **Director(s)** (filter `crew.job === "Director"`) ngay trên section Cast. Cả 2 section dùng chung `PersonCreditCard`. Click → `/person/[slug]`.

**Hidden behaviors**:
- Known For chỉ render khi filmography ≥ 15 phim (`KNOWN_FOR_MIN_FILMOGRAPHY`) — tránh duplicate cards cho actor mới.

- Backdrop fallback `bg-surface` plain khi không credit nào có backdrop.

## Search Autocomplete (hoàn thành) ✅

Header search bar mở rộng từ submit-only thành autocomplete dropdown — preview tối đa 5 phim, "See more" delegate sang `/discover?q=`.

- [x] `app/api/search/movies/route.ts` — route handler proxy `searchMovies()` (server-only) để client fetch. Trả 5 results đầu + `total_results`. Guard `q < 2` trả mảng rỗng.
- [x] `components/layout/search-bar.tsx` — refactor: debounce 500ms, `AbortController` cancel inflight, dropdown states (hint < 2 chars / skeleton / empty / list + "See more N+").
- [x] Keyboard nav: Arrow Up/Down highlight, Enter chọn highlight hoặc fallback submit `/discover?q=`, Escape đóng.
- [x] Click-outside `mousedown` listener + `focused || isOpen` giữ form expanded khi tương tác dropdown.
- [x] URL sync: `useSearchParams` + `if (urlQ !== prevUrlQ) setQ(urlQ)` (render-time pattern, không cascading) → "clear search" link ở `/discover` reset luôn bar.
- [x] Item dùng `<Link>` để Next prefetch movie pages.
- [x] `posterUrl` mở rộng size union: thêm `w92 | w154 | w185` cho thumbnail use cases.

**Hidden behaviors**:
- Bar value mirror URL `?q=`: navigate sang trang không có `?q=` (e.g. movie detail sau khi click result) cũng clear bar — UX phổ biến.
- Stale results giữ lại khi user gõ tiếp (chưa qua debounce) thay vì clear ngay → tránh flicker; fetch mới setLoading(true) → skeleton overrides.
- `controller.signal.aborted` check ở finally tránh setState sau khi unmount/abort.

## Auth / Login (hoàn thành) ✅

Đăng nhập Google OAuth, session lưu Neon. Nền cho watchlist/watched (Slice 3.5+). Chi tiết quyết định: **ADR-020** trong docs/ARCHITECTURE.md.

- [x] Deps: `next-auth@5 (beta)` + `@auth/drizzle-adapter` (+ `dotenv` dev). `@neondatabase/serverless`/`drizzle-orm`/`drizzle-kit` đã có sẵn.
- [x] `src/lib/db/client.ts` — Neon HTTP driver + Drizzle, `server-only`. `src/lib/db/schema.ts` — 4 bảng chuẩn Auth.js (`user`/`account`/`session`/`verificationToken`).
- [x] `drizzle.config.ts` (load `.env.local` qua dotenv) + scripts `db:generate`/`db:push`/`db:studio`. Tạo bảng bằng **`db:push`** (chưa dùng migration files).
- [x] `src/auth.ts` — NextAuth + DrizzleAdapter + Google, database session. `src/app/api/auth/[...nextauth]/route.ts` — handler.
- [x] `src/lib/auth-actions.ts` — server actions `signInWithGoogle`/`signOutAction` (dùng chung header + mobile-nav).
- [x] `Header` async → `auth()`, truyền `user` xuống. `user-menu.tsx` (server) + `user-dropdown.tsx` (client, avatar + Sign out). `mobile-nav.tsx` wire sign in/out. shadcn `dropdown-menu` + `avatar` đã add.
- [x] Env: `AUTH_SECRET` (gen sẵn) + `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` + `DATABASE_URL`. Set y hệt trên Vercel (`.env.local` gitignore). Google OAuth redirect URI: local + `https://xanemi.vercel.app`.
- [x] Verify: `tsc` sạch, `build` pass, login local + production chạy, 2 user row trên Neon.

**Hidden behaviors / cần biết**:
- `auth()` trong root Header → **toàn site dynamic** (mất static cache, TMDB data cache vẫn chạy). Liên quan SEO Week 2.
- Google app đang **Testing** nhưng non-sensitive scope → Gmail bất kỳ vẫn login được dù chưa publish (không document chính thức). Publish khi muốn ổn định — không cần Google verification.
- ✅ Đã có (ADR-021): `proxy.ts` + `(user)/layout.tsx` gating, trang `/login`, bảng `watchlist` + UI. Chưa có: `watched` table + UI, mood log.

## Week 4+: Post-MVP ⬜

- [ ] Loading skeletons polish
- [ ] TV series support
- [ ] Comment system
- [ ] Curated collections
- [ ] LLM-powered free-form mood
- [ ] Filter Tier 2 + /browse page

---

## Decision Log
Decision quan trọng giữa slices → ghi ADR vào docs/ARCHITECTURE.md.

## Bug & Tech Debt Log
(Add khi xuất hiện)
- 

## Notes
- Working name: Moodflix (deploy moodflix.vercel.app)
- MVP = movie only, no TV
- Filter V1 = 5 basic filters
- Header: sticky top, nav chỉ "Trending", "Sign in" = placeholder đến Week 3
- TMDB attribution BẮT BUỘC ở footer (terms requirement)
- Breadcrumb: hybrid (back button + breadcrumb tĩnh theo URL). Ở Discover/Movie/Trending, KHÔNG landing. Movie detail = "Home > Title". BreadcrumbList JSON-LD ở Week 2.
