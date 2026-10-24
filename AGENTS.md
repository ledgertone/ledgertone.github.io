# AGENTS.md

Operating manual for AI agents working on Ledgertone.

## Project

A static site for GitHub Pages: plain HTML, CSS, and JavaScript, no build step, no external requests (no CDN, no third-party font hosts). The only exception is Google Analytics 4: the Google tag sits in the `<head>` of every HTML page in Consent Mode v2 (all storage denied by default), and `assets/consent.js` grants analytics storage only after the visitor accepts. It ranks phonk artists on Pandora by verified streams from dated, hand-collected snapshots.

## Hard rules

1. Language: everything in the repository and on the site is English. Talk to the owner in Russian only.
2. Never invent data. `data/snapshots.js` changes only with numbers the owner collected. No placeholder artists on the live page. The one exception is sample data that the owner explicitly asks for to preview the design: fictional artist names only, `sample: true` on every such snapshot, a note that it is not real, and it must be removed before the real launch (see `TODO.md`). Never ask for or add sample data on your own.
3. Never imply live data. Keep the four disclosures on `about.html` (the "How the data is collected" section): collected by hand, verified streams, not the Pandora API, snapshots with dates. Owner decision: the home page and the rankings page do not repeat the by-hand or not-live explanations, they just say "snapshot". Every page keeps the non-affiliation footer.
4. Pandora: named as the data source and wherever Pandora data or a Pandora link appears, say "Pandora" explicitly (labels like "streams on Pandora", "Open on Pandora", "Pandora snapshot"). Owner decision: each artist row shows an artist image and a link to the artist's Pandora page (`profileUrl`, https only). Images are local files in `assets/artists/` referenced by `image` in `data/snapshots.js`, never hotlinked from Pandora or any other host (the site makes no external requests), and only images the owner has the right to use. Rows without an image show an initials monogram. Still no Pandora logo or branding, and keep the non-affiliation footer.
5. Archive naming: every archive of the site handed to the owner must carry the site version in its file name, for example `ledgertone_github_io_v0.1.1.zip`. The version is the top entry of `CHANGELOG.md`. Bump it with every change. This rule is mandatory for all AI agents.
6. Privacy and cookies: set no cookies before consent. The head snippet must always declare consent defaults as denied before the tag loads. Every new HTML page needs the same head snippet, and `privacy.html` must stay accurate about it. Keep Reject as prominent as Accept. If the data collected changes, update `privacy.html` in the same change. Ask the owner before adding any new tracker.
7. Follow `CLAUDE.md`: no emojis, no em-dashes, verify before asserting APIs, versions, or flags.

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Home: hero with two buttons. No rankings, no long explanations |
| `rankings.html` | Snapshot picker and ranking list, rendered by `assets/app.js` |
| `about.html` | What the site is, how the data is collected (the four disclosures), independence, contact |
| `assets/styles.css` | Tokens, glass styles for all buttons, chips, cards and bars, accessibility media queries |
| `assets/app.js` | Rendering, snapshot picker, delta vs previous snapshot |
| `data/snapshots.js` | Only data source. Schema in `docs/DATA.md` |
| `assets/artists/` | Local artist images (generated placeholders for the sample artists right now) |
| `assets/glass.js` | Refraction filter for `.glass` elements (Chromium only, progressive enhancement) |
| `assets/consent.js` | Cookie banner, sends the visitor's choice to the Google tag |
| `assets/theme.js` | Auto, Light, Dark theme switch, loaded in every `<head>` |
| `privacy.html`, `404.html`, `robots.txt`, `sitemap.xml` | Legal and search files. Every new HTML page needs the head snippet, the same nav and footer links, and a sitemap entry. Launch steps in `docs/SEO.md` |
| `skills/` | Design skills, see `skills/README.md` |

## Design rules

