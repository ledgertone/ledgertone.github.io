// Machine-readable ranking (v1.26.0, assistant idea from TODO): ranking-<genre>.csv and ranking-<genre>.json, the top list of the latest snapshot of every genre.
// Same places and order as the home page (topOf, AGENTS.md rule 19), nothing is typed by hand, never edit the generated files by hand.
// v1.37.0: every OLDER snapshot of a genre also gets ranking-<genre>-<YYYY-MM-DD>.csv and .json (numbered artists of that snapshot only, places 1 to topLimit,
// verified artists only because unverified artists exist only in the latest snapshot, no \"Few\" rows). The latest snapshot keeps the plain names. With one snapshot per genre nothing extra is written.
// Says "snapshot" and never implies live data (rule 3). Run after ANY data change: node scripts/build-ranking-files.js (or node scripts/build-all.js).
const lib = require('./lib/ledger.js');
const { L, SITE, topOf, rankedAt, topLimit, snapsOf, genreName, linksOf, month, writeCRLF } = lib;

const q = (v) => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const files = [];
const rowsOf = (list) => list.map((a) => ({ place: a.rank, artist: a.name, listeners: a.few ? 'Few' : a.listeners, verified: !a.unverified, pandora: linksOf(a.name).pandora || '' }));
const writePair = (g, s, rows, stem, older) => {
  const csvName = stem + '.csv', jsonName = stem + '.json';
  const csv = [['snapshot_date', 'genre', 'place', 'artist', 'listeners_28d', 'genre_verified', 'pandora_url']]
    .concat(rows.map((r) => [s.capturedAt, genreName(g.id), r.place, r.artist, r.listeners, r.verified ? 'yes' : 'no', r.pandora]));
  writeCRLF(csvName, csv.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
  const json = {
    name: 'Ledgertone ' + genreName(g.id) + ' ranking on Pandora by 28-day listeners',
    publisher: 'Ledgertone',
    url: SITE,
    genre: genreName(g.id),
    snapshot: s.capturedAt,
    note: 'A hand-collected snapshot of ' + month(s.capturedAt, 'en') + ', not live data. ' + (older ? 'An earlier snapshot: the top ' + topLimit + ' of the artists with a 28-day listeners number in it, places counted by 28-day listeners.' : 'The top ' + topLimit + ' of the list, places counted by 28-day listeners, \"Few\" artists follow the numbered ones.'),
    license: 'https://creativecommons.org/licenses/by/4.0/',
    count: rows.length,
    artists: rows.map((r) => ({ place: r.place, artist: r.artist, listeners_28d: r.listeners, genre_verified: r.verified, pandora_url: r.pandora || null }))
  };
  return { csvName, jsonName, json };
};
L.genres.forEach((g) => {
  const all = snapsOf(g.id);
  const s = all[0];
  if (!s || !s.capturedAt) return;
  // older snapshots first, so the latest JSON can list them
  const earlier = [];
  all.slice(1).forEach((o, i) => {
    if (!o.capturedAt) return;
    const rows = rowsOf(rankedAt(g.id, i + 1).filter((a) => a.rank <= topLimit));
    if (!rows.length) return;
    const stem = 'ranking-' + g.id + '-' + o.capturedAt;
    const w = writePair(g, o, rows, stem, true);
    writeCRLF(w.jsonName, JSON.stringify(w.json, null, 1) + '\n');
    earlier.push({ snapshot: o.capturedAt, csv: w.csvName, json: w.jsonName, count: rows.length });
    console.log('built ' + w.csvName + ' and ' + w.jsonName + ': ' + rows.length + ' rows (earlier snapshot)');
  });
  const rows = rowsOf(topOf(g.id));
  const w = writePair(g, s, rows, 'ranking-' + g.id, false);
  if (earlier.length) w.json.earlier_snapshots = earlier.map((e) => ({ snapshot: e.snapshot, csv: SITE + e.csv, json: SITE + e.json }));
  writeCRLF(w.jsonName, JSON.stringify(w.json, null, 1) + '\n');
  files.push({ id: g.id, genre: genreName(g.id), snapshot: s.capturedAt, csv: w.csvName, json: w.jsonName, count: rows.length, earlier });
  console.log('built ' + w.csvName + ' and ' + w.jsonName + ': ' + rows.length + ' rows');
});
if (!files.length) throw new Error('No snapshots, ranking files not built');
module.exports = files;
