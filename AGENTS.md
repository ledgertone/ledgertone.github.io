# AGENTS.md

Operating manual for AI agents working on Ledgertone.

## Project

A static site for GitHub Pages: plain HTML, CSS, and JavaScript, no build step, no external requests (no CDN, no web fonts). It ranks phonk artists on Pandora by verified streams from dated, hand-collected snapshots.

## Hard rules

1. Language: everything in the repository and on the site is English. Talk to the owner in Russian only.
2. Never invent data. `data/snapshots.js` changes only with numbers the owner collected. No placeholder artists on the live page.
3. Never imply live data. Keep the four disclosures in `index.html` (`#method`): collected by hand, verified streams, not the Pandora API, snapshots with dates.
4. Pandora is named only as the data source. No Pandora logo, no artwork, no artist images. Keep the non-affiliation footer.
5. Follow `CLAUDE.md`: no emojis, no em-dashes, verify before asserting APIs, versions, or flags.

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Single page: hero, rankings, method, footer |
| `assets/styles.css` | Tokens, glass layer, accessibility media queries |
| `assets/app.js` | Rendering, snapshot picker, delta vs previous snapshot |
| `data/snapshots.js` | Only data source. Schema in `docs/DATA.md` |
| `skills/` | Design skills, see `skills/README.md` |

## Design rules

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
