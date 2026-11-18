# Osama Khalifa: Every layer, one engineer

The Next.js 14 (App Router) port of the approved Framer portfolio
(`framer-source/`: `ConsolePortfolio.tsx`, `CaseCard.tsx`, `WritingRow.tsx`, `SocialCard.tsx`).
The design, copy and motion are unchanged. The CSS is the Framer CSS verbatim. Card and post copy comes from the Framer CMS.

```bash
npm install
npm run dev        # http://localhost:3000 (runs the dither script first)
npm run build      # static build (also runs the dither script first)
npm start
```

Set `NEXT_PUBLIC_SITE_URL` (for example `https://osamakhalifa.dev`) in production. Canonical URLs, Open Graph URLs, the sitemap and robots.txt all use it.

## Structure

```text
app/
  layout.tsx                    fonts (next/font/local), global CSS, site metadata, Person JSON-LD
  page.tsx                      home: compiles MDX on the server, hands it to <Portfolio>
  work/[slug]/page.tsx          standalone case study, generateStaticParams + generateMetadata
  work/[slug]/opengraph-image.tsx   per-case next/og image
  opengraph-image.tsx           home next/og image
  sitemap.ts, robots.ts, icon.svg
  fonts/                        the exact woff2 subsets the Framer site served
components/
  Portfolio.tsx                 client shell: nav state, scroll progress, overlay <dialog>, shortcuts
  Topbar · Hero · Ruler · Identity
  StackSection · WorkSection · LogSection · WritingSection · AboutSection · ContactSection · Footer
  CaseCard · WritingRow · CaseView · CaseStandalone · ProductScreen · Architecture · MobileMenu
  SocialCard.tsx                OG artwork (Satori-compatible port of the Framer SocialCard)
  ui/                           Dot, Arrow, Glyph, Strip, Reveal, PixelMark, TypeIn
  mdx/                          components the case-study MDX uses: Section, Decisions/Decision, Metrics, SystemSection
lib/
  radar.ts                      sweep drawing + visibility-gated rAF loop
  dither.mjs                    Bayer ordered dither + false-colour ramp (build time only)
  clock.ts                      Cairo header clock, visitor local time
  keyboard.ts                   shortcut guard + useShortcuts hook
  content.tsx                   reads content/, compiles MDX (next-mdx-remote/rsc)
  site.ts                       email, social links, CV, case links (formerly Framer property controls)
  images.ts, generated/images.json   manifest written by the dither script
  layers.ts, types.ts, og.tsx
content/
  work/*.mdx                    the four case studies (frontmatter = readout, body = sections 02–06)
  writing/*.mdx                 the four posts (frontmatter only for now)
scripts/dither.mjs              sharp pipeline: assets/source → public/generated
assets/source/                  drop original screenshots/portrait here
assets/og/                      TTF used only by next/og (Satori can't read woff2)
styles/                         portfolio.css, case-card.css, writing-row.css (verbatim Framer)
                                base.css (Next glue), spec-additions.css (spec items Framer lacked)
lighthouse/                     mobile reports: simulated (*.report.html) and applied throttling (*-applied)
```

### One MDX source, two surfaces

`lib/content.tsx` compiles each `content/work/<slug>.mdx` once per build (React `cache`).
The compiled body is a React node tree.

- `/` passes all four bodies to `<Portfolio>`. Clicking a card on desktop opens the overlay `<dialog>`, which renders `bodies[slug]`, and pushes `/work/<slug>` with `history.pushState`. Back and Esc close it, and ←/→ switch cases with `replaceState`.
- `/work/[slug]` renders the same body inside `<CaseStandalone>`. Phones (≤767px), direct visits, refreshes and shared links all land here.

Both surfaces render the same `CaseView`, so the markup matches. I checked this in the browser: the overlay and the page produce the same DOM, apart from how inline styles are serialized.

