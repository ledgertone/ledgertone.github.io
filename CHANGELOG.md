# Changelog

Format follows Keep a Changelog. Dates are YYYY-MM-DD.

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
