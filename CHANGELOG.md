# Changelog

Format follows Keep a Changelog. Dates are YYYY-MM-DD.

## [1.53.1] - 2026-10-29
### Fixed
- `sameAs` of the one SETTWOR entity was missing three profiles: Apple Music, YouTube Music and YouTube (owner supplied the links). Added to the key `x` of the `settwor` entry in `data/links.js`; `ownerNode()` and the snippet for `settwor.github.io` pick them up after `build-all.js`. Ten profiles in `x` now, plus Pandora and Spotify.
- Rule wording fixed in `AGENTS.md` rule 26 and `docs/SEO.md`: the entity is one `MusicGroup` that CDRA and Ledgertone refer to by `@id`; the CDRA `creator` is exactly `{"@id": "https://settwor.github.io/#artist"}` without a type; `llms.txt` brings nothing and does no harm, so it is not made; markup is for clarity, not for a boost.
- Not done: CDRA is not in this workspace, so its JSON-LD still has to get the `creator` line. The Rich Results Test was not run (no network).
- No visible change on any page.

## [1.53.0] - 2026-10-29
### Changed
- The one SETTWOR entity now lists all his profiles in `sameAs` (owner request): Pandora and Spotify as before, plus Shazam, MusicBrainz, Musixmatch, Genius, Deezer, Amazon Music and TikTok, the links the owner supplied. They live in `data/links.js` under the new key `x` of the `settwor` entry (https only, filtered by `safeUrl`), `ownerNode()` and `linksOf()` in `assets/ledger-core.js` read them, so every page that carries the node (home, platforms page, `settwor.html`, `settwor-ru.html`, `docs/settwor-site-snippet.html`) gets the same list after `node scripts/build-all.js`.
- `genre` of the entity is `["Brazilian Phonk", "Phonk"]` (was Phonk, Brazilian Phonk), the same two main genres as on `settwor.github.io` (site v11.15).
- Docs: `docs/SEO.md` has the new section "Markup and AI answers" (run the Rich Results Test after every publish, one `MusicGroup` with the single `@id`, Ledgertone and CDRA name it as `creator`, markup is for clarity not for a boost, no llms.txt); `docs/DATA.md` describes the key `x`; AGENTS.md rules 12 and 26 updated.
- Not done: Apple Music, YouTube and the other profiles of the SETTWOR site are not in `data/links.js` (the owner has not sent them here; never guess a link). CDRA is not in this workspace: it must point to `https://settwor.github.io/#artist` as `creator`. The Rich Results Test was not run (no network), only `scripts/check-release.js`.
- No visible change on any page.

## [1.52.0] - 2026-10-29
### Changed
- One SETTWOR entity in the JSON-LD (owner request): a single `MusicGroup` with the `@id` `https://settwor.github.io/#artist` (the same `@id` the snippet for his own site uses), built by `ownerNode()` in `assets/ledger-core.js`. The home page (`index.html`, `all.html` if it carries the Datasets), `settwor-platforms.html`, `settwor.html`, `settwor-ru.html` and `docs/settwor-site-snippet.html` all carry that same node, no page has its own second SETTWOR `MusicGroup` any more (the platforms page and the two artist pages had one each).
- The two ranking Datasets on the home page and the Dataset on the SETTWOR pages now name SETTWOR as `creator` by `@id`; the Ledgertone `Organization` (`@id` `https://ledgertone.github.io/#org`, `founder` = SETTWOR) is their `publisher`. Datasets of every other artist page are unchanged (creator Ledgertone).
- `sameAs` of the entity holds only the Pandora and Spotify links from `data/links.js`. Other profiles (Apple Music, YouTube) are added when the owner supplies the links. His own site is in `url`, no longer in `sameAs`.
- No llms.txt (owner decision: no benefit). No visible change on any page.

## [1.51.3] - 2026-10-29
### Added
- Owner line under the heading of the home page and of `all.html` (owner request): "The ranking is run by SETTWOR, who is #13 in it." with a link to "Who runs Ledgertone" on About, and the same sentence at the end of the meta description (also `og:description`, `twitter:description` and the `WebSite` description in the JSON-LD), so the disclosure travels with the figure in snippets and AI answers. The place is computed, never typed: `scripts/build-home.js` writes it from the ranked list of the latest Phonk snapshot (same order as the table), `render()` in `assets/app.js` recomputes it for the genre and the snapshot on screen (Brazilian Phonk, older snapshots), and if SETTWOR has no number in that snapshot the line says only that he is also listed in the rankings. Style `.ownernote` in `assets/styles.css`, plain muted text. Version 1.51.3.

## [1.51.2] - 2026-10-29
### Fixed
- On a phone (up to 700 px wide) the ranking list stopped at 40 rows with "Per page" 50, 75, 100, 200 or "All": the invisible end marker that loads the next 40 rows (`.rowsend`, `assets/app.js`) had no `order` in the flex column of the ranking page (`.rks`, phone block of `assets/styles.css`), so it sat above the table and the next rows never loaded. `.rks>.tbl,.rks>.rowsend{order:1}` puts it right after the table. Found while measuring list performance. Desktop was not affected. Version 1.51.2 everywhere.

## [1.51.1] - 2026-10-29
### Changed
- `TODO.md` only: the consent flow test, the text contrast check and the nav and picker legibility check are marked done with what was and was not measured (headless Chromium, the Google tag blocked, so `_ga` cookies were not tested). Lighthouse could not be installed (npm registry unreachable). No site change. Version 1.51.1 everywhere.

## [1.51.0] - 2026-10-29
### Added
- `settwor-platforms.html`: SETTWOR listeners on every platform and the platforms added together (owner request). Pandora comes from the latest snapshot (24,459, 28-day listeners, 2026-10-25, counted once), Spotify, Apple Music and YouTube read No data until the owner fills `data/settwor-platforms.js`. The sum counts only platforms with a figure ("1 of 4"), with a note that it is not unique people and that the periods differ. Generated by the new `scripts/build-platforms.js` (run by `build-all.js`), in `sitemap.xml`, linked from the footer of the pages built from `about.html` (`spotify.html` and itself). Styles `.total`, `.nd`, small date under a figure in `assets/styles.css`. AGENTS.md rule 25 and the layout table. Version 1.51.0 everywhere.

## [1.50.0] - 2026-10-29
### Added
- `spotify.html`, "Top Phonk Artists on Spotify" with a Phonk and a Brazilian Phonk switch (owner request). There is no Spotify reading yet, so every number reads No data and no place is given; the artists are the top-list roster of each genre, listed alphabetically, SETTWOR linked to his page. Generated by the new `scripts/build-spotify.js` (run by `build-all.js`), JSON-LD with the two lists, in `sitemap.xml`, linked from the nav of `index.html` and `all.html`. AGENTS.md rule 24 and the layout table. Version 1.50.0 everywhere.

