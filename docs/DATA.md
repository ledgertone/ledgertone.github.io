# Data guide

All data lives in `data/snapshots.js`. Each snapshot is a record of one moment, so never edit an older snapshot to match newer numbers.

## Schema

```js
window.LEDGERTONE = { snapshots: [
  {
    capturedAt: "YYYY-MM-DD",      // the day the numbers were read from the profiles
    note: "Optional short text shown under the heading.",
    sample: true,                  // optional, marks fictional preview data (see Rules)
    artists: [
      { name: "Artist A", streams: 1234567, image: "assets/artists/artist-a.jpg", profileUrl: "https://example.com/artist-a" }
    ]
  }
]};
```

- `name`: exactly as written on the artist profile.
- `streams`: integer, no separators.
- `profileUrl`: the link to the artist's page on Pandora, `https` only. Other values are ignored by the page. When set, the row shows an "Open on Pandora" button.
- `image`: path to a local file in `assets/artists/` (png, jpg, webp, or svg, lowercase letters, digits, dot, dash, underscore). Anything else is ignored and the row shows an initials monogram. Never point it at a Pandora or other external URL.
- Order inside the file does not matter. The page sorts snapshots by date and artists by streams.

## Steps for a new snapshot

1. Read the stream count manually from the profile of every phonk artist you include.
2. Add one snapshot object with the capture date.
3. Open `index.html` and check the ranking.
4. Add a line to `CHANGELOG.md`. Suggested commit message: `data: snapshot YYYY-MM-DD`.

## Rules

- Only numbers collected by hand and verified. No estimates, no averages, no placeholders.
- Keep the same inclusion rule between snapshots, and write it down in `TODO.md` under Open questions once decided.
- Sample data: the owner may ask for fictional preview data. It must use fictional artist names, carry `sample: true` and a note saying it is not real, and be removed before the real launch. With `sample: true` the home page status chip reads "Sample data, not real".
