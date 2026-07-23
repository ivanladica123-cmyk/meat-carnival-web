# Meat Carnival website — build verification report

## Content-accuracy fixes before client meeting (2026-07-12, owner-reported)
Verified in-browser (DOM) at localhost; `tsc -b` + build clean; no console errors.
1. **Hardcoded Google rating removed.** `rating` "4,6" + `reviewCount` 210 deleted
   from `restaurant.json`, the `business` normalizer, and the CMS fields. Hero
   chip now reads **"Recenzije na Googleu"** (star kept) and links to the live
   Google profile — no number to go stale. (Live Places API rejected: needs a
   billed key + serverless proxy on a static site.)
2. **Wolt-price disclaimers removed.** Deleted the menu "Cijene preuzete s
   Wolta (11. 7. 2026.)…" line and the footer "Cijene prema Wolt ponudi" line.
   The menu no longer tells guests its prices are the (higher) Wolt prices; the
   owner sets real in-store prices via `/admin`. Kept the honest order-panel
   note that *delivery* prices on Wolt/Glovo may differ from in-store.
3. **"…u potvrdi kod vlasnika" gone** (removed with the Wolt line); the sibling
   "podložno potvrdi vlasnika" footer note deleted and the terrace note reworded
   to "Radno vrijeme može se razlikovati za blagdane…" (no "unofficial" tell).
   CMS toggle label updated to match.