## [1.49.0] - 2026-10-29
### Added
- The photo of SETTWOR on his artist pages (`settwor.html`, `settwor-ru.html`), a small round picture next to the title, loaded by link from `https://settwor.github.io/images/main.jpg` and not copied into the site (owner request, owner decision to load it by link). The same address is the `image` of the artist in the page JSON-LD. `photo` in `OWNER` (`assets/ledger-core.js`), alt text `photoAlt` in `data/artist-text.js` (English and Russian), markup in `assets/artist-page.js`, styles in `assets/styles.css`. This is a second external request of the site next to Spotify pictures: `privacy.html` has a new row, AGENTS.md (project line) names it. Version 1.49.0 everywhere.

## [1.48.0] - 2026-10-29
### Added
- `about.html`, section "How Ledgertone started": the launch dates, in the owner's words: the site was created and launched on 24 October 2026 without the full information, and after many improvements launched in full, with the whole database, on 27 October 2026 (owner request). AGENTS.md rule 15 notes it. Version 1.48.0 everywhere.

## [1.47.7] - 2026-10-29
### Removed
- SETTWOR pages: no logo any more (owner request). The title is plain text again, "SETTWOR on Pandora: 28-day listeners", on the left like every other page, with the reduced space under the header kept. The logo code is removed from `assets/artist-page.js` and its styles from `assets/styles.css`. The logo stays on `about.html`. Version 1.47.7 everywhere.

## [1.47.6] - 2026-10-29
### Changed
- SETTWOR pages: the logo stands in the title in place of the word SETTWOR (owner request), sized to the capital letters of the title, the title centered. The name stays in the page for readers and search engines as hidden text in the heading. The separate logo above the title is gone. `assets/artist-page.js`, `assets/styles.css`, `assets/motion.js`. Version 1.47.6 everywhere.

## [1.47.5] - 2026-10-29
### Changed
- SETTWOR pages: the glass card and the link buttons at the top are gone (owner request). The top holds only the small centered logo and the title, closer to the header (less padding on `.doc.own`). The links are a plain line under the snapshot history again, as on every other artist page. `assets/artist-page.js`, `assets/styles.css`, `assets/motion.js`. Version 1.47.5 everywhere.

## [1.47.4] - 2026-10-29
### Changed
- SETTWOR pages: the small logo (104 px, 92 px on a phone) is centered above the top card with more space above and below it, and the title and the link buttons in the card are centered too (owner request). `assets/styles.css` only. Version 1.47.4 everywhere.

## [1.47.3] - 2026-10-29
### Changed
- The logo on the SETTWOR pages is taken out of the top card and sits above it, small (92 px, 80 px on a phone), with no plate and no outline (owner request). `assets/artist-page.js`, `assets/styles.css`. Version 1.47.3 everywhere.

## [1.47.2] - 2026-10-29
### Changed
- The logo on the SETTWOR pages is small and neat (owner request): a small glass plate with the logo (88 px, 78 px on a phone) above the title, which is the main heading again, the links under it as glass buttons, all left-aligned. The large centered logo and its glow of 1.47.1 are gone. `assets/artist-page.js`, `assets/styles.css`. Version 1.47.2 everywhere.

## [1.47.1] - 2026-10-29
### Changed
- The card at the top of the SETTWOR pages is centered (owner request, the logo looked badly placed): the large logo in the middle with a soft glow behind it, the title smaller and quiet under it, the link buttons centered. `assets/styles.css` only. Version 1.47.1 everywhere.

## [1.47.0] - 2026-10-29
### Changed
- The SETTWOR pages (`settwor.html`, `settwor-ru.html`) are laid out as a profile (owner request): a glass card at the top with the large SETTWOR logo, the title and the links as glass buttons; the listeners figure is shown large with the other three figures in one row; the growth facts are glass rows with an accent edge; "Who runs Ledgertone" is a card (the small logo at the bottom is gone, the large one at the top links to his site). Markup in `assets/artist-page.js` (owner pages only), styles `.doc.own` in `assets/styles.css`, press effect for the new buttons in `assets/motion.js`. Other artist pages are unchanged. The text is unchanged. Version 1.47.0 everywhere.

## [1.46.0] - 2026-10-29
### Added
- `about.html`, section "Who runs Ledgertone": one line that SETTWOR also runs the CDRA project, with a link to cdra.github.io (owner request).
### Changed
- On a phone the "Per page" control sits directly under the table, above the pager and the notes (`assets/styles.css`, owner request). Desktop unchanged.
### Removed
- The "Under development" warning on Brazilian Phonk: `devwarn` in `data/snapshots.js`, the banner element on `index.html` and `all.html`, its code in `assets/app.js`, its styles, and the matching sentence in the feed and the ranking files (owner request). Version 1.46.0 everywhere.

## [1.45.0] - 2026-10-28
### Changed
- The site name in the header (`.brand`) is set in Gloock instead of New York (owner request): `assets/fonts/Gloock-Regular.woff` (one weight, 400, supplied by the owner), `@font-face` and `.brand` in `assets/styles.css`, the preload in every HTML head, the font gate in `assets/theme.js` (waits for Gloock instead of New York), `assets/fonts/README.md` and AGENTS.md. `NewYork.woff` stays in the repository, unused. Version 1.45.0 everywhere. No data change.

## [1.44.0] - 2026-10-27
### Changed
- `TODO.md` only: items the owner finished are marked done. No site change. Version 1.44.0 everywhere.

## [1.43.0] - 2026-10-27
### Changed
- Rule 18 (AGENTS.md) and CLAUDE.md: `delete-banned-pages.bat` is run from the Downloads folder, not from the site root, so it changes into the owner's site folder by its full path and checks `index.html` there. Documentation and the .bat only, no data change. Version 1.43.0 everywhere.

## [1.42.0] - 2026-10-27
### Removed
- Devilish Trio banned again (owner decision, AGENTS.md rule 8): deleted from the Phonk roster, the Phonk snapshot and `data/links.js`, added to `banned`. His artist page is not generated. This undoes the restore of 1.41.0, so the ban of 1.40.0 stands. Top 100 recalculated. Version 1.42.0 everywhere.

