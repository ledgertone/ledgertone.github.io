// SETTWOR listeners on the platforms other than Pandora (v1.51.0, AGENTS.md rule 25). Only numbers the owner collected (rule 2).
// Pandora is not here: it is read from the latest snapshot in data/snapshots.js. null = no data yet, the page then reads "No data".
// Optional extra figures of the same reading (same date): followers (whole number), popularity (0 to 100, Spotify's own score). Shown under the metric name, never added to the sum.
// To publish a platform, fill listeners (a whole number) and date (YYYY-MM-DD, the day the number was read), then run node scripts/build-all.js.
window.LEDGERTONE_PLATFORMS = [
  { name: 'Spotify', metric: 'Monthly listeners', listeners: 5191, date: '2026-11-01', followers: 179, popularity: 16 },
  { name: 'Apple Music', metric: 'Monthly listeners', listeners: null, date: null },
  { name: 'YouTube', metric: 'Monthly listeners', listeners: null, date: null }
];
