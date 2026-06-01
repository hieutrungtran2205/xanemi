# Moodflix — Design System

> Style: **Premium minimal** (Mubi/A24 vibe). Dark-only. Content (poster) là ngôi sao, UI lùi về sau. Mood accent dùng tiết chế.

## Design Philosophy

1. **Content first**: poster/backdrop nổi bật, UI chrome tối thiểu.
2. **Breathing room**: spacing rộng rãi, không chật chội.
3. **Typography-led**: chữ làm chủ đạo, không decoration thừa.
4. **Restraint**: ít màu, ít effect. Khi phân vân → bớt đi, không thêm vào.
5. **Mood accent = gia vị**: màu mood chỉ điểm xuyết, không phải món chính.

## Reference Sites
- **Letterboxd**: layout grid, detail page structure, dark balance
- **Mubi**: premium minimal, typography, generous spacing

Khi build component, tham khảo vibe 2 site này.

## Color Tokens

### Base (dùng 90% thời gian)
```
--bg:            #0A0A0B   /* near-black, page background */
--surface:       #141416   /* cards, elevated elements */
--surface-2:     #1C1C1F   /* hover, secondary surface */
--border:        #2A2A2E   /* subtle borders */
--text:          #FAFAFA   /* primary text */
--text-muted:    #A1A1AA   /* secondary text, meta */
--text-subtle:   #71717A   /* tertiary, disabled */
```

### Mood Accents (dùng TIẾT CHẾ — xem rules dưới)
```
cozy          #F59E0B   amber
mind-bending  #06B6D4   cyan
edge-of-seat  #EF4444   red
laugh         #FACC15   yellow
good-cry      #EC4899   pink
escape        #A855F7   purple
date-night    #F43F5E   rose
adrenaline    #F97316   orange
dark-gritty   #991B1B   deep red
curious       #10B981   green
```

### Accent dùng Ở ĐÂU (chỉ 3 chỗ)
1. Mood chip hover/active state
2. Discover page header (1 đường line/subtle glow theo mood)
3. Focus ring (keyboard navigation)

### Accent KHÔNG dùng ở
- Background toàn trang (giữ near-black)
- Body text
- Mọi button khác ngoài mood
- Borders chung

### Semantic
```
--rating-gold:   #FACC15   /* star rating */
--success:       #22C55E
--error:         #EF4444
```

## Typography

### Fonts (next/font/google)
- **Heading**: Space Grotesk
- **Body**: Inter

### Scale
```
--text-xs:    0.75rem   /* 12px - meta, labels */
--text-sm:    0.875rem  /* 14px - secondary */
--text-base:  1rem      /* 16px - body */
--text-lg:    1.125rem  /* 18px - emphasized body */
--text-xl:    1.5rem    /* 24px - section heading */
--text-2xl:   2rem      /* 32px - page heading */
--text-3xl:   3rem      /* 48px - hero / landing H1 */
```

### Rules
- Heading: Space Grotesk, font-weight 600-700, letter-spacing tight (-0.02em)
- Body: Inter, font-weight 400, line-height 1.6
- Movie title trên card: font-weight 600, truncate 1 line
- Meta (year, rating): text-muted, text-sm

## Spacing

Generous. Dùng Tailwind scale, ưu tiên rộng:
```
Section gap:        py-16 / py-20 (mobile py-12)
Card grid gap:      gap-4 / gap-6
Inside card:        p-3 / p-4
Page padding:       px-4 (mobile) / px-8 (desktop) / max-w-7xl mx-auto
Element spacing:    space-y-4 / space-y-6
```

## Border Radius

Mix có chủ đích, KHÔNG rounded-full mọi thứ:
```
Cards/posters:    rounded-lg (8px)
Buttons:          rounded-md (6px)
Chips/tags:       rounded-md (6px)
Inputs:           rounded-md
Avatar:           rounded-full (chỉ avatar)
```

## Shadows & Effects

Tiết chế. KHÔNG stack effects:
```
Card hover:       1 trong { nhẹ scale-[1.02] } HOẶC { shadow-lg } — KHÔNG cả 2
Elevated:         shadow-md (modals, dropdowns)
```