To edit a case, change its MDX. Sections 02, 03 and 06 are Markdown inside `<Section>`. Decisions are `<Decision n title>` with the paragraph followed by a ```` ```text ```` block for the diagram. The MDX has no JavaScript expressions, so it compiles under next-mdx-remote 6's default `blockJS`. `<Metrics />` and `<SystemSection />` read the frontmatter.

## How the radar works

Two layers, in `components/LogSection.tsx` and `lib/radar.ts`:

1. **Static compass (SVG, 600×600 viewBox):** four rings (r 55/110/165/221), crosshairs and diagonals, 72 ticks (every 9th one longer) and eight degree labels. It never repaints.
2. **Moving sweep (canvas, 600×600 backing store over the SVG):** each frame clears the canvas and draws a conic gradient. The gradient is transparent except for a faint green band just behind the sweep angle, which forms the trailing wedge. A 1px line at the angle sits on top.

Timing: one revolution takes **8 s of active time**. `elapsed` only advances while the radar is visible. An IntersectionObserver (threshold 0.1) and `visibilitychange` stop the rAF loop. Each frame's delta is capped at 40 ms, so coming back never jumps ahead, and frames are capped at about 60 fps.
Every 2 s the sweep enters a new quarter (`floor(elapsed / 2000)`) and calls `onQuarter(layer)` for N, E, S, W in turn. That call:

- lights the matching node glyph in its layer colour for 1.5 s;
- prepends the layer's next supplied log line, which alternates between its two messages, stamped with the visitor's local time. Five rows are kept, and CSS hides rows past the third on mobile;
- updates a polite live region, at most once every 30 s.

With `prefers-reduced-motion`, the loop never starts and the radar stays static.

## How the dither works

All dithering happens at build time. `scripts/dither.mjs` runs before `dev` and `build`, and you can run it alone with `npm run dither`. It reads `assets/source/` and writes `public/generated/` plus `lib/generated/images.json`, which the app imports.

**Ordered (Bayer) dither:** each pixel's grey level is compared with a threshold from the 4×4 Bayer matrix `[0 8 2 10 / 12 4 14 6 / 3 11 1 9 / 15 7 13 5] × 16`, indexed by `(x mod 4, y mod 4)`. Pixels above the threshold become light, the rest dark. The result is the regular cross-hatch "silver" texture, with no error diffusion and no noise. The pixel functions are in `lib/dither.mjs`.

| Source | Output | Notes |
|---|---|---|
| `<slug>.png` or `<slug>-01.png`, `-02.png`… | `<slug>[-NN]-silver.webp` (≤1600px, 226/15 levels, lossless) + `<slug>-color.webp` (≤1800px, q85) | Flattened on `#0e0f11` before greyscale |
| `portrait.png/jpg/webp` | `portrait-silver.webp` (400×480 cover, Rec.709 luminance, 220/22 levels, lossless), `portrait-thermal.webp` (blue→amber→red ramp by luminance), `portrait-color.webp` (≤900px) | Same maths the Framer canvas ran in the browser |

The silver files are lossless WebP and rendered with `next/image` `unoptimized`. The Next.js optimizer would otherwise resize and re-encode them, which blurs the 1-bit pattern. The colour files go through the normal optimizer (AVIF/WebP, responsive `sizes`).

At runtime the app only swaps images:

- **Cards and case screens:** the silver preview shows first. The colour image is mounted only on pointer or focus intent, then revealed with a 500ms top-down `clip-path` wipe. With reduced motion it is a 150ms opacity fade.
- **Hero portrait:** the silver image sits under the thermal image. The thermal image's `clip-path` follows the scan frame, so false colour appears only inside the frame. The frame follows the pointer on fine pointers and drifts on touch.

Each case can have several screens. The first one is the home-page card image, and every screen shows in the case study as `SCREEN 01 / 03 · CAPTION`. Set captions and alt text in `lib/site.ts`, keyed by file name.

With no files in `assets/source/`, every surface falls back to the OS pixel monogram and the labelled architecture diagrams, as Framer did.

## Keyboard

`1`–`5` jump to Work, Stack, Log, Writing and Contact. `C` copies the email. `=` opens the menu. `Esc` closes the menu or case. `←`/`→` change case. Shortcuts are ignored in editable fields and when ⌘/Ctrl/Alt is held.

## What changed from Framer, and why

