# Changelog

Format follows Keep a Changelog. Dates are YYYY-MM-DD.

## [0.14.0] - 2026-10-24
### Changed
- The whole site now uses Neue Machina (supplied by the owner): `.woff2` in `assets/fonts/` in Regular, Medium, and Bold, Latin and Cyrillic, Regular and Bold preloaded. Replaces SF Pro, New York, and Instrument Sans. Headings no longer use a serif. Heading tracking loosened for this wide font.
- Removed Instrument Sans files and its license file. Added `assets/fonts/README.md`.
- Sample artist placeholder images now draw their initials as outlines of Neue Machina Bold.
- `AGENTS.md`: Type rule rewritten.

## [0.13.0] - 2026-10-24
### Added
- Artist images: every ranking row shows a round image from `assets/artists/` (field `image`), with an initials monogram when the image is missing or fails to load. Only local `assets/artists/*.png|jpg|webp|svg` paths are accepted.
- "Open on Pandora" button in every row that has a `profileUrl`, plus the artist name as a link.
- 12 generated SVG placeholder images for the fictional sample artists.
### Changed
- Pandora is named explicitly in the UI: "streams on Pandora" under each number, "Open on Pandora", "Pandora snapshot" in the picker and the snapshot line, "Latest Pandora snapshot" on the home page, "View Pandora rankings" button, Pandora in the rankings intro and empty state.
- Row layout: rank, image, then name and streams, bar, change and Pandora button. Compact variant under 480 px.
- Sample data now has `image` and a stand-in `profileUrl` (the Pandora home page, fictional artists have no Pandora pages).
- `AGENTS.md` rule 4 (images and links allowed, local images only, say Pandora everywhere), layout table, `docs/DATA.md` schema.

## [0.12.0] - 2026-10-24
### Added
- Sample data at the owner's request: three snapshots (2026-10-01, 2026-10-12, 2026-10-24) with 12 fictional artists, to preview the design. Every snapshot has `sample: true` and a note that it is not real.
- `sample` flag: the home page status chip reads "Sample data, not real" when the latest snapshot is a sample. Documented in `docs/DATA.md`.
### Changed
- `AGENTS.md` rule 2 allows owner-requested sample data under strict conditions (fictional names, flag, removal before launch).

## [0.11.0] - 2026-10-24
### Added
- Theme switch: one glass cycle button in the top bar (Auto, Light, Dark). `assets/theme.js` runs in the `<head>` of every page so there is no flash, stores the choice in localStorage (`ledgertone-theme`, removed on Auto) and updates `theme-color`. CSS has `[data-theme=light]` and `[data-theme=dark]` overrides next to the system media query.
- `privacy.html`: row for the theme key.
### Changed
- Stricter palette: pink and yellow background fields replaced by lavender and steel blue (dark: indigo and deep blue), rings fainter, fields at opacity .5, accent slightly deeper.
- `AGENTS.md`: accessibility rule now describes the theme switch, strict rule names the cool palette, layout table lists `theme.js`.

## [0.10.0] - 2026-10-24
### Changed
- Stricter look: the huge hero heading is replaced by a compact one (h1 at most 2.75 rem on all pages, h2 at most 1.75 rem, weight 650), tighter hero spacing, softer background color fields (opacity .55), 20 px corners on rows and the empty state.
- `AGENTS.md`: new "Strict and restrained" design rule with the size caps.

## [0.9.0] - 2026-10-24
### Changed
- Fonts: SF Pro for body and interface, New York for headings and the brand, through system stacks (`--sans`, `--serif` in `assets/styles.css`). Apple fonts are referenced, not bundled. Non-Apple devices fall back to the self-hosted Instrument Sans, then the platform system font.
- Heading weight set to 700 and tracking to -0.025em (h1) and -0.02em (h2). Removed the Instrument Sans preload links from every page.
- `AGENTS.md`: Type rule rewritten.

## [0.8.0] - 2026-10-24
### Changed
- Liquid Glass now covers almost the whole UI, not only the top bar and picker: primary and secondary buttons, cookie Accept and Reject, footer Cookie settings button, status chip, ranking rows, empty state, current nav link and selected picker item. The primary button and Accept are accent-tinted glass (88 percent accent).
- New `glass-flat` class: same glass look without refraction, used for ranking rows and for glass nested in the cookie banner. `assets/glass.js` skips it.
- Opaque fallbacks (reduced transparency, increased contrast, no backdrop-filter) extended to all new glass elements.
- `AGENTS.md`: the "two layers" rule is replaced by "Liquid Glass is the core style" (owner decision). `CLAUDE.md` and `README.md` updated.

