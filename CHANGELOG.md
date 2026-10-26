# Changelog

Format follows Keep a Changelog. Dates are YYYY-MM-DD.

## [1.0.0] - 2026-10-26
### Fixed
- Phones (owner report): the search field had no entrance animation on page load. Cause: on a phone (up to 700 px) `.tools` is `display:contents` (v0.86.0), so it has no box of its own and `reveal()` in `assets/motion.js` skipped it, and the search field inside it is not a direct child of the section. Now `reveal()` replaces a `display:contents` child of a section by its visible children, so the search field (and the "Per page" control, which enters when scrolled into view) enter like the other blocks: move and scale only, no opacity on glass (v0.82.4). Desktop is unchanged (the `.tools` box itself enters there).
- Checked in headless Chromium at 390 and 1280 px: the search field moves from 14 px down to its place on load on a phone, no console errors. Not seen on a real iPhone.
### Changed
- Version number (owner decision): the version after 0.99 is always 1.0.0. Only the version stamp and the fix above changed, no data and no page text.

## [0.99.0] - 2026-10-26
### Changed
- Archive rule (owner decision): the generated artist pages that did not change are no longer put into the archive, the owner always has them (AGENTS.md rule 17, rule 5 and `CLAUDE.md` adjusted). A version bump alone does not count as a change. New `scripts/pack.js` builds the archive (`Ledgertone vX.Y.Z.zip`, no `artist-media*.js`, unchanged artist pages left out by comparing with the previous archive with the version number ignored) and prints which page files the owner must delete.
- No page, style or script content changed, only the version stamp and the rules.

## [0.98.0] - 2026-10-26
### Changed
- Fonts (owner request): SF Pro Rounded and New York are always used and the text does not blink or jump while they load. `assets/theme.js` (loaded in every head, after the stylesheet) now holds a font gate: it hides the body with `visibility` (never `opacity`, glass blur) until the five font faces (SF Pro Rounded 400, 500, 600, 700 and New York) are loaded, then shows the page at once; after 2.5 s it shows the page anyway, and without JavaScript nothing is hidden (`.fw body{visibility:hidden}` in `assets/styles.css`). `font-display` is back to `swap` in all `@font-face` rules (`optional` from v0.95.0 could leave the page on a fallback font on a first visit). The preloads from v0.95.0 stay.
- Phones: the last row of the table (count line, then "Prev 1 2 ... 111 Next") redesigned: the buttons are spread over the full width of the row (Prev left, Next right), the current page is a 40 px round glass pill, the count is a small muted line above, 10 px side padding like the rows, nothing clipped at the bottom. Desktop unchanged.
- Checked in headless Chromium: body stays hidden while the font files are slowed by 0.8 s and appears with all five faces loaded, paging works inside the table, desktop keeps the pager under the table, no console errors. Not seen on a real iPhone.

## [0.97.0] - 2026-10-26
### Changed
- Home heading (owner request): only the genre name ("Phonk") is Bold now, "Top" and "Artists" are Medium, "on Pandora" stays the thinnest (Regular). Same color, weight contrast only. `index.html` (static heading), `assets/app.js` (heading on genre switch, new `.gn` span and `gh` class), `assets/styles.css` (`h1.gh`, so the headings of other pages are unchanged). AGENTS.md type rule updated.
- Checked in headless Chromium only.

## [0.96.0] - 2026-10-26
### Changed
- Phones only, up to 700 px wide (owner request): the count line and the page buttons ("Prev 1 2 ... 111 Next") are now the last row inside the table panel, under the last artist, separated by the same thin line as the rows. `assets/app.js` moves `#foot` into `#tbl` on a phone and back under the table on a wider screen (`matchMedia`, follows a window resize), `assets/styles.css` strips the separate glass pill from the pager there. Desktop and tablets above 700 px are unchanged.
- Checked in headless Chromium at 390 px and 1280 px only (position, resize back and forth, no console errors seen). Not seen on a real iPhone.

## [0.95.0] - 2026-10-26
### Changed
- Banned artist (owner request): "líue" removed from `data/unverified.js` and `data/links.js`, added to `banned` in `data/snapshots.js`, his page `liue.html` deleted, `data/artist-pages.js` and `sitemap.xml` rebuilt (AGENTS.md rule 8). `node scripts/check-banned.js` prints ok.
- Fonts (owner report: text jumped while fonts loaded): every `@font-face` in `assets/styles.css` uses `font-display:optional` instead of `swap`; `SFProRounded-Semibold.woff` and `NewYork.woff` are now preloaded in `index.html`, `about.html`, `404.html` (and so in every artist page). Not yet shrunk to woff2 or subset (no tools here); on a first visit with a slow connection the fallback font may stay until the next load.
- Search appearance: `favicon.ico` rebuilt with 16, 32 and 48 px; `assets/icons/favicon-192.png` linked in every head (Google wants a multiple of 48 px); the missing `apple-touch-icon.png` (180 px, from the 192 px icon) added; `alternateName` `ledgertone.github.io` added to the `WebSite` JSON-LD of the home page (`scripts/build-home.js`). The site name in Google may still read "GitHub" for a github.io subdomain, only a custom domain fixes it for sure.
- Structured data: `license` (CC BY 4.0, `https://creativecommons.org/licenses/by/4.0/`) added to the `Dataset` JSON-LD of every artist page (`assets/artist-page.js`), the optional field the Rich Results Test reported as missing. Licence chosen by the assistant, the owner may change it.
- Archive naming rule changed (owner decision): `Ledgertone vX.Y.Z.zip`, always the whole site (AGENTS.md rule 5 and `CLAUDE.md`). The owner shorthand "<name> - бан" is written down in `CLAUDE.md`.
- Note: the icon, font and licence changes of this version were first handed out as unnumbered patch archives that broke rules 5 and 9; this version replaces them.

## [0.94.0] - 2026-10-25
### Changed
- `assets/og-image.png` redrawn (owner request) in the current design, 1200 x 630: flat light page color, the staff and the note as on the site, the site name in New York, the title "Top Phonk Artists on Pandora" in SF Pro Rounded (Bold and Regular, as the home page heading), a glass chip "Snapshot ranking" and a glass bar with "Ranked by 28-day listeners" and the site address. The old wording is gone. No figures, no artist names, no Pandora logo (rule 4).
- No code, data or page text changed. Only the version stamp (`version.json`, the `?v=` suffixes, the `ledgertone-version` tag, the footer line).
- Rendered in headless Chromium from the site's own font files. Not seen in a real link preview (Telegram, Slack, Facebook cache old images for a while, a re-scrape may be needed).