| Framer | Next.js |
|---|---|
| `framer` imports, `addPropertyControls`, `ControlType` | Removed. The controls are now plain config in `lib/site.ts` |
| `useIsStaticRenderer()` | Removed. Effects only run on the client, so SSR output is the static render |
| `initialCase` page control | Real routes: `/` and `/work/[slug]` |
| CMS slot children (`featured`, `work`, `writing`) | Rendered directly from MDX. The list layout is in `styles/base.css` |
| `osk:open-case` CustomEvent between card and shell | An `onOpen` callback prop with the same behaviour |
| Runtime canvas dithering of the portrait | Build-time sharp output (`scripts/dither.mjs`) |
| `@font-face` from framerusercontent.com | `next/font/local` with the same two subsets |
| Embedded `CASES` array + `sync-content.mjs` | `content/work/*.mdx` |
| `framer-motion` | Kept (it's a standalone React library, not a Framer API) for `layoutId`, `AnimatePresence` and `whileInView` |

## Credits

- JetBrains Mono (OFL): https://github.com/JetBrains/JetBrainsMono
- Departure Mono by Helena Zhang (OFL): https://github.com/rektdeckard/departure-mono

The license files are in `licenses/`.

## Spec compliance

The port follows the Framer version wherever the build spec and Framer disagree. Anything the spec asks for that Framer didn't have has been added, in `styles/spec-additions.css` and the components named below.

### Added (missing from Framer)

| Spec | Where |
|---|---|
| §4 Several screens per case with captions (`SCREEN 03 / 07 · BOQ TABLE, 10K ROWS`) | `lib/images.ts`, `lib/site.ts`, `ProductScreen`, `SystemSection` |
| §4 Team size in the summary readout | `team:` frontmatter → `CaseView` (hidden until set) |
| §3 Read time column in Writing | Derived from the post's MDX body (hidden while bodies are empty) |
| §5 Overlay top bar types in on open | `ui/TypeIn.tsx` in `CaseView` (overlay only, off with reduced motion) |
| §5 Hero callout leader re-draws when the scan enters a new area | `Identity.tsx` (3×3 areas, 300ms) |
| §5 Stack card hover: leader draws tag → "+" in 300ms, status dot brightens | `spec-additions.css` |
| §5 Links in body text: underline draws from left | `spec-additions.css` (case-study paragraphs) |
| §1 Repository linked from the site | `site.sourceRepo` → "SITE SOURCE ↗" in Contact (hidden until set) |

### Kept from Framer (conflicts with the spec)

| Spec says | Framer (kept) |
|---|---|
| Tailwind CSS, 12-column grid | Plain CSS with CSS variables and per-section grids |
| Display letter-spacing −0.02em; labels 10–11px; buttons 12px; muted `#6E6E6E`; focus offset 2px | −0.065em; labels 7–10px; buttons 10px; muted `#969692` / `#5E5E59`; offset 4px |
| Primary button hover inverts | Lightens to `#C6C6BC` |
| Hero top-left: name / layers / status stacked | Brand top-left, layers + status in the hero meta row |
| Top-right `// BUILD a1f3c9e` (commit hash) | Clock + coordinates; no build hash |
| Footer `LIGHTHOUSE 98 · BUILD a1f3c9e · ©` | `© year OSAMA KHALIFA / CAIRO, EGYPT ●`. Framer chose not to show a score until a production audit exists |
| Boot: readouts type in, hairlines draw, portrait resolves from noise | Top bar and portrait blur in on steps, hero copy rises 12px (still 1.1s, once per session, skippable) |
| Section reveals: hairline draws, labels type, 60ms per-line stagger | Whole block fades and rises 16px |
| Stack glyphs are dithered and assemble from dots on reveal | Stroked SVG glyph over a dot field, revealed with the card |
| Frontend footer `ROUTES MIGRATED 57 · NEXT.JS 14` | `57 ROUTES MIGRATED · NEXT.JS 14` |
| Featured chip `O(N) QUERIES → 1` | `1 ROUND TRIP` |
| POS label `CASE 04 · 2024` | `CASE 04 · PRODUCT BUILD · 2024` |
| Log header `BLIND SPOTS 0 / STATUS: ALL LAYERS COVERED ●` | `OSK-00 // ALL LAYERS COVERED`; "BLIND SPOTS: 0" sits under the radar |
| Log rows type in at 15ms/char, single line with dot leaders | Row slides in (350ms); direction stacked over message; no leaders |
| Log order in the second round N, S, E, W | N, E, S, W, so every row matches the sweep's actual position |
| Timeline `BUILDMETRICS AI · FULL STACK (CONTRACT)` | Name with role on a second line |
| Case top bar middle: name + image count | `NAME / FIELD NOTES` |
| Case sections: separate "Before / after" and "Screens" | `RESULTS / KNOWN NUMBERS`; screens and architecture share `05 SCREEN / SYSTEM` |
| Syntax-highlighted code snippets in decision cards | Single-colour flow diagrams (the content is flows, not code) |
| Mobile radar 300px | 350px max |

### Performance numbers

Mobile Lighthouse 13.5, production build served locally. The reports are in `lighthouse/`.

| Page | Throttling | Perf | A11y | BP | SEO | FCP | LCP | CLS | TBT | JS (transfer) |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | simulated (default) | 99 | 100 | 100 | 100 | 0.9 s | 2.2 s | 0 | 30 ms | 141 KB |
| `/` | applied | 100 | 100 | 100 | 100 | 1.5 s | 1.5 s | 0 | 0 ms | 141 KB |
| `/work/buildmetrics` | simulated | 99 | 100 | 100 | 100 | 0.8 s | 2.1 s | 0 | 0 ms | 132 KB |
| `/work/buildmetrics` | applied | 100 | 100 | 100 | 100 | 1.5 s | 1.5 s | 0 | 0 ms | 132 KB |

The LCP element is the hero `<h1>`, with 131 ms of observed render delay. The simulated model also counts every script requested before that paint, which on localhost is all of them. It reports 2.1–2.3 s, above the spec's 2.0 s target. Under applied throttling, LCP is 1.5 s. Lowering the simulated number would mean dropping framer-motion (about 37 KB), which drives the approved layout and overlay motion. Re-run on the deployed URL: real CDN latency changes both numbers.

### Content still needed

- **Images:** portrait (high resolution), BuildMetrics, KACADEMIA (or blurred) and DADBOD screenshots, each with alt text. Add these to `assets/source/` and set captions and alt text in `lib/site.ts`.
- **Links:** GitHub, LinkedIn, CV PDF, POS live link and repo, LinkedIn URLs for the four posts. GitHub and LinkedIn also go into JSON-LD `sameAs` automatically.
- **BuildMetrics numbers:** module count, query count, BOQ rows at 60fps, load time before and after. Add them to the MDX once they're real.
- **Optional:** team size per case (`team:`), post bodies (these switch on read time).
- **Deployment:** `NEXT_PUBLIC_SITE_URL`, the custom domain and the Vercel project. None of these are done yet.
