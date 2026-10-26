// Static ranking for the home page (owner decision, v0.81.0) so search engines and AI answers can read the table without
// running JavaScript. It writes the rows of the default genre (the first genre, Phonk), its latest snapshot, into index.html:
// the status chip, the meta line, the numbered rows of the table and an ItemList in the JSON-LD.
// assets/app.js replaces all of it as soon as it runs, so visitors with JavaScript see the same table as before.
// Only artists with a 28-day listeners number are written (the "Few" and "No data" rows stay JavaScript-only, they would add thousands of rows).
// Every name and number comes from the data files, nothing is typed by hand. Run after ANY data change and after every version bump:
// node scripts/build-home.js (or node scripts/build-all.js)
const lib = require('./lib/ledger.js');
const { topLimit, L, SITE, homeId, esc, month, num, snapsOf, rankedAt, artistCount, linksOf, safeUrl, pandoraLink, readCRLF, writeCRLF, LINKS, norm, pageFileOf } = lib;

const g = L.genres.find((x) => x.id === homeId);
const snaps = snapsOf(homeId);
if (!snaps.length) throw new Error('No snapshot for ' + g.name + ', home page not built');
const latest = snaps[0].capturedAt;
const total = artistCount(homeId);
const rows = rankedAt(homeId, 0).filter((a) => a.rank <= topLimit); // top list (rule 19)
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
  { '@type': 'WebSite', '@id': SITE + '#site', name: 'Ledgertone', alternateName: 'ledgertone.github.io', url: SITE, description: 'A snapshot ranking of phonk artists on Pandora by 28-day listeners.', inLanguage: 'en' },
  { '@type': 'ItemList', '@id': SITE + '#ranking', name: 'Top-' + topLimit + ' ' + g.name + ' Artists on Pandora by 28-day listeners, snapshot of ' + month(latest, 'en'), description: 'Artists with a 28-day listeners number in the Ledgertone snapshot of ' + month(latest, 'en') + '. A hand-collected snapshot, not live data.', itemListOrder: 'https://schema.org/ItemListOrderDescending', numberOfItems: rows.length, dateModified: latest,
    itemListElement: rows.map((a) => { const pf = pageFileOf(a.name), u = pf ? SITE + pf : (a.profileUrl && safeUrl(a.profileUrl)) || linksOf(a.name).pandora; return Object.assign({ '@type': 'ListItem', position: a.rank, name: a.name, description: num(a.listeners, 'en') + ' listeners over 28 days on Pandora' }, u ? { url: u } : {}); }) }
] };

let h = readCRLF('index.html');
const sub = (re, s) => { if (!re.test(h)) throw new Error('index.html changed, pattern missing: ' + re); h = h.replace(re, () => s); };
sub(/<p class="status glass" id="status"[^>]*>.*?<\/p>/, '<p class="status glass" id="status" hidden></p>'); // the "Latest Pandora snapshot" label was removed by the owner (v0.86.0), the chip stays hidden until app.js has a warning to show
sub(/<p class="meta" id="meta">.*?<\/p>/, '<p class="meta" id="meta">' + month(latest, 'en') + ' \u00b7 ' + (total > topLimit ? 'Top ' + num(topLimit, 'en') + ' of ' : '') + num(total, 'en') + ' artists</p>');
sub(/<p class="topnote" id="topnote"[^>]*>.*?<\/p>/, total > topLimit ? '<p class="topnote" id="topnote">Ledgertone follows the top ' + num(topLimit, 'en') + ' artists of each genre. The list of all other artists is not updated. <a href="all.html">See the list of all artists</a></p>' : '<p class="topnote" id="topnote" hidden></p>');
sub(/<div class="tools" id="tools"( hidden)?>/, '<div class="tools" id="tools" hidden>');
sub(/<div class="foot" id="foot"( hidden)?>/, '<div class="foot" id="foot" hidden>');
sub(/<tbody id="list">[\s\S]*?<\/tbody>/, '<tbody id="list">\n' + rows.map(tr).join('\n') + '\n</tbody>');
sub(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="meta">Search, paging and the other genres need JavaScript. The table above lists the artists with a number in the ' + g.name + ' snapshot.</p></noscript>');
const sizesTop = '<div class="picker glass glass-flat sizes" id="sizes" role="group" aria-label="Artists per page"><span>Per page</span><button type="button" data-size="25" aria-pressed="true">25</button><button type="button" data-size="50" aria-pressed="false">50</button><button type="button" data-size="75" aria-pressed="false">75</button><button type="button" data-size="100" aria-pressed="false">100</button></div>';
const sizesAll = '<div class="picker glass glass-flat sizes" id="sizes" role="group" aria-label="Artists per page"><span>Per page</span><button type="button" data-size="25" aria-pressed="true">25</button><button type="button" data-size="50" aria-pressed="false">50</button><button type="button" data-size="100" aria-pressed="false">100</button><button type="button" data-size="200" aria-pressed="false">200</button><button type="button" data-size="0" aria-pressed="false">All</button></div>';
const sizesRe = /<div class="picker glass glass-flat sizes" id="sizes"[^>]*>.*?<\/div>/;
sub(sizesRe, sizesTop);
const top = 'Top-' + num(topLimit, 'en');
sub(/<h1 class="gh">.*?<\/h1>/, '<h1 class="gh">' + top + ' <span class="gn">' + esc(g.name) + '</span> Artists <span class="lt">on Pandora</span></h1>');
h = h.replace(/Top Phonk Artists on Pandora/g, top + ' ' + g.name + ' Artists on Pandora');
sub(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>');
writeCRLF('index.html', h);

// all.html (v1.15.0): the full list of every artist, same page and same script, body data-view="all"; the rows are drawn by assets/app.js only (thousands of rows stay JavaScript-only)
let a = h;
const asub = (re, s) => { if (!re.test(a)) throw new Error('all.html pattern missing: ' + re); a = a.replace(re, () => s); };
asub(/<body>/, '<body data-view="all">');
a = a.split(top + ' ' + g.name + ' Artists on Pandora').join('All ' + g.name + ' Artists on Pandora');
asub(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + SITE + 'all.html">');
asub(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + SITE + 'all.html">');
asub(/<h1 class="gh">.*?<\/h1>/, '<h1 class="gh">All <span class="gn">' + esc(g.name) + '</span> Artists <span class="lt">on Pandora</span></h1>');
asub(sizesRe, sizesAll);
asub(/<p class="meta" id="meta">.*?<\/p>/, '<p class="meta" id="meta">' + month(latest, 'en') + ' \u00b7 ' + num(total, 'en') + ' artists</p>');
asub(/<p class="topnote" id="topnote"[^>]*>.*?<\/p>/, '<p class="topnote" id="topnote">This is the full list. Ledgertone follows only the top ' + num(topLimit, 'en') + ' artists of each genre, the figures of all other artists are not updated. <a href="index.html">Back to the top ' + num(topLimit, 'en') + '</a></p>');
asub(/<tbody id="list">[\s\S]*?<\/tbody>/, '<tbody id="list">\n</tbody>');
asub(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="meta">The full list needs JavaScript. The top ' + num(topLimit, 'en') + ' artists are on the home page.</p></noscript>');
asub(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': [ld['@graph'][0]] }).replace(/</g, '\\u003c') + '</script>');
writeCRLF('all.html', a);
console.log('built index.html: ' + g.name + ', ' + month(latest, 'en') + ', ' + rows.length + ' numbered rows, ' + total + ' artists in the meta line, top ' + topLimit);
