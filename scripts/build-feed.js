// Feed of updates (v1.25.0, assistant idea from TODO): feed.xml, Atom 1.0, one entry per snapshot of every genre, newest first.
// Generated from data/snapshots.js with the same ranking logic as the site (rankedAt), nothing is typed by hand, never edit feed.xml by hand.
// The entries say "snapshot" and never imply live data (AGENTS.md rule 3). Run after ANY data change: node scripts/build-feed.js (or node scripts/build-all.js).
const lib = require('./lib/ledger.js');
const { L, SITE, esc, month, num, snapsOf, rankedAt, genreName, topLimit, writeCRLF } = lib;

const entries = [];
L.genres.forEach((g) => {
  snapsOf(g.id).forEach((s, i) => {
    if (!s.capturedAt) return;
    const ranked = rankedAt(g.id, i).filter((a) => a.rank <= topLimit);
    const top = ranked.slice(0, 3).map((a) => a.rank + '. ' + a.name + ' (' + num(a.listeners) + ')').join(', ');
    const when = month(s.capturedAt);
    const summary = 'Snapshot of ' + when + ' for ' + g.name + ' on Pandora by 28-day listeners. ' + ranked.length + ' artists in the top list.' + (top ? ' Top 3: ' + top + '.' : '') + (g.devwarn ? ' This section is under development, the data is raw and incomplete.' : '') + ' A hand-collected snapshot, not live data.';
    entries.push({ date: s.capturedAt, gi: L.genres.indexOf(g), id: 'tag:ledgertone.github.io,' + s.capturedAt + ':' + g.id, title: g.name + ' snapshot, ' + when, summary });
  });
});
entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.gi - b.gi));
if (!entries.length) throw new Error('No snapshots, feed.xml not built');
const stamp = (d) => d + 'T00:00:00Z';
const xml = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<feed xmlns="http://www.w3.org/2005/Atom">',
  '  <title>Ledgertone: new snapshots</title>',
  '  <subtitle>One entry for every new snapshot of phonk artists on Pandora by 28-day listeners.</subtitle>',
  '  <link rel="self" type="application/atom+xml" href="' + SITE + 'feed.xml"/>',
  '  <link rel="alternate" type="text/html" href="' + SITE + '"/>',
  '  <id>' + SITE + '</id>',
  '  <updated>' + stamp(entries[0].date) + '</updated>',
  '  <author><name>Ledgertone</name></author>'
].concat(entries.map((e) => [
  '  <entry>',
  '    <title>' + esc(e.title) + '</title>',
  '    <link rel="alternate" type="text/html" href="' + SITE + '"/>',
  '    <id>' + esc(e.id) + '</id>',
  '    <updated>' + stamp(e.date) + '</updated>',
  '    <summary>' + esc(e.summary) + '</summary>',
  '  </entry>'
].join('\n'))).concat(['</feed>', '']).join('\n');
writeCRLF('feed.xml', xml);
console.log('built feed.xml: ' + entries.length + ' entries');
