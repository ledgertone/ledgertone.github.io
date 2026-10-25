# Changelog

Format follows Keep a Changelog. Dates are YYYY-MM-DD.

## [0.40.0] - 2026-10-25
### Added
- Banned: DJ MTG BONAFORTE (owner request, immediate). Added to the `banned` list, so the site drops the name from every snapshot and imports skip it.
- Phonk roster: 15 more artist names from the owner's Spotify playlist export "OG phonk 2021 2022" (73 tracks, 68 unique artists, 51 already in the roster, 1 banned name skipped). The roster now has 292 names. Names only, no stream numbers, not shown on the site.
- Not added: "Fast & Furious: The Fast Saga" (a soundtrack credit, not an artist). "BADTRIP MUSIC" looks like a label or channel name and may need checking before a Pandora lookup.

## [0.39.0] - 2026-10-25
### Added
- `banned` list in `data/snapshots.js` (owner request): Freddie Dredd and Oliver Tree are not phonk artists. `assets/app.js` removes banned names from every snapshot, so they can never show up in a ranking. Rule 8 in `AGENTS.md` and `docs/DATA.md` say to skip banned names in every future import.
### Changed
- Both names removed from the Phonk roster, which now has 277 names.

## [0.38.0] - 2026-10-25
### Added
- Phonk roster: 73 more artist names from the owner's Spotify playlist export "OG Drift Phonk" (159 tracks, 129 unique artists, 55 were already in the roster). The roster now has 279 names. Names only, no stream numbers, not shown on the site (see 0.36.0).
- Not added: "Fast & Furious: The Fast Saga" (a soundtrack credit, not an artist). "prod. DTM" is kept as Spotify lists it and probably needs a real name before a Pandora lookup.

## [0.37.0] - 2026-10-25
### Changed
- Phone scale adjusted (owner request). The top bar is back to the desktop size on phones (50 px high, site name 19 px, links and theme button 36 px). Other visible controls (genre switcher, per page selector, pager, cookie buttons) are 33 px instead of 30; the 44 px touch area is kept (hit zone inset 6 px). The search field is 40 px high.
### Fixed
- The status chip ("Sample data, not real") sat right under the top bar and the bar's blur and shadow fell on it. The hero now starts 92 px below the safe area on phones (was 62 px), which leaves about 30 px between the bar and the chip.
- Checked in headless Chromium with touch emulation at 390 px. Not tested on a real iPhone.

## [0.36.0] - 2026-10-25
### Changed
- Drift Phonk removed (owner request). The genres are now Phonk and Brazilian Phonk: switcher, `genres` list in `data/snapshots.js`, About intro (two genres), `docs/DATA.md`, `AGENTS.md`, `TODO.md`. An old `#drift-phonk` link opens the first genre.
### Added
- `roster` on the Phonk genre in `data/snapshots.js`: 206 artist names from the owner's list (`drift_phonk_all_artists.md`, 222 lines, 16 duplicates removed, backslash escapes removed). Names only: no stream numbers were invented, so the roster is not a ranking and is not shown on the site. An artist enters a snapshot only with a stream count read by hand (rule in `docs/DATA.md`).
- The roster mixes drift phonk and Memphis phonk names from public directories. The inclusion rule for real snapshots is still open (see `TODO.md`).

## [0.35.0] - 2026-10-25
### Changed
- Phone scale (screens up to 600 px wide, owner request: everything was too big). Body text 15 px (was 17). Visible controls 30 px high (was 36): top bar links, theme button, genre switcher, per page selector, pager, cookie buttons; the 44 px touch area is kept through the `::before` hit zone (inset 7 px). Top bar 40 px high (was 50), search field 38 px (was 44), headline 26 px (was 30), table rows 45 px (was 63), avatars 28 px, rank badges 20 px, cookie banner 114 px high (was 147), smaller footer and Pandora logo.
- The search text stays 16 px on purpose, otherwise iOS zooms the page when the field is tapped (see 0.32.0).
- Desktop and tablet (over 600 px) are unchanged. The block is the last rule set in `assets/styles.css`.
- Checked in headless Chromium with touch emulation at 320, 360, 390 and 430 px: no sideways scroll. Not tested on a real iPhone.

## [0.34.0] - 2026-10-25
### Fixed
- The genre switcher, the per page selector, the pager and the snapshot picker had a different color from the rest of the glass (table, search, top bar, status chip). A rule from the time when the snapshot picker was sticky gave every `.picker` an 82 percent surface fill, while the other glass elements use the standard fill (6 percent, 18 percent on touch screens). The rule is removed, so every glass surface now has the same fill, in light and dark. The selected item inside a picker keeps its own lighter pill.
- Checked in headless Chromium with touch emulation (390 px, light and dark): computed fill is the same on the top bar, status chip, genre switcher, search, per page selector, pager and table. Not tested on a real iPhone.

