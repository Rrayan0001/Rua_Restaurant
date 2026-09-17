# RUA — Restaurant Landing Page · Build Brief

> **Deliverable:** one self-contained `index.html` (CSS in `<style>`, JS in `<script>`).
> **Theme:** light, premium fine-dining. **Animation:** rich but intentional.
> This brief contains everything needed to build the page in a single pass — copy, palette, type, layout, animation spec, responsive rules, and acceptance criteria.

---

## 1. Objective

Build a landing page for **RUA**, a small fire-led fine-dining restaurant ("Ruawebsite" project name). Visitor goals in order:

1. Feel the premium atmosphere within 3 seconds (typography + motion carry it).
2. See signature dishes and the tasting menu with prices.
3. Book a table (reservation form) or find hours / address.

Tone of voice: quiet confidence, warm precision. Short sentences. No hype words ("delicious", "amazing", "best"). No emojis anywhere.

---

## 2. Hard constraints

- **Single file:** `index.html` only. All CSS in one `<style>` in `<head>`, all JS in one `<script>` at end of `<body>`.
- **Offline-safe:** no external images, no stock URLs, no hotlinked photos. All visuals are typography + CSS + inline SVG icons. Only external requests allowed: Google Fonts (with system-font fallback if offline).
- **Light theme only.** No dark-mode toggle.
- **Responsive:** must look deliberate at 1440px, 768px, and 390px. No horizontal scroll at any width. Long display words must not overflow small screens.
- **Accessible:** semantic landmarks (`header`, `main`, `section`, `footer`), one `h1`, logical heading order, visible `:focus-visible` states, `prefers-reduced-motion` support, form `<label>`s, color contrast per palette below.
- **No template tells:** no floating blurred navbar, no identical icon-card grid, no gradient text (`background-clip: text` is banned), no `border-left` stripe accents, no eyebrow label above every section, no `01 / 02 / 03` section numbering, no `border + wide soft shadow` combo on one element, no card radius above 16px.

---

## 3. Brand & art direction

**Mood sentence:** "Negroni hour on a Roman terrace — bitter campari red, late golden light spilling across white linen."

**Color strategy:** Restrained-with-commitment. Pure-white architectural surface so the campari red and burnt gold do all the emotional work. One drenched oxblood band (chef quote section) for depth and rhythm.

### 3.1 Palette (OKLCH — use exactly these variables)

```css
:root {
  --bg: oklch(1.0 0 0);               /* pure white page */
  --surface: oklch(0.975 0.008 20);   /* panel / alt section */
  --line: oklch(0.9 0.012 20);        /* hairline rules */
  --ink: oklch(0.24 0.025 20);        /* body text — near-black with red warmth */
  --muted: oklch(0.5 0.03 20);        /* secondary text */
  --primary: oklch(0.55 0.18 20);     /* campari red — CTAs, key accents */
  --primary-deep: oklch(0.38 0.13 15);/* oxblood — drenched quote band, footer text */
  --accent: oklch(0.7 0.14 80);       /* burnt gold — prices, rules, badges */
  --white: oklch(1.0 0 0);
}
```

Rules: body text uses `--ink` on `--bg` (≥7:1). Muted only for secondary text (≥3.5:1). White text on `--primary` fills and on `--primary-deep` fills. Dark `--ink` text on `--accent` fills. Primary chroma stays ≤ 0.23.

### 3.2 Typography (Google Fonts CDN)

