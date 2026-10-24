# AGENTS.md

Operating manual for AI agents working on Ledgertone.

## Project

A static site for GitHub Pages: plain HTML, CSS, and JavaScript, no build step, no external requests (no CDN, no web fonts). The only exception is Google Analytics 4: the Google tag sits in the `<head>` of every HTML page in Consent Mode v2 (all storage denied by default), and `assets/consent.js` grants analytics storage only after the visitor accepts. It ranks phonk artists on Pandora by verified streams from dated, hand-collected snapshots.

## Hard rules

1. Language: everything in the repository and on the site is English. Talk to the owner in Russian only.
2. Never invent data. `data/snapshots.js` changes only with numbers the owner collected. No placeholder artists on the live page.
3. Never imply live data. Keep the four disclosures on `about.html` (the "How the data is collected" section): collected by hand, verified streams, not the Pandora API, snapshots with dates. Owner decision: the home page and the rankings page do not repeat the by-hand or not-live explanations, they just say "snapshot". Every page keeps the non-affiliation footer.
4. Pandora is named only as the data source. No Pandora logo, no artwork, no artist images. Keep the non-affiliation footer.
5. Archive naming: every archive of the site handed to the owner must carry the site version in its file name, for example `ledgertone_github_io_v0.1.1.zip`. The version is the top entry of `CHANGELOG.md`. Bump it with every change. This rule is mandatory for all AI agents.
6. Privacy and cookies: set no cookies before consent. The head snippet must always declare consent defaults as denied before the tag loads. Every new HTML page needs the same head snippet, and `privacy.html` must stay accurate about it. Keep Reject as prominent as Accept. If the data collected changes, update `privacy.html` in the same change. Ask the owner before adding any new tracker.
7. Follow `CLAUDE.md`: no emojis, no em-dashes, verify before asserting APIs, versions, or flags.

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Home: hero with two buttons. No rankings, no long explanations |
| `rankings.html` | Snapshot picker and ranking list, rendered by `assets/app.js` |
| `about.html` | What the site is, how the data is collected (the four disclosures), independence, contact |
| `assets/styles.css` | Tokens, glass layer, accessibility media queries |
| `assets/app.js` | Rendering, snapshot picker, delta vs previous snapshot |
| `data/snapshots.js` | Only data source. Schema in `docs/DATA.md` |
| `assets/glass.js` | Refraction filter for `.glass` elements (Chromium only, progressive enhancement) |
| `assets/consent.js` | Cookie banner, sends the visitor's choice to the Google tag |
| `privacy.html`, `404.html`, `robots.txt`, `sitemap.xml` | Legal and search files. Every new HTML page needs the head snippet, the same nav and footer links, and a sitemap entry. Launch steps in `docs/SEO.md` |
| `skills/` | Design skills, see `skills/README.md` |

## Design rules

- **Glass transparency.** Liquid Glass is as transparent as legibility allows: fill at most 6 percent of `--surface`, light blur, visible edge highlight. Do not raise the fill or blur without an explicit request from the owner. Opaque fallbacks for reduced transparency and increased contrast stay.
- **Glass is refraction, not just blur.** In Chromium browsers `assets/glass.js` builds a displacement map per `.glass` element and applies it as an SVG filter in `backdrop-filter`, so the rim bends the background. Safari and Firefox cannot do this and use the CSS fallback in `styles.css` (blur, saturation, specular edges). Do not remove the rings and color fields in the page background, the glass needs hard edges and color to bend. New `.glass` elements are picked up automatically only if present at load. Test any glass change in Chromium and in a browser without refraction.
- **Navigation.** Top bar buttons open separate pages (`rankings.html`, `about.html`), they never scroll the page. Say "snapshot" in copy.
- **Two layers.** Glass (`.glass`) belongs only to the functional layer: the top bar and the snapshot picker. Rows, chips, and cards are opaque. Do not add glass to content.
- **Color budget.** One accent (`--accent`) for the primary button, the notehead, and rank bars. Labels stay monochrome. The colorful fields live in the page background so the glass has something to refract.
- **Signature.** The staff with a note on a ledger line above it. Do not add other decorative motifs.
- **Motion.** One orchestrated moment on load (staff draws, note lands), row entrance on render, press feedback on pointer down. Animate only `transform` and `opacity`. No full-screen moving backgrounds.
- **Type.** System font stack. Tight tracking on large text, normal on body, body 17 px or larger, spacing in `rem`.
- **Accessibility floor.** Targets at least 44 px. Visible focus. Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`. Light and dark follow the system, no manual toggle.
- Follow `skills/apple-design-fluid-web/SKILL.md` for motion and materials, and read the cited pages in `skills/apple-design-hig/references/hig/` (start with `liquid-glass.md`) before changing glass or layout.

## Before you finish

```bash
node --check assets/app.js
node -e "global.window={};require('./data/snapshots.js');console.log(window.LEDGERTONE.snapshots.length)"
grep -rnP "\x{2014}" --include="*.html" --include="*.css" --include="*.js" --include="*.md" . --exclude-dir=skills   # must print nothing
```

Then update `CHANGELOG.md` and `TODO.md`.