## [0.33.0] - 2026-10-25
### Fixed
- The search field stuck out past the right edge of the screen on phones. A search input has a built-in width of about 20 characters, and with the 16 px text from 0.32.0 that width kept the field from shrinking to the column. `.search` now has `min-width:0` and the input has `width:100%`.
- Checked in headless Chromium with touch emulation at 320, 360, 390 and 430 px: the search field, the per-page picker and the table all stay inside the column and the page has no sideways scroll. Not tested on a real iPhone.

## [0.32.0] - 2026-10-25
### Fixed
- iPhone zoomed the page in when the search field was tapped (Safari zooms any field with text under 16 px). The search field text is now 16 px, so the page no longer changes scale on focus.
- Pull to refresh now starts only when the finger touches down in the top strip of the screen (150 px) with the page at scroll position 0. A pull that starts lower, over the list, is ordinary scrolling.
- The page no longer scrolls while the refresh gesture is active or while the page is refreshing (touchmove is cancelled and `html` gets the `ptr-lock` class until the reload). The old scroll listener in `assets/pull.js` is removed because the gesture now holds the touch until the finger lifts.
- Not tested on a real iPhone, only a syntax check of `assets/pull.js`.

## [0.31.0] - 2026-10-25
### Fixed
- The site saved to the iPhone home screen kept showing an old version. Two fixes: every stylesheet and script URL now carries the site version (`?v=0.31.0`), and a new `assets/update.js` compares the version of the open page with `version.json` (fetched past all caches) on load and when the app returns to the foreground, then reloads once if they differ.
- `version.json` is new. `privacy.html` lists the one sessionStorage key used to avoid reload loops.
- Release rule: the version must now be changed in `version.json`, the `?v=` on every asset URL, the `ledgertone-version` meta tag and the footer line, together with the top entry here.
- Not tested on a real iPhone. Home screen copies that are older than this version still need one manual refresh (pull down, or remove and add the shortcut again).

## [0.30.0] - 2026-10-25
### Added
- Genres: Phonk, Drift Phonk, Brazilian Phonk. A glass switcher under the title; the title, the page title, the status chip, the ranking and the snapshot list all follow the chosen genre. Each genre has its own snapshots (`genre` field in `data/snapshots.js`, genre list in `genres`). Deep links: `#drift-phonk`, `#brazilian-phonk`.
- A genre without snapshots shows the empty state "The first <genre> snapshot is not published yet". No data was invented for the new genres.
### Changed
- The three sample snapshots are tagged `genre: "phonk"`. About page intro names the three genres.
- Not checked in Safari or Firefox, only headless Chromium.

## [0.29.0] - 2026-10-25
### Added
- Pull to refresh on touch screens (`assets/pull.js`, loaded on every page). A glass round indicator drops under the top bar while you pull and the page reloads when you release past the threshold. It replaces the browser's own pull to refresh.
- Guards against false triggers: touch only, one finger, only from scroll position 0, must be mostly vertical and downward, ignored on the search field, snapshot pickers and cookie banner, fires only on release past about 64 px of indicator travel (about 115 px of finger travel).
- No data is stored.
- Tested with emulated touch in headless Chromium only, not on a real phone.

## [0.28.0] - 2026-10-25
### Added
- Search by artist name above the ranking (ignores case and accents). Ranks stay the real ones from the snapshot while searching.
- Pages in the ranking, with a Prev, page numbers, Next bar under the table and a "Showing X to Y of N" line.
- Per-page selector: 10, 25, 50 or All. Default is 10. The choice is kept in memory only, nothing is stored.
- Not checked in Safari or Firefox, only headless Chromium.

## [0.27.0] - 2026-10-25
### Changed
- "Earlier snapshots" is always open (no toggle), still at the bottom under the table.
- The line above the table is shorter: "Pandora snapshot · date · N artists". The sample note is dropped there because the chip at the top already says "Sample data, not real".
- Site name in the header is smaller (1.2 rem).

## [0.26.0] - 2026-10-25
### Changed
- Home page title is now "Top Phonk Artists on Pandora" (h1, page title, social titles). The "ranked by verified streams" phrase and the intro paragraph under the title are removed.
- The snapshot picker moved below the ranking table into a closed "Earlier snapshots" block and is no longer sticky. It stays hidden when there is only one snapshot.
- `assets/og-image.png` still carries the old wording and needs a new image.

## [0.25.0] - 2026-10-25
### Changed
- Liquid Glass is richer (owner request). Chromium refraction: smoother bend profile, wider bezel, and a faint color fringe at the rim (one displacement per color channel). All browsers: a thin specular rim ring (bright top left and bottom right, brighter near the pointer on hover), inner edge light and a softer, deeper shadow. Fill and blur values are unchanged.
- Not tested in Safari or Firefox, only headless Chromium, light and dark.

## [0.24.0] - 2026-10-25
### Changed
- Places 1 to 3 in the ranking show a gold, silver and bronze round badge instead of a plain number.
- Artist names are no longer underlined.
- Ranking rows are taller (cell padding 13 px, avatar 36 px). Rank column widened to fit the badge.
- Not checked in a browser in this change, only code checks.

