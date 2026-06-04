# Xanemi — Roadmap

> Build theo **vertical slices**. Mỗi slice: plan → code → review → test → commit → check off.
> Tên cũ "Moodflix" → đã rebrand **Xanemi** (ADR-019).

## Trạng thái: MVP đã ship ✅

Full flow chạy end-to-end, deploy `xanemi.vercel.app`. Hướng sản phẩm: **multi-lane discovery** (trending + theme + country + filter + search), **KHÔNG còn mood** (ADR-024).

**Đã có**:
- **Foundation**: Next 16 App Router, Tailwind v4 + shadcn, fonts (Space Grotesk + Inter), TMDB client (`lib/tmdb/*`), layout shell (header/footer/nav), PWA installable.
- **Discovery**: trending (hero slider + grid + `/trending`), theme `/theme/[slug]` (12), country `/country/[slug]` (12).
- **Browse/Filter** `/discover`: 5 filter (genre, year, rating, sort, **country of origin**), nuqs URL state, numbered pagination, active filter chips, empty state.
- **Search**: header autocomplete (5 preview + See more) → `/discover?q=`.
- **Movie detail** `/movie/[slug]`: hero, synopsis, director(s) + cast (→ person), trailer (lite-youtube), watch providers, similar.
- **Person detail** `/person/[slug]`: bio + Known For + filmography.
- **Auth**: Google OAuth, database session (Neon/Drizzle).
- **Watchlist**: protected route (2-layer gating) + `/login`, add/remove optimistic, `/watchlist` page.

**Chưa làm (xem dưới)**: SEO foundation (Week 2 phần lớn), Watched + rating, gỡ mood orphan code.

---

## Workflow Mỗi Slice

1. Plan scope (architecture chat) → 2. Prompt scope rõ + acceptance → 3. Review từng file → 4. Test manual browser → 5. `git commit` → 6. Check off → 7. Next slice.

---

## Week 1 — Foundation & Core Discovery ✅ (hoàn thành)

- [x] 1.1 Project setup (Next, shadcn dark, fonts, env, image config, deploy)
- [x] 1.1.5 Layout shell (logo, header sticky, footer + TMDB attribution)
- [x] 1.2 TMDB client foundation (`client`, `types`, `endpoints`, `utils`)
- [x] 1.3 MovieCard + skeleton
- [x] 1.4 Trending section + MovieGrid
- [x] 1.8 Movie detail hero (slug parser, breadcrumb, back button)
- [x] 1.9 Movie detail sections (synopsis, cast, director, genre tags)
- [x] 1.10 Trailer (lite-youtube) + watch providers
- [x] 1.11 Similar movies

**Deprecated (mood — ADR-024, KHÔNG còn là hướng đi)**:
- ~~1.5 Mood definitions + engine~~ → code orphan, chờ gỡ
- ~~1.6 Hero MoodPicker~~ → thay bằng trending hero slider (ADR-018)
- ~~1.7 Discover `/discover/[mood]` page~~ → orphan, chờ gỡ

> Thay cho mood lane: **Theme** (ADR-016) + **Country** (ADR-017) discovery lanes — đã build, là hướng chính.

---

## Week 2: SEO + Filter

### Filter ✅
- [x] 2.1 Filter UI (sidebar desktop + drawer mobile, 5 filters)
- [x] 2.2 Filter logic (nuqs URL state + query builder + apply/clear + empty state)
- [x] Filter: **Original Language → Country of Origin** (ADR-025)

### SEO ⬜ (phần lớn chưa làm)
- [ ] 2.3 Metadata API mọi route
- [ ] 2.4 Sitemap động + robots.txt
- [ ] 2.5 JSON-LD Movie schema + BreadcrumbList schema
- [ ] 2.6 Open Graph + opengraph-image
- [ ] 2.7 Performance audit (Lighthouse LCP < 2.5s)
- [ ] 2.8 Submit Google Search Console + Vercel Analytics

> **Blocker SEO**: `auth()` ở root Header làm toàn site dynamic (ADR-020) → cần tách auth khỏi static path (PPR / client session) trước khi đẩy SEO nghiêm túc.

---

## Week 3: Auth + User Features

- [x] 3.1 Neon DB + Drizzle setup → **Auth/Login** ✅
- [x] 3.2 Drizzle schema (auth tables)
- [x] 3.3 Auth.js v5 + Google OAuth ✅ (ADR-020)
- [x] 3.4 Protected routes (`proxy.ts` edge cookie-gate + `(user)/layout.tsx` guard) + `/login` ✅ (ADR-021)
- [x] 3.5 Watchlist table + server actions + `WatchlistButton` ✅
- [x] 3.6 `/watchlist` page (grid + remove optimistic + empty state) ✅
- [ ] 3.7 Watched + rating + `/watched` page
- [ ] 3.8 Movie card bookmark indicator + optimistic updates
- [ ] ~~3.9 Mood log tracking~~ → bỏ cùng mood (ADR-024)

---

## Hoàn thành ngoài kế hoạch (cross-cutting)

### Theme + Country discovery lanes ✅ (ADR-016, ADR-017)
- `lib/themes/definitions.ts` (12) + `app/theme/[slug]/page.tsx` + `getThemeMovies()`.
- `lib/countries/definitions.ts` (12) + `app/country/[slug]/page.tsx` + `getCountryMovies()`.
- Reuse `ThemeHero` + `MovieGrid` + pagination. Landing render cả 2 ("What to Watch?" + "Cinema by Country").

