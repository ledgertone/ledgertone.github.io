# Changelog

Format follows Keep a Changelog. Dates are YYYY-MM-DD.

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
