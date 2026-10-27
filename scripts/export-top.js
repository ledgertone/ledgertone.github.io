// Exports the current top list (AGENTS.md rule 19) per genre, to run new snapshots over it.
// Since v1.30.0 scripts/pack.js runs this into top100/ so the files are always inside the archive.
// usage: node scripts/export-top.js --out <dir>   writes Ledgertone top100.txt (names, one per line) and Ledgertone top100.json
// Order and places are the ones the home page shows: numbered artists by listeners, then "Few" artists by name.
const fs = require('fs'), path = require('path');
const lib = require('./lib/ledger.js');
const { L, topOf, topLimit, linksOf, snapsOf, genreName } = lib;
const i = process.argv.indexOf('--out');
const out = path.resolve(i > -1 ? process.argv[i + 1] : '.');
const version = JSON.parse(fs.readFileSync(path.join(lib.root, 'version.json'), 'utf8')).version;
const json = { version, topLimit, genres: {} };
const txt = [];
for (const g of L.genres) {
  const snaps = snapsOf(g.id);
  if (!snaps.length) continue;
  const rows = topOf(g.id).map((a) => ({ place: a.rank, name: a.name, listeners: a.few ? 'few' : a.listeners, verified: !a.unverified, pandoraUrl: linksOf(a.name).pandora || null }));
  json.genres[g.id] = { name: genreName(g.id), snapshot: snaps[0].capturedAt, count: rows.length, artists: rows };
  txt.push('# ' + genreName(g.id) + ' (top ' + rows.length + ', snapshot ' + snaps[0].capturedAt + ')');
  rows.forEach((r) => txt.push(r.name));
  txt.push('');
}
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'Ledgertone top100.txt'), txt.join('\r\n'));
fs.writeFileSync(path.join(out, 'Ledgertone top100.json'), JSON.stringify(json, null, 2));
console.log(Object.entries(json.genres).map(([k, v]) => k + ': ' + v.count).join(', '));