KHÔNG dùng:
- glow / box-shadow màu
- backdrop-blur / glassmorphism
- multiple shadows stack

## Animation

Subtle, fast:
```
Transition:       transition-colors / transition-transform, duration-200
Hover:            ease-out
Page/fade in:     opacity fade, duration-300
```

KHÔNG: bounce, spring, scale lớn, rotate playful.

## Logo

Text wordmark **"Xanemi"** — Space Grotesk, CSS thuần. Dấu chấm chữ "i" cuối được thay bằng **nút play** (gợi điện ảnh).

```
"Xanemi" — Space Grotesk
- font-weight 600 (semibold), 1 weight đều
- letter-spacing: -0.02em
- leading-none           # khóa line-height để play tittle neo ổn định mọi nơi
- mixed case (chữ X hoa)
```

Play tittle (thay chấm chữ i):
- Render chữ cuối bằng **"ı" dotless** (U+0131) rồi đặt SVG tam giác play vào đúng vị trí chấm.
- Tam giác **trọng tâm-giữa** (path `M34 18 L82 50 L34 82 Z`) để `translateX(-50%)` căn giữa quang học trên thân chữ ı.
- Kích thước theo `em` (`h-[0.3em] w-[0.3em]`, `top-[-0.06em]`) → tự scale theo cỡ chữ.
- `currentColor` → tự ăn màu chữ, mono, không thêm màu accent.
- A11y: `aria-label="Xanemi"` trên `<Link>`, `aria-hidden` trên svg (glyph "ı" đọc lệch với screen reader).

**Tại sao KHÔNG biến chữ X thành mark điện ảnh**: đã thử (film-strip X, reel-hub X) nhưng X tự nó đã mơ hồ phát âm (z? ks? eks?); biến nó thành symbol trừu tượng làm mất tính đọc-được. Nguyên tắc: **wordmark phải đọc rõ tên trước**, vibe điện ảnh là yếu tố phụ (nút play) — không hi sinh legibility. Xem ADR-019.

Implementation: `components/layout/logo.tsx`. KHÔNG dùng image/raster logo trong MVP.

## Component Patterns

### MovieCard
```
- Poster: aspect-[2/3], rounded-lg, object-cover
- Bottom meta: title (1 line truncate) + year · ★rating (text-muted, text-sm)
- Hover: scale-[1.02] HOẶC ring nhẹ — pick 1, không cả 2
- Loading: skeleton với surface-2 pulse
```

### MoodChip
```
- Layout: emoji (lớn) + label (text-base, 600) + subtitle (text-sm, muted)
- Idle: bg-surface, border-border
- Hover: bg-surface-2, border chuyển mood accent (subtle)
- Active: border mood accent rõ + accent text
- rounded-md, p-4
```

### Hero Slider (Landing)

> Landing mở đầu bằng **slider banner phim trending** (không còn mood hero — mood
> bị deprecate ở home vì trùng vai & nông hơn theme/country). Component:
> `components/movie/hero-slider.tsx` (Server, fetch data) + `hero-carousel.tsx`
> (Client, Embla). Carousel primitive: `components/ui/carousel.tsx` (shadcn, KHÔNG sửa tay).