## [0.93.0] - 2026-10-25
### Changed
- Performance fix for "Per page: All" (owner report: the iPhone froze). Cause: All built 2,774 rows at once (about 44,000 elements), and each row had two small glass link buttons with their own blur behind them, about 3,000 blurred layers.
- `assets/app.js`: rows are built in chunks of 40; the next chunk is added only when the end of the table gets within 1500 px of the screen (IntersectionObserver on a 1 px element after the table). The page count text ("Showing 1 to 2774 of 2774"), search, per-page buttons and the other genre work as before; browsers without IntersectionObserver build everything at once as before.
- `assets/styles.css`: a list of more than 60 rows gets the class `big`; there the small Spotify and Pandora buttons keep their look but lose the blur behind them and the large soft shadow. Lists of 25 and 50 rows look exactly as before. `.rks{overflow-anchor:none}` stops browsers from scrolling by themselves while rows are added.
- Measured in headless Chromium with the CPU slowed 4 times, phone size: pressing All took 659 ms of script work and 4.1 s until the next frames, 44,055 elements, 17 long tasks; now 25 ms, 0.1 s, 843 elements, 1 long task. Scrolling to the end still reaches all 2,774 rows (and all 1,886 in Brazilian Phonk). Not tested on a real iPhone or in Safari.
- The archive again leaves out the artist pages.

## [0.92.0] - 2026-10-25
### Changed
- Reverted v0.91.0 (owner request): on a phone the search field is separate from the main table again, with the gap between them as in v0.90.0. The CSS block of v0.91.0 is removed, nothing else changed.

## [0.91.0] - 2026-10-25
### Changed
- On a phone (up to 700 px) the search field is joined to the top of the main table as one panel (owner request): no gap, the search field has square bottom corners and the table square top corners. Computers are unchanged. CSS only.
- The archive again leaves out the artist pages (owner request).
- Checked in headless Chromium at 390 and 1280 px. Not seen in Safari or on a real phone.

## [0.90.0] - 2026-10-25
### Changed
- On a phone (up to 700 px) the page content starts lower under the fixed header (owner request): `.hero` and `.doc` top padding is now 120 px plus the safe area, so the title no longer crowds the header (home page gap was 30 px, text pages 50 px, now about 58 px on both). Computers are unchanged.
- Delivery: the archive of this version does not contain the artist pages (the owner already has them in the site folder, owner request). Those files are regenerated by `node scripts/build-all.js` on every version bump, so the copies in the owner's folder keep the older version stamp until they are replaced.
- Checked in headless Chromium at 390 px. Not seen in Safari or on a real phone.

## [0.89.0] - 2026-10-25
### Changed
- The text inside the "Has data" card ("Collected popular artists first ...") is removed (owner request), the card shows only the number and the bar again. The `hint` code and style are gone.
- More room between the elements of the ranking page (owner request): bigger gaps and padding for the genre switch, the meta line, the two cards, the search and per-page controls, the table rows and header, the page switcher and the "Earlier snapshots" block, on a computer and on a phone. Scoped to `.rks` and the hero, so the artist pages, About and Privacy do not change.
- Checked in headless Chromium at 390 and 1280 px. Not seen in Safari or on a real phone.

## [0.88.0] - 2026-10-25
### Changed
- The sentence "Data is still being collected. Only part of the artists is displayed." is removed everywhere (owner request), and the whole note under the cards is gone (`#note` removed from `index.html`, its code removed from `assets/app.js`).
- The explanation now sits inside the "Has data" card, under the bar: "Collected popular artists first. When the rest is collected, the ranking will most likely not change: they will probably show "Few" instead of a number." The text is the fourth item of the card in `drawStats` in `assets/app.js`; the "Verified" card has none.
- Correction of v0.87.0: its note said the bar "may never reach 100%". That was wrong, because "Has data" counts "Few" as a reading too (v0.70.0). The new text says what the owner meant: the ranking will most likely not change when the rest is collected.
- Checked in headless Chromium at 390 and 1280 px. Not seen in Safari or on a real phone.

## [0.87.0] - 2026-10-25
### Changed
- The note under the "Has data" and "Verified" cards now says the data is collected popular artists first, and that the bar may never reach 100% because the artists still missing are less popular and will most likely show "Few" instead of a number (owner request). Text lives in `index.html` (`#note`), shown for every genre like the old note.
- Checked in headless Chromium at 390 and 1280 px. Not seen in Safari or on a real phone.

## [0.86.0] - 2026-10-25
### Changed
- Logo text in the header is bolder (`.brand` font-weight 500 to 700, all pages).
- The chip "Latest Pandora snapshot: October 2026" is removed (owner request). `assets/app.js` hides the chip when there is nothing to warn about; it still shows "No snapshot published yet" and "Sample data, not real" when those apply. `index.html` and `scripts/build-home.js` write the chip as hidden and empty.
- On a phone (up to 700 px) the "Per page" control (25, 50, 100, 200, All) moves under the table and the page switcher; on a computer it stays next to the search field. CSS only: `.rks` becomes a column and `.tools` `display: contents` on a phone, the search field keeps its height (`flex: none`).
- Checked in headless Chromium at 390, 680 and 1280 px, no console errors. Not seen in Safari or on a real phone.

## [0.85.0] - 2026-10-25
### Changed
- Artist pages no longer hold figures or text (owner request: "change one line and every artist page changes, and the information is pulled from the database, not written into the page"). Every ordinary artist page (596 files) is now a 3.7 KB shell: head snippet, nav, footer, version tags and `<body data-artist="<key>">`. `assets/artist-page.js` fills title, description, Open Graph tags, JSON-LD and the whole content from `data/snapshots.js`, `data/unverified.js` and `data/links.js`, and every line of text comes from ONE new file, `data/artist-text.js` (English plus the Russian block for `settwor-ru.html`, with `{name}`-style fields). Change a line there and all pages show it on the next load, with no build and no page file touched (checked: the page files stay byte-identical).
- New `assets/ledger-core.js`: the ranking and place logic as one module used by the browser (artist pages) and by `scripts/lib/ledger.js` (node), so there is one implementation. `index.html` built before and after is byte-identical.
- `scripts/build-artist-pages.js` now writes shells, and static pages only for SETTWOR (`settwor.html`, `settwor-ru.html`, from the same renderer and text file, so they need `node scripts/build-all.js` after a text change). Flag `--static` writes every page static again: all 603 pages built that way are byte-identical to v0.84.0 apart from the version, so the new renderer gives the old output exactly.
- Trade-off accepted by the owner: a shell has no figures for search engines and AI answers that do not run JavaScript (the SETTWOR pages stay static). Title, description and JSON-LD are set by JavaScript, the static `<title>` of a shell is just "Ledgertone".
- AGENTS.md rules 1 and 13, Layout and `docs/DATA.md` updated.
- Checked in headless Chromium: all 596 shells render the same main content, title, description and JSON-LD as the v0.84.0 static pages (0 differences, scripts that animate the page switched off for the comparison), a test change of one text line showed on three pages with no page file changed, no console errors. Not seen in Safari or on a real phone.