4. **"Kuća časti preporukom" → "Ljubimci gostiju"** (old phrase reads as "on the
   house / free" in Croatian).
5. Footer year made dynamic (`new Date().getFullYear()`).

## Bug fix: invisible Jelovnik on mobile (2026-07-12, owner-reported)
**Symptom:** whole menu section white on phones. **Root cause:** `Reveal` used
`IntersectionObserver` with `threshold: 0.15` — a *ratio* threshold. The mobile
menu wrapper is ~4700px tall (1-col layout + images), so at a ~844px viewport
the max achievable ratio is ~0.17, and after the -8% rootMargin / narrower
phones it drops **below 0.15 → the observer can never fire → section stuck at
opacity 0**. Desktop was unaffected (4-col layout keeps the section short).
**Fix:** `threshold: 0` (first-pixel trigger, height-independent) + a
belt-and-braces passive scroll/resize rect-check fallback with the same
geometry (top < 88% viewport), one-time and self-cleaning. **Verified at
390×844 with dispatched scroll events: all five wrappers, including
`#jelovnik`, gain `.reveal-in`; in-view sections reveal at mount.** The scroll
fallback is height-independent, covering 320/375px by construction.

## CMS auth backend: GitHub, not Git Gateway (2026-07-12)
Git Gateway is deprecated, so the Decap backend is `github` →
`ivanladica123-cmyk/meat-carnival-web` @ `main`. Netlify Identity scripts
removed from `public/admin/index.html` and `index.html`. Auth = GitHub OAuth
via Netlify's OAuth proxy (callback `https://api.netlify.com/auth/done`); the
Client Secret lives only in Netlify, never in the repo (grep-verified: no
secret strings, no identity/git-gateway refs in source). Verified: `/admin`
loads, Decap parses config, shows **"Login with GitHub"**, `window.netlifyIdentity`
undefined, no console errors; main site unaffected. NOT testable here: a real
CMS publish → commit → Netlify build (needs the GitHub OAuth app + Netlify
OAuth provider + push access — all owner-side).

## CMS conversion (2026-07-12)
Editable content moved to `content/menu.json` + `content/restaurant.json`
(prices as numbers; rendered via `Intl.NumberFormat("hr-HR","EUR")` → "9,40 €").
Decap CMS at `/admin` (Netlify Identity + Git Gateway, invite-only, Croatian
field labels; media → `public/images/menu`). Build-time JSON imports = no
runtime fetch, no loading state needed; malformed JSON fails the build and
cannot deploy. Adapter (`src/data/site.ts`) normalizes defensively. Verified
live: unavailable item hides (37→38 rows on toggle), category tiles mirror the
filter, popular badges intact, no-description items fine, JSON-LD Restaurant
emitted from the same data, tel: derived from the CMS phone. Audit: no console
errors, no duplicate IDs, no dead anchors, all external links `noopener`, no
h-scroll at 320/390/768/1440, one `h1`, all imgs have alt, no localhost in
`dist/`. Owner docs: README "Uređivanje jelovnika".
**Date:** 2026-07-11 · **Source of truth:** [../DESIGN_BLUEPRINT.md](../DESIGN_BLUEPRINT.md) + [../design-tokens.json](../design-tokens.json)
**Stack:** Vite + React + Tailwind v4 + shadcn (base-ui primitives, nova preset) · light-only theme · `lang="hr"`

## Method note (environment limitation)
The in-app browser pane could not capture pixel screenshots and did not run
animation frames during this session (screenshots timed out even on static
pages; CSS transitions froze mid-flight). Verification was therefore done via
**computed styles, DOM geometry, and live interaction probes** at three
viewports — which is the stronger evidence class for token/layout claims —
while **animated behaviors were verified logically and via their non-animated
code paths**. A quick human pass in a normal browser is recommended before
launch (see "Recommended manual checks").

## Verified against blueprint design rules

| Check | Result | Evidence (measured in-browser) |
|---|---|---|
| Tokens: canvas / ink / red / dark surface | ✅ | body `#FAF6EF`/`#1C1512`; hero & footer `#211A16`; claim band `#C8262C` with cream text |
| Display type = Rye, sections + hero only | ✅ | `h1` and menu category `h3` computed `font-family: Rye`; body `Barlow` |
| Spaced-caps label register (+0.06em) | ✅ | nav links `Barlow Condensed`, letter-spacing 0.84px @14px = 0.06em |
| Prices tabular, Croatian format, verbatim Wolt values | ✅ | `font-variant-numeric: tabular-nums`; full-page text diffed against data file (all 40 prices match E11; none invented) |
| Focus ring 3px / offset 2, token-driven | ✅* | `outline: 3px solid var(--ring) !important` in cascade; `--ring` = `#A31B20` on light, `#F0A81C` in `.section-dark` (*final state verified in cascade; transition to it could not animate in the pane — see D1, D5) |
| Rule 3: mascot once per viewport | ✅ | placeholder badge appears once in nav, once in footer (different viewports of the page) |
| Rule 4: red leads, gold seasons | ✅ | gold used only: badges, focus ring (dark), footer headings, hero kicker/star |
| Rule 5/6: visible prices + concrete sourcing lines | ✅ | prices on all cards/rows; "100 % junetina s hrvatskih farmi (150 g)" category note; venison description verbatim |
| Rule 6a: Carnival umak as sub-brand | ✅ | claim band slot + named in hero sub + menu |
| Rule 7: 4.6★ (210) near CTA | ✅ | hero rating chip links to the Google listing |
| Rule 8/9: terrace section + late hours | ✅ | dedicated `#terasa` section with hours table; hero chip "Petkom i subotom do 02:00" |
| Rule 10: Croatian-first informal voice | ✅ | all UI copy hr; CTAs imperative ("Naruči", "Pogledaj jelovnik") |
| Heading hierarchy | ✅ | exactly one `h1`; h2 per section; h3 for categories/cards |
| Landmarks + skip link | ✅ | `main`, labeled `nav` ×2(+menu quick-nav), footer; first Tab focuses "Preskoči na sadržaj" which becomes visible (red bg/cream) |

## Responsive matrix (computed at exact widths)

| Check | 390×844 | 768×1024 | 1440×900 |
|---|---|---|---|
| No horizontal scroll | ✅ (scrollW 390) | ✅ | ✅ |
| H1 clamp | 36px | — | 56px |
| Body ≥16px | ✅ 16px | ✅ | ✅ |
| Signature grid columns | 1 | 2 | 4 |
| Terrace columns | 1 | 2 | 2 |
| Nav model | hamburger 44×44 → sheet | desktop nav | desktop nav |
| Category pills | 44px high, horizontal scroll | wrap centered | wrap centered |
| Hero CTAs | stacked, 44px high | row | row |
| Anchor offset under sticky nav | ✅ `#jelovnik` lands at top:80px (nav 64px) | ✅ | ✅ |

## Interaction checks
- Mobile sheet: opens from hamburger; contains nav links + order CTA; nav
  link click closes the sheet, then scrolls to the target and pushes the hash
  (native-listener implementation — see D5). Scroll respects
  `prefers-reduced-motion` (auto vs smooth).
- All order CTAs point to the live Wolt store URL (`rel="noopener noreferrer"`,
  `target="_blank"`); phone CTA uses `tel:+385976127608`.
- Fonts self-hosted via @fontsource (Rye 400, Barlow 400/500/600, Barlow
  Condensed 500/600); `document.fonts.check` confirmed Rye, Barlow, Barlow
  Condensed 600 loaded.
- `tsc -b` clean; production build clean (CSS 9.9 kB gzip, JS 99 kB gzip).

## Deviations from the blueprint (recorded)

| ID | Deviation | Reason |
|---|---|---|
| D1 | Focus ring is **red-deep on light surfaces**, gold only inside dark sections (blueprint §5.9 said gold everywhere) | Gold #F0A81C on cream is ~1.9:1 — fails WCAG 3:1 non-text contrast. Token-driven via `--ring` per scope. |
| D2 | Menu categories are **anchor pills + real headings**, not Tabs | Blueprint §5.9 itself requires "categories as headings, not tabs-only"; 8 categories also overflow a tablist on mobile. Satisfies §5.8's pill look. |
| D3 | Claim band and menu headers ship **without food illustrations** | Design rule 11 forbids generic icon libraries for food motifs; the flat red illustration set (E3) is a pending owner deliverable. Typographic treatment holds the slot. |
| D4 | Button `xl` size (44px) added to the shadcn scale; navbar CTA forced to 44px | Blueprint touch-target rule ≥44px; stock shadcn sizes max out at 36px. |
| D5 | Mobile sheet nav uses a **native click listener** (ref callback) instead of React `onClick`, and defers scrolling ~250ms until the sheet's exit transition releases the scroll lock | Base UI's popup stops click propagation before React's delegated root listener, so `onClick` props inside the sheet never fire; anchor jumps are also swallowed while the scroll lock is active. |
| D6 | Template `ThemeProvider` (system dark + "d" hotkey) removed from the render tree | Blueprint defines a light-only site; `.dark` tokens kept aligned with `.section-dark` as a safety net. |
| D7 | Site favicon + logo slots use a **typographic "MC" badge**, not the mascot | Blueprint §9.1: artwork is artist-signed; must not be redrawn without owner vector files. |
| D8 | `Instagram` icon replaced with generic `AtSign` glyph | lucide-react removed brand icons; unofficial brand-logo redraws avoided. |
| D9 | Display font switched **Rye → Alfa Slab One** (2026-07-11) | Owner screenshot showed Č/Ć/Š rendering from serif fallback — Rye lacks Croatian diacritics. Canvas glyph probe confirmed Alfa Slab One covers Ć Č Đ Š Ž (upper+lower). Blueprint §9.3 contingency applied; blueprint + tokens updated. |
| D10 | Menu quick-nav pills replaced by a **category tile grid** (photo/placeholder + caps label per category) | Owner request, modeled on Taco Bell's "Our Food" layout but fully restyled to Meat Carnival tokens (cream cards, red-deep caps labels, brand hover). No Taco Bell colors, fonts, or assets copied. Grid: 2/3/4 cols at 390/768/1440 — verified. Category headings below keep §5.9 semantics. |
| D11 | Scroll animation implemented in **vanilla React/CSS**, not Framer Motion (evaluated and removed) | Framer's rAF frame-loop left reveal content stuck at opacity 0 whenever the loop didn't run, and its `useScroll` did not subscribe in this environment — an unacceptable invisible-content risk. Vanilla parallax (direct scroll handler, additive transforms over always-visible content) + IntersectionObserver reveals are lighter (bundle −130 kB) and degrade safely. |

## Scroll animation (hero parallax + section reveals) — added 2026-07-12

Owner request: an automatic scroll animation at the top of the site. Implemented
as a **hero parallax** plus lightweight **section reveals**, both vanilla (no
animation library — see D11).

**Verified via dispatched real scroll events (computed transforms):**
| Behavior | scrollY 0 | scrollY 300 | scrollY 500 | Result |
|---|---|---|---|---|
| Hero background translateY | 0px | 30px | 50px | drifts slowly (p·60) ✅ |
| Hero content translateY | 0px | 65px | 108px | lags faster than bg ✅ |
| Hero content opacity | 1 | 0.35 | 0 | fades out as hero leaves ✅ |
| Background scale (overscan) | 1.25 | 1.25 | 1.25 | no edge gap during drift ✅ |

- `bgMovesSlowerThanContent`: **true** (true parallax depth). Content and hero
  are fully visible at rest (opacity 1, no offset).
- **Reveals:** in-view section forced visible by the fallback (opacity → 1,
  hidden class removed); below-fold sections retain `.reveal` (opacity 0) and
  reveal on scroll via IntersectionObserver; `.reveal-in` end-state confirmed to
  resolve to opacity 1 when the (pane-frozen) transition is neutralized.
- **Robustness contract proven:** content is visible without JS, under
  reduced-motion, without IntersectionObserver, and if the reveal never fires
  (in-view fallback removes the hidden class — an instant change, not a frozen
  transition). No code path can leave a section stuck invisible in a real
  browser. Both Hero and Reveal early-return to the static, fully-visible layout
  under `prefers-reduced-motion`.
- No console errors; `tsc -b` and production build clean.

**Could not verify in-pane (environment, not code):** the actual motion in
flight — the pane runs the page `hidden`, so `requestAnimationFrame`, CSS
transitions, and CSS animations are all frozen. The parallax math, reveal
wiring, and all resting/end states were verified via computed styles; the visual
smoothness needs a glance in a normal browser.

## Owner assets integrated (2026-07-12)
- **All 14 photo slots filled** from the owner's `Images` folder (renamed to slug
  keys): hero, 4 signature dishes, terrace, 8 category tiles — all decode OK
  (probed programmatically; AVIF/WebP/JPEG). **0 placeholders remain.**