```
- Data: top 5 phim trending CÓ backdrop (lọc null). Genre tên map từ genre_ids
  qua getGenreList() (fetch song song, cache 30 ngày). Tất cả từ list endpoint —
  KHÔNG fetch getMovieDetail per-movie (tránh 5 call thừa ở home).
- Carousel: Embla (shadcn Carousel), MANUAL — mũi tên + dots, loop bật.
  KHÔNG auto-rotate (bảo vệ LCP/CLS, tránh layout shift bất ngờ).
- Height: `h-[65vh] min-h-85` (cố định → chống CLS). Skeleton cùng kích thước.
- Backdrop: size `original`, `object-cover object-top`. CHỈ slide đầu `priority`
  (LCP element), slide sau lazy.
- Overlay: 2 gradient — bottom `from-background via-background/30 via-35% to-transparent`
  + left `from-background/80 via-transparent` → text readable mọi backdrop.
- Nội dung mỗi slide (align bottom, trong Container, max-w-2xl):
  · Eyebrow "Trending #N" (text-xs, uppercase, tracking-wide, muted)
  · Title: `<h2>` Space Grotesk 700, `text-3xl → md:text-5xl`
  · Meta 1 hàng: `năm · ★rating (vote_count) · genre1 · genre2 · genre3` (≤3 genre)
  · Overview: `line-clamp-3`, text-sm muted, max-w-xl
  · Button "View details" (size lg) → `/movie/{slug}` (qua toSlug)
- Mũi tên: ẩn mobile (`hidden sm:inline-flex`), căn giữa dọc bằng
  `top-[calc(50%-1rem)] translate-y-0` — KHÔNG dùng `-translate-y-1/2` vì xung đột
  với `active:translate-y-px` của Button (gây nhảy khi bấm).
- Dots: bottom-center, active = `w-6 bg-foreground`, idle = `w-1.5 bg-foreground/40`.
- KHÔNG glassmorphism, KHÔNG backdrop-blur.
```

### MovieHero (detail page)
```
- Backdrop full-width, height ~50vh
- Gradient overlay: from-bg via-bg/60 to-transparent (fade lên trên)
- Content: poster (trái) + title/meta/actions (phải), align bottom
- Mobile: poster trên, info dưới (stack)
```

### Section Heading
```
- text-xl/2xl, Space Grotesk 600
- Optional "see all" link bên phải (text-muted, text-sm)
- mb-6
```

### Breadcrumb + Back Button
```
Breadcrumb (tĩnh, theo URL hierarchy):
- text-sm, text-muted
- Separator: "/" hoặc chevron nhỏ (text-subtle)
- Last item (current page): text-text (không link)
- Discover: Home > [Mood Label]
- Movie detail: Home > [Title]   (bỏ segment "Movies")
- Trending: Home > Trending
- KHÔNG ở landing page
- Subtle, KHÔNG nổi bật hơn content

Back button:
- "← Back", text-muted hover:text-text
- router.back() với fallback về /
- Đặt trên content area, trước hero
- Trên movie detail: back button + breadcrumb cùng hàng (back trái, breadcrumb dưới hoặc cạnh)
```

### Button
```
- Primary: bg-text text-bg (high contrast, white button đen chữ)
- Secondary: bg-surface border-border text-text
- Ghost: text-muted hover:text-text
- rounded-md, px-4 py-2, font-weight 500
```

## Responsive Breakpoints

```
Movie grid:   2 cols (mobile) / 3 (sm) / 4 (md) / 5 (lg)
Mood picker:  2 cols (mobile) / 3 (sm) / 5 (lg)
Detail hero:  stack (mobile) / side-by-side (md+)
Filter:       bottom drawer (mobile) / sidebar (lg)
```

## Anti-Patterns (TRÁNH "AI-generated look")

KHÔNG làm những điều sau:
- ❌ Gradient nhiều hướng / màu mè (1 subtle dark gradient cho hero overlay OK)
- ❌ Glassmorphism, backdrop-blur
- ❌ Hover stack: scale + shadow + glow cùng lúc → pick 1
- ❌ rounded-full mọi thứ (chỉ avatar)
- ❌ Emoji ngoài mood context
- ❌ Copy "stunning/revolutionary/seamless/elevate/unleash"
- ❌ Neon glow, box-shadow màu
- ❌ Quá nhiều accent color trên 1 màn hình
- ❌ Card chật chội, thiếu padding
- ❌ Center mọi thứ (dùng left-align cho text dài)

## Verify Checklist (review output Claude Code)

Mỗi khi Claude generate UI, check:
- [ ] Nền vẫn near-black, không gradient lạ?
- [ ] Spacing đủ rộng (breathing room)?
- [ ] Chỉ 1 hover effect, không stack?
- [ ] Mood accent chỉ ở chip/ring/header?
- [ ] Poster nổi bật, UI lùi sau?
- [ ] Có giống vibe Letterboxd/Mubi không?
- [ ] Typography rõ ràng, Space Grotesk heading + Inter body?