## [0.7.0] - 2026-10-24
### Changed
- Site font is now Instrument Sans (SIL OFL 1.1), self-hosted in `assets/fonts/` as Latin subsets (Regular and Bold, about 49 KB total), with the system font stack as fallback. Preloaded on every page. Weights up to 599 render Regular, 600 and above render Bold.
- Hero heading tracking loosened from -0.04em to -0.03em to suit the new font. Top bar links use weight 600.
- `AGENTS.md`: the "no web fonts" rule now allows self-hosted fonts only.

## [0.6.1] - 2026-10-24
### Changed
- Cookie banner is smaller (max width 380 px, tighter padding, shorter copy) and uses the glass layer, including refraction in Chromium. Reject and Accept keep the same size. Opaque fallbacks for reduced transparency and increased contrast apply to the banner too.
- `assets/glass.js` exposes `window.ledgertoneGlass.observe(el)` so glass elements created after load get refraction. `assets/consent.js` uses it.

## [0.6.0] - 2026-10-24
### Added
- `assets/glass.js`: real Liquid Glass refraction in Chromium browsers (per-element displacement map used through an SVG filter in `backdrop-filter`), disabled for reduced transparency and increased contrast.
### Changed
- Design refresh: stronger color fields and concentric rings in the page background (hard edges for the glass to bend), larger hero type with a muted second line, rounder ranking cards with soft shadow, larger primary button.
- Glass fallback for Safari and Firefox now has specular rim highlights and extra saturation instead of plain blur.
- `AGENTS.md`, `README.md`: glass rules updated.

## [0.5.1] - 2026-10-24
### Changed
- `privacy.html`: controller named as "Daniil (SETTWOR)" with the contact email.

## [0.5.0] - 2026-10-24
### Added
- `rankings.html`: the snapshot picker and ranking list moved here from the home page. Added to the sitemap and footer.
### Changed
- Top bar buttons (Rankings, About) open separate pages instead of scrolling. Current page is highlighted.
- Home page copy says "snapshot" and no longer explains by-hand collection or not-live data there. The explanation stays on `about.html`.
- `assets/app.js` works on pages without the rankings list. Title, description, and social image text updated.
- `AGENTS.md`: navigation and wording rules updated.

## [0.4.0] - 2026-10-24
### Added
- `about.html`: what the site is, how the data is collected, independence, contact. Added to the sitemap and to the nav and footer of every page.
### Changed
- The "How the data is collected" section moved from `index.html` to `about.html`. The home page keeps a link to it and the not-live notes in the hero and footer.
- `AGENTS.md`: disclosure rule now points to `about.html`.

## [0.3.0] - 2026-10-24
### Changed
- Google tag moved into the `<head>` of every page (Consent Mode v2 advanced mode): defaults denied before the tag, no cookies before consent, limited cookie-free pings before consent.
- `assets/consent.js` no longer loads the tag, it only sends the visitor's choice.
- `privacy.html` and the banner text describe the cookie-free pings and the legitimate-interest basis for them.

## [0.2.2] - 2026-10-24
### Changed
- `assets/consent.js`: GA4 measurement ID set. Banner is now active.

## [0.2.1] - 2026-10-24
### Changed
- `privacy.html`: contact email filled in. Final URL confirmed as `https://ledgertone.github.io/`.

## [0.2.0] - 2026-10-24
### Added
- Search readiness: canonical link, robots meta, Open Graph and Twitter Card tags, social image, WebSite structured data, `robots.txt`, `sitemap.xml`, `404.html`.
- `privacy.html` (English) covering hosting logs and consent-based Google Analytics.
- `assets/consent.js`: cookie banner with equal Accept and Reject, Consent Mode v2 defaults, Google Analytics 4 loaded only after consent, Cookie settings button in the footer. Inactive while `GA_ID` is empty.
- `docs/SEO.md`: launch checklist, GA4 setup, Search Console steps.
### Changed
- `AGENTS.md`, `README.md`: Google Analytics exception to the no-external-requests rule, privacy rule, user-site hosting.

## [0.1.1] - 2026-10-24
### Changed
- Liquid Glass made as transparent as possible: fill reduced from 58 to 6 percent, blur from 26 to 10 px, softer shadow and highlight. Accessibility fallbacks unchanged.
- `AGENTS.md` and `CLAUDE.md`: archive name must include the site version; glass transparency rule.

## [0.1.0] - 2026-10-24
### Added
- Initial scaffold of the Ledgertone site for GitHub Pages.
- Page sections: hero with staff and ledger-line note, rankings, method, footer with non-affiliation notice.
- Liquid Glass top bar and snapshot picker, opaque content layer, scroll edge effect.
- Fallbacks for reduced motion, reduced transparency, increased contrast, and missing backdrop-filter.
- Snapshot data format in `data/snapshots.js` (empty until the first hand-collected snapshot) and change vs previous snapshot.
- `AGENTS.md`, `CLAUDE.md`, `docs/DATA.md`, `TODO.md`, and both design skills under `skills/`.
