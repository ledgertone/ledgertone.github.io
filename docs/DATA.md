# Data guide

All data lives in `data/snapshots.js`. Each snapshot is a record of one moment, so never edit an older snapshot to match newer numbers.

## Schema

```js
window.LEDGERTONE = {
  genres: [ { id: "phonk", name: "Phonk", roster: ["Artist A", "Artist B"] }, { id: "brazilian-phonk", name: "Brazilian Phonk" } ],
  snapshots: [
  {
    genre: "phonk",         // id from the genres list above, one ranking per genre
    capturedAt: "YYYY-MM-DD",      // the day the numbers were read from the profiles
    note: "Optional short text shown under the heading.",
    sample: true,                  // optional, marks fictional preview data (see Rules)
    artists: [
      { name: "Artist A", listeners: 1234567, text: "1.2M", image: "assets/artists/artist-a.jpg", profileUrl: "https://example.com/artist-a" }
    ]
  }
]};
```

- `genre`: the `id` of one of the genres. Each genre has its own snapshots, its own dates and its own ranking. A snapshot without `genre` counts as the first genre. A genre with no snapshots shows an empty state. To add a genre, add it to `genres` (the switcher, the title and the `#id` link appear by themselves).
- `roster` (optional, on a genre): names only, the artists whose 28-day listeners the owner plans to collect. No numbers. The site lists roster artists with `No data` in the listeners column and a `-` instead of a rank (artists with `few: true` get a place after the numbered ones, v0.71.0); they sit after the ranked artists of the latest snapshot, in alphabetical order, and are the whole list while the genre has no snapshot. An artist moves from `No data` into the ranking only with a stream count read by hand in a snapshot.
- `pending` (optional, on a genre): `true` while the genre has no working data. The page shows its table dark and dimmed so it is clear at a glance that it does not work yet. Remove the line when real data goes live. The notice "Data is still being collected" is shown for every genre that has a list, with or without `pending`.
- `banned` (optional, top level): artist names that are not phonk artists (owner decision). A ban deletes the artist from the data and blocks adding him again: remove the name from every roster and snapshot (readings too), from `data/unverified.js` and from `data/links.js`, and never put it back, also not through an import (playlist, list, `artistMonthly.json`, `artistBase.json`). `assets/app.js` also removes banned names at run time. Case and accents do not matter. `node scripts/check-banned.js` fails if a banned name is still in the data. Current list: Freddie Dredd, Oliver Tree, DJ MTG BONAFORTE.
- `name`: exactly as written on the artist profile.
- `listeners`: 28-day listeners on Pandora, integer, no separators. The ranking is sorted by it, and the page prints the full number with commas (144,000), never a K. `text` (optional) is the figure as the source shows it, for example `144K`, kept for reference only and not printed. `{ name, few: true }` instead of a number means the source shows only "few listeners": the row shows `Few` instead of a rank. Collaboration rows of the source file are not used.
- `profileUrl`: the link to the artist's page on Pandora, `https` only. Other values are ignored by the page. When set, the row shows an "Open on Pandora" button.
- Artist pictures from Spotify: one file per genre (owner's live data, never include them in an archive, see AGENTS.md rule 9). Phonk uses `data/artist-media.js` (`window.LEDGERTONE_MEDIA`), Brazilian Phonk uses `data/artist-media-brazilian-phonk.js` (`window.LEDGERTONE_MEDIA_BRAZILIAN_PHONK`). The script asks which pictures to search (only new, or all again) and which genre (one or all) when started in a terminal; options `--genre <id>`, `--all-genres`, `--new`, `--refresh` skip the questions. It uses Spotify ids from `scripts/spotify-ids.json` and `data/links.js` when it has them, paces its requests, and stops cleanly with the wait time when Spotify asks for a long pause. The owner starts it with a `.bat` launcher kept outside the repository (it holds the Spotify keys, `*.bat` is in `.gitignore`). The owner runs `node scripts/fetch-artist-images.js` for Phonk and `node scripts/fetch-artist-images.js --genre brazilian-phonk` for Brazilian Phonk. The Brazilian Phonk page looks in its own file first and then in the Phonk file, for artists that are in both lists. Each file maps the lowercase, accent-free name to a `https://i.scdn.co/...` URL (see the header of the script for the commands). It applies to roster rows and snapshot rows without their own `image`. Names that did not match exactly are listed in `scripts/artist-images-review.txt` (Phonk) or `scripts/artist-images-review-brazilian-phonk.txt` (Brazilian Phonk) and keep the initials monogram.
- `image`: path to a local file in `assets/artists/` (png, jpg, webp, or svg, lowercase letters, digits, dot, dash, underscore). Anything else is ignored and the row shows an initials monogram. Never point it at a Pandora or other external URL.
- Order inside the file does not matter. The page sorts snapshots by date and artists by listeners.

## Steps for a new snapshot

1. Take the 28-day listeners reading of every phonk artist you include (owner-supplied).
2. Add one snapshot object with the capture date.
3. Open `index.html` and check the ranking.
4. Add a line to `CHANGELOG.md`. Suggested commit message: `data: snapshot YYYY-MM-DD`.

## Rules

- Only numbers collected by hand and verified. No estimates, no averages, no placeholders.
- Keep the same inclusion rule between snapshots, and write it down in `TODO.md` under Open questions once decided.
- Sample data (not in use since v0.41.0): the owner may ask for fictional preview data. It must use fictional artist names, carry `sample: true` and a note saying it is not real, and be removed before the real launch. With `sample: true` the home page status chip reads "Sample data, not real".

## Importing artistMonthly.json

Trigger: the owner sends a site archive and an `artistMonthly.json` file and nothing else (AGENTS.md rule 10). The owner's words: "add new listeners, SETTWOR is entered 100 percent, for the others: if we already have information leave it alone, if it differs change it to the new one, if we do not have such an artist skip it". Do the steps below without asking.

File shape: a list of `{ artist, searchName, history: [{ monthlyListeners, monthlyText, takenAt, periodFrom, periodTo, few? }], pandoraUrl, linkSource, fits? }`. `monthlyListeners` is the number, `monthlyText` the figure as shown (for example `1.6K`), `few: true` means the source shows only "few listeners".

1. Reading per artist: the `history` entry with the newest `takenAt`. `monthlyListeners` set gives a number reading (`listeners` + `text`). `few: true` gives a `few` reading. `monthlyListeners: null` without `few`, or an empty `history`, is no reading: skip the artist and leave any existing row alone.
2. Our base is two separate lists: the verified base (rosters and snapshots in `data/snapshots.js`) and the unverified list (`data/unverified.js`). Match names ignoring case and accents. An artist in neither list is skipped and is never added anywhere. `banned` artists and `fits` (collaboration) entries are skipped.
3. SETTWOR (the owner) is always entered, 100 percent, in every genre roster that lists him, including when his reading is `few`.
4. Verified artist: the reading goes into the snapshot of each genre whose roster lists him (`{ name, listeners, text }` or `{ name, few: true }`). The snapshot is the one whose `capturedAt` equals the file's `takenAt` and whose period equals `periodFrom` to `periodTo`; if no such snapshot exists yet, create one for that date and period (one per genre) and keep older snapshots unchanged. Never edit an older snapshot to match newer numbers. Keep rows sorted by listeners, then the `few` rows.
5. Unverified artist: the reading goes into his own item in `data/unverified.js` (the item becomes `{ name, genre?, listeners, text }` or `{ name, genre?, few: true }`, keep `genre` when it is there). All readings in that file belong to the period in its `readings` field; when the file's period is older than the new one, replace every reading with the new import only for the artists that are in the new file, update `readings`, and leave the other items as they are. Never copy a unverified artist into the verified base.
6. Compare with what we already have for that artist: same reading, leave it untouched; different reading (including `few` versus a number), replace it with the new one; no reading, add it.
7. Links: for every artist of the file that is in our base, set the Pandora link `p` in `data/links.js` from `pandoraUrl` by the same rules (add if none, replace if different, leave if the same). Do not change `image`, rosters, or any other field.
8. Report to the owner (in Russian), separately for the verified and the unverified base: added, changed, unchanged, skipped (not in our base), skipped (banned), no reading, plus the names that were added or changed. Then bump the version, update `CHANGELOG.md` and `TODO.md`, run the checks from `AGENTS.md`, and build the archive without `data/artist-media*.js` (rule 9).

## Artist pages

Every artist with a reading gets a generated page (AGENTS.md rule 13). After any data change run `node scripts/build-all.js`: it rebuilds all pages, `data/artist-pages.js` and `sitemap.xml`. A new artist page is created automatically when a reading arrives. If an artist loses his reading or is banned, delete his old `<slug>.html` by hand (the script does not delete files) and rebuild.

## Links

`data/links.js` is `window.LEDGERTONE_LINKS = { "<key>": { p: "<Pandora URL>", s: "<Spotify artist id>" } }` (AGENTS.md rule 12). The key is the artist name lowercased, NFD normalized, with only the combining marks U+0300 to U+036F removed, trimmed (the same as `norm` in `assets/app.js`; a stricter normalization breaks names such as Dxrk with Japanese letters).

- `p`: from `pandoraUrl` of `artistMonthly.json`, `https://www.pandora.com` only. Filled by the artistMonthly import (step 7 above).
- `s`: from `spotifyId` of `artistBase.json` (22 letters and digits). Filled by the artistBase import: for every artist of that file that is in our base (verified or unverified list), add or replace the id. Never use `profileUrl` of that file, it is a musicmetricsvault link.
- Only artists in our base get an entry, never banned ones. Never guess a link or an id, a missing link just means no link on the page. Keep the entries sorted by key, one per line, and keep the header comment.
- Known gaps (v0.61.0): SETTWOR has a Pandora link but no Spotify id (the owner's file has none), artists that only exist in the verified roster have no Pandora link until a reading with `pandoraUrl` arrives.
