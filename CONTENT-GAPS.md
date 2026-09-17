# Rua Restaurant — Content & Link Gap Audit

Audited 17 September 2026 against the full codebase (`src/`, `public/`, `scripts/`, `tests/`, `RESEARCH.md`, `README.md`).
Principle followed by the codebase: do not fabricate unverified facts (see `RESEARCH.md:23`, `src/app/credits/page.tsx:30-31`). Everything below is an explicit ask for the owner, not a suggestion to invent data.

Legend: 🔴 needed for an official launch · 🟡 should fix soon · 🔵 nice-to-have

## 1. Placeholder links (`href="#"`)

| # | Location | Current | Should be |
|---|----------|---------|-----------|
| 1.1 🟡 | `src/components/experience.tsx:96` — header brand `rua YELAHANKA` | `<a href="#">` | `/` (or `#main`). `#` pollutes history and jumps without smooth scroll |
| 1.2 🟡 | `src/app/page.tsx:51` — footer brand | `<a href="#">` | Same as above |
| 1.3 🟡 | `src/app/page.tsx:51` — `BACK TO TOP` | `<a href="#">` | `#main` / scroll-to-top button. Currently just sets `#` in the URL |

No other `href=""`, `TODO`, `FIXME`, `lorem`, or `example.com` placeholders were found in `src/`.

## 2. Contact & location data — all missing 🔴

Source of truth today is only `src/lib/restaurant.ts:2-13` + `RESEARCH.md` (EazyDiner listing, accessed 17 Sep 2026).

- [ ] **Street address** — site shows only "Yelahanka, Bengaluru, Karnataka, India" (`src/app/page.tsx:48`). No door number, street, landmark, PIN. Needed for footer, visit card, and SEO schema.
- [ ] **Phone** — zero `tel:` links anywhere in `src/`. Needed for visit card + mobile action bar + footer.
- [ ] **Email / contact form** — zero `mailto:` links, no enquiry form.
- [ ] **Hours detail** — only generic `11:00 AM – 11:00 PM` (`src/lib/restaurant.ts:6`, rendered at `src/app/page.tsx:48`). No lunch/dinner split, no holiday hours, no "confirm when booking" source beyond the disclaimer.
- [ ] **Map** — no embedded map; only an external directions link with raw coordinates `13.1751274,77.5480449` (`src/lib/restaurant.ts:10-12`). Confirm the pin is the restaurant entrance, not the area centre.
- [ ] **Owner / chef / story facts** — intentionally absent (`RESEARCH.md:23`). The "Rua feeling" copy is editorial, not a verified history. Owner needs to approve or supply a real story.

## 3. Menu, pricing, reservations 🔴

- [ ] **Real menu items + prices** — the 3 flavour cards are explicitly "cuisine inspiration, not an unverified priced restaurant menu" (`src/lib/restaurant.ts:15`, `src/app/page.tsx:41`, `src/app/credits/page.tsx:30`). No dish names, prices, veg/jain options, or spice levels from the owner.
- [ ] **Spend for two** — research found ~₹1,200 but deliberately hid it as volatile (`RESEARCH.md:12`). Owner to confirm whether to show it.
- [ ] **Reservation flow is fully external** — all CTAs (`Find your table`, `Plan your visit`, `Find a table`, mobile bar) hand off to Zomato (`src/lib/restaurant.ts:7-8`, used in `src/components/experience.tsx:20,170-172`, `src/app/page.tsx:25,48`):
  - `.../rua-yelahanka-bangalore/book`
  - `.../rua-yelahanka-bangalore/menu`
  - Listing page itself `.../rua-yelahanka-bangalore` is not linked anywhere (only menu/book are).
  - Live check 17 Sep 2026 via curl: all three Zomato URLs return **403 to bots** (bot protection), EazyDiner listing returns **200**. They may work in a real browser, but the owner must click each CTA in Chrome/Safari and confirm it lands on the right venue (not a generic/search page). Direct fetch during research also 403'd (`RESEARCH.md:13`).
- [ ] **Reviews / ratings / awards** — intentionally not invented (`src/app/credits/page.tsx:31`). Supply if the owner wants social proof.

## 4. Social & trust links — all missing 🟡