## [1.41.0] - 2026-10-27
### Removed
- 111 artists banned (AGENTS.md rule 8) and deleted from every roster, snapshot and `data/links.js`, added to `banned`: every artist of `missing_artists_by_listeners.xlsx` (sheets "Rating" and "No data") except the ones the owner kept. All 111 were in the verified base: 111 in the Phonk roster (106 with a reading in the 2026-10-25 snapshot, 35 numbered and 71 Few) and 11 of them also in the Brazilian Phonk roster (11 readings, 4 numbered and 7 Few). Not in `data/unverified.js`. Their 106 artist pages are deleted (`delete-banned-pages.bat`), Ghostdriving, Lestmor and CAIRO! had no page.
- Banned: PHNKR, Geoxor, Narvent, Marin Hoxha, DJ Smokey, MXRCVRY, DJ Yung Vamp, QKReign, GXNRC, Kiraw, NXGHT!, Heuse, T-Mass, Willix, Extra Terra, Nuphory, Slowboy, NOIXES, chipbagov, ANGELPLAYA, Igrxs, Floatinurboat, Rizo, HRXSTAL, Itz Daksh Music, CHMCL SOUP, Harddope, Shxpe, Xxephyrr, Godmode, Lowpocus, Lastfragment, Hiraeth, Tommy Wright III, The FifthGuys, SpaceGhostPurrp, Lowx, OhtoPlaya, KoruSe, LAGXNA, ENXK, Sensi Affect, bxkq, Altare, Hugomasked, Vincce, skyfall beats, Strybo, RXMALIAN, HXPETRAIN, HXTTA, HXLARIOUS, KICKSTXP, KNSRK, KVRMVD, PHARAOH, POOTY, SLXSH, TTM, Vinsmoker, crier, erickD, reedleyreaper, sapphyre, nashi, ARTVT, DIPIENS, KILLER MANTIS, mzmff, Ailow, 1$K1, ATSMXN, BLL4X, Brxshi, Crushed Candy, Dashie, DEVIL AARYA, DRXWCHILL, DYNAMIS, Emin Nilsen, HXDES, Jaxxtone, Juan Dileju, Kamran747, LIKEBSNS, MBNDON, MXRCURY, NECROLX, NILXRO, Nomeli, NOCTRIS, REKZ!, Rxf Siemens, Rxm, Sam Ourt, SH3RWIN, SYNTHEZAAR, XTOM, Yarimov (from the sheet "Rating"); Ghostdriving, Mythic, Lestmor, FAROFINAT BEATS, WILLE, nanebo, CASPER, CAIRO!, Freddz808, Kim, Seventaiin, SHIRO (from the sheet "No data").
- Already banned artists of the same file stay banned: Three 6 Mafia, Skeler, NEFFEX, Rameses B, DJ Screw, Ofdream, NxxxxxS, SwuM, Jeja, Soudiere, SLVG, Bearded Legend.
### Changed
- Kept by the owner decision: Ogryzek, CURSEDEVIL, Skorde (Phonk and Brazilian Phonk), THIRST (Phonk), Irokz, DJ FKU and nightfxrce (Brazilian Phonk only, as before).
- Devilish Trio is taken off `banned` (owner decision, he was banned in 1.40.0) and put back: Phonk roster, reading 85,700 in the Phonk 2026-10-25 snapshot (3,700 own plus 82,000 from the one page in his own list, rule 20, same number as in the xlsx), Pandora link in `data/links.js`. No Spotify id (none known, never guessed). His artist page is generated again.
- Top 100 recalculated, `top100/` rewritten by `scripts/pack.js`. Version 1.41.0 everywhere.

## [1.40.0] - 2026-10-27
### Removed
- 17 artists banned (AGENTS.md rule 8) and deleted from every roster, snapshot, `data/unverified.js` and `data/links.js`, added to `banned`: Devilish Trio, DJ Paul, TWISTED, Lumi Athena, Kingpin Skinny Pimp, Towa, jnhygs, ovg!, NxxxxxS, SwuM, Jéja, 911, Soudiere, Sinizter, dnvn, Scarlxrd, Genshin. 15 of them were in the verified Phonk roster (14 with a reading in the 2026-10-25 snapshot), 911 and Genshin were in the unverified list. Their 17 artist pages are deleted (`delete-banned-pages.bat`).
### Changed
- Irokz is no longer in the Phonk roster and the Phonk snapshot, he stays in Brazilian Phonk only (reading 14,771).
- Top 100 recalculated, `top100/` rewritten by `scripts/pack.js`. Version 1.40.0 everywhere.

## [1.39.0] - 2026-10-27
### Added
- `ledgerMonthly.json` imported again (AGENTS.md rules 10, 11, 20, 1,443 entries, readings of 2026-10-25, 26 and 27), fits folded into every artist's number, readings written into the existing 2026-10-25 snapshots (date and period unchanged, like in 1.17.0 and 1.18.0).
- Verified base: 7 added (DJ ALEX, FXARZ, notdjfake, Beyounger, Mc Luizinho, mc jhenny all Few, qaraqshy 11,953), 122 changed, 678 unchanged, 26 with no reading. Unverified list: 0 added, 0 changed, 336 unchanged, 259 with no reading. Skipped: 0 not in our base, 15 banned. SETTWOR unchanged (24,459).
- Pandora links in `data/links.js`: 7 added, 19 changed, 1,108 same.
- Top 100 recalculated: Phonk has 9 new places (dnvn, Phonk King, ARCHEZ, THIRST, Memphis Cult, Marin Hoxha, QKReign, GXNRC, NXGHT!) and 9 left (ROMANE, PlayaPhonk, T-Mass, NUEKI, ChillPanic, Nia.wave, Apoc Krysis, Phonkyrie, lilbubblegum), Brazilian Phonk has 3 new (qaraqshy, Mc Roba Cena, Silo) and 3 left (Nomi XD, Raiden, NUEKI), the order changed in both. `top100/Ledgertone top100.txt` and `.json` in the archive are rewritten by `scripts/pack.js`.
### Changed
- Default chosen by the agent, the owner may change it (written into AGENTS.md rule 10): when the newest `history` entry of an artist or of a fit has no number and is not `few` (a failed run), the newest entry that has a value is used instead. Without it Kordhell (newest entry empty, 144,000 on 2026-10-25) would have lost his own number and kept only the fits. It applied to 125 artists and 107 fits.
- Rules: AGENTS.md rule 10 and `docs/DATA.md` now say in the import steps that fits are always included and that the top 100 files are always refreshed and the changes in the top reported.
- Version 1.39.0 in `version.json`, footers, meta tag and every `?v=`.

