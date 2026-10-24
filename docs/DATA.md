# Data guide

All data lives in `data/snapshots.js`. Each snapshot is a record of one moment, so never edit an older snapshot to match newer numbers.

## Schema

```js
window.LEDGERTONE = { snapshots: [
  {
    capturedAt: "YYYY-MM-DD",      // the day the numbers were read from the profiles
    note: "Optional short text shown under the heading.",
    artists: [
      { name: "Artist A", streams: 1234567, profileUrl: "https://example.com/artist-a" }
    ]
  }
]};
```

- `name`: exactly as written on the artist profile.
- `streams`: integer, no separators.
- `profileUrl`: optional, `https` only. Other values are ignored by the page.
- Order inside the file does not matter. The page sorts snapshots by date and artists by streams.

## Steps for a new snapshot

1. Read the stream count manually from the profile of every phonk artist you include.
2. Add one snapshot object with the capture date.
3. Open `index.html` and check the ranking and the change against the previous snapshot.
4. Add a line to `CHANGELOG.md`. Suggested commit message: `data: snapshot YYYY-MM-DD`.

## Rules

- Only numbers collected by hand and verified. No estimates, no averages, no placeholders.
- Keep the same inclusion rule between snapshots, and write it down in `TODO.md` under Open questions once decided.
