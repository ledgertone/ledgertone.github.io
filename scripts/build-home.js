// Static ranking for the home page (owner decision, v0.81.0) so search engines and AI answers can read the table without
// running JavaScript. It writes the rows of the default genre (the first genre, Phonk), its latest snapshot, into index.html:
// the status chip, the meta line, the numbered rows of the table and an ItemList in the JSON-LD.
// assets/app.js replaces all of it as soon as it runs, so visitors with JavaScript see the same table as before.
// Only artists with a 28-day listeners number are written (the "Few" and "No data" rows stay JavaScript-only, they would add thousands of rows).
// Every name and number comes from the data files, nothing is typed by hand. Run after ANY data change and after every version bump:
// node scripts/build-home.js (or node scripts/build-all.js)
const lib = require('./lib/ledger.js');
const { L, SITE, homeId, esc, month, num, snapsOf, rankedAt, artistCount, linksOf, safeUrl, pandoraLink, readCRLF, writeCRLF, LINKS, norm, pageFileOf } = lib;

const g = L.genres.find((x) => x.id === homeId);
const snaps = snapsOf(homeId);
if (!snaps.length) throw new Error('No snapshot for ' + g.name + ', home page not built');
const latest = snaps[0].capturedAt;
const rows = rankedAt(homeId, 0);
const initials = (n) => String(n).trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase();
const medal = ['gold', 'silver', 'bronze'];

// same markup as draw() in assets/app.js, without the picture and the link pills
const tr = (a) => {
  const lk = LINKS[norm(a.name)] || {};
  const url = (a.profileUrl && safeUrl(a.profileUrl)) || pandoraLink(lk.p);
  const pg = pageFileOf(a.name);
  const name = pg ? '<a class="nm" href="' + esc(pg) + '" title="' + esc(a.name) + '">' + esc(a.name) + '</a>' : url ? '<a class="nm" href="' + esc(url) + '" rel="noopener" title="' + esc(a.name) + '">' + esc(a.name) + '</a>' : '<span class="nm" title="' + esc(a.name) + '">' + esc(a.name) + '</span>';
  let flag = '';
  if (a.unverified) {
    const full = 'Genre not verified' + (a.src ? ' (listed as ' + a.src + ')' : '') + ', may be here by mistake';
    flag = '<span class="flag" title="' + esc(full) + '"><span class="fl">' + esc(full) + '</span><span class="fs">Not verified</span></span>';
  }
  const rk = a.rank <= 3 ? '<span class="mdl ' + medal[a.rank - 1] + '" aria-label="Place ' + a.rank + '">' + a.rank + '</span>' : String(a.rank);
  return '<tr><td class="rk">' + rk + '</td><td class="who"><div class="wh' + (a.unverified ? ' hasfl' : '') + '"><span class="av mono">' + esc(initials(a.name)) + '</span><div class="info">' + name + '</div>' + flag + '</div></td><td class="st">' + num(a.listeners, 'en') + '</td></tr>';
};

const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebSite', '@id': SITE + '#site', name: 'Ledgertone', url: SITE, description: 'A snapshot ranking of phonk artists on Pandora by 28-day listeners.', inLanguage: 'en' },
  { '@type': 'ItemList', '@id': SITE + '#ranking', name: 'Top ' + g.name + ' Artists on Pandora by 28-day listeners, snapshot of ' + month(latest, 'en'), description: 'Artists with a 28-day listeners number in the Ledgertone snapshot of ' + month(latest, 'en') + '. A hand-collected snapshot, not live data.', itemListOrder: 'https://schema.org/ItemListOrderDescending', numberOfItems: rows.length, dateModified: latest,
    itemListElement: rows.map((a) => { const pf = pageFileOf(a.name), u = pf ? SITE + pf : (a.profileUrl && safeUrl(a.profileUrl)) || linksOf(a.name).pandora; return Object.assign({ '@type': 'ListItem', position: a.rank, name: a.name, description: num(a.listeners, 'en') + ' listeners over 28 days on Pandora' }, u ? { url: u } : {}); }) }
] };

let h = readCRLF('index.html');
const sub = (re, s) => { if (!re.test(h)) throw new Error('index.html changed, pattern missing: ' + re); h = h.replace(re, () => s); };
sub(/<p class="status glass" id="status"[^>]*>.*?<\/p>/, '<p class="status glass" id="status" hidden></p>'); // the "Latest Pandora snapshot" label was removed by the owner (v0.86.0), the chip stays hidden until app.js has a warning to show
sub(/<p class="meta" id="meta">.*?<\/p>/, '<p class="meta" id="meta">' + month(latest, 'en') + ' \u00b7 ' + num(artistCount(homeId), 'en') + ' artists</p>');
sub(/<div class="tools" id="tools"( hidden)?>/, '<div class="tools" id="tools" hidden>');
sub(/<div class="foot" id="foot"( hidden)?>/, '<div class="foot" id="foot" hidden>');
sub(/<tbody id="list">[\s\S]*?<\/tbody>/, '<tbody id="list">\n' + rows.map(tr).join('\n') + '\n</tbody>');
sub(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="meta">Search, paging and the other genres need JavaScript. The table above lists the artists with a number in the ' + g.name + ' snapshot.</p></noscript>');
sub(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>');
writeCRLF('index.html', h);
console.log('built index.html: ' + g.name + ', ' + month(latest, 'en') + ', ' + rows.length + ' numbered rows, ' + artistCount(homeId) + ' artists in the meta line');