## [1.38.0] - 2026-10-27
### Removed
- The note "(only the N artists with a number are ranked)" after the places in the answer sentence of every artist page, English and Russian (owner request). The places stay ("place 10 of 2,752 artists in Phonk"). The Dataset JSON-LD still carries the explanation in the `placeDesc` of each place, owner may remove it too.
### Added
- Section "Growth and activity" ("Рост и активность") on `settwor.html` and `settwor-ru.html` only (owner request, rule 13 owner page): the sentence that SETTWOR is an active and fast-growing artist, followed by six dated figures taken from the owner's own biography (`settwor.github.io/bio.html`, `bioRU.html` for the Russian page): total streams (1,000,000 on 21 October 2025, 2,000,000 on 17 May 2026), GOT ME UP 2 milestones, February and April 2026 monthly streams, the release series with its pause, XEREQUINHA NERVOSA 10,000 Spotify streams in 11 days, YouTube 10 million views. Under the list a source line with links to the biography and to the Spotify, Pandora, Apple Music and YouTube pages, saying that the figures are reported by the artist and not measured by Ledgertone, that SETTWOR runs Ledgertone, and that the Ledgertone snapshots on the page are Pandora 28-day listeners only (rule 14).
- The same facts as a second question in the FAQPage JSON-LD of the two SETTWOR pages.
### Changed
- All text lives in `data/artist-text.js` (`growH`, `growLead`, `growItems`, `growSrc`, `growQ`, English and Russian blocks), rendered by `assets/artist-page.js` for the owner page only. Other artist pages are unchanged.
- Left out on purpose: collaborations (rule 20), the April 2025 places 4 and 5 and the biography's "official" wording (rule 14), and any claim of growth drawn from Ledgertone data, which has one snapshot so far (rule 2).

## [1.37.0] - 2026-10-27
### Added
- CSV and JSON for every older snapshot (TODO item "CSV download of each snapshot"): `scripts/build-ranking-files.js` now also writes `ranking-<genre>-<YYYY-MM-DD>.csv` and `.json` for each snapshot of a genre except the latest (same columns as the latest files, numbered artists of that snapshot only, places 1 to `topLimit`; unverified artists exist only in the latest snapshot and "Few" rows are not part of older snapshots, so neither appears). The latest `ranking-<genre>.json` lists them in `earlier_snapshots`. `scripts/check-release.js` checks every pair (row count, date, note, listed in the latest JSON).
- With the present data (one snapshot per genre) nothing new is written and the four existing ranking files are byte-identical to v1.36.0. Tested in a scratch copy with a made-up older snapshot (files written, check fails when a file is missing). Node checks only, not seen in a browser.
### Changed
- Defaults chosen by the agent, the owner may change them: the older files are not linked in the head of `index.html`, not in `sitemap.xml`, not in the `Dataset` JSON-LD, no visible download link. Documentation: `AGENTS.md` layout table, `docs/DATA.md`.
### Tried and not done
- Shrinking the fonts (TODO): `fonttools` subsetting to Latin and Cyrillic saves only about 2 percent (1,141 to 1,121 glyphs in SF Pro Rounded, the files already hold little else), and woff2 needs the `brotli` module, which is not available here. The font files are unchanged.

## [1.36.0] - 2026-10-27
### Changed
- Documentation only: TODO cleanup. "Artist detail view with history across snapshots" (snapshot history table on the artist pages) and "Structured data (schema.org Dataset)" (Dataset JSON-LD on `index.html` and the artist pages) were already built and are marked done. "CSV download of each snapshot" stays open: no genre has an older snapshot yet. No site, data or script change.

## [1.35.0] - 2026-10-27
### Changed
- Static accessibility pass (part of the Lighthouse TODO item, no Lighthouse or browser audit was possible here): checked index, all, about, privacy, 404 and settwor for `lang`, one `h1`, image `alt`, empty buttons, description and canonical. Only finding fixed: the `h3` "Changes to the method" in the Methodology section had no style, `.doc h3` added in `assets/styles.css` (quiet, same font as headings). Left as is: the empty state `h3` on the home page skips a heading level (it is shown only when no snapshot exists); `404.html` has no canonical (intended for an error page); the theme button is empty in the HTML but gets its text from `assets/theme.js` and has an `aria-label`. Node checks only, not seen in a browser.

## [1.34.0] - 2026-10-27
### Added
- Methodology section on `about.html` (anchor `#methodology`, assistant idea from TODO): method version 1.0, the rules of the ranking (metric, order, Few and No data, verified and not verified, top 100, change pills, snapshot address) and a short list of method changes by site version (0.54.0, 0.60.0, 0.71.0, 1.14.0, 1.22.0). Only restates rules already in force, no new facts, no word about how the figures are made up. Node checks only, the page was not opened in a browser. Open: the wording and the method version number are defaults chosen by the agent, the owner may change them.

## [1.33.0] - 2026-10-27
### Changed
- Documentation only (TODO item about artist names with non-Latin letters): checked all 4,583 names in rosters, snapshots and the unverified list. 22 names have Cyrillic letters and every Cyrillic glyph in them is in all four SF Pro Rounded files, so they are drawn in the site font. 22 more names carry Japanese, Chinese, Greek or symbol characters, which fall back to the system font (the fonts have no such glyphs). No site, data or script change.

## [1.32.0] - 2026-10-27
### Added
- Static artist pages for the best artists (assistant idea from TODO): places 1 to 10 of every genre (latest snapshot, same order as the home page) are now written with figures and text in the HTML, readable without JavaScript, like SETTWOR. `STATIC_TOP = 10` in `scripts/build-artist-pages.js`, 17 new static pages, all other pages stay shells. The static pages are bigger than shells, so they enter the archive (rule 17) and are re-sent whenever their content changes, for example when the top 10 changes. Node checks only, the pages were not opened in a browser. To change the limit edit `STATIC_TOP`.

## [1.31.0] - 2026-10-27
### Changed
- `assets/og-image.png` redrawn (open item since v1.14.0): the title now reads "Top-100 Phonk Artists on Pandora", the rest of the design is as in v0.94.0 (1200 x 630, staff and note, site name in New York, SF Pro Rounded, "Snapshot ranking" chip, bar with "Ranked by 28-day listeners" and the site address). No figures, no artist names, no Pandora logo (rule 4). Rendered in headless Chromium only, not seen in a real link preview. After deploy refresh the link preview cache (Facebook Sharing Debugger, Telegram @WebpageBot).

## [1.30.0] - 2026-10-27
### Changed
- Owner rule: the top list files (`Ledgertone top100.txt` and `.json`) always go inside the archive, in the new folder `top100/`. `scripts/pack.js` writes them from the data with `export-top.js` before zipping and fails if they are missing. Documentation: `AGENTS.md` rule 19, `CLAUDE.md`, `docs/DATA.md`. No site change.

## [1.29.0] - 2026-10-27
### Changed
- DJ FKU, sma$her, nightfxrce, Chilx, Rubikdice and LXNGVX are Brazilian Phonk artists only (owner decision): removed from the Phonk roster and from the Phonk snapshot of 2026-10-25. The five that were already in the Brazilian Phonk roster and snapshot keep their rows unchanged. nightfxrce was not in the Brazilian Phonk lists yet: added to its roster and snapshot with his own existing reading (34,905), no new number.
- Their artist pages and links stay.
### Removed
- Banned and removed everywhere (rule 8): Øneheart. Deleted from the Phonk roster, the Phonk snapshot (reading 52,079) and `data/links.js`, added to `banned`. His page `oneheart.html` has to be deleted from the site folder (`delete-banned-pages.bat`).
- Node checks only (`check-banned.js`, `check-release.js`), the site was not opened in a browser.