## [0.84.0] - 2026-10-25
### Changed
- Brazilian Phonk unlocked (owner request): `pending: true` removed from the genre in `data/snapshots.js`, so its table is no longer dark and dimmed. The `.pending` CSS stays for any future genre.
- Large warning on the Brazilian Phonk tab (owner request): a glass panel with a red edge above the table, title "Under development", text that the section is under development, the information is raw and incomplete, only part of the artists has a 28-day Pandora reading and the data may contain mistakes. It comes from the new optional genre field `devwarn: { title, text }` in `data/snapshots.js`, rendered by `assets/app.js` into the new `#devwarn` element of `index.html` (hidden for Phonk and any genre without `devwarn`). The element has no opacity animation, so Safari keeps its glass. New styles at the end of `assets/styles.css`.
- Check of the owner's request "verify these artists as Brazilian Phonk": all 511 artists of the five playlist exports were already in the verified Brazilian Phonk roster (39 of them also in Phonk), none banned, none in the unverified list, so no artist data changed.
- Checked in headless Chromium (1280 and 390 px) and with node (data, build, banned check), not in Safari or on a real phone.

## [0.83.0] - 2026-10-25
### Added
- New listeners imported from `artistMonthly.json` (AGENTS.md rule 10, period 2026-09-27 to 2026-10-25, the same snapshot date as the existing snapshots). Verified base: 126 added, 0 changed, 71 unchanged, 8 without a reading. Unverified base: 329 added, 0 changed, 71 unchanged, 19 without a reading. Skipped: 6 not in our base (LONOWN, akiaura, IVOXYGEN, fam0uz, STM, shadowraze), 7 banned (RJ Pasin, Freddie Dredd, SLVG, Bearded Legend, Roland Jones, Daedra, Necroez). SETTWOR unchanged (23,000 in Phonk and Brazilian Phonk). `fits` entries skipped. Pandora links in `data/links.js`: 450 added, 0 changed, 149 same. Phonk now has 54 verified artists with a number in the snapshot, Brazilian Phonk 19. Rebuilt with `node scripts/build-all.js`: a new artist page and sitemap entry appears for every artist that got a reading. Node data checks only.

## [0.82.4] - 2026-10-25
### Fixed
- Glass textures jumping on load and reload, mostly on iPhone (owner report). Likely cause: the entrance animation in `assets/motion.js` faded the header, chips, cards, table rows and the cookie banner with `opacity`. Safari does not draw the backdrop blur of a glass element (or of glass buttons inside it) while an ancestor has an opacity below 1, so the buttons looked flat and then snapped to the real texture when the entrance ended. Now an element that is glass or holds glass enters by moving and scaling only, with no fade (new `glassy()` check, also for the below-the-fold reveal and the cookie banner); with reduced motion such elements just appear. Elements without glass fade as before. Checked in headless Chromium only (no console errors, no inline opacity on glass during the entrance), the Safari behavior is a diagnosis from known rendering rules, not tested on a real iPhone.

## [0.82.3] - 2026-10-25
### Changed
- The place on every artist page is now out of all artists of the genre, not out of the ranked ones (owner request): "place 8 of 2,774 artists in Phonk" instead of "8 of 38 ranked". The total is the same number as in the meta line on the home page (verified and unverified artists together, latest snapshot). The sentence adds that only the artists with a number (38 in Phonk) are ranked, so the figure is not read as 2,774 ranked artists. Cards, JSON-LD `variableMeasured` descriptions and the Russian page changed the same way ("место 8 из 2 774 артистов"). The place number itself did not change. A place is still left out of the sentence and the title when fewer than 3 artists have a number (Brazilian Phonk, card only: 1 of 1,886 artists). Node checks only.

## [0.82.2] - 2026-10-25
### Changed
- The whole ranking row is clickable and opens the artist page (owner request), not only the name. Rows of artists without a page stay as they were. The name remains the real link (keyboard, screen readers, no JavaScript), the Spotify and Pandora pills keep their own links, a click with Ctrl, Cmd, Shift or Alt, a non-primary button, or with text selected does nothing extra. Pointer cursor on those rows. Checked in headless Chromium only (desktop mouse and touch emulation), not on a real iPhone.

## [0.82.1] - 2026-10-25
### Fixed
- The "Per page" control no longer scrolls sideways on iPhone (owner report). It had `overflow-x:auto` from `.picker` and bounced or scrolled under the finger. It is now `overflow:hidden`, and on screens up to 360 px the buttons get smaller padding so all five sizes and the label fit (320 px: needed 312 px, had 278 px). Checked in headless Chromium at 430, 390, 375, 360 and 320 px, not on a real iPhone.

## [0.82.0] - 2026-10-25
### Added
- A page for every artist with a reading (owner request: "when an artist is clicked, his page opens, like with SETTWOR"). `scripts/build-artist-pages.js` now builds `<slug>.html` for every artist that has a 28-day listeners reading (a number or "Few") in any snapshot or in the unverified list: 142 artists today (71 verified, 71 unverified). Same layout, JSON-LD (WebPage, MusicGroup, Dataset, FAQPage), answer sentence, place per genre, snapshot history and four disclosures as `settwor.html`. English only: the Russian twin stays SETTWOR only (rule 1). An unverified artist gets one extra sentence that his genre is not verified and he may be listed by mistake. The owner disclosure stays on the SETTWOR page only. `settwor.html`, `settwor-ru.html` and the snippet are byte-identical to v0.81.0 apart from the version.
- `data/artist-pages.js` (generated): name key to page file, read by `assets/app.js`. Slugs come from the English name (accents and non-Latin letters dropped, a collision gets `-2`), the list is sorted by name so slugs stay stable. Goes into the archive (unlike `artist-media*.js`).
- `sitemap.xml` is now generated by the same script (home, all artist pages, SETTWOR hreflang pair, About, Privacy).
### Changed
- The artist name in the ranking opens the artist page (home table, rendered by `assets/app.js` and by `scripts/build-home.js`); the Pandora pill under the name still opens Pandora. Artists without a reading keep the name as a Pandora link. `ItemList` in the home JSON-LD points to the artist pages.
- AGENTS.md rules 4 and 13, Layout, `CLAUDE.md`, `docs/DATA.md` updated. Checked in headless Chromium (click from the home table opens the page, no console errors) and with node only, not seen in Safari or on a real phone.