- [ ] Instagram / Facebook / X / YouTube — no handles, no footer social icons (grep for `instagram|facebook|twitter|youtube` in `src/` returns nothing except the Twitter-card meta tag).
- [ ] Footer nav is only 3 links (`src/app/page.tsx:51`): Our story, The menu ↗, Find us. Missing: Moments, Sources & credits (exists only in the bottom bar), Privacy, Terms, Accessibility.
- [ ] No private-events / catering / bulk-booking info or contact path.

## 5. Photography — all illustrative, none venue-verified 🔴

All 7 local assets exist in `public/images/` and all references resolve — **no broken images**. But none depicts the verified premises (disclosed at `/credits`, `src/app/credits/page.tsx:27-31`):

| File | Current source | Action |
|------|---------------|--------|
| `hero.jpg` + `hero-mobile.jpg` (portrait crop) | Unsplash `photo-1552566626-52f8b828add9` | Replace with owner exterior/interior hero + real mobile crop |
| `table.jpg` | Unsplash `photo-1414235077428-338989a2e8c0` | Replace |
| `evening.jpg` | Unsplash `photo-1517248135467-4c7edcad34c4` | Replace |
| `curry.jpg` | Unsplash `photo-1631452180519-c014fe946bc7` | Replace with real dish |
| `tandoor.jpg` | Unsplash `photo-1599487488170-d11ec9c172f0` | Replace with real dish |
| `indian-table.jpg` | EazyDiner CDN listing image (`RESEARCH.md:37`), "not independently authenticated" (`src/app/credits/page.tsx:39`) | Replace; confirm usage rights for the listing image meanwhile |

OG/social share image reuses illustrative `hero.jpg` (`src/app/layout.tsx:25`). Ship a dedicated 1200×630 owner photo before launch.

## 6. SEO / deploy config gaps 🟡

- [ ] `NEXT_PUBLIC_SITE_URL` is **not set** — only `.env.example` exists; `src/app/layout.tsx:17` falls back to `http://localhost:3000` (or Vercel URL). Absolute OG URLs will be wrong in production until this is set to the real origin.
- [ ] No `public/robots.txt`, no `public/sitemap.xml`, no web manifest. No canonical-URL override beyond `metadataBase`.
- [ ] No `Restaurant` JSON-LD (`schema.org`: name, address, telephone, openingHours, servesCuisine, priceRange, geo `13.1751274,77.5480449`). Depends on §2 data.
- [ ] Twitter metadata is only `card: summary_large_image` (`src/app/layout.tsx:27`) — no title/description/image override.
- [ ] Credits-page Unsplash attributions are plain `<a>` without `target="_blank" rel="noreferrer"` (unlike Zomato links) — minor inconsistency (`src/app/credits/page.tsx:34-38`).
- [ ] `scripts/performance.mjs:26` defaults to `http://127.0.0.1:3000` while Playwright uses `:3100` — only matters if you run the perf script without `PERF_URL` (documented in README, low priority).
- [ ] Safari/WebKit validation still open per `README.md:77` (missing system libs on this VM). Chromium covers CI; native iOS check remains a pre-launch follow-up.

## 7. What is NOT missing (verified OK)

- All `gallery` (`src/lib/gallery.ts`) and `flavours` (`src/lib/restaurant.ts:16-41`) image paths resolve to files in `public/images/`. Playwright `experience.spec.ts` asserts every `main img` loads with `naturalWidth > 0`.
- External destinations all resolve to real URLs (Zomato menu/book, EazyDiner listing, Google Maps directions). Only the Zomato 403-to-bots caveat above applies.
- `/credits` disclosure page, custom 404 (`src/app/not-found.tsx`), SVG icon (`src/app/icon.svg`), skip-link, focus management, and WCAG Axe checks in tests are all present.
- Dev server runs at `http://localhost:3000` (verified 200).

## 8. Suggested owner ask-list (copy/paste)

1. Full street address + PIN + landmark + confirmed Google Maps pin.
2. Phone number + email (and whether to display them).
3. Confirmed hours (incl. holidays) + whether ₹1,200-for-two may be shown.
4. Real menu (items, prices, veg/non-veg/jain marks) or confirmation to keep linking out to Zomato.
5. Click-test the Zomato book/menu links in a browser; confirm correct venue.
6. Social handles + 6–10 owner photos (hero, interior, 3–4 dishes, table spread) with usage rights.
7. Production domain for `NEXT_PUBLIC_SITE_URL` + privacy/terms preference.
