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

### Slice 1.6: MoodPicker UI ⬜
- [ ] `components/mood/mood-chip.tsx` (emoji + label + accent)
- [ ] `components/mood/mood-picker.tsx` (grid 10 chips)
- [ ] Place trên landing (above trending)
- [ ] Click chip → navigate /discover/[mood]
**Acceptance**: Landing có mood grid, click → URL change đúng mood

### Slice 1.7: Discover Page ⬜
- [ ] Route app/discover/[mood]/page.tsx
- [ ] Breadcrumb tĩnh: Home > [Mood Label]
- [ ] Hero: mood emoji + label + description + accent
- [ ] MovieGrid render mood results
- [ ] "Show more" pagination
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

- [ ] Slice 3.1: Neon DB + Drizzle setup
- [ ] Slice 3.2: Drizzle schema (User, Watchlist, Watched, MoodLog)
- [ ] Slice 3.3: Auth.js v5 + Google OAuth
- [ ] Slice 3.4: Protected routes middleware + login modal
- [ ] Slice 3.5: Watchlist API + button trên detail
- [ ] Slice 3.6: /watchlist page + empty state
- [ ] Slice 3.7: Watched + rating + /watched page
- [ ] Slice 3.8: Movie card bookmark indicator + optimistic updates
- [ ] Slice 3.9: Mood log tracking (anonymous + auth)

---

## Week 4+: Post-MVP ⬜

- [ ] Search page (TMDB search API)
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