## [0.81.0] - 2026-10-25
### Added
- Static ranking on the home page (owner request, "do all of it" for the search plan): `index.html` now holds the numbered Phonk rows (38 artists with a 28-day listeners number), the status chip, the meta line and an `ItemList` in the JSON-LD as plain HTML, generated by the new `scripts/build-home.js` from the data files (AGENTS.md rule 16). `assets/app.js` replaces it on load, so visitors with JavaScript see the same table as before. Checked in headless Chromium: the static rows and the rows `app.js` renders are identical (38 of 38, 0 differences), same status and meta text. Without JavaScript the search and paging controls stay hidden and the `noscript` text says what needs JavaScript. "Few" and "No data" rows are not in the static HTML.
- Snapshot history on `settwor.html` (owner request): a glass table with one row per snapshot and genre that has a reading for SETTWOR (month, date, genre, 28-day listeners, place), newest first. The place is counted inside that snapshot with the same logic as the home page. Today it has two rows, both from the snapshot of 2026-10-25 (Phonk place 8, Brazilian Phonk place 1), more rows appear with every new snapshot. The Dataset `temporalCoverage` becomes a date range once there are several dates. New CSS at the end of `assets/styles.css` (`.tbl.hist` and `.doc .tbl`, no new colors or effects).
- Russian twin of the artist page `settwor-ru.html` (owner request): same data and the same four disclosures, owner disclosure and non-affiliation footer in Russian, FAQ question "Сколько слушателей у SETTWOR на Pandora?", own title, description, canonical, `og:locale`, JSON-LD with `inLanguage: ru`. `hreflang` (en, ru, x-default) links in the head of both pages and in `sitemap.xml`, and a link between the pages. The cookie banner and the theme button labels are in Russian on this page only (`assets/consent.js` and `assets/theme.js` read `<html lang>`), same choices, Reject as prominent as Accept. `privacy.html` is unchanged: no new data is collected and no new tracker. Footer links that lead to English-only pages are marked "(English)".
- `docs/settwor-site-snippet.html` (owner request): a fragment for `https://settwor.github.io/` with JSON-LD (MusicGroup with `subjectOf` pointing to both Ledgertone pages, Ledgertone as an Organization with SETTWOR as founder) and a visible link. It holds no figures, so it does not go stale. Generated by `scripts/build-artist-pages.js`, pasted into the owner's site by the owner, nothing in this repository touches that site.
- `scripts/lib/ledger.js` (data loading and the ranking logic shared with `assets/app.js`), `scripts/build-all.js` (runs both build scripts).
### Changed
- AGENTS.md rule 1: the Russian twin page is the one exception to "everything is English" (owner decision). New rule 16 (static home ranking). Rule 13, Layout and "Before you finish" updated, `CLAUDE.md` and `docs/SEO.md` too.
- `scripts/build-artist-pages.js` now uses the shared module. The English page text and numbers are unchanged (place 8 of 38 in Phonk, 1 of 1 in Brazilian Phonk).
- `sitemap.xml`: `settwor-ru.html` added, `xhtml:link` alternates, `lastmod` 2026-10-25 for the home page and both artist pages.

## [0.80.0] - 2026-10-25
### Added
- "How Ledgertone started" section on `about.html` (owner request): SETTWOR noticed by chance that some other phonk artists had fewer listeners on Pandora than he did, wanted to check it, found no information about listeners on Pandora, checked the numbers by hand, and later decided to build a site where the information can be kept and checked more accurately. Written in the third person like the rest of the page. "Some other artists" is used instead of "other artists" because the ranking shows several artists above him.

## [0.79.0] - 2026-10-25
### Added
- Disclosure of who runs the site (owner request): new "Who runs Ledgertone" section on `about.html` and a short matching paragraph on `settwor.html`. It says Ledgertone is run by SETTWOR, who is also listed in the rankings, that he checks the accuracy of the data by hand, that the aim is a useful and honest reference, and that every artist is placed by the same rule (28-day listeners number in the snapshot). The JSON-LD of the SETTWOR page names the artist as `founder` of Ledgertone in the Dataset `creator`.

## [0.78.0] - 2026-10-25
### Changed
- `settwor.html` (owner request): the page now states SETTWOR's place, computed by `scripts/build-artist-pages.js` exactly as the home page does (latest snapshot of the genre plus unverified artists with a number, by listeners, then name): place 8 of 38 ranked artists in Phonk, place 1 of 1 in Brazilian Phonk. The place is in the answer sentence, in the page title ("23K listeners, No. 8 in Phonk"), in the JSON-LD (Dataset `variableMeasured`) and in four glass cards (listeners, snapshot, place per genre, existing `.stats` and `.stat` styles, no new CSS). A place out of fewer than 3 ranked artists stays in the cards but is left out of the sentence and the title.
- Link to the owner's site `https://settwor.github.io/` on the page ("SETTWOR website") and in the JSON-LD (`url` and `sameAs` of the MusicGroup), so search engines can tie the artist to his own site.

## [0.77.0] - 2026-10-25
### Changed
- Banned (owner request, "RS Pasin is still shown in the list"): the name that was on the page is "RJ Pasin" (14K, unverified list), no "RS Pasin" existed in any data file. RJ Pasin is in `banned` now and is removed from `data/unverified.js` and `data/links.js`. "RS Pasin" stays in `banned` too, in case it is a separate name. If the owner meant only RS Pasin, take RJ Pasin out of `banned` and restore the two lines from v0.76.0.

## [0.76.0] - 2026-10-25
### Added
- `settwor.html` (owner request: make search and AI answers able to quote the SETTWOR figure). Static page with the answer in plain text ("SETTWOR had 23,000 listeners over 28 days on Pandora in the Ledgertone snapshot of October 2026"), the snapshot date, links to Pandora and Spotify, the method note, and JSON-LD (WebPage, MusicGroup, Dataset, FAQPage). Own title, description, canonical, Open Graph tags, `max-snippet:-1`. In the sitemap and linked from every footer.
- `scripts/build-artist-pages.js`: generates the page from `data/snapshots.js` and `data/links.js` (latest reading per genre), no number is typed by hand, it fails if the artist has no reading or is banned. AGENTS.md rule 13, `docs/SEO.md` updated.

## [0.75.0] - 2026-10-25
### Changed
- Ban now deletes and blocks (owner request). SLVG (65 listeners) and Bearded Legend (6,900 listeners) are removed from the October Phonk snapshot in `data/snapshots.js`, so no banned artist is left in any data file. Before, old readings stayed in the file and only the page hid them.
- `assets/app.js` matches banned names by the page key (lowercase, accents stripped) in the snapshots, the rosters and the unverified list, so a spelling with accents cannot slip through.
- AGENTS.md rule 8, `docs/DATA.md` and `CLAUDE.md`: a ban removes the name from rosters, snapshots, `data/unverified.js` and `data/links.js`, and the name is never added again by any import.
### Added
- `scripts/check-banned.js`: exits with an error if a banned name is still in rosters, snapshots, the unverified list or the links. Part of the "Before you finish" checks.

