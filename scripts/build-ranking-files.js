// Machine-readable ranking (v1.26.0, assistant idea from TODO): ranking-<genre>.csv and ranking-<genre>.json, the top list of the latest snapshot of every genre.
// Same places and order as the home page (topOf, AGENTS.md rule 19), nothing is typed by hand, never edit the generated files by hand.
// Says "snapshot" and never implies live data (rule 3). Run after ANY data change: node scripts/build-ranking-files.js (or node scripts/build-all.js).
const lib = require('./lib/ledger.js');
const { L, SITE, topOf, topLimit, snapsOf, genreName, linksOf, month, writeCRLF } = lib;

const q = (v) => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const files = [];
L.genres.forEach((g) => {
  const s = snapsOf(g.id)[0];
  if (!s || !s.capturedAt) return;
  const rows = topOf(g.id).map((a) => ({ place: a.rank, artist: a.name, listeners: a.few ? 'Few' : a.listeners, verified: !a.unverified, pandora: linksOf(a.name).pandora || '' }));
  const csvName = 'ranking-' + g.id + '.csv', jsonName = 'ranking-' + g.id + '.json';
  const csv = [['snapshot_date', 'genre', 'place', 'artist', 'listeners_28d', 'genre_verified', 'pandora_url']]
    .concat(rows.map((r) => [s.capturedAt, genreName(g.id), r.place, r.artist, r.listeners, r.verified ? 'yes' : 'no', r.pandora]));
  writeCRLF(csvName, csv.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
  const json = {
    name: 'Ledgertone ' + genreName(g.id) + ' ranking on Pandora by 28-day listeners',
    publisher: 'Ledgertone',
    url: SITE,
    genre: genreName(g.id),
    snapshot: s.capturedAt,
    note: 'A hand-collected snapshot of ' + month(s.capturedAt, 'en') + ', not live data. The top ' + topLimit + ' of the list, places counted by 28-day listeners, "Few" artists follow the numbered ones.' + (g.devwarn ? ' This section is under development, the data is raw and incomplete.' : ''),
    license: 'https://creativecommons.org/licenses/by/4.0/',
    count: rows.length,
    artists: rows.map((r) => ({ place: r.place, artist: r.artist, listeners_28d: r.listeners, genre_verified: r.verified, pandora_url: r.pandora || null }))
  };
  writeCRLF(jsonName, JSON.stringify(json, null, 1) + '\n');
  files.push({ id: g.id, genre: genreName(g.id), snapshot: s.capturedAt, csv: csvName, json: jsonName, count: rows.length });
  console.log('built ' + csvName + ' and ' + jsonName + ': ' + rows.length + ' rows');
});
if (!files.length) throw new Error('No snapshots, ranking files not built');
module.exports = files;