## [0.23.0] - 2026-10-25
### Added
- SF Pro Rounded (Regular, Medium, Semibold, Bold, `.woff`, supplied by the owner) in `assets/fonts/`, with `@font-face` rules and preloads for Regular and Medium.
### Changed
- Body text and the interface now use SF Pro Rounded (`--sans`): paragraphs, long-form pages, buttons, nav links, snapshot picker, chips, ranking table, cookie banner, footer.
- Headings (`h1`, `h2`, `h3`, definition terms in the method block) stay in Neue Machina via the new `--display` variable. The site name stays in New York.
- Neue Machina Regular and Medium are no longer used by any text but their files and `@font-face` rules are kept (owner decision). Preload of Neue Machina Regular replaced by SF Pro Rounded Regular and Medium.
- `AGENTS.md` type rule and `assets/fonts/README.md` updated.
- Not checked in a browser in this change, only code checks.

## [0.22.0] - 2026-10-25
### Fixed
- Site name in the header looked like a generic serif instead of New York. The browser picked the low-contrast text cut automatically (optical size axis); `.brand` now uses the display cut (`font-optical-sizing:none`), weight 500, size 1.375 rem.

## [0.21.0] - 2026-10-25
### Changed
- Rankings button removed from the top bar on every page (the site name links home).
- Site name in the header is lighter (New York, weight 400).
- Phone layout, checked in headless Chromium at 390 px: the ranking table uses fixed columns so artist names no longer break letter by letter; the "Streams on Pandora" header wraps to two lines; the snapshot label is hidden visually on narrow screens so more dates fit; smaller hero spacing and lede; smaller cookie banner.
- Privacy page: the two data tables were wider than a phone screen and made the whole page scroll sideways. On phones each row is now a stacked block with labels (`data-label`).
- The sticky snapshot picker has a denser fill so text under it stays readable.

## [0.20.0] - 2026-10-25
### Added
- Pandora logo (supplied by the owner, `assets/pandora-logo.png`) in the "Streams on Pandora" column header.
### Removed
- The change versus the previous snapshot under each artist name.

## [0.19.0] - 2026-10-25
### Added
- Site version line in the footer of every page (`<p class="ver">`).
### Changed
- `AGENTS.md` rule 5 and `CLAUDE.md`: archive name ALWAYS carries site name and version (`ledgertone_github_io_vX.Y.Z.zip`, never `site.zip`), and the footer version must match the top entry here.

## [0.18.0] - 2026-10-25
### Changed
- Rankings are a compact table in one glass panel: rank, small avatar with the artist name and the change vs the previous snapshot, streams on the right. One row is about 50 px, same layout on phones. Rank bars removed.
- "Open on Pandora" button removed, the artist name is the link.
- Fixed: the class `.rk` was used for both the rank number and the rankings section, so the section text came out bold and muted. The section is now `.rks`.
- Not checked in a browser in this change, only code checks.

## [0.17.0] - 2026-10-25
### Changed
- The site is strict again (owner decision, rule restored in `AGENTS.md`). Background picture removed: glow fields, film grain, rings, and the hero star.
- Controls are smaller and quieter: 36 px visible height with a 44 px hit area, Medium weight, 14 px text, solid accent primary button, no colored glow. Glass lost its magenta glow and iridescent sheen.
- Not checked in a browser in this change, only code checks.

## [0.16.0] - 2026-10-25
### Changed
- Rankings moved to the home page; `rankings.html` removed (also from the sitemap). Nav and footer "Rankings" point to `index.html`. Hero buttons and the staff drawing removed.
- Site name in the header uses New York (`assets/fonts/NewYork.woff`).
- Site icon: `favicon.ico`, `assets/icons/favicon-32.png` and a white `-dark` variant. Apple Home Screen icon: `apple-touch-icon.png` (180 px) and `apple-mobile-web-app-title`.
- Glass on phones: refraction (`assets/glass.js`) now runs only with a mouse; touch devices get a stronger blur and sheen from CSS, and the highlight follows taps.
- Not checked in a browser or on a device in this change, only code checks.

## [0.15.0] - 2026-10-25
### Changed
- New look from the owner's references: Y2K holographic glow. Dark theme is near-black violet with violet, cyan, magenta, and blue glow fields and a small peach field; light theme is a pale lavender version. Film grain over the background (`html::after`, inline SVG noise, no request).
- Glass cards, rows, bar, and buttons get a violet and magenta glow and a faint iridescent sheen. Primary button and cookie Accept are gradient glass with a glow.
- Rank bars use a cyan to violet to magenta gradient with a glow.
- Hero: slowly turning chrome star with a glow behind it (hidden under 720 px). Second half of the h1 uses a holographic gradient.
- Status chip, picker label, snapshot line, and "streams on Pandora" are small uppercase with wide tracking.
- `theme-color` and `theme.js` bar colors updated to the new backgrounds.
- `AGENTS.md`: "Strict and restrained" and "Color budget" rules replaced by the Y2K holographic glow rule (owner decision). Heading size caps unchanged.
- Not checked in a browser in this change, only code checks.

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