## [0.74.0] - 2026-10-25
### Changed
- Dark theme (owner request, "ugly"): the near-black page is now a deep violet (`--bg` #120E26, was #07050F), the glass tint a lighter violet (`--surface` #2A2058), the white rims and row lines are softer (`--edge` .26 to .14, `--line` .16 to .09, specular ring .7 to .45). Same glass fill and blur as before. `theme-color` meta tags and `theme.js` follow the new color.
- Banned (owner request): RS Pasin, Roland Jones, SLVG, Necroez, Daedra, Bearded Legend, Sinitizer are in `banned` now. Removed SLVG and Bearded Legend from the Phonk roster, Roland Jones, Necroez and Daedra from `data/unverified.js`, and their entries from `data/links.js`. The old Bearded Legend and SLVG readings stay in the October snapshot file untouched, the page drops them at run time.
- Genres (owner request): blueberry is in the Phonk and the Brazilian Phonk roster, OXWAVE and V21 in the Phonk roster (all three were in the unverified list, left untouched, the page hides them there). Phonk roster 375 names, Brazilian Phonk 512.

## [0.73.0] - 2026-10-25
### Added
- `assets/motion.js`: a living interface (owner request), built on the Apple Design skill. One small spring engine (no library), critically damped by default, interruptible, velocity is kept when a motion is redirected. Everything answers on pointer down: buttons, links, pills, theme button, brand, rank medals, the artist name, cards, headings and text, table numbers, the search field (breathes on focus), keyboard Enter and Space. Mouse and pen also get hover (controls grow and lean toward the pointer, names slide, cards lift). Touch gets press only.
- Table rows: a highlight lens glides from row to row under the mouse, brightens on press, and a ripple spreads from the touch point (touch and mouse). The picture of an artist can be grabbed and dragged 1:1 (soft rubber band at the edge, tilt), and on release it springs back with the finger's speed (the only bounce on the site). Pressing and sliding away cancels a press, coming back resumes it.
- Spotify and Pandora pills: the arrow shoots out on click. Theme button: the icon turns in. Genre, per page, snapshot and page pickers: one indicator glides to the chosen button (it keeps its speed if you click again mid-move).
- Entrances: the top bar, hero, cards and the table settle in on load, below-the-fold blocks as they scroll into view, rows on every render (first 30 only), cards on every render. The cookie banner comes in and flies out the same way.
- Reduced motion: no scale, slide or spring, a short opacity change for feedback and fades for entrances.
### Changed
- CSS transitions and `:active` scales of the controls are handed over to `motion.js` (`html.mo`), the old rules stay as the fallback. Artist pictures cannot be dragged as files (`dragstart` blocked). Only `transform` and `opacity` are animated.
- Phonk roster: 11 more names from the owner's playlist export "Chill old phonk" (49 tracks, 43 unique artists): CYREX, DJ Jacob, ROMANE, ZERXMANE, KILLOMANE, LXSTGRED, CHAVØMANE, EVVORTEX, lilbubblegum, Yung Gravy, TZAR. 30 were already in the roster, Oliver Tree skipped (banned), "Fast & Furious: The Fast Saga" skipped (a soundtrack credit, not an artist). Six of the 11 (DJ Jacob, ROMANE, ZERXMANE, KILLOMANE, EVVORTEX, TZAR) were in the unverified list, which is left untouched, the page already hides an unverified name that is in the verified base. The Phonk roster now has 374 names, names only, no numbers.

## [0.72.0] - 2026-10-25
### Changed
- Spotify buttons now open the Spotify app (owner request). Phones and tablets keep the https link `open.spotify.com/artist/<id>`, which the installed app takes over by itself (universal link on iOS, app link on Android). On desktop a plain click launches the app through `spotify:artist:<id>`, and if the browser never left the page within 2 seconds (no app installed) the web page opens in a new tab. Ctrl, Cmd, Shift, Alt and middle clicks keep the normal https behavior. No new data, no new requests, `privacy.html` unchanged.

## [0.71.0] - 2026-10-25
### Changed
- Artists with a "Few" reading now get a place in the table (owner request): they follow the numbered artists, in the order they were already listed, with places continuing the count (for Phonk: 47 numbered, then places 48 to 149 for "Few"). This matches the "Has data" card (149). Rows with "No data" still show a "-". Applies to verified and unverified artists alike.

## [0.70.0] - 2026-10-25
### Changed
- The meta line now counts all artists, verified and unverified together (for example "October 2026 · 2,775 artists"). The separate "with no data" and "unverified" counts are gone from that line, the new cards below show the coverage instead.
### Added
- Two coverage cards between the meta line and the search row (owner request): "Has data" (artists with a number or with "Few", out of all artists) and "Verified" (verified artists out of all artists). Each card is glass-flat with a large value, the total in muted text and a thin accent bar (animated with `transform` only, not when reduced motion is on). Shown for the latest snapshot only, two columns on phones too. Computed in `assets/app.js` from the same lists the table uses, no new data.

## [0.69.0] - 2026-10-25
### Changed
- Table header (owner request): the full label "28-day listeners on Pandora" is back, in two lines on every screen. Wide screens: "28-day listeners on" on line 1, the Pandora logo on line 2 (column 10.5 rem, no wrap). Phones: "28-day listeners" on line 1, "on" plus the logo on line 2 (smaller header text, 9 px, column 6.5 rem). The word "listeners" is visible again. The header is 42 px high on phones, rows keep 69 px, the Spotify and Pandora buttons stay side by side down to 360 px.

## [0.68.0] - 2026-10-25
### Changed
- `about.html`, "Collected by hand": the text now says only that every figure is collected by hand from the artist's Pandora profile (owner request). Nothing else about how the collection is done. The same rule is added to `AGENTS.md` rule 3.
- Phones, less crowded rows (owner request): the Spotify and Pandora buttons are smaller and quieter (muted text, 18 px high), there is more space between the name and the buttons, rows have a little more padding (69 px at 390 px, 91 px under about 350 px where the buttons stack) and the picture is 40 px.
### Removed
- The Other genre (owner request): its entry is gone from `genres` in `data/snapshots.js`, so the genre switcher shows only Phonk and Brazilian Phonk. The `other` group in `data/unverified.js` is left in the file, untouched, and is not shown anywhere.

## [0.67.0] - 2026-10-25
### Changed
- Table header (owner request): "28-day listeners on Pandora" is now "28-day" plus the Pandora logo. The word "listeners" stays in the markup for screen readers (`.hl`, visually hidden). One line on wide screens, two lines on phones, so the header no longer takes three or four lines and no longer pushes the column wider.
- The `#` in the header and the rank numbers and medals are centered in their column with no side padding, so the `#` sits exactly over the medal and the digits (checked at 1280, 390 and 320 px: same center for the header and every row). On phones the medal was shifted 2 px to the right before, because the padded cell was narrower than the medal.

## [0.66.0] - 2026-10-25
### Changed
- The small "Spotify" text link under the artist name is now two small glass pill buttons, Spotify and Pandora (owner request). Each button shows only when its link exists: Spotify from the id in `data/links.js`, Pandora from the same address the artist name links to (`profileUrl` or `p`). Glass-flat style (no refraction filter per row), label plus a small up-right arrow, 44 px hit area, press feedback, works in light and dark and with reduced transparency and increased contrast.
- Phones: the listeners column is narrower (5.75 rem), the buttons drop the arrow and sit side by side, so rows keep the height of v0.64.0 (60.5 to 61 px at 390 px). The red "Not verified" pill now sits to the right of the name on the first line. Under about 350 px the two buttons stack and rows get taller.
### Added
- SETTWOR Spotify id `5BD8hsAGp1fwJKcnlQWjGf` in `data/links.js` (from the owner's artist link, the tracking part after `?si=` is dropped). SETTWOR now has both buttons.

## [0.65.0] - 2026-10-25
### Added
- Phonk roster: 70 more artist names from the owner's two Spotify playlist exports "OG Phonk Vibes Best of 2020-2022" (234 tracks) and "2020-2022 PHONK" (79 tracks). Together 191 unique artists (collaborations split at `;`): 118 were already in the roster, 2 banned names skipped (Freddie Dredd, Oliver Tree), "Fast & Furious: The Fast Saga" skipped (a soundtrack credit, not an artist). The Phonk roster now has 363 names. Names only, no listener numbers.
- Of the 70, 7 are also in the Brazilian Phonk roster (ANDROMEDA, Rushex, PHOROMANE, SZEKTAS, SXCREDMANE, Baly & Shem, 0to8) and stay there too. 16 were in the unverified list (14 Phonk, 2 Brazilian Phonk: GhostyPlaya, LaughingSkxll): `data/unverified.js` is left untouched and the page already hides an unverified name that is in the verified base, so they now show as verified Phonk rows with `No data`.

## [0.64.0] - 2026-10-25
### Changed
- The unverified note is prettier (owner request): a glossy red pill with a thin light edge, soft red glow and a small white "!" mark. The red is brighter (gradient `#FF5A70` to `#D90E2E`), the text is white bold with a light shadow so it stays legible.
- On wide screens (over 700 px) the text "Genre not verified, may be here by mistake" stays on one line, to the right of the name.
- On phones (700 px and narrower) the pill shows the short text "Not verified" on the same line as the Spotify link, and the full text is in the tooltip (`title`). A flagged row now has exactly the height of every other row (checked at 390 and 320 px: 60.5 to 61 px for all rows).
- On phones an artist name stays on one line and is cut with an ellipsis when it is too long (the full name is in the tooltip, set on every name), otherwise long names such as "Fast & Furious: The Fast Saga" made their row taller than the rest.

## [0.63.0] - 2026-10-25
### Changed
- The note "Genre not verified, may be here by mistake" is now a small red pill with white bold text (owner request, style of the owner's example button), narrow (at most 9.5 rem), the text wraps to two or three lines. Red gradient from `#DC2F47` to `#B80F29`, white text stays legible in light and dark.
- On screens wider than 600 px the pill sits to the right of the name, in the row of the picture, not under the name. On phones it sits under the name and the Spotify link.
### Fixed
- On phones the long note squeezed the artist picture. The picture no longer shrinks (`.av{flex:none}`) and on phones the row is a two column grid, so the note cannot take width from it.

## [0.62.0] - 2026-10-25
### Changed
- `scripts/fetch-artist-images.js` asks what to do (owner request). Started in a terminal without options it asks two questions: search only new pictures or all pictures again, and for which genre (one genre or all genres). The options `--genre <id>`, `--all-genres`, `--new` and `--refresh` skip the matching question, and without a terminal the old defaults apply (only new, first genre).
- Rate limit fix: the old script showed "waiting 120 s" because it cut Spotify's real wait time to 120 s and retried too early. Now requests are spaced 350 ms apart (slower after every rate limit answer), the real wait time is honored up to 5 minutes, and a longer wait stops the run: progress and the review file are saved, the script says how long to wait and exits. Running it again with "only new pictures" continues.
- Fewer requests: an artist with a Spotify id in `data/links.js` (or in `scripts/spotify-ids.json`) is fetched by id, one request instead of up to two searches. An id from `data/links.js` is used only when the artist's name on Spotify equals ours, otherwise the name search runs as before. An artist in two genres is looked up once per run.
- Tested with a mock Spotify only (menus, short and long rate limit, all genres), not against the real API.
### Added
- A Windows launcher `run-fetch-artist-images.bat`, delivered next to the archive and kept outside the repository because it holds the Spotify keys. `.gitignore` now ignores `*.bat`. Not in the archive.

## [0.61.0] - 2026-10-25
### Added
- Links for every artist (owner request): new file `data/links.js` with 4,059 entries. The artist name is now the link to the artist's Pandora page (153 artists in the Phonk table, from `pandoraUrl` of `artistMonthly.json`), and a small "Spotify" link under the name opens the artist on Spotify (about 4,000 artists, from `spotifyId` of `artistBase.json`). A link shows only when we have it, nothing is guessed. Hosts are checked in `assets/app.js` (`pandora.com`, `open.spotify.com`). Works for verified and unverified rows alike.
- Gaps: SETTWOR has a Pandora link but no Spotify id (the file has none), and about 520 verified artists, mostly Brazilian Phonk roster names, have no links yet because neither file has them.
- New hard rule 12 in `AGENTS.md` and a "Links" section in `docs/DATA.md`. The artistMonthly import now also updates the Pandora link, the artistBase import also stores the Spotify id.
### Fixed
- Names with Japanese letters (for example Dxrk with katakana) matched nothing because the link key was built with a stricter normalization than the page uses. The key now strips only combining marks U+0300 to U+036F, as `assets/app.js` does.

## [0.60.0] - 2026-10-25
### Changed
- Unverified artists with a listeners number now sit in the common table among the verified artists, ordered by listeners, and get a place number (owner request). Each keeps the red note "Genre not verified, may be here by mistake". Unverified artists with `Few` or no reading follow the verified `Few` and `No data` rows, all sorted by name. Medals (places 1 to 3) can now go to an unverified artist.
- The data is still in two separate files (`data/snapshots.js` and `data/unverified.js`), only the display is merged in `assets/app.js`. Rule 11 in `AGENTS.md` updated.

## [0.59.0] - 2026-10-25
### Changed
- Drift Phonk is always plain Phonk (owner decision): the Drift Phonk tab and group are gone, its 1,614 unverified names moved into the `phonk` group of `data/unverified.js` (Phonk unverified is now 2,426). The `#drift-phonk` link opens Phonk.
- New listeners from the owner's `artistMonthly.json` (170 artists, 2026-09-27 to 2026-10-25), same rules as before (AGENTS.md rule 10), now over both bases. Verified Phonk: 8 artists added with `Few` (NØCTRIS, qonran, glexks, BLXCKBUSTA, sapphyre, mxnarch, Skidz, Sensi Affect), 67 rows are the same and were left untouched, no number changed, SETTWOR was already entered. Unverified: 87 artists got a reading in `data/unverified.js` (81 Phonk and Brazilian Phonk names plus the 6 in Other), 8 with a number, for example RJ Pasin 14K and LONOWN 5K. Skipped: Freddie Dredd (banned), 9 artists with no reading (Funk Tribu, Luga, Kim, SLXEPING TOKYO, CASPER, HR, Clovis Reyes, Nakani, Goos). Nobody was skipped as unknown, every artist of the file is in one of the two bases.
- Unverified rows show their reading in the listeners column (numbers first, then `Few`), with no rank and the same red note. They stay in a separate base and are never mixed into the verified ranking. `data/unverified.js` gets a `readings` field with the period.
- Rules for the next AI updated (owner request): AGENTS.md rule 10 now includes the owner's own wording and covers the unverified list, rule 11 says Drift Phonk is Phonk and describes readings in the unverified list, `docs/DATA.md` and `CLAUDE.md` match.

## [0.58.0] - 2026-10-25
### Added
- Unverified artists (owner request): new file `data/unverified.js` with 3,808 names from the owner's `artistBase.json`, names only: Phonk 812, Brazilian Phonk 1,376, Drift Phonk 1,614, Other 6 (Angelcore 2, Emo Rap, Jeffrey Epstein Edit Songs, Bemani, Dota Rap; the source genre is shown in the red note). Skipped: 252 artists already in our verified base and Freddie Dredd (banned).
- The home page shows them in the same table after the verified rows of the genre, with `No data`, no rank, and a red note "Genre not verified, may be here by mistake" under the name. The meta line counts them separately ("812 unverified"). Search covers them too. They are never merged with `data/snapshots.js` and never ranked (`assets/app.js` also drops any name that is in the verified base or banned).
- Two new genre tabs, Drift Phonk and Other, with unverified artists only and the dimmed `pending` table. Drift Phonk was removed in v0.36.0 and is back only because of this list.
- Numbers, `profileUrl` (musicmetricsvault) and `imageUrl` from `artistBase.json` are not used: they are Spotify and third party figures, not Pandora 28-day listeners.
- New hard rule 11 in `AGENTS.md`, section "Importing artistBase.json" in `docs/DATA.md`, a pointer in `CLAUDE.md`: an archive plus `artistBase.json` means import the unverified names this way.
### Changed
- `.tbl.pending` dims the header, rank, name, picture and listeners cells instead of the whole table, so the red note keeps its color. Looks the same for verified rows.

## [0.57.0] - 2026-10-25
### Added
- New listeners from the owner's `artistMonthly.json` (131 readings, period 2026-09-27 to 2026-10-25, same snapshot date as before). Phonk: 11 artists added (g3ox_em 27K, SETTWOR 23K, Soudiere 1.6K, Apoc Krysis 59, GXNRC 4, and few: HOSPICEMANE, Mista Playa, 5admin, safetypleace, gelowler, 6 Senz). Brazilian Phonk: SETTWOR added (23K). SETTWOR is entered 100 percent, in both genres that list him.
- 55 existing rows are the same as in the file and were left untouched, no number changed. 67 artists of the file are not in our base and were skipped, Freddie Dredd is banned and skipped, 4 roster artists have no reading in the file (Funk Tribu, Luga, Kim, SLXEPING TOKYO) and stay as they were. Collaboration entries (`fits`) are not used.
- New hard rule 10 in `AGENTS.md`, a new section "Importing artistMonthly.json" in `docs/DATA.md` and a pointer in `CLAUDE.md` (owner request): when the owner sends only an archive and an `artistMonthly.json`, the agent imports the listeners with these rules: SETTWOR always, others only if already in our base, different numbers replaced, same numbers untouched, unknown artists skipped.

## [0.56.0] - 2026-10-25
### Changed
- The meta line above the table no longer says "Pandora snapshot" or "28-day listeners" (owner request). It reads "October 2026 · 293 artists · 241 with no data". The status chip and the column header are unchanged.
- Listener counts are printed in full with commas, 144,000 instead of 144K (owner request). The `text` field in the data stays for reference and is not printed.

## [0.55.0] - 2026-10-25
### Added
- Pictures for Brazilian Phonk artists (owner request) live in their own file, `data/artist-media-brazilian-phonk.js` (`window.LEDGERTONE_MEDIA_BRAZILIAN_PHONK`). `scripts/fetch-artist-images.js` now works for one genre per run: without `--genre` it reads the Phonk names and writes `data/artist-media.js` as before, with `--genre brazilian-phonk` it reads the 511 Brazilian Phonk names and writes only the new file (and `scripts/artist-images-review-brazilian-phonk.txt`). A run for one genre never touches the other genre's file.
- `assets/app.js` and `index.html` load the new file. The Brazilian Phonk page looks in its own file first and then in the Phonk file for artists that appear in both lists. Missing files are fine, rows show initials monograms.
- Rule 9 now covers every `data/artist-media*.js`: none of them goes into an archive, and no empty placeholder is created. This archive has neither file, so the Brazilian Phonk pictures appear after the owner runs the script and uploads the new file. Checked with a mock Spotify only, not with real credentials.

## [0.54.0] - 2026-10-25
### Changed
- The site measures 28-day listeners on Pandora, not streams (owner correction). The column header reads "28-day listeners on Pandora", the ranking is sorted by listeners, the data field `streams` is now `listeners` (with optional `text`, the figure as the source shows it, for example 144K), and every page, meta description, caption and doc says listeners.
- The 28-day readings from `artistMonthly.json` are now real snapshots (2026-10-25, period 2026-09-27 to 2026-10-25) instead of the small line under the artist name, which is removed together with the top-level `listeners` block. Phonk: 34 artists are ranked with a number, 18 more show `Few` (the source shows only "few listeners"), the rest show `No data`. Brazilian Phonk: 3 artists show `Few` and no one has a number, so its table stays dimmed (`pending`).
- Roster artists keep the `-` instead of a rank when there is no number. Rows with `Few` come before rows with `No data`.
- The meta line says "28-day listeners"; the snapshot date is still shown as month and year.
- `about.html`: "Verified streams" is now "Verified listeners" and says the figure is the 28-day listener count, rounded as Pandora shows it. The "collected by hand" disclosure is unchanged.

## [0.53.0] - 2026-10-25
### Changed
- Headings use SF Pro Rounded instead of Neue Machina for now (owner request). `--display` now points to `var(--sans)`, the old stack is kept as `--display-neue`. Bold headings use SF Pro Rounded Bold, the "on Pandora" part of the home heading uses Regular. The Neue Machina preloads are commented out in the HTML heads (marked `neue-revert`) and the SF Pro Rounded Bold preload is added.
- To go back: in `assets/styles.css` set `--display:var(--display-neue)` and restore the commented preloads. Fonts and `@font-face` rules stay in the repository. Noted in `AGENTS.md`.

## [0.52.0] - 2026-10-25
### Changed
- New hard rule 9 in `AGENTS.md` (owner request): `data/artist-media.js` is never put into an archive, even if it was in the uploaded one. It holds the picture data the owner records, and the file from an archive wipes it. Also noted in `CLAUDE.md` and `docs/DATA.md`. This archive does not contain the file.

## [0.51.0] - 2026-10-25
### Changed
- Dates of snapshots are shown as month and year only, for example "October 2026" (owner request): the status chip, the meta line, the snapshot picker buttons and the monthly listeners period. The data still keeps the full `capturedAt` date. If two snapshots fall in the same month their picker buttons read the same.

## [0.50.0] - 2026-10-25
### Added
- Monthly listeners on Pandora under the artist name (owner request), from the owner's file `artistMonthly.json` (readings of 2026-10-25, period 2026-09-27 to 2026-10-25). Stored in `data/snapshots.js` under `listeners`. 54 of the 85 artists in the file are in our rosters and have a reading (52 Phonk, 3 Brazilian Phonk, 1 in both); 34 have a number (shown as the source text, for example 144K), 20 are marked "few" by the source and show "Few monthly listeners". The period appears in the meta line.
- Skipped, as asked: 29 artists not in our base, plus Freddie Dredd (banned), and 2 roster artists with no reading in the file (Funk Tribu, Luga). Collaboration entries (`fits`) are not used.

## [0.49.0] - 2026-10-25
### Changed
- Per page options (owner request): 25, 50, 100, 200, All (were 10, 25, 50, All). The default is 25.

## [0.48.0] - 2026-10-25
### Changed
- Brazilian Phonk table (owner request): the table panel is dark and dimmed (new `.tbl.pending`, set from `pending: true` on the genre in `data/snapshots.js`), so it is clear at a glance that this genre does not work yet. Phonk shows its table as usual. The notice "Data is still being collected. Only part of the artists is displayed." stays on every genre that has a list.
- The table panel gets `aria-describedby` pointing at the notice while it is dimmed.
- The tint is a soft gray-violet, not black (owner request). It is a deliberate exception to the 6 percent glass fill rule, requested by the owner. Remove `pending: true` and the table returns to normal.
- Checked with `node --check` only so far, see TODO.

## [0.47.0] - 2026-10-25
### Added
- Brazilian Phonk roster: 511 artist names from the owner's five Spotify playlist exports (BRAZILIAN PHONK, BRAZILIAN PHONK 2022-2023, BRAZILIAN PHONK 2026, BRAZILIAN PHONK/FUNK VIRAL 2026, Latest Phonk Songs OCTOBER 2026). Every credited artist counted (credits are split on `;`), duplicates removed, names only, no stream numbers. The genre now lists them with `No data` like Phonk.
- Notice on the home page above the list (owner request): "Data is still being collected. Only part of the artists is displayed." Shown for every genre that has a list (`#note`).
- 32 of the names are also in the Phonk roster (for example Rubikdice, NUEKI, SETTWOR). They stay in both lists for now, the open question about artists in more than one genre is still in `TODO.md`.
- Skipped: one placeholder row with the artist "undefined" in the 2026 export. No banned names were found.
- Some names look like labels, channels or tags and may need a check before a Pandora lookup: Akuma Records, SHADOW RECORDS, SoundMusic Original, Resumo Produtora, Conexão do Funk, Dominando as Ruas, MONTAGEM, Prod.Nifour. They are kept as Spotify lists them.
- Run `scripts/fetch-artist-images.js` again to fetch pictures for the new names (it skips names that already have one).

## [0.46.0] - 2026-10-25
### Changed
- Home page heading (owner request): the Pandora logo and the accent color on the genre word from 0.45.0 are removed. The heading is plain ink again and reads "Top Phonk Artists on Pandora" in text. The `--hl` color token is removed.
- New look for the heading: "Top <genre> Artists" stays Neue Machina Bold, "on Pandora" is set in Neue Machina Regular (weight contrast, no color, no decoration). "on Pandora" never splits across lines. Neue Machina Regular is preloaded on the home page. `assets/app.js` builds the heading again when the genre switches.
- `AGENTS.md` rule 4 and the type rule are updated (the logo appears once again, only in the table column header).
- Checked in headless Chromium, light and dark, at 1100 px and 390 px. Not tested on a real phone.

## [0.45.0] - 2026-10-25
### Changed
- Home page heading (owner request): the Pandora logo, unmodified, now stands in for the word "Pandora" ("Top Phonk Artists on [pandora]"), and the genre word is set in the accent color (new token `--hl`: `#5B34E0` in light, `#9B7BFF` in dark, 6.1:1 and 6.4:1 against the page background; the regular accent is only 3.4:1 in dark). The logo keeps the alt text "Pandora", so the heading reads the same to screen readers and search engines. `document.title` is unchanged. `assets/app.js` builds the heading again when the genre switches.
- `AGENTS.md` rule 4: the logo now appears in two places, the table column header and the heading.
- Checked in headless Chromium, light and dark, at 1100 px and 390 px. Not tested on a real phone.

## [0.44.0] - 2026-10-25
### Changed
- Artist pictures and monograms are bigger (owner request): 56 px on desktop (was 36) and 44 px on phones up to 600 px (was 28). Table rows are a little taller (desktop cell padding 10 px, was 13). Monogram text scaled with it.
- `scripts/fetch-artist-images.js` now picks the smallest Spotify picture at least 150 px wide (was 100), so the bigger avatars stay sharp. Rerun the script with `--refresh` only if pictures were fetched with the older version.
- Checked in headless Chromium at 1100 px and 390 px. Not tested on a real phone.

## [0.43.0] - 2026-10-25
### Added
- Artist pictures from Spotify without storing them on the site (owner request). `scripts/fetch-artist-images.js` (run by the owner with a Spotify developer app, Client Credentials flow, Node 18 or newer) looks up every roster and snapshot artist and writes picture URLs to `data/artist-media.js`. Only exact name matches are used; the rest go to `scripts/artist-images-review.txt`. Optional `scripts/spotify-ids.json` pins an exact Spotify artist by ID.
- `assets/app.js` shows a picture from `data/artist-media.js` when the row has no local `image`. Only https URLs on `i.scdn.co` are accepted, images are requested with `no-referrer`, and a failed load falls back to the initials monogram.
- `data/artist-media.js` ships empty, so nothing changes on the site until the owner runs the script.
### Changed
- `privacy.html` (date 2026-10-25), `about.html`, `AGENTS.md` rule 4 and `docs/DATA.md` describe the Spotify image requests. The site now makes requests to Spotify's image host as soon as pictures exist.
- The script was tested only with a mocked Spotify API, not against the real one (no network in the build environment). The image host `i.scdn.co` is assumed, not verified; any other host is reported and not used.

## [0.42.0] - 2026-10-25
### Added
- Phonk roster: SETTWOR (owner request, the owner's own name). Listed with `No data` like the rest. The roster now has 293 names.

## [0.41.0] - 2026-10-25
### Changed
- The list now shows the real Phonk roster (292 artist names) instead of fictional sample data. The streams column reads `No data` for every artist and the rank column shows `-`, because no stream counts were collected yet. Nothing is ranked and no number is shown (owner request). Search, pages and per page work as before. The status chip says "No snapshot published yet", the line above the list says "Pandora · 292 artists · No data yet".
- When a snapshot exists, its ranked artists come first and roster artists missing from it follow in alphabetical order with `No data` (latest snapshot only).
- Brazilian Phonk has no roster, so it still shows the empty state.
- The roster is no longer "not shown on the site": `AGENTS.md` rule 2, `docs/DATA.md` and the comments in `data/snapshots.js` are updated. Banned names stay filtered out of the roster list.
### Removed
- The three `sample: true` snapshots with fictional artists and their 12 placeholder SVG images in `assets/artists/`.
- Checked in headless Chromium at 1100 px: 292 rows over 30 pages, search works, genre switch works. Not tested on a real phone.

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