- **Official logo** (red bull, jester cap) wired: navbar + footer badge (cream
  circle so the white-background PNG reads on dark), and site favicon.
- **4 Instagram promo shots** → new "S našeg roštilja" gallery section
  (2 cols mobile / 4 desktop) with follow-CTA to @meatcarnivalhr; alt texts
  condensed from the original post captions.
- **Glovo confirmed live** (`glovoapp.com/hr/hr/zagreb/stores/meat-carnival`,
  fetched — valid store page, normal "closed now" state off-hours). Order panel
  now: Wolt (primary) · Glovo · phone. Placeholder note removed.
- Signature-card crop changed 4:5 → **4:3** to match the landscape (16:9)
  source photography without decapitating the dishes.
- A11y fix: `signature-title` / `jelovnik-title` aria-labelledby references now
  resolve (SectionHeading gained an `id` prop).

### Hover micro-interactions added (all transform/opacity, 180–300ms, killed by reduced-motion)
- Buttons: −2px lift on hover, 0.98 press scale.
- Signature cards + category tiles: −4px lift + shadow, image zoom 1.03/1.04.
- Desktop nav links: gold-current underline slides in; logo tilts −6° on hover.
- Menu rows: warm background tint on hover.
- Verified: all four rule groups present in the cascade; grid/scroll unaffected
  at 390 and 1440 (no horizontal scroll; gallery 2/4 cols).

