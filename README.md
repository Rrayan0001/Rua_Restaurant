# Rua — a little escape in Yelahanka

A responsive restaurant portfolio built with Next.js App Router, React, TypeScript, and custom CSS. Forest green, ivory, and warm peach; Cormorant Garamond and DM Sans; editorial layouts and image-led storytelling.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Node.js 20.9+ is required. If Node isn't on this VM's PATH, run `export PATH="$HOME/.local/node/bin:$PATH"` first.

## Production

```bash
npm run lint
npm run build
npm start
```

Deploy as a standard Next.js project (Vercel, or a Node server with `npm start`). Assets are local and optimized by Next.js; Google Fonts are downloaded and self-hosted at build time. No API keys or database are required.

Set `NEXT_PUBLIC_SITE_URL` to the deployed website origin for absolute social-sharing image URLs. On Vercel the preview URL is detected automatically.

## Features

- Responsive cinematic hero and sticky navigation.
- Accessible mobile navigation, keyboard-operable cuisine filters, native-dialog image gallery, Escape-to-close and focus restoration.
- Scroll reveals, hover effects, reduced-motion support, and progressive enhancement for content visibility.
- Real menu and reservation links to Rua's published Zomato listing.
- Google Maps directions using the listed restaurant coordinates.
- SEO metadata, social sharing image, custom SVG icon, and a custom 404 page.

### Mobile & motion upgrade

- Portrait-specific hero image, 15px body copy, 48px primary controls, and safe-area-aware layouts.
- A mobile Menu / Directions / Find a table bar appears after the hero passes beneath the header.
- Native scroll-snap gallery with real touch swipes, pagination, and previous/next controls.
- Gallery dialog code is loaded on demand; expanded photos support directional swipes.
- Line-by-line hero typography, photo reveals, drawn arches, staggered food cards, and animated navigation.
- A slow moving ribbon and rotating emblem pause offscreen. The ribbon's pause button controls both.
- Reduced-motion preferences disable ambient effects and preserve immediate content access.
- Fixed-body overlay scroll locking and focus restoration; background content is inert while navigation is open.
- Scroll progress and section highlighting; subtle scroll-linked photo depth on supported desktop browsers.

Mobile and motion overrides live in `src/app/mobile-motion.css`. No animation library is required.

## Content and images

Edit restaurant information in `src/lib/restaurant.ts`, page copy in `src/app/page.tsx`, and theme tokens in `src/app/globals.css`. Replace images in `public/images/` to update photography.

See `RESEARCH.md` and `/credits` for sources. Interior imagery is illustrative; food cards are cuisine inspiration rather than an asserted menu. Reservations complete externally on Zomato. Verify operational details and replace illustrative images with the owner's photographs for an official launch.

## Browser checks

```bash
npm run test:e2e
```

Playwright checks desktop/mobile rendering, cuisine tabs, gallery keyboard controls and focus restoration, external destinations, and accessibility. It starts a production server on port 3100; build first. Uses the existing VM Chromium binary when available; otherwise run `npx playwright install chromium`.

The expanded suite also covers 320–844px viewports, landscape, native touch gestures, overlay scroll restoration, reduced motion, rapid filter changes, enlarged body text, and accessibility of the mobile menu and action bar. Mobile-only checks are intentionally skipped in the desktop project.

### Reproducible mobile loading sample

With the production server running:

```bash
node scripts/performance.mjs
# Optional: PERF_URL=http://127.0.0.1:3100 node scripts/performance.mjs
```

This runs three cold-browser-cache samples at 390×844, DPR 3, 1.6 Mbps, 150ms latency, and 4× CPU slowdown. It reports median LCP, layout shift, and initial resource transfer. Local lab measurements are not real-user field results or an INP assessment.

Safari/WebKit validation on this VM is blocked by missing system libraries (`libevent`, GStreamer bad plugins, `libflite`, and `libavif`). Chromium tests cover the current verification; native iOS validation remains a deployment follow-up.
