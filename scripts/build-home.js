// Static ranking for the home page (owner decision, v0.81.0) so search engines and AI answers can read the table without
// running JavaScript. It writes the rows of the default genre (the first genre, Phonk), its latest snapshot, into index.html:
// the status chip, the meta line, the numbered rows of the table and an ItemList in the JSON-LD.
// assets/app.js replaces all of it as soon as it runs, so visitors with JavaScript see the same table as before.
// Only artists with a 28-day listeners number are written (the "Few" and "No data" rows stay JavaScript-only, they would add thousands of rows).
// Every name and number comes from the data files, nothing is typed by hand. Run after ANY data change and after every version bump:
// node scripts/build-home.js (or node scripts/build-all.js)
const lib = require('./lib/ledger.js');
const rankingFiles = require('./build-ranking-files.js'); // v1.26.0: ranking-<genre>.csv and .json, written first, linked below
const { topLimit, L, SITE, homeId, esc, month, num, snapsOf, rankedAt, artistCount, linksOf, safeUrl, pandoraLink, readCRLF, writeCRLF, LINKS, norm, pageFileOf, earlierPlaceAt, moveAt, OWNER, ownerNode } = lib;

const g = L.genres.find((x) => x.id === homeId);
const snaps = snapsOf(homeId);
if (!snaps.length) throw new Error('No snapshot for ' + g.name + ', home page not built');
const latest = snaps[0].capturedAt;
const total = artistCount(homeId);
const rows = rankedAt(homeId, 0).filter((a) => a.rank <= topLimit); // top list (rule 19)
const initials = (n) => String(n).trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase();
const medal = ['gold', 'silver', 'bronze'];

// owner mark (owner decision, v1.19.0, AGENTS.md rule 21): same markup as in assets/app.js
const ownerEarlier = earlierPlaceAt(homeId, 0, OWNER.name);
const drop = (a) => (norm(a.name) === norm(OWNER.name) && ownerEarlier !== null && a.rank > ownerEarlier)
  ? '<span class="dn" aria-label="Earlier place ' + ownerEarlier + '"><svg class="ar" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false"><path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>#' + ownerEarlier + '</span>' : '';
// change pills (owner request, v1.22.0, AGENTS.md rule 22): places moved against the previous snapshot of the genre, same markup as in assets/app.js
const moves = moveAt(homeId, 0);
const mv = (a) => {
  const d = a.unverified ? undefined : moves.get(norm(a.name));
  if (!d) return '';
  const n = Math.abs(d), word = n === 1 ? ' place' : ' places';
  return d > 0 ? '<span class="up" aria-label="Up ' + n + word + '"><svg class="ar" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false"><path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>' + n + '</span>' : '<span class="dn mv" aria-label="Down ' + n + word + '"><svg class="ar" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false"><path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>' + n + '</span>';
};
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
  return '<tr><td class="rk">' + rk + '</td><td class="who"><div class="wh' + (a.unverified ? ' hasfl' : '') + '"><span class="av mono">' + esc(initials(a.name)) + '</span><div class="info">' + name + '</div>' + flag + '</div></td><td class="st">' + num(a.listeners, 'en') + mv(a) + drop(a) + '</td></tr>';
};