## [1.28.0] - 2026-10-27
### Added
- Snapshot permalinks (assistant idea from TODO, AGENTS.md rule 23): `#<genre id>-<YYYY-MM-DD>` opens that snapshot of the genre on `index.html` and `all.html` (for example `#phonk-2026-10-25`, `all.html#brazilian-phonk-2026-10-25`). `#<genre id>` still opens the latest one, an unknown date falls back to the latest. New muted line under the table, "Cite this snapshot: https://ledgertone.github.io/#phonk-2026-10-25", drawn by `render()` in `assets/app.js` (follows the genre and the snapshot on screen), written statically by `scripts/build-home.js` for the first genre and its latest snapshot (index and all), style `.cite` in `assets/styles.css`.
- `scripts/check-release.js` checks the static line on `index.html` and `all.html`.
### Changed
- Defaults chosen by the agent, the owner may change them: plain muted text with the address as link text, no copy button, no hash change when the picker or the genre buttons are used (only the line shows the address), not in `sitemap.xml`, not on the artist pages. Checked in headless Chromium at 1280 and 390 px (all hash forms, click on the line, no horizontal scroll, no script errors), not on a real iPhone. Documentation: `AGENTS.md` rule 23, `CLAUDE.md`.

## [1.27.0] - 2026-10-27
### Added
- Documentation only (assistant idea from TODO, "Monthly routine"): new section "Monthly routine" in `docs/DATA.md`, ten steps in order for one monthly update: export the top list, import the readings file, apply bans, bump the version, `build-all`, `check-release`, `CHANGELOG` and `TODO`, `pack.js` with `--prev`, the Russian report to the owner, and the owner's steps after deploy. It repeats no new rule, it only points to the existing ones (rules 5, 8, 9, 10, 11, 17, 18, 19, 20). No site, data or script change.

## [1.26.0] - 2026-10-27
### Added
- Machine-readable ranking (assistant idea from TODO): `ranking-<genre>.csv` and `ranking-<genre>.json` for every genre (`ranking-phonk.*`, `ranking-brazilian-phonk.*`), the places 1 to 100 of the latest snapshot in the same order as the home page. CSV columns: `snapshot_date, genre, place, artist, listeners_28d, genre_verified, pandora_url` (a "Few" artist has `Few` in the listeners column); the JSON has the same rows plus the snapshot date, a note that it is a hand-collected snapshot and not live data (and that Brazilian Phonk is under development), and the license (CC BY 4.0, as on the artist pages). Generated by the new `scripts/build-ranking-files.js` from the same `topOf` logic as the site, run by `scripts/build-all.js` before the home page, never edited by hand.
- `index.html` (and `all.html`, it is built from it) link the four files with `rel="alternate"` in the head, and the JSON-LD of `index.html` has one `Dataset` per genre with `DataDownload` distributions (CSV and JSON), like the SETTWOR page.
- `scripts/check-release.js` checks the ranking files (one pair per snapshotted genre, row count equals the top list, CSV and JSON agree, linked from `index.html`, Dataset in the JSON-LD).
### Changed
- Documentation: `AGENTS.md` layout table and rule 16, `docs/DATA.md` steps, `docs/SEO.md` launch steps, `TODO.md`.
- Defaults chosen by the agent, the owner may change them: the files hold the top 100 only (not the whole list), because the owner follows only the top list (rule 19); no visible link on the page, the files are found through the head links and the Dataset (no change to the design); the files are not in `sitemap.xml`.

## [1.25.0] - 2026-10-27
### Added
- Feed of updates (assistant idea from TODO): `feed.xml`, Atom 1.0, one entry per snapshot of every genre (title, date, the top 3 of the top list, "hand-collected snapshot, not live data"; the Brazilian Phonk entry also says the section is under development). Generated by the new `scripts/build-feed.js` from the same ranking logic as the site, run by `scripts/build-all.js`, never edited by hand. Linked from the head of `index.html` and `all.html` (`rel="alternate"`), artist pages are not touched, so the archive grows by one file only. Today it has 2 entries (Phonk and Brazilian Phonk, 2026-10-25).
- `scripts/check-release.js` checks `feed.xml` (well-formed entries, one per snapshot, unique ids, in sync with the data).
### Changed
- Documentation: `AGENTS.md` layout table and rule 16 note, `docs/DATA.md` steps, `docs/SEO.md` launch steps. Real `lastmod` per page in `sitemap.xml` was checked: it is already the snapshot date of the page's latest reading (About and Privacy keep their own dates), so nothing to change there.

## [1.24.0] - 2026-10-27
### Changed
- `scripts/pack.js` no longer needs the artist pages to be inside the previous archive (assistant idea from TODO): every archive now carries `data/pages-manifest.json` (SHA-256 of each generated artist page with the version masked), the next run compares with the manifest of the previous archive. Falls back to the old comparison when the previous archive has no manifest; `--baseline` leaves out pages found in neither place (for the first archive with a manifest). Gone pages are taken from the old manifest too. Tested in a scratch copy: version bump only gives 0 pages included, one changed page gives 1 included, one removed page is listed under DELETE. No site change.

## [1.23.0] - 2026-10-27
### Added
- `scripts/check-release.js` (assistant idea from TODO): one command that runs `node --check` on every script, `check-banned.js`, `build-all.js`, the em-dash and emoji check, the version stamps (CHANGELOG, `version.json`, meta tag, footer, every `?v=`), the JSON-LD of the home page, `settwor.html`, `settwor-ru.html` and one artist shell (parses, every referenced `@id` is defined), and that every local `href` and `src` exists (`data/artist-media*.js` are expected to be missing, rule 9). Exit code 1 on any failure. No site change.

## [1.22.0] - 2026-10-27
### Added
- Change pills (owner request from TODO, AGENTS.md rule 22): a numbered row shows a light green pill with an arrow up or a light red pill with an arrow down and the number of places moved against the next older snapshot of the same genre. Computed by the site: `moveAt` in `assets/ledger-core.js` (exported by `scripts/lib/ledger.js`), the static home rows in `scripts/build-home.js`, the browser tables (home and `all.html`) in `render()` of `assets/app.js`. Style `.up` and the colour `--up` in `assets/styles.css`, light and dark.
- Defaults, because the owner did not answer the questions: the pill shows the place change only, any change counts, places are counted among the verified artists with a number (unverified rows exist only in the latest snapshot), no pill for new artists, "Few", "No data", unverified rows or artists that left the top 100, the SETTWOR mark of rule 21 stays and sits under his change pill.
- Today every genre has one snapshot, so no pill appears yet. They show up with the next snapshot of a genre. Checked with a made-up older snapshot in a scratch copy (not in the data): the static rows equal the rows of `app.js`.
### Changed
- `AGENTS.md` rule 4 (two exceptions now), new rule 22, `CLAUDE.md`.