- **Display:** `Marcellus` (400 only) — Roman-inscriptional, quiet luxury. H1, H2, dish names, big quote. `letter-spacing: -0.02em`, `text-wrap: balance`, hero via `clamp(3rem, 8vw, 6rem)` (max 96px).
- **Body/UI:** `Jost` (300, 400, 500) — geometric, light, precise. Body 16–18px, `line-height: 1.7`, max measure 65ch. Nav, buttons, labels, form.
- **Accent script (sparingly):** `Italianno` (400) — one handwritten word per section max (e.g. "tonight", "from the fire"). Never body copy.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500&family=Italianno&display=swap" rel="stylesheet">
```

Fallback stacks: `Marcellus, "Times New Roman", serif` · `Jost, "Avenir Next", "Segoe UI", sans-serif`.

### 3.3 Signature devices (what makes it memorable)

1. **Curtain-lift preloader** with counting percent and monogram, then a masked line-by-line hero reveal.
2. **Rotating circular badge** ("WOOD FIRE · SEASONAL · RUA ·") beside the hero, pure CSS rotation.
3. **One drenched oxblood band** (chef quote) interrupting the white page — the single bold color moment.
4. **Tasting-menu tabs** with sliding indicator and crossfading panels.

---

## 4. Copy deck (use verbatim — premium text)

- **Brand:** RUA · sub-line "Cucina del Fuoco" (use under logo in footer/hero meta only).
- **Nav:** Story · Signatures · Menu · Visit + CTA button "Reserve".
- **Hero script word:** "dal fuoco" (small Italianno, gold, above H1).
- **H1 (three masked lines):** `Fire-led cooking,` / `served quietly.` / (third line optional seasonal: `Autumn menu now.`)
- **Hero sub:** "Seven courses from a single oak fire. Twelve seats, one seating rhythm, no noise — just season and smoke."
- **Hero CTAs:** primary "Reserve a table" (→ `#reserve`), ghost "View the menu" (→ `#menu`).
- **Hero meta row:** "Tue – Sun · 18:00 – 23:00" · "Via delle Braci 12, Roma" · "★ 4.9 — 800+ guests".
- **Marquee (repeat):** "Wood fire — Seasonal tasting — Twelve seats — Natural wines — " (separated by ✳ asterisk glyph, not emoji).
- **Story heading:** "A small room around a single fire." / Body: "RUA began with a wood oven and a stubborn idea: that a menu should read like a walk through the market that morning. We cook over oak, plate on linen-white ceramic, and change the menu when the season tells us to. Nothing performs. Everything is meant." / Stats: "12 — seats nightly", "07 — courses", "01 — oak fire".
- **Signatures heading:** "Signatures" + script "tonight" / sub: "Three plates that never leave the menu — everything else follows the market."
  - Dish A: "Cacio e brace" — "Hand-torn tonnarelli, smoked pecorino, cracked pepper, oak-fire butter." — €24.
  - Dish B: "Orata sul fuoco" — "Sea bream over embers, charred lemon, wild fennel, cold-pressed olive oil." — €32.
  - Dish C: "Fico e fumo" — "Roasted figs, smoked honey, bay-leaf gelato, almond crumble." — €14.
- **Menu heading:** "The tasting menu" + script "sette portate" / sub: "Seven courses, one fire. Wine pairing optional."
  - Tabs:.handler Dinner (7 courses — €85 / +€45 pairing) · Lunch (4 courses — €48) · Dessert (3 acts — €22).
  - Dinner items: Sourdough & smoked butter — 8 · Charred leeks, hazelnut — 14 · Tonnarelli, cacio e brace — 24 · Sea bream, fennel — 32 · Oak-aged ribeye, bone marrow — 46 · Figs, smoked honey — 14 · Bay-leaf gelato — 9.
  - Lunch items: Pick any four dinner plates — 48 (list 4 abbreviated rows).
  - Dessert items: Fico e fumo — 14 · Bay-leaf gelato — 9 · Bitter chocolate, campari caramel — 12.
  - Note under menu: "Menus change with the market. Tell us about allergies — the fire adapts."
- **Quote band:** "“We don't decorate plates. We remove until only the season is left.”" — Elena Ruaro, chef & founder.
- **Visit heading:** "Find us, book us." / Address: Via delle Braci 12, 00153 Roma / Hours: Tue–Sun 18:00–23:00, closed Mondays / Contact: ciao@rua-roma.it · +39 06 000 0000.
- **Form:** name, email, date, time select (18:00/19:30/21:00), guests select (1–6; note "7+ call us"), button "Request table". Success message: "Grazie — request received. We confirm within two hours."
- **Footer:** giant wordmark "RUA", columns (Visit / Hours / Follow: Instagram, TikTok), bottom line "© 2026 RUA Roma · Privacy · Cookies", "Back to top ↑".