const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebSite', '@id': SITE + '#site', name: 'Ledgertone', alternateName: 'ledgertone.settwor.com.pl', url: SITE, description: 'A snapshot ranking of phonk artists on Pandora by 28-day listeners.', inLanguage: 'en' },
  // v1.52.0: the Datasets below name SETTWOR as creator by @id, so the page carries the one shared SETTWOR entity and the Ledgertone organization (publisher)
  ownerNode(),
  { '@type': 'Organization', '@id': SITE + '#org', name: 'Ledgertone', url: SITE, logo: SITE + 'assets/icons/favicon-192.png', founder: { '@id': OWNER.site + '#artist' } },
  { '@type': 'ItemList', '@id': SITE + '#ranking', name: 'Top-' + topLimit + ' ' + g.name + ' Artists on Pandora by 28-day listeners, snapshot of ' + month(latest, 'en'), description: 'Artists with a 28-day listeners number in the Ledgertone snapshot of ' + month(latest, 'en') + '. A hand-collected snapshot, not live data.', itemListOrder: 'https://schema.org/ItemListOrderDescending', numberOfItems: rows.length, dateModified: latest,
    itemListElement: rows.map((a) => { const pf = pageFileOf(a.name), u = pf ? SITE + pf : (a.profileUrl && safeUrl(a.profileUrl)) || linksOf(a.name).pandora; return Object.assign({ '@type': 'ListItem', position: a.rank, name: a.name, description: num(a.listeners, 'en') + ' listeners over 28 days on Pandora' }, u ? { url: u } : {}); }) }
].concat(rankingFiles.map((f) => ({ '@type': 'Dataset', '@id': SITE + '#data-' + f.id, name: 'Ledgertone ' + f.genre + ' ranking on Pandora by 28-day listeners, snapshot of ' + month(f.snapshot, 'en'), description: 'The top ' + f.count + ' ' + f.genre + ' artists on Pandora by 28-day listeners in the Ledgertone snapshot of ' + month(f.snapshot, 'en') + '. A hand-collected snapshot, not live data.', url: SITE, creator: { '@id': OWNER.site + '#artist' }, publisher: { '@id': SITE + '#org' }, license: 'https://creativecommons.org/licenses/by/4.0/', isAccessibleForFree: true, keywords: 'phonk, Pandora, 28-day listeners, ranking, ' + f.genre, dateModified: f.snapshot, temporalCoverage: f.snapshot, inLanguage: 'en', distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: SITE + f.csv }, { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: SITE + f.json }] }))) };

// owner line (owner request, v1.51.3): "The ranking is run by SETTWOR, who is #N in it", under the heading and in the meta description, so the
// disclosure travels with the figure in snippets and AI answers. The place is computed from the same ranked list as the table (never typed),
// the same count as render() in assets/app.js. If he has no number in this snapshot the line says only that he is also listed.
const ownerRow = rankedAt(homeId, 0).find((r) => norm(r.name) === norm(OWNER.name));
const ownerTail = ownerRow ? ', who is #' + ownerRow.rank + ' in it.' : ', who is also listed in the rankings.';
const ownerNote = '<p class="ownernote" id="ownernote">The ranking is run by ' + esc(OWNER.name) + esc(ownerTail) + ' <a href="about.html">Who runs Ledgertone</a></p>';
const DESC_OLD = 'A snapshot ranking of phonk artists on Pandora by 28-day listeners.';
const DESC_NEW = DESC_OLD + ' The ranking is run by ' + OWNER.name + ownerTail;

