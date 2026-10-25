// Builds the static artist pages (owner decision, v0.76.0) so search engines and AI answers can read the number
// without running JavaScript. Every number and date comes from data/snapshots.js and data/links.js, nothing is typed by hand.
// Run after ANY data change and after every version bump: node scripts/build-artist-pages.js
// The page shell is copied from about.html (head snippet with Consent Mode, nav, footer, version tags).
const fs = require('fs');
const path = require('path');
global.window = {};
const root = path.join(__dirname, '..');
['snapshots', 'links'].forEach((f) => require(path.join(root, 'data', f + '.js')));
const L = window.LEDGERTONE, LINKS = window.LEDGERTONE_LINKS || {};
const SITE = 'https://ledgertone.github.io/';
const ARTISTS = [{ name: 'SETTWOR', file: 'settwor.html' }];
const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nf = new Intl.NumberFormat('en-US');
const month = (d) => new Date(d + 'T00:00:00Z').toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const genreName = (id) => (L.genres.find((g) => g.id === id) || {}).name || id;
const banned = new Set((L.banned || []).map(norm));
const nl = '\r\n';
const tpl = fs.readFileSync(path.join(root, 'about.html'), 'utf8').replace(/\r\n/g, '\n');

ARTISTS.forEach((a) => {
  if (banned.has(norm(a.name))) throw new Error(a.name + ' is banned');
  // latest reading per genre (a number or "few")
  const rows = [];
  L.genres.forEach((g) => {
    const snaps = L.snapshots.filter((s) => s.genre === g.id).sort((p, q) => (p.capturedAt < q.capturedAt ? 1 : -1));
    for (const s of snaps) {
      const x = (s.artists || []).find((y) => norm(y.name) === norm(a.name));
      if (x && (Number.isFinite(x.listeners) || x.few === true)) { rows.push({ genre: g.id, date: s.capturedAt, x }); break; }
    }
  });
  if (!rows.length) throw new Error('No reading for ' + a.name + ', page not built');
  const latest = rows.map((r) => r.date).sort().pop();
  const top = rows.filter((r) => r.date === latest)[0];
  const num = Number.isFinite(top.x.listeners);
  const label = num ? nf.format(top.x.listeners) + ' (shown by Pandora as ' + top.x.text + ')' : 'Few';
  const answer = num
    ? a.name + ' had ' + nf.format(top.x.listeners) + ' listeners over 28 days on Pandora in the Ledgertone snapshot of ' + month(latest) + ' (Pandora showed ' + top.x.text + ').'
    : 'In the Ledgertone snapshot of ' + month(latest) + ', Pandora showed "Few" as the 28-day listeners of ' + a.name + ', not a number.';
  const genres = rows.map((r) => genreName(r.genre));
  const same = rows.every((r) => r.x.listeners === top.x.listeners && r.x.few === top.x.few);
  const second = rows.length > 1 && same ? 'The same reading is listed in ' + genres.join(' and ') + '.' : 'Listed in ' + genres.join(' and ') + '.';
  const lk = LINKS[norm(a.name)] || {};
  const pandora = lk.p && /^https:\/\/www\.pandora\.com\//.test(lk.p) ? lk.p : null;
  const spotify = lk.s && /^[A-Za-z0-9]+$/.test(lk.s) ? 'https://open.spotify.com/artist/' + lk.s : null;
  const url = SITE + a.file;
  const title = a.name + ' on Pandora: 28-day listeners (' + month(latest) + ') | Ledgertone';
  const desc = answer + ' A hand-collected snapshot, not live data.';

  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url + '#page', url, name: title, description: desc, inLanguage: 'en', dateModified: latest, isPartOf: { '@type': 'WebSite', name: 'Ledgertone', url: SITE }, about: { '@id': url + '#artist' }, mainEntity: { '@id': url + '#faq' } },
    { '@type': 'MusicGroup', '@id': url + '#artist', name: a.name, sameAs: [pandora, spotify].filter(Boolean) },
    { '@type': 'Dataset', '@id': url + '#data', name: a.name + ' 28-day listeners on Pandora', description: answer + ' Collected by hand from the artist profile on Pandora, snapshot dated ' + latest + '. Not the Pandora API, not live.', creator: { '@type': 'Organization', name: 'Ledgertone', url: SITE }, dateModified: latest, temporalCoverage: latest, inLanguage: 'en', about: { '@id': url + '#artist' }, variableMeasured: num ? { '@type': 'PropertyValue', name: '28-day listeners on Pandora', value: top.x.listeners, unitText: 'listeners' } : { '@type': 'PropertyValue', name: '28-day listeners on Pandora', value: 'Few' } },
    { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: [{ '@type': 'Question', name: 'How many listeners does ' + a.name + ' have on Pandora?', acceptedAnswer: { '@type': 'Answer', text: answer + ' ' + second } }] }
  ] };

  const body = [
    '<main>', '<section class="wrap doc">',
    '<h1>' + esc(a.name) + ' on Pandora: 28-day listeners</h1>',
    '<h2>How many listeners does ' + esc(a.name) + ' have on Pandora?</h2>',
    '<p>' + esc(answer) + ' ' + esc(second) + '</p>',
    '<dl class="method">',
    '  <div><dt>Reading</dt><dd>' + esc(label) + ' listeners over 28 days on Pandora</dd></div>',
    '  <div><dt>Snapshot</dt><dd>' + esc(month(latest)) + ' (captured ' + esc(latest) + ')</dd></div>',
    '  <div><dt>Ledgertone genres</dt><dd>' + esc(genres.join(', ')) + '</dd></div>',
    '</dl>',
    '<h2>Where the number comes from</h2>',
    '<p>The figure is the number of listeners over the last 28 days shown on the artist profile on Pandora, collected by hand on the snapshot date. It is a record of one moment, it is not live and it is not from the Pandora API, so it may differ from what Pandora shows today. More on the method is on the <a href="about.html">About page</a>.</p>',
    '<p>' + [pandora ? '<a href="' + esc(pandora) + '" rel="noopener">' + esc(a.name) + ' on Pandora</a>' : '', spotify ? '<a href="' + esc(spotify) + '" rel="noopener">' + esc(a.name) + ' on Spotify</a>' : '', '<a href="index.html">Full ranking</a>'].filter(Boolean).join(' &middot; ') + '</p>',
    '</section>', '</main>'
  ].join('\n');

  let h = tpl;
  const sub = (re, s) => { if (!re.test(h)) throw new Error('template changed, pattern missing: ' + re); h = h.replace(re, () => s); };
  sub(/<title>.*?<\/title>/, '<title>' + esc(title) + '</title>');
  sub(/<meta name="description" content=".*?">/, '<meta name="description" content="' + esc(desc) + '">');
  sub(/<meta name="robots" content=".*?">/, '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">');
  sub(/<link rel="canonical" href=".*?">/, '<link rel="canonical" href="' + url + '">\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="Ledgertone">\n<meta property="og:title" content="' + esc(title) + '">\n<meta property="og:description" content="' + esc(desc) + '">\n<meta property="og:url" content="' + url + '">\n<meta property="og:image" content="' + SITE + 'assets/og-image.png">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>');
  sub(/<main>[\s\S]*?<\/main>/, body);
  h = h.replace(/ aria-current="page"/g, '');
  fs.writeFileSync(path.join(root, a.file), h.replace(/\n/g, nl));
  console.log('built ' + a.file + ': ' + answer);
});