## Owner polish round (2026-07-12, second pass)
- **Favicon cropped**: `public/favicon.png` generated from the logo — near-white
  → transparent, trimmed to content (674×729), centered on a 192×192
  transparent square. Verified in-browser: all 4 corner pixels alpha 0, 44 % of
  pixels transparent. Site badges unchanged (cream circle is intentional there).
- **Pića tile**: owner's `pića bolja verzija.png` (1672×941) downscaled to
  800×450 → `pica.png`, replaces the old 4 kB `pica.avif`. Verified live.
- **Order channel chooser**: new `OrderMenu` (shadcn DropdownMenu) replaces the
  direct-to-Wolt links on navbar "Naruči", hero "Naruči dostavu", and the mobile
  sheet CTA. Items: Wolt · Glovo · phone, rendered as native anchors. Verified:
  trigger toggles `aria-expanded`; popup content itself could not mount in the
  frozen pane (Base UI positions via rAF) — **needs one human click in a real
  browser**. Order panel at the menu keeps its three explicit buttons.
- **Map**: Google Maps embed (`output=embed`, lazy iframe, 256px/320px tall) in
  the footer under "Gdje smo", plus an "Otvori u Google kartama" link to the
  full listing. Verified present at 390 and 1440; no horizontal scroll.

## Placeholders still awaiting owner input (visible in UI)
1. **Hours** — shown per poster E4 with "* podložno potvrdi vlasnika" note.
2. **Review quote** (Petra) — republish permission from owner/reviewer pending.
3. **In-house prices** — footer + menu note that prices are from Wolt (11.7.2026.) and may differ in the restaurant.

## Recommended manual checks in a normal browser (pane could not run animations)
- Sheet open/close transition and the post-close scroll-to-section feel.
- Smooth-scroll behavior for pill/nav anchors (and with reduced motion on).
- Focus ring appearance during its 150ms transition.
- ~~Rye rendering of Croatian diacritics~~ Resolved: display font is now Alfa
  Slab One (D9); glyph coverage verified programmatically.