### Landing trending hero slider ✅ (ADR-018)
- `hero-slider.tsx` (Server) + `hero-carousel.tsx` (Client, Embla qua shadcn Carousel). Manual nav, KHÔNG auto-rotate. Chi tiết DESIGN.md → "Hero Slider".

### Numbered Pagination ✅ (ADR-022)
- `components/movie/pagination.tsx` — numbered + ellipsis + jump-to-page. Dùng ở `/discover` (max 500) và `/trending` (max 50). RSC + nuqs, Suspense `key` đổi theo filter/page → skeleton đúng.

### Person Detail + Director Credit ✅
- Types: `PersonDetail`, `PersonMovieCastCredit`, `PersonMovieCredits`, `CrewMember`; `Credits` mở rộng `crew`.
- Endpoints `getPersonDetail`/`getPersonMovieCredits` qua `fetchPersonResource` (24h, tag `person-{id}`).
- Slug `toPersonSlug({name, id})` = `{kebab-name}-{tmdb_id}` (không year). `parseSlug` reuse.
- `person-hero.tsx`, `biography-text.tsx` (line-clamp + Read more), `person-credit-card.tsx` (dùng chung cast + director).
- Movie detail: section **Director(s)** (`crew.job === "Director"`) trên section Cast.
- Hidden: Known For chỉ render khi filmography ≥ 15 phim (`KNOWN_FOR_MIN_FILMOGRAPHY`).

### Search Autocomplete ✅ (ADR-015)
- `app/api/search/movies/route.ts` proxy `searchMovies()`. `search-bar.tsx`: debounce 500ms, `AbortController`, dropdown states, keyboard nav, click-outside, URL sync (`urlQ !== prevUrlQ`).
- `posterUrl` thêm size `w92|w154|w185` cho thumbnail.

### Auth / Login ✅ (ADR-020, ADR-021)
- `next-auth@5 (beta)` + `@auth/drizzle-adapter`, database session, Google only.
- `db/client.ts` (Neon HTTP) + `db/schema.ts` (4 bảng Auth.js + `watchlist`). `db:push`.
- `auth.ts`, `auth-actions.ts`, Header async `auth()`, `user-menu`/`user-dropdown`/`mobile-nav`.
- Env: `AUTH_SECRET`/`AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`/`DATABASE_URL` (set y hệt Vercel). Redirect URI local + production.

### Rebrand Moodflix → Xanemi ✅ (ADR-019)
- `logo.tsx` wordmark "Xanemi" + play tittle. Manifest `name: "Xanemi"`. Tagline "The cinema, in your room". Docs titles.
- Còn lại: OG image, favicon final, metadata `<title>` toàn site (gắn SEO Week 2).

### PWA installable ✅ (ADR-026)
- `app/manifest.ts` (standalone, theme/bg #0A0A0B, icons 192/512) + `components/layout/register-sw.tsx`.

---

## Week 4+: Post-MVP ⬜

- [ ] Gỡ mood orphan code (xem Tech Debt Log) — slice "deprecate mood"
- [ ] SEO foundation đầy đủ (Week 2 còn lại)
- [ ] Watched + rating + `/watched`
- [ ] Loading skeletons polish
- [ ] TV series support
- [ ] Comment system / curated collections
- [ ] LLM-powered free-form discovery (kế thừa ý tưởng mood theo cách mới)
- [ ] Filter Tier 2 + `/browse`

---

## Decision Log
Decision quan trọng giữa slices → ghi ADR vào docs/ARCHITECTURE.md.

## Bug & Tech Debt Log

### Mood orphan code — chờ gỡ (ADR-024)
Mood đã bỏ khỏi hướng sản phẩm nhưng code còn trong repo, **không UI nào link tới** (route chỉ vào được bằng URL trực tiếp). Slice "deprecate mood" sẽ xoá (refactor, commit tách riêng):
- `src/app/discover/[mood]/` (route + loading)
- `src/lib/moods/` (`definitions.ts`, `engine.ts`, `types.ts`)
- `src/components/mood/` (`mood-chip.tsx`, `mood-picker.tsx`)
- `src/components/movie/mood-movie-hero.tsx`
- `src/components/layout/hero-banner.tsx`
- `buildQueryWithFilters(mood,...)` trong `src/lib/filters/query-builder.ts` (+ import `MoodDefinition`)
- Kiểm tra accent token mood (nếu còn) trong `globals.css` — hiện không thấy.

> Lưu ý khi gỡ: `lib/filters/query-builder.ts` còn `buildDiscoverQuery` + `filtersToUrlParams` đang dùng — chỉ xoá nhánh `buildQueryWithFilters` + import mood, đừng xoá cả file.

## Notes
- Deploy `xanemi.vercel.app`. MVP = movie only, no TV.
- Header nav: Browse + Trending (+ user menu). Search bar luôn hiện.
- TMDB attribution BẮT BUỘC ở footer (terms requirement).
- Breadcrumb: hybrid (back button + breadcrumb tĩnh theo URL), KHÔNG ở landing.
</content>