- **Liquid Glass is the core style (owner decision, permanent).** Almost everything on the site is glass. Every button and every button-like control is glass: the primary button, the secondary button, the cookie Accept and Reject, the footer Cookie settings button, snapshot picker items, the current nav link. So are chips (`.status`), cards and ranking rows (`.row`), the empty state (`.empty`), the top bar, the picker, and the cookie banner. Do not add new opaque panels, buttons, or cards, and do not turn existing glass elements back into opaque ones. Long-form text on `about.html` and `privacy.html`, the footer text, and headings stay plain on the page background, with no panel. Opaque fills exist only as fallbacks (reduced transparency, increased contrast, no `backdrop-filter`).
- **Glass transparency.** Fill at most 6 percent of `--surface`, light blur, visible edge highlight. Do not raise the fill or blur without an explicit request from the owner. The one exception is the accent-tinted button (primary button, cookie Accept): accent fill at 88 percent so white text stays legible. Text must stay legible over the colorful page background in light and dark, check it after any glass change.
- **Glass is refraction, not just blur.** In Chromium browsers `assets/glass.js` builds a displacement map per `.glass` element and applies it as an SVG filter in `backdrop-filter`, so the rim bends the background. Safari and Firefox cannot do this and use the CSS fallback in `styles.css` (blur, saturation, specular edges). Do not remove the rings and color fields in the page background, the glass needs hard edges and color to bend. Two classes: `.glass` (refraction) and `.glass.glass-flat` (same look, no refraction). Use `glass-flat` for repeated items (ranking rows) and for glass nested inside other glass (cookie buttons inside the banner), so the page does not build dozens of filters. `glass.js` picks up elements present at load; for elements created later call `window.ledgertoneGlass.observe(el)`. Test any glass change in Chromium and in a browser without refraction.
- **Navigation.** Top bar buttons open separate pages (`rankings.html`, `about.html`), they never scroll the page. Say "snapshot" in copy.
- **Y2K holographic glow (owner decision, permanent, replaces "strict and restrained" since v0.15.0).** Reference: dark iridescent look with glow gradients, grain, and glass cards. Heading size caps stay: h1 at most 2.75 rem (`clamp(1.875rem,4.5vw,2.75rem)`), h2 at most 1.75 rem. The page background is soft glowing color fields (`body::before`, opacity `--fo`) plus film grain (`html::after`), with faint rings kept for the glass to bend. Corners are 20 px on cards and rows, pills for buttons. Gradient text is allowed only for `h1 .soft` (`--hg`). Labels (`.status`, `.meta`, picker label, `.st small`) are small uppercase with wide tracking, in Neue Machina. One decorative star in the hero (`.hero::after`) is allowed. No other decorative motifs, no opaque panels.
- **Color budget.** Palette: violet, blue, cyan, magenta, with a small peach field. Buttons and rank bars use gradients built from `--accent`, `--btn2` and `--f1` to `--f3`. Text colors stay `--ink` and `--muted`. Keep text legible on glass in light and dark.
- **Signature.** The staff with a note on a ledger line above it, plus the hero star. Do not add other decorative motifs.
- **Motion.** One orchestrated moment on load (staff draws, note lands), row entrance on render, press feedback on pointer down. Animate only `transform` and `opacity`. No full-screen moving backgrounds.
- **Type (owner decision: Neue Machina).** One typeface for everything, headings, body, and interface: Neue Machina (Pangram Pangram), supplied by the owner, self-hosted as `.woff2` in `assets/fonts/` (Regular up to weight 450, Medium 451 to 599, Bold 600 and up, Latin and Cyrillic). Fallback is the system sans stack in `--sans` in `assets/styles.css`. Regular and Bold are preloaded on every page. Do not add other typefaces, serif headings, or Apple font stacks, and never load fonts from a third-party host. The font is wide, so keep tracking near zero on headings. Body 17 px or larger, spacing in `rem`.
- **Accessibility floor.** Targets at least 44 px. Visible focus. Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`. Light and dark: a theme switch (owner decision) with Auto (follows the system), Light, Dark, as one cycle button in the top bar (`assets/theme.js`, loaded in the `<head>` of every page, choice kept in localStorage key `ledgertone-theme`, not a cookie, `privacy.html` lists it). Dark values live in two places in `styles.css` (the media query and `[data-theme=dark]`), keep them identical. Every page needs the `theme.js` script and the `#theme-toggle` button in the nav.
- Follow `skills/apple-design-fluid-web/SKILL.md` for motion and materials, and read the cited pages in `skills/apple-design-hig/references/hig/` (start with `liquid-glass.md`) before changing glass or layout.

## Before you finish

```bash
node --check assets/app.js
node -e "global.window={};require('./data/snapshots.js');console.log(window.LEDGERTONE.snapshots.length)"
grep -rnP "\x{2014}" --include="*.html" --include="*.css" --include="*.js" --include="*.md" . --exclude-dir=skills   # must print nothing
```

Then update `CHANGELOG.md` and `TODO.md`.
