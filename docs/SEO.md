# Launch and SEO guide

Site URL confirmed by the owner and used in every canonical, sitemap, and Open Graph tag: `https://ledgertone.settwor.com.pl/`.
This requires the repository to be named `ledgertone.settwor.com.pl` under the GitHub user or organization `ledgertone`.
If the real URL differs, replace it everywhere:

```bash
grep -rn "ledgertone.settwor.com.pl" --include="*.html" --include="*.xml" --include="*.txt" --include="*.js" . --exclude-dir=skills --exclude-dir=.git
```

## Placeholders to fill before going public

| Where | Placeholder | What to put |
| --- | --- | --- |

GA4 measurement ID `G-R9G4YSEG77` is set in `assets/consent.js`. The Google tag is in the `<head>` of `index.html`, `privacy.html`, and `404.html`, with Consent Mode defaults set to denied before the tag. Every new HTML page must get the same snippet. Never use Google's raw snippet without the consent defaults.
Check before publishing: `grep -rn "REPLACE_" . --exclude-dir=skills --exclude-dir=.git` must print nothing.

## Google Analytics 4 setup

1. Create a GA4 property and a Web data stream for the final URL.
2. Admin, Data collection: turn Google signals off. Turn off all advertising features.
3. Admin, Data retention: set event data retention to 2 months or 14 months, matching `privacy.html` (it says at most 14 months).
4. The measurement ID is already in `GA_ID` in `assets/consent.js`.
5. Test: with a fresh browser profile, confirm there is no `_ga` cookie before pressing Accept and that it appears after Accept. After Reject from Cookie settings the `_ga` cookies must disappear. The setup check in GA4 can now detect the tag.

Consent design: Consent Mode v2 defaults are all denied. The tag loads on every page (advanced mode): before consent it sends only cookie-free pings, and cookies are set only after Accept. Reject and Accept have equal weight. The choice is kept in localStorage.

## Search Console and indexing

1. Add the URL-prefix property `https://ledgertone.settwor.com.pl/` in Google Search Console.
2. Verify with the HTML tag method: add the provided `<meta name="google-site-verification" ...>` to the `<head>` of `index.html`, or upload the HTML file Google provides to the repository root.
3. Submit `https://ledgertone.settwor.com.pl/sitemap.xml`.
4. Use URL Inspection on the home page and request indexing.
5. Optional: add the site to Bing Webmaster Tools and import from Search Console.
6. Update `<lastmod>` in `sitemap.xml` whenever a snapshot is added (`node scripts/build-all.js` does it, and it also writes `feed.xml`, an Atom feed with one entry per snapshot, v1.25.0, and `ranking-<genre>.csv` and `.json`, the top 100 of each genre as clean data with a `Dataset` in the home JSON-LD, v1.26.0).

## What helps ranking, and what does not

