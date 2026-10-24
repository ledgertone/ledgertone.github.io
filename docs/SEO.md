# Launch and SEO guide

Site URL confirmed by the owner and used in every canonical, sitemap, and Open Graph tag: `https://ledgertone.github.io/`.
This requires the repository to be named `ledgertone.github.io` under the GitHub user or organization `ledgertone`.
If the real URL differs, replace it everywhere:

```bash
grep -rn "ledgertone.github.io" --include="*.html" --include="*.xml" --include="*.txt" --include="*.js" . --exclude-dir=skills --exclude-dir=.git
```

## Placeholders to fill before going public

| Where | Placeholder | What to put |
| --- | --- | --- |
| `privacy.html` | `REPLACE_OWNER_NAME` | Name of the person or entity running the site |

GA4 measurement ID `G-R9G4YSEG77` is set in `assets/consent.js`. Do not add the raw Google tag snippet to any HTML file: it would load before consent. While `GA_ID` is empty, the site loads nothing from Google and shows no banner.
Check before publishing: `grep -rn "REPLACE_" . --exclude-dir=skills --exclude-dir=.git` must print nothing.

## Google Analytics 4 setup

1. Create a GA4 property and a Web data stream for the final URL.
2. Admin, Data collection: turn Google signals off. Turn off all advertising features.
3. Admin, Data retention: set event data retention to 2 months or 14 months, matching `privacy.html` (it says at most 14 months).
4. The measurement ID is already in `GA_ID` in `assets/consent.js`.
5. Test: with a fresh browser profile, confirm no request to `googletagmanager.com` and no `_ga` cookie before pressing Accept, and both after Accept. After Reject from Cookie settings the `_ga` cookies must disappear.

Consent design: Consent Mode v2 defaults are all denied, and the Google tag is loaded only after Accept (basic mode, no cookieless pings). Reject and Accept have equal weight. The choice is kept in localStorage.

## Search Console and indexing

1. Add the URL-prefix property `https://ledgertone.github.io/` in Google Search Console.
2. Verify with the HTML tag method: add the provided `<meta name="google-site-verification" ...>` to the `<head>` of `index.html`, or upload the HTML file Google provides to the repository root.
3. Submit `https://ledgertone.github.io/sitemap.xml`.
4. Use URL Inspection on the home page and request indexing.
5. Optional: add the site to Bing Webmaster Tools and import from Search Console.
6. Update `<lastmod>` in `sitemap.xml` whenever a snapshot is added.

## What helps ranking, and what does not

- Google ranks pages that have real, useful, unique content. Publish the first hand-collected snapshot before requesting indexing. An empty ranking page is thin content.
- Rankings are rendered by `assets/app.js`. Google executes JavaScript, but static text is more reliable. When data exists, consider a build step or a static HTML table generated from `data/snapshots.js`.
- Add schema.org `Dataset` structured data only after at least one snapshot exists, with real dates and a description of the metric.
- Backlinks matter most for a new site: share the site where phonk listeners are, and link to it from the owner's profiles.
- One search intent per page: if artist pages are added later, give each its own URL, title, and description, and list them in the sitemap.
- No one can guarantee a position. Do not use paid link schemes or keyword stuffing.