---

## 5. Section build order (IDs for nav)

1. **Preloader** `#loader` — fixed overlay, brand `R.` monogram + `%` counter, lifts as curtain on `window load` (max 1.6s fallback).
2. **Header** — fixed, transparent → white with hairline border after 24px scroll. Left: `RUA` wordmark (Marcellus, letterspaced). Center links (desktop). Right: Reserve button. Mobile: hamburger → full-screen drawer.
3. **Hero** `#top` — full viewport (`min-height: 100svh`), asymmetric: left-aligned display type occupying ~7 cols, right side rotating badge + reservation card mini-panel (date/guests quick-pick linking to form). Background: white with one large soft radial gold glow + one thin arch outline (CSS) framing the right side. Scroll cue at bottom ("scroll" + animated line).
4. **Marquee strip** — campari-red band, white Marcellus text scrolling infinitely (CSS keyframes, duplicated content, `aria-hidden` on copy).
5. **Story** `#story` — two columns (text + stats panel on `--surface` with gold numerals). Hairline top rule. Reveal on scroll.
6. **Signatures** `#signatures` — three editorial rows (not identical cards): each row = name (Marcellus 2rem) + description + dotted leader + price (gold). Hover: name slides 6px, price turns red. Dividers are hairlines. Stagger reveal.
7. **Menu** `#menu` — tabs (Dinner/Lunch/Dessert) with sliding pill indicator; panels crossfade/slide; each item row = name + dotted leader + price. Footnote + pairing callout box.
8. **Quote band** — drenched `--primary-deep` background, white Marcellus quote, gold attribution. Subtle grain via repeating radial? Keep flat + one large decorative quotation glyph. Parallax-free (transform on scroll is enough).
9. **Visit + Reserve** `#visit` / `#reserve` — split: left info (address/hours/contact stacked with SVG icons), right form card (surface bg, 12px radius, single 8px shadow OR border — never both). Floating labels or top labels; focus ring gold.
10. **Footer** — white, giant outlined "RUA" wordmark (text-stroke ink at low opacity), columns, bottom bar. Back-to-top button.

---

## 6. Animation spec (the "great animation" — implement all)