- Google ranks pages that have real, useful, unique content. Publish the first hand-collected snapshot before requesting indexing. An empty ranking page is thin content.
- Rankings are rendered by `assets/app.js`. Google executes JavaScript, but static text is more reliable, so since v0.81.0 `scripts/build-home.js` writes the numbered rows of the Phonk ranking, the status chip, the meta line and an `ItemList` into `index.html` as plain HTML (AGENTS.md rule 16). `app.js` replaces them on load. "Few" and "No data" rows are not in the static HTML. This can help queries like "top phonk artists on Pandora", nobody can promise it will.
- Add schema.org `Dataset` structured data only after at least one snapshot exists, with real dates and a description of the metric.
- Backlinks matter most for a new site: share the site where phonk listeners are, and link to it from the owner's profiles.
- One search intent per page: if artist pages are added later, give each its own URL, title, and description, and list them in the sitemap.
- No one can guarantee a position. Do not use paid link schemes or keyword stuffing.
- Artist page for answers (v0.76.0): `settwor.html` is static HTML with the figure in plain text, a question heading and JSON-LD (Dataset, MusicGroup, FAQPage), built by `scripts/build-artist-pages.js`. After deploy: Search Console, URL Inspection on `https://ledgertone.settwor.com.pl/settwor.html`, Request indexing, then check the Rich Results Test. Search and AI answers pick a source on their own, there is no switch to force Google or Gemini to show or quote the page. What helps: the page is indexed, other sites link to it, the number matches what Pandora shows, and the page is refreshed with every new snapshot.
- Russian twin (v0.81.0): `settwor-ru.html` has the same data in Russian, `hreflang` links on both pages and in `sitemap.xml`, `og:locale` and `inLanguage` set to Russian. After deploy: URL Inspection and Request indexing for `https://ledgertone.settwor.com.pl/settwor-ru.html` too. hreflang helps Google pick the right language version, it is not a ranking boost.
- Snapshot history (v0.81.0): the artist pages list every snapshot with a reading, one row per snapshot and genre. It grows by itself with each new snapshot after `node scripts/build-all.js`.
- Links from the artist's own site (v0.81.0): `docs/settwor-site-snippet.html` is a fragment (JSON-LD with `subjectOf` pointing to both Ledgertone pages, and a visible link) for `https://settwor.com.pl/`. The owner pastes it by hand. A link in both directions helps search engines connect the two sites, it does not guarantee anything.
- Evidence for answers (v1.1.0): the artist pages carry an Organization node, a BreadcrumbList and a Dataset with `measurementTechnique`, `keywords` and, for SETTWOR, a CSV `distribution` (`settwor-listeners.csv`, generated). The CSV is rewritten by `node scripts/build-all.js` with every snapshot. Off-site signals matter more than markup: indexing in Search Console, links to the pages from `settwor.com.pl` and from the owner profiles, and a number that matches Pandora.

## Markup and AI answers (v1.53.0, owner note)

- Markup: the pages carry JSON-LD, but the page text does not show it, so after every publish run the Rich Results Test (https://search.google.com/test/rich-results) on the home page, `settwor.html` and `settwor-platforms.html`. `node scripts/check-release.js` only proves that the JSON-LD parses and that every `@id` it uses is defined on the same page; it is not the Rich Results Test.
- One entity: SETTWOR is ONE `MusicGroup` (the type of his own site) with the single `@id` `https://settwor.com.pl/#artist` (`ownerNode()` in `assets/ledger-core.js`, AGENTS.md rule 26). Its `sameAs` lists every profile of the artist from `data/links.js` (Pandora `p`, Spotify `s`, ten other profiles in `x`: Shazam, MusicBrainz, Musixmatch, Genius, Deezer, Amazon Music, TikTok, Apple Music, YouTube Music, YouTube). Ledgertone and CDRA refer to it by that `@id` as `creator` (or `founder`) and never redefine the type.
- CDRA: its site is not in this workspace. In its JSON-LD the `creator` field must be exactly `{ "@id": "https://settwor.com.pl/#artist" }`, with no `@type`, no `name` and no second `sameAs`. The full node is printed only on `settwor.com.pl` and on the Ledgertone pages that are about him.
- Why: the markup is there so that search engines and answer engines tell the entity apart without guessing (one name, one `@id`, one set of profiles). It is not a ranking boost.
- Google says that no special machine-readable files, AI text files or special markup are needed to appear in Google Search, generative AI features included, and that special schema.org markup is not required for them. `llms.txt` brings nothing and does no harm. So the markup is for an unambiguous entity, not for a boost, and no `llms.txt` is made (owner decision), no AI-only copies of pages, no AI-only schema. Structured data stays because it keeps the Dataset and rich result eligibility, not because it unlocks AI answers.
- CDRA award cards: the SETTWOR pages show them as iframes (AGENTS.md rule 27, v1.54.0). They are separate pages on `cdra.settwor.com.pl`, so the text of an award is not part of the Ledgertone page for search engines; the visible heading, the lead sentence and the link to the CDRA site are. No markup was added for the awards, and the SETTWOR entity (`@id` above) is unchanged.
