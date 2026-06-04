# Xanemi — Claude Code Instructions

> Bạn đang work trên **Xanemi** (tên cũ "Moodflix"), một movie discovery platform giúp user tìm phim qua **nhiều lane khám phá** (trending + theme/genre + country + filter + search). Painpoint giải quyết: "không biết xem gì". **Hướng mood-first ban đầu đã bỏ — xem ADR-024.** Project cá nhân, mục tiêu học SEO + Next.js + full-stack pattern. Deploy free trên Vercel.

## Cách Làm Việc (QUAN TRỌNG NHẤT)

Project này build theo **feature-by-feature (vertical slices)**, KHÔNG generate hết một lần.

- Mỗi lần CHỈ làm 1 slice được user define rõ scope.
- KHÔNG tự ý mở rộng ra ngoài scope của slice hiện tại.
- KHÔNG tạo file không liên quan đến slice.
- Trước khi code: confirm hiểu đúng scope. Nếu mơ hồ → HỎI, không assume.
- Xong slice → dừng, để user review + test + commit. KHÔNG nhảy sang slice tiếp theo.

## Stack (KHÔNG đổi nếu không được yêu cầu)

- **Framework**: Next.js 15 App Router
- **Language**: TypeScript (strict mode, no `any`)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Data source**: TMDB API ONLY (no other movie source, NO pirate sites)
- **Video**: YouTube trailer via `lite-youtube-embed` (NEVER raw iframe, NEVER pirate embed)
- **URL state**: nuqs
- **Client state**: Zustand (chỉ khi thật cần)
- **Database**: Neon Postgres + Drizzle ORM (Week 3+)
- **Auth**: Auth.js v5 + Google OAuth (Week 3+)
- **Deploy**: Vercel Hobby
- **Package manager**: pnpm

## Hard Rules — NEVER VIOLATE

1. **TMDB_API_KEY chỉ ở server side**. Không bao giờ ship xuống client.
2. **MỌI TMDB call qua `lib/tmdb/client.ts`**. Không gọi trực tiếp ở component.
3. **Next.js fetch cache only** (`next: { revalidate, tags }`). KHÔNG manual cache (no Redis, no in-memory).
4. **Server Component default**. Add `'use client'` CHỈ KHI cần: event handlers, React hooks, browser API.
5. **Image domain**: `image.tmdb.org` (config trong `next.config.ts`).
6. **Slug format**: `{kebab-title}-{year}-{tmdb_id}` — VD: `inception-2010-27205`. Reason: imdb_id is absent from TMDB list endpoints; tmdb_id is stable and present everywhere.
7. **No `any`, no `@ts-ignore`**.
8. **No pirate video**. Video = YouTube trailer + TMDB watch providers only.
9. **MVP = movie only**. KHÔNG build TV series (defer V2).
10. **TMDB attribution BẮT BUỘC**: Footer phải có text "This product uses the TMDB API but is not endorsed or certified by TMDB" + logo TMDB. Đây là yêu cầu bắt buộc của TMDB terms — không được bỏ.
11. **Mapping helpers**: Before inlining TMDB field formatting in a component (image URLs, vote_average, release_date, runtime, etc.), check `lib/tmdb/utils.ts` for a helper. None exists → add it there first. Do NOT inline in JSX.
12. **Movie links**: Every `/movie/...` link goes through `toSlug(movie)`. Never hardcode `/movie/${id}`.
13. **TMDB types**: Before adding a TMDB type, check `lib/tmdb/types.ts`. If it shares fields with an existing type, compose via `extends`/`&` from `MovieBase` (or the right base) — do NOT copy fields.
14. **Fetch helpers**: All TMDB calls go through `lib/tmdb/client.ts` (no direct `fetch()`). New per-movie resource → use `fetchMovieResource()`. New list query → use `tmdbList()`. Cache values live in those helpers only (per-movie: revalidate 86400, tag `movie-${id}`; list: revalidate 3600) — do not re-declare per endpoint.

## Naming Conventions

- **Files**: kebab-case → `movie-card.tsx`, `mood-picker.tsx`
- **Components**: PascalCase → `MovieCard`, `MoodPicker`
- **Functions/vars**: camelCase
- **Types/interfaces**: PascalCase, KHÔNG prefix `I`
- **Constants**: SCREAMING_SNAKE_CASE

## Folder Structure