Easing token: `--ease: cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Durations: micro 200ms, reveal 900ms, hero 1100ms, curtain 800ms.

1. **Preloader:** counter 0→100 over ~1s; then overlay `translateY(-100%)` with `var(--ease)` 800ms; hero timeline starts on curtain start. Failsafe: force-hide after 2.5s regardless.
2. **Hero entrance (choreographed, runs once):** masked lines — each `.line > span` from `translateY(110%)` → 0, 1100ms expo, stagger 120ms; sub + CTAs fade-rise (24px, 800ms, delay 400ms); badge scales in with 600ms; meta row fades last. Implement with CSS classes added by JS on load (`body.loaded`), transitions only — content visible by default if JS fails.
3. **Rotating badge:** circular SVG text on 140px circle, `animation: spin 18s linear infinite`.
4. **Marquee:** `translateX(0 → -50%)`, 22s linear infinite; pause on hover.
5. **Scroll reveals:** `IntersectionObserver` adds `.in` to `[data-reveal]`; default state is fully visible — the pre-`.in` hidden state is applied via JS only (`js-reveal` class on `<html>`), so no-JS/no-observer still shows content. Hidden state: `opacity 0, translateY(28px), blur(6px)` → visible 900ms expo. Stagger children via inline `--d` custom property delays.
6. **Header behavior:** add `.scrolled` past 24px (bg + border). Hide on scroll down beyond 400px, show on scroll up (transform, 300ms).
7. **Menu tabs:** indicator slides via `transform: translateX` measured from active button; panels: outgoing `opacity 0, translateY(12px)` 200ms, incoming reversed. Update `aria-selected`, keyboard arrows optional but nice.
8. **Buttons:** primary red pill (radius 999px allowed for buttons), hover darkens to oxblood + `translateY(-2px)` + shadow ≤8px blur; ghost button hairline border, hover fills ink with white text. Magnetic effect on hero CTA only (±6px toward cursor, desktop pointer only).
9. **Dish/menu rows:** hover translate + color shift (200ms); price underline draws (scaleX) on hover.
10. **Form:** on submit `preventDefault`, validate natively (`required`), then morph button to "Sending…" → success panel swap with check SVG draw animation.
11. **Back-to-top + smooth scroll:** `scroll-behavior: smooth` (respect reduced motion), back-to-top appears after 600px.
12. **Reduced motion:** `@media (prefers-reduced-motion: reduce)` — kill marquee/spin/magnetic/parallax; reveals become instant opacity crossfade ≤200ms; preloader hides immediately.

---

## 7. Components & states

- **Buttons:** `.btn-primary` (red fill, white text), `.btn-ghost` (1px ink border). Focus-visible: 2px gold outline offset 3px. Disabled: 50% opacity.
- **Nav drawer (mobile ≤860px):** full-screen white overlay, big Marcellus links stagger in, close on link click / Escape.
- **Tabs:** `role="tablist"`, buttons `role="tab"`, panels `role="tabpanel"`.
- **Form fields:** `<label>` per input, `input[type=date]` min = today (set via JS), selects for time/guests, `required` on all. Error: native bubbles + red border via `:invalid`.
- **Z-index scale:** header 50 · drawer 60 · loader 100 · success toast (if any) 70. No 9999.

---

## 8. Responsive spec

- **≥1024px:** hero two-column (type 7fr / side panel 5fr); story two-column; visit split 5/7; signatures full-width rows.
- **661–1023px:** hero stacks (badge inline, smaller), story stacks, visit stacks with form first? No — info first, form second.
- **≤660px:** single column everywhere; H1 `clamp(2.6rem, 13vw, 4rem)`; nav links hidden behind hamburger; marquee slower (30s); stats panel becomes 3-row list; form fields full width; footer wordmark scales with `vw`.
- Grid technique: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` for stats/info clusters. No breakpoint should cause overlap or horizontal scroll.

---

## 9. Technical skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RUA — Cucina del Fuoco · Roma</title>
  <meta name="description" content="RUA Roma — seven fire-led courses, twelve seats, one oak fire. Reserve a table.">
  <!-- fonts (see §3.2) -->
  <style> /* tokens, reset, header, hero, sections, animations, responsive, reduced-motion */ </style>
</head>
<body>
  <div id="loader">…</div>
  <header id="site-header">…</header>
  <nav id="drawer">…</nav> <!-- mobile -->
  <main id="top">
    <section class="hero">…</section>
    <div class="marquee">…</div>
    <section id="story">…</section>
    <section id="signatures">…</section>
    <section id="menu">…</section>
    <section class="quote">…</section>
    <section id="visit">… + <form id="reserve">…</form></section>
  </main>
  <footer>…</footer>
  <script> /* loader, header, IO reveals, tabs, drawer, form, back-to-top, magnetic */ </script>
</body>
</html>
```

JS must be vanilla, ~150 lines max, no libraries required. All queries guarded (null-checks). Use `defer`-equivalent placement at body end.

---

## 10. Acceptance checklist (verify before calling it done)

- [ ] One file only; opens via double-click with no build step; fonts degrade gracefully offline.
- [ ] Preloader lifts ≤2.5s; hero lines rise with masks; badge rotates; marquee loops seamlessly.
- [ ] Every section reveals on scroll with stagger; returns pass with `prefers-reduced-motion` (no trapped invisible content).
- [ ] Tabs switch panels with indicator slide; drawer opens/closes; form validates and shows success; back-to-top works.
- [ ] 390px wide: no horizontal scroll, no overflowing headline, tappable targets ≥44px.
- [ ] Contrast: body ink-on-white, white-on-red button, white-on-oxblood quote all pass; focus rings visible.
- [ ] No emojis, no lorem ipsum, no external images, no console errors.

---

*Build it with conviction: white linen, campari red, burnt gold — and motion that feels like a curtain rising, not confetti.*
