// Ban guard (owner decision, v0.75.0). Exits with code 1 if a banned artist is still anywhere in the data:
// rosters and snapshots (data/snapshots.js), the unverified list (data/unverified.js) or the links (data/links.js).
// Run before every archive: node scripts/check-banned.js
// Names are matched like the page does: lowercase, accents stripped.
const path = require('path');
global.window = {};
const root = path.join(__dirname, '..');
['snapshots', 'unverified', 'links'].forEach((f) => require(path.join(root, 'data', f + '.js')));
const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const L = window.LEDGERTONE || {};
const banned = new Set((L.banned || []).map(norm));
const hits = [];
const test = (name, where) => { if (name && banned.has(norm(name))) hits.push(where + ': ' + name); };
(L.genres || []).forEach((g) => (g.roster || []).forEach((n) => test(n, 'roster ' + g.id)));
(L.snapshots || []).forEach((s) => (s.artists || []).forEach((x) => test(x && x.name, 'snapshot ' + s.genre + ' ' + s.capturedAt)));
const groups = (window.LEDGERTONE_UNVERIFIED && window.LEDGERTONE_UNVERIFIED.groups) || {};
Object.keys(groups).forEach((id) => (groups[id] || []).forEach((x) => test(typeof x === 'string' ? x : x && x.name, 'unverified ' + id)));
Object.keys(window.LEDGERTONE_LINKS || {}).forEach((k) => test(k, 'links'));
if (hits.length) { console.error('Banned artists found in the data:\n' + hits.join('\n')); process.exit(1); }
console.log('ok: no banned artist in rosters, snapshots, unverified list or links (' + banned.size + ' banned)');