ld['@graph'][0].description = DESC_NEW;
let h = readCRLF('index.html');
const sub = (re, s) => { if (!re.test(h)) throw new Error('index.html changed, pattern missing: ' + re); h = h.replace(re, () => s); };
const feedRe = /(<link rel="alternate" type="application\/atom\+xml"[^>]*>)(\n<link rel="alternate" type="(?:text\/csv|application\/json)"[^>]*>)*/;
if (!feedRe.test(h)) throw new Error('index.html changed, feed link missing');
h = h.replace(feedRe, (m0, feedLink) => feedLink + rankingFiles.map((f) => '\n<link rel="alternate" type="text/csv" title="Ledgertone ' + f.genre + ' ranking (CSV)" href="' + f.csv + '">\n<link rel="alternate" type="application/json" title="Ledgertone ' + f.genre + ' ranking (JSON)" href="' + f.json + '">').join(''));
sub(/<p class="status glass" id="status"[^>]*>.*?<\/p>/, '<p class="status glass" id="status" hidden></p>'); // the "Latest Pandora snapshot" label was removed by the owner (v0.86.0), the chip stays hidden until app.js has a warning to show
sub(/<p class="meta" id="meta">.*?<\/p>/, '<p class="meta" id="meta">' + month(latest, 'en') + ' \u00b7 ' + (total > topLimit ? 'Top ' + num(topLimit, 'en') + ' of ' : '') + num(total, 'en') + ' artists</p>');
sub(/<p class="topnote" id="topnote"[^>]*>.*?<\/p>/, total > topLimit ? '<p class="topnote" id="topnote">Ledgertone follows the top ' + num(topLimit, 'en') + ' artists of each genre. The list of all other artists is not updated. <a href="all.html">See the list of all artists</a></p>' : '<p class="topnote" id="topnote" hidden></p>');
const citeP = (pre) => '<p class="cite" id="cite">Cite this snapshot: <a href="' + pre + '#' + g.id + '-' + latest + '">' + SITE + pre + '#' + g.id + '-' + latest + '</a></p>'; // rule 23
sub(/<p class="cite" id="cite"[^>]*>.*?<\/p>/, citeP(''));
sub(/<div class="tools" id="tools"( hidden)?>/, '<div class="tools" id="tools" hidden>');
sub(/<div class="foot" id="foot"( hidden)?>/, '<div class="foot" id="foot" hidden>');
sub(/<tbody id="list">[\s\S]*?<\/tbody>/, '<tbody id="list">\n' + rows.map(tr).join('\n') + '\n</tbody>');
sub(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="meta">Search, paging and the other genres need JavaScript. The table above lists the artists with a number in the ' + g.name + ' snapshot.</p></noscript>');
const sizesTop = '<div class="picker glass glass-flat sizes" id="sizes" role="group" aria-label="Artists per page"><span>Per page</span><button type="button" data-size="25" aria-pressed="true">25</button><button type="button" data-size="50" aria-pressed="false">50</button><button type="button" data-size="75" aria-pressed="false">75</button><button type="button" data-size="100" aria-pressed="false">100</button></div>';
const sizesAll = '<div class="picker glass glass-flat sizes" id="sizes" role="group" aria-label="Artists per page"><span>Per page</span><button type="button" data-size="25" aria-pressed="true">25</button><button type="button" data-size="50" aria-pressed="false">50</button><button type="button" data-size="100" aria-pressed="false">100</button><button type="button" data-size="200" aria-pressed="false">200</button><button type="button" data-size="0" aria-pressed="false">All</button></div>';
const sizesRe = /<div class="picker glass glass-flat sizes" id="sizes"[^>]*>.*?<\/div>/;
sub(sizesRe, sizesTop);
const top = 'Top-' + num(topLimit, 'en');
sub(/<h1 class="gh">.*?<\/h1>(\n    <p class="ownernote"[^>]*>.*?<\/p>)?/, '<h1 class="gh">' + top + ' <span class="gn">' + esc(g.name) + '</span> Artists <span class="lt">on Pandora</span></h1>\n    ' + ownerNote);
h = h.replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")A snapshot ranking of phonk artists on Pandora by 28-day listeners\.[^"]*(">)/g, (m0, a1, a2) => a1 + esc(DESC_NEW) + a2);
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
asub(/<h1 class="gh">.*?<\/h1>(\n    <p class="ownernote"[^>]*>.*?<\/p>)?/, '<h1 class="gh">All <span class="gn">' + esc(g.name) + '</span> Artists <span class="lt">on Pandora</span></h1>\n    ' + ownerNote);
asub(sizesRe, sizesAll);
asub(/<p class="meta" id="meta">.*?<\/p>/, '<p class="meta" id="meta">' + month(latest, 'en') + ' \u00b7 ' + num(total, 'en') + ' artists</p>');
asub(/<p class="topnote" id="topnote"[^>]*>.*?<\/p>/, '<p class="topnote" id="topnote">This is the full list. Ledgertone follows only the top ' + num(topLimit, 'en') + ' artists of each genre, the figures of all other artists are not updated. <a href="index.html">Back to the top ' + num(topLimit, 'en') + '</a></p>');
asub(/<p class="cite" id="cite"[^>]*>.*?<\/p>/, citeP('all.html'));
asub(/<tbody id="list">[\s\S]*?<\/tbody>/, '<tbody id="list">\n</tbody>');
asub(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="meta">The full list needs JavaScript. The top ' + num(topLimit, 'en') + ' artists are on the home page.</p></noscript>');
asub(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': [ld['@graph'][0]] }).replace(/</g, '\\u003c') + '</script>');
writeCRLF('all.html', a);
console.log('built index.html: ' + g.name + ', ' + month(latest, 'en') + ', ' + rows.length + ' numbered rows, ' + total + ' artists in the meta line, top ' + topLimit);