## [1.21.0] - 2026-10-27
### Changed
- Documentation only: `TODO.md` got the open task for automatic change pills (light green arrow up, light red arrow down) computed by the site at each new snapshot. Not started, needs an owner decision on AGENTS.md rule 4 first.

## [1.20.0] - 2026-10-27
### Changed
- Owner mark of SETTWOR (rule 21): the place in the pill is no longer typed (`earlierPlace: 3` removed). `earlierListeners: 60000` in `data/snapshots.js` is the only input, the site counts the place SETTWOR would have in that genre with 60,000 listeners among the other ranked artists, at every build (static home row, `settwor.html`, `settwor-ru.html`) and in the browser (tables). New `earlierPlaceAt` in `assets/ledger-core.js`, exported by `scripts/lib/ledger.js`.

## [1.19.0] - 2026-10-27
### Added
- Owner mark (owner request, AGENTS.md rule 21): a small light red pill with an arrow down and `#3` for SETTWOR only, under his listeners number in the ranking rows (home, static home row, `all.html`) and after the place in his place cards on `settwor.html` and `settwor-ru.html`. It shows while his place in a genre is worse than `earlierPlace` (3, new in `data/snapshots.js`, the number is the owner's), no label, no date. New text key `earlier` (aria-label) in `data/artist-text.js`, English and Russian. Style `.dn` in `assets/styles.css`. The place is still counted by the number only.

## [1.18.0] - 2026-10-27
### Changed
- New mandatory rule (owner decision, AGENTS.md rule 20): the listeners of an artist are his own latest reading plus the latest reading of every entry in his own `fits` list, summed into one number, with no mention of fits on the site. The `ledgerMonthly.json` import of 1.17.0 was redone with it: 224 snapshot rows changed (198 artists in the verified base, 2 added that had only fits with numbers, 15 unverified readings changed), top lists recalculated. `text` of a sum is derived from the number (K and M rounding).
- `CLAUDE.md`, `AGENTS.md` (rules 10 and 20) and `docs/DATA.md` updated, the old "skip the fits" is gone.

## [1.17.0] - 2026-10-27
### Added
- `ledgerMonthly.json` imported (AGENTS.md rule 10, 1,440 entries, latest reading per artist; the file holds readings taken on 2026-10-25, 2026-10-26 and 2026-10-27). Skipped: 14 banned (HAARPER, Skeler, 1nonly, Rameses B, Øfdream, NEFFEX, Three 6 Mafia, DJ Screw, Pouya, $NOT, CORPSE, Öwnboss, Yung Gravy, SPOON), the collaboration (`fits`) entries, artists with no reading.
- Verified base (readings written into the existing 2026-10-25 snapshots, the snapshot date and period were not changed): 2 artists added (D&rwin and h6itam, both Few, Brazilian Phonk), 17 changed (Phonk Killer, Skorde, Ogryzek, blueberry, SETTWOR 23K to 24K, Mc Gw, SXID, MC PR, S3BZS, Mc Pogba, Mc Kitinho, VYRUS, Zericxxn, DJZRX, SYNN, VAVA, Mc Denny), 763 unchanged, 49 with no reading. Every changed reading comes from the 2026-10-27 run.
- Unverified list: 18 readings added (ROMANE 10K and 17 Few), 1 changed (blueberry 102 to Few), 341 unchanged, 260 with no reading. `readings` in `data/unverified.js` left at 2026-10-25.
- Pandora links in `data/links.js`: 1 added (h6itam), 10 changed (blueberry, Mc Gw, MC PR, Mc Pogba, CACAU CHUU, Mc Staff, TRXSHBXY, DJ DUDA, SAVAS, Mc Denny), 1,123 same.
- Rebuilt with `node scripts/build-all.js`.

## [1.16.0] - 2026-10-26
### Changed
- The note "Ledgertone follows the top 100 artists of each genre..." moved from under the meta line to below the table, next to the link to the full list (home) and to the link back (`all.html`). Text and link unchanged.

## [1.15.0] - 2026-10-26
### Added
- `all.html`: the full list of all artists (owner request), the same page and script as the home page with `<body data-view="all">`, everything as before the top list (all rows, coverage cards, page sizes 25, 50, 100, 200, All). Generated by `scripts/build-home.js`, in `sitemap.xml`, linked from the note on the home page ("See the list of all artists") and back ("Back to the top 100"). Keeps the chosen genre through the `#brazilian-phonk` hash.
### Changed
- Home page title is now "Top-100 <genre> Artists on Pandora" (heading, page title, social tags, JSON-LD). `assets/og-image.png` still has the old title text.
- Home page size buttons are 25, 50, 75, 100, no "All".
- `all` is a reserved page name in `assets/ledger-core.js`.

## [1.14.0] - 2026-10-26
### Changed
- Top list (owner request, AGENTS.md rule 19): the ranking shows only the places 1 to 100 of each genre (`topLimit: 100` in `data/snapshots.js`). All other artists stay in the data but are hidden from the table, the search and the paging. New note under the meta line and a "Top 100 only" disclosure on `about.html`: the list of all other artists is not updated. The meta line reads "Top 100 of N artists", the coverage cards are not shown, the static home table carries 100 rows.
- Brazilian Phonk has only 44 artists with a number, so its places 45 to 100 are "Few" artists in alphabetical order (the site gives "Few" artists places after the numbered ones, rule 2).
### Added
- `scripts/export-top.js`: writes `Ledgertone top100.txt` and `Ledgertone top100.json` (the current places 1 to 100 of Phonk and Brazilian Phonk) to run new snapshots over.
- `ledger-core.js`: `topLimit` and `topOf`. No data changed.

## [1.13.0] - 2026-10-26
### Added
- `artistBase.json` imported (AGENTS.md rule 11, 4,629 entries). Skipped: 830 already in the verified base, 21 banned (RJ Pasin, 1nonly, Freddie Dredd, SLVG, Bearded Legend, líue, Roland Jones, Daedra, Necroez, SPOON, HAARPER, Skeler, Rameses B, Øfdream, NEFFEX, Three 6 Mafia, DJ Screw, Pouya, $NOT, CORPSE, Öwnboss). 3,777 already in the unverified list, left as they are.
- Unverified list: 1 name added to the Brazilian Phonk group ("Brazilian Phonk", an entry named like the genre, the owner may ban it). Numbers, `profileUrl` and `imageUrl` of the file are not used.
- Spotify ids in `data/links.js` (rule 12): 1 added, 0 changed, 4,047 same. 563 artists of our base have no Spotify id (the file has none for them), no link is shown for them.
- Rebuilt with `node scripts/build-all.js`.

## [1.12.0] - 2026-10-26
### Added
- New listeners imported from `ledgerMonthly.json` (same shape as `artistMonthly.json`, AGENTS.md rule 10). Two dates in the file (2026-10-25, period 2026-09-27 to 2026-10-25, and 2026-10-26, period 2026-09-28 to 2026-10-26). Same owner decision as in 1.6.0, 1.9.0 and 1.10.0: no new snapshot, every reading goes into the existing 2026-10-25 snapshots and into the 2026-10-25 reading period of `data/unverified.js`, so dates and periods are unchanged.
- Verified base: 1 artist added (SPLYXER, Few, Phonk), 0 changed, 793 unchanged, 35 without a reading (Ghostdriving, Lestmor, CASPER, CAIRO!, Kim, SLXEPING TOKYO, Kool Kidz Krew, T’iny, KILLOMANE, ΣP, D&rwin, h6itam, WAA, Z1Z, WILBUR, cape, NAOMI, Rayn.., MIDNIGHT, haze, Forsaken, DJ Kinn, DJ ALEX, itssimannn!, Lŭ, DJ RD, FXARZ, 1HXSX, T$R, notdjfake, Beyounger, $AvE, Mc Lullu, DJ DUDA, Mc Luizinho). SETTWOR unchanged (23,000 in Phonk and Brazilian Phonk).
- Unverified base: 0 added, 0 changed, 336 unchanged, 259 without a reading.
- Skipped: 0 not in our base, 14 banned (HAARPER, Skeler, 1nonly, Rameses B, Øfdream, NEFFEX, Three 6 Mafia, DJ Screw, Pouya, $NOT, CORPSE, Öwnboss, Yung Gravy, SPOON). `fits` (collaboration) entries not used.
- Pandora links in `data/links.js`: 1 added (SPLYXER), 0 changed, 1129 same. 8 links skipped because they are not on `https://www.pandora.com` (D&rwin, h6itam, Forsaken, DJ Kinn, FXARZ, 1HXSX, notdjfake, Beyounger, rule 12).
- Rebuilt with `node scripts/build-all.js` (home rows, artist pages, `data/artist-pages.js`, `sitemap.xml`).

## [1.11.0] - 2026-10-26
### Removed
- Banned (owner request, AGENTS.md rule 8): SPOON, Rameses B. Deleted from the Phonk roster and the 2026-10-25 snapshot (Rameses B, 57,000), from `data/unverified.js` (SPOON, 195,000), and from `data/links.js`, added to `banned`. Their generated pages `spoon.html` and `rameses-b.html` are deleted, `data/artist-pages.js` and `sitemap.xml` rebuilt.

## [1.10.0] - 2026-10-26
### Added
- New listeners imported from `ledgerMonthly.json` (same shape as `artistMonthly.json`, AGENTS.md rule 10). Two dates in the file (2026-10-25, period 2026-09-27 to 2026-10-25, and 2026-10-26, period 2026-09-28 to 2026-10-26). Same owner decision as in 1.6.0 and 1.9.0: no new snapshot, every reading goes into the existing 2026-10-25 snapshots and into the 2026-10-25 reading period of `data/unverified.js`, so dates and periods are unchanged.
- Verified base: 274 artists added (274 rows), 0 changed, 520 unchanged, 36 without a reading (Ghostdriving, SPLYXER, Lestmor, CASPER, CAIRO!, Kim, SLXEPING TOKYO, Kool Kidz Krew, T’iny, KILLOMANE, ΣP, D&rwin, h6itam, WAA, Z1Z, WILBUR, cape, NAOMI, Rayn.., MIDNIGHT, haze, Forsaken, DJ Kinn, DJ ALEX, itssimannn!, Lŭ, DJ RD, FXARZ, 1HXSX, T$R, notdjfake, Beyounger, $AvE, Mc Lullu, DJ DUDA, Mc Luizinho). SETTWOR unchanged.
- Unverified base: 0 added, 0 changed, 337 unchanged, 259 without a reading.
- Skipped: 0 not in our base, 12 banned (HAARPER, Skeler, 1nonly, Øfdream, NEFFEX, Three 6 Mafia, DJ Screw, Pouya, $NOT, CORPSE, Öwnboss, Yung Gravy). `fits` (collaboration) entries not used.
- Pandora links in `data/links.js`: 274 added, 8 changed (RXDXVIL, MC Pequeno Diamante, Mc Delux, MC MN, Mc Bockaum, Akuma Records, DJ Guih Da ZO, mc pl alves), 849 same. 8 links skipped because they are not on `https://www.pandora.com` (D&rwin, h6itam, Forsaken, DJ Kinn, FXARZ, 1HXSX, notdjfake, Beyounger, rule 12).
- Rebuilt with `node scripts/build-all.js` (home rows, artist pages, `data/artist-pages.js`, `sitemap.xml`).

## [1.9.0] - 2026-10-26
### Added
- New listeners imported from `ledgerMonthly.json` (same shape as `artistMonthly.json`, AGENTS.md rule 10). Two dates in the file (2026-10-25 and 2026-10-26, period 2026-09-27 to 2026-10-25 and 2026-09-28 to 2026-10-26). Same owner decision as in 1.6.0: no new snapshot, every reading goes into the existing 2026-10-25 snapshots and into the 2026-10-25 reading period of `data/unverified.js`, so dates and periods are unchanged.
- Verified base: 119 artists added (120 rows, an artist counts once per genre roster that lists him), 1 changed (Mc Gw), 359 unchanged, 14 without a reading (Ghostdriving, SPLYXER, Lestmor, CASPER, CAIRO!, Kim, SLXEPING TOKYO, Kool Kidz Krew, T’iny, KILLOMANE, ΣP, D&rwin, h6itam, WAA). SETTWOR unchanged (23,000 in Phonk and Brazilian Phonk).
- Unverified base: 288 readings added, 0 changed, 49 unchanged, 259 without a reading. 25 names of the file are in the verified base and in the unverified list at once, they were handled as verified and the unverified duplicates were left untouched (the page hides them anyway).
- Skipped: 0 not in our base, 12 banned (HAARPER, Skeler, 1nonly, Øfdream, NEFFEX, Three 6 Mafia, DJ Screw, Pouya, $NOT, CORPSE, Öwnboss, Yung Gravy). `fits` (collaboration) entries not used.
- Pandora links in `data/links.js`: 407 added, 12 changed (akrai, Alban Chela, ALZO, attashe, besch1er, Consumane, Cxxlion, Daisuke13, DARKWOLE, DeadJxhn, Din1c, Mc Menor Do Alvorada), 397 same. Two links skipped because they are not on `https://www.pandora.com` (D&rwin, h6itam, rule 12).
- Rebuilt with `node scripts/build-all.js` (home rows, artist pages, `data/artist-pages.js`, `sitemap.xml`).

## [1.8.0] - 2026-10-26
### Changed
- New hard rule 18 in `AGENTS.md` and a pointer in `CLAUDE.md` (owner request): whenever page files must be deleted from the site folder (a ban, a removed artist), the agent also creates a one-time `delete-banned-pages.bat` and hands it over next to the archive, so the owner never deletes files by hand. No data or page text changed, only the version stamp.

## [1.7.0] - 2026-10-26
### Removed
- Banned (owner request, AGENTS.md rule 8): Three 6 Mafia, NEFFEX, Yung Gravy, Skeler, 1nonly, HAARPER, Pouya, DJ Screw, CORPSE, $NOT, Øfdream, Öwnboss. Deleted from the Phonk roster, from the 2026-10-25 snapshots (readings included) and from `data/links.js`, none were in `data/unverified.js`, added to `banned`. Their 12 generated pages (`three-6-mafia.html`, `neffex.html`, `yung-gravy.html`, `skeler.html`, `1nonly.html`, `haarper.html`, `pouya.html`, `dj-screw.html`, `corpse.html`, `not.html`, `fdream.html`, `ownboss.html`) are deleted, `data/artist-pages.js` and `sitemap.xml` rebuilt.

## [1.6.0] - 2026-10-26
### Added
- New listeners imported from `ledgerMonthly.json` (same shape as `artistMonthly.json`, AGENTS.md rule 10). The file holds two dates (293 readings of 2026-10-26, period 2026-09-28 to 2026-10-26, and 56 of 2026-10-25, period 2026-09-27 to 2026-10-25). Owner decision: no new snapshot, every reading goes into the existing 2026-10-25 snapshots regardless of its own date, so the snapshot dates and periods are unchanged.
- Verified base: 219 artists added (237 rows, an artist counts once per genre roster that lists him), 0 changed, 130 unchanged, 20 without a reading (Ghostdriving, VØJ, SPLYXER, Lestmor, Jéja, Rameses B, PHARAØH, erickD, CASPER, CAIRO!, Kim, Luga, T-Mass, Wels, SLXEPING TOKYO, Kool Kidz Krew, T’iny, Chi X, SVI!, KILLOMANE). Unverified base: nothing in the file. Skipped: 0 not in our base, 0 banned. SETTWOR unchanged (23,000 in Phonk and Brazilian Phonk). `fits` (collaboration) entries not used.
- Pandora links in `data/links.js`: 219 added, 13 changed (chipbagov, HXTTA, Vinsmoker, safetypleace, ANTICXLTXRE, DRXWCHILL, TRVNSPORTER, fkbambam, Cloudymane, Yavomag, GhostyPlaya, DePaul, 0to8), 117 same.
- Rebuilt with `node scripts/build-all.js` (home rows, artist pages, `data/artist-pages.js`, `sitemap.xml`).

## [1.5.0] - 2026-10-26
### Changed
- `TODO.md`: new section "Assistant ideas" with what the assistant would do next (owner request). No code, data or page text changed, only the version stamp.

## [1.4.0] - 2026-10-26
### Changed
- SETTWOR logo (owner report: far too big, did not fit): the logo is about half the size now (88 to 112 px wide instead of 150 to 224 px) and its glass card is smaller (padding 12 x 20 px, radius 16 px, no minimum height), `.ownmark` and `.ownlogo` in `assets/styles.css`. Checked in headless Chromium at 1280 and 390 px (card about 154 x 53 px on a computer). Not seen on a real iPhone.

## [1.3.0] - 2026-10-26
### Fixed
- Spring on links inside text (owner report: pressing one link, for example "SETTWOR on Spotify" in the row of links on an artist page, made the whole paragraph spring). Cause: `pick()` in `assets/motion.js` only knew the listed buttons and links, so any other link fell through to the text block around it. Now a link or a button inside a text block springs by itself and the block stays still (everywhere: artist pages, About, hero text, footer text). Inline boxes cannot be transformed, so `assets/styles.css` makes such links `inline-block`. Checked in headless Chromium: the pressed link scales (about 0.96), its paragraph keeps `transform: none`, no console errors.
- SETTWOR logo (owner report: not visible): the logo was drawn from a separate file `assets/settwor-logo.svg` as a CSS mask, so it stayed empty when that file was not uploaded next to the pages. It is now an inline SVG (the path of the owner's file, unchanged) in `about.html` and in `assets/artist-page.js`, filled with the ink color, so it needs no extra file. The file `assets/settwor-logo.svg` stays in the repository as the source.

## [1.2.0] - 2026-10-26
### Added
- SETTWOR logo (owner request): the wordmark sits in a glass card under the text of the "Who runs Ledgertone" section on `about.html` and on both SETTWOR pages (and so on every page that shows the owner block); the card links to `https://settwor.github.io/`, with an accessible name (`ownerLogo` in `data/artist-text.js`, English and Russian). The owner's file is `assets/settwor-logo.svg`, unchanged; it is drawn as a CSS mask so it takes the ink color in light and dark (`.ownmark` in `assets/styles.css`, press feedback through the `PRESS` list in `assets/motion.js`). The logo is not in the header and not on the home page (strict style, rules 3 and 14 unchanged).
- Checked in headless Chromium: light and dark, 1280 and 390 px, no console errors. Not seen in Safari or on a real iPhone (mask with `-webkit-mask` prefix is set).

## [1.1.0] - 2026-10-26
### Added
- Search and AI answers (owner goal: Google and Gemini should find the site for "how many listeners does SETTWOR have on Pandora" and answer from it). More machine-readable evidence on every artist page, from the one renderer `assets/artist-page.js`: an `Organization` node for Ledgertone (`@id` `https://ledgertone.github.io/#org`, logo, for the SETTWOR pages with the founder link), a `BreadcrumbList`, `publisher` and `breadcrumb` on the `WebPage`, and on the `Dataset` the `url`, `isAccessibleForFree`, `publisher`, `keywords`, `measurementTechnique` ("read by hand from the artist profile page on Pandora", nothing more about how, rule 3) and, for SETTWOR only, `distribution` with a CSV download.
- `settwor-listeners.csv` (new, generated by `scripts/build-artist-pages.js`, English column names, one row per snapshot and genre: date, genre, 28-day listeners, the value Pandora showed, place, ranked artists, artists in the genre). Linked from both SETTWOR pages ("Download the SETTWOR readings as CSV") and from the Dataset. New text keys `linkCsv`, `dsMethod`, `dsKeywords` (English and Russian) in `data/artist-text.js`.
- Checked in headless Chromium: the JSON-LD graph of `settwor.html`, `settwor-ru.html` and a shell page parses and every `@id` reference resolves, the CSV link is on both SETTWOR pages, no console errors. The Rich Results Test and Search Console were not run (no network here), the owner should run them. Nobody can promise that Google or Gemini will show or quote the page.

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