```
app/
  (marketing)/page.tsx       # Landing - trending hero slider + trending grid + themes + countries
  discover/page.tsx          # Browse/filter + search (?q=)
  theme/[slug]/page.tsx      # Theme lane (genre-first)
  country/[slug]/page.tsx    # Country lane (cinema-by-origin)
  movie/[slug]/page.tsx      # Movie detail
  person/[slug]/page.tsx     # Person detail (bio + filmography)
  trending/page.tsx          # Hot now
  login/page.tsx             # Auth
  (user)/                    # Protected (auth-gated)
    watchlist/
  api/                       # Route handlers (auth, search proxy)
  manifest.ts                # PWA
  sitemap.ts / robots.ts     # Week 2 (chưa làm)
  layout.tsx
  globals.css
  discover/[mood]/           # ⚠️ ORPHAN — mood đã bỏ (ADR-024), chờ gỡ
components/
  ui/                        # shadcn primitives — regenerate via CLI, không sửa tay
  movie/                     # MovieCard, MovieGrid, MovieHero, ThemeCard, CountryCard, HeroSlider, Pagination...
  person/                    # PersonHero, PersonCreditCard, BiographyText
  filter/                    # Filter panel/controls/chips
  player/                    # TrailerEmbed (lite-youtube)
  layout/                    # Header, Footer, Logo, nav, SearchBar, register-sw...
  mood/                      # ⚠️ ORPHAN — chờ gỡ (ADR-024)
  seo/                       # JSON-LD (Week 2)
lib/
  tmdb/                      # client, types, endpoints, utils
  themes/ countries/         # discovery lane definitions
  filters/                   # types, parsers, query-builder
  watchlist/                 # actions, queries, types
  db/                        # Drizzle schema + client
  moods/                     # ⚠️ ORPHAN — chờ gỡ (ADR-024)
  utils.ts                   # cn(), formatters
```

## Design Rules

**Style**: Premium minimal (Mubi/A24 vibe). Dark-only. Content (poster) là ngôi sao.
**Reference sites**: Letterboxd + Mubi.

Chi tiết đầy đủ (color tokens, typography, spacing, component patterns, anti-patterns) ở **`docs/DESIGN.md`** — ĐỌC file này trước khi build bất kỳ UI nào.

## UI Rules (post-refactor)
- Trước khi viết JSX: check components/ui/ có primitive phù hợp chưa (Button, Badge, Skeleton, Select...). Có thì dùng, KHÔNG viết raw <button>/<input>/<select>.
- Trước khi viết layout: check components/layout/ (Container, PageShell, SectionHeading, PageHeader) và docs/DESIGN.md. Có pattern thì dùng, KHÔNG tự chế lại class wrapper.
- Nav link = <Link> (+ buttonVariants() nếu cần trông như nút). KHÔNG biến nav link thành <Button> hay Tabs.
- Interactive element có action = Button. Label tĩnh = Badge. Đừng nhầm.
- nuqs là source of truth cho filter/search/pagination. Đổi UI control không được đổi logic ghi URL.

### Tóm tắt nhanh
- **Dark-only** MVP. Background near-black `#0A0A0B`, surface `#141416`
- **Typography**: Space Grotesk (heading) + Inter (body) qua next/font
- **Accent**: neutral (shadcn default). KHÔNG accent màu trang trí — chỉ near-black + neutral + semantic (mood accent đã bỏ, xem ADR-024)
- **Spacing**: generous, breathing room
- **Effects**: tiết chế. Hover = 1 effect (KHÔNG stack scale+shadow+glow)
- **Logo**: text wordmark CSS thuần "Xanemi" (Space Grotesk semibold, chấm chữ "i" cuối = nút play)

### Anti-patterns (tránh "AI-generated look")
- KHÔNG glassmorphism / backdrop-blur
- KHÔNG gradient màu mè (1 subtle dark gradient cho hero overlay OK)
- KHÔNG hover stack effect — pick 1
- KHÔNG rounded-full mọi thứ (chỉ avatar)
- KHÔNG emoji trong UI
- KHÔNG copy "stunning/revolutionary/seamless/elevate"
- KHÔNG neon glow, box-shadow màu

## Coding Style

- **Comments**: tiếng Anh, ngắn, chỉ giải thích WHY (không WHAT)
- **Error handling**: try/catch ở server, fallback UI ở client
- **No premature optimization**: work trước, optimize sau khi đo
- **Composition over inheritance**: small components ghép lại

## When In Doubt

- Đọc `docs/ARCHITECTURE.md` cho deep context + ADRs
- Đọc `docs/DISCOVERY.md` khi work với discovery lane (theme/country/trending) hoặc filter/search
- Đọc `docs/DESIGN.md` khi build UI (color, typography, spacing, patterns)
- Đọc `docs/ROADMAP.md` để biết slice hiện tại
- HỎI user nếu requirement không rõ

## What NOT To Do

- ❌ Generate nhiều slice cùng lúc
- ❌ Suggest Redux khi RSC + URL state đủ
- ❌ Suggest tRPC khi Route Handlers đủ
- ❌ Add testing framework ở MVP (Week 1-3 không test)
- ❌ Refactor file không liên quan mà không hỏi
- ❌ Add dependency không justify
- ❌ Build TV series features (movie only cho MVP)
