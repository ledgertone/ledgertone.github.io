// Builds the artist pages. Since v0.85.0 (owner decision) the artist pages hold NO figures and NO text: every page is a small shell
// (head snippet, nav, footer, version tags, <body data-artist="<key>">) and assets/artist-page.js fills it in the browser from the database
// (data/snapshots.js, data/unverified.js, data/links.js) and from the one text file data/artist-text.js. So a changed line or number never touches the pages.
// Static pages are written only for SETTWOR (settwor.html and settwor-ru.html, so search engines and AI answers can read the owner's figure without JavaScript)
// and for every artist with the flag --static (the old behaviour, same code and same text file, use it if you want every page readable without JavaScript).
// The same script writes data/artist-pages.js (name to file map for assets/app.js), sitemap.xml and docs/settwor-site-snippet.html.
// Run after ANY data change, after a change of data/artist-text.js (for the two SETTWOR pages) and after every version bump: node scripts/build-artist-pages.js [--static] (or node scripts/build-all.js)
// The page shell is copied from about.html (head snippet with Consent Mode, nav, footer, version tags).
const fs = require('fs');
const path = require('path');
const lib = require('./lib/ledger.js');
const { L, SITE, norm, esc, banned, genreName, month, num, snapsOf, rankedAt, unverifiedOf, artistCount, linksOf, readCRLF, writeCRLF, pageArtists, OWNER, historyOf, root } = lib;
const core = require(path.join(root, 'assets', 'ledger-core.js'))(window);
require(path.join(root, 'data', 'artist-text.js'));
const AP = require(path.join(root, 'assets', 'artist-page.js'))(core, window.LEDGERTONE_TEXT);
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version;
const STATIC_ALL = process.argv.includes('--static');

const ARTISTS = pageArtists();
const tpl = readCRLF('about.html');

function buildPage(a, lang) {
  const ru = lang === 'ru', file = ru ? a.fileRu : a.file;
  const isStatic = STATIC_ALL || !!a.owner;
  const r = AP.model(a, lang);
  if (!r) throw new Error('No reading for ' + a.name + ', page not built');
  let h = tpl;
  const sub = (re, s) => { if (!re.test(h)) throw new Error('template changed, pattern missing: ' + re); h = h.replace(re, () => s); };
  const altBlock = r.twin ? ['<link rel="alternate" hreflang="en" href="' + r.urlEn + '">', '<link rel="alternate" hreflang="ru" href="' + r.urlRu + '">', '<link rel="alternate" hreflang="x-default" href="' + r.urlEn + '">'].join('\n') : '';
  sub(/<html lang="en">/, '<html lang="' + lang + '">');
  sub(/<meta name="robots" content=".*?">/, '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">');
  if (isStatic) {
    sub(/<title>.*?<\/title>/, '<title>' + esc(r.title) + '</title>');
    sub(/<meta name="description" content=".*?">/, '<meta name="description" content="' + esc(r.desc) + '">');
    sub(/<link rel="canonical" href=".*?">/, '<link rel="canonical" href="' + r.url + '">\n' + (altBlock ? altBlock + '\n' : '') + AP.ogBlock(r) + '\n' + AP.ldTag(r));
    sub(/<main>[\s\S]*?<\/main>/, r.body);
  } else {
    // shell: no figures and no text, assets/artist-page.js fills title, description, og tags, JSON-LD and <main> from the database
    sub(/<title>.*?<\/title>/, '<title>Ledgertone</title>');
    sub(/<meta name="description" content=".*?">/, '<meta name="description" content="Ledgertone artist page">');
    sub(/<link rel="canonical" href=".*?">/, '<link rel="canonical" href="' + r.url + '">');
    sub(/<main>[\s\S]*?<\/main>/, '<main>\n</main>');
    sub(/<body>/, '<body data-artist="' + a.key + '">');
    const v = '?v=' + VERSION;
    sub(/<script src="assets\/motion\.js\?v=[^"]*"><\/script>/, ['data/snapshots.js', 'data/unverified.js', 'data/links.js', 'data/artist-text.js', 'assets/ledger-core.js', 'assets/artist-page.js', 'assets/motion.js'].map((f) => '<script src="' + f + v + '"></script>').join('\n'));
  }
  h = h.replace(/ aria-current="page"/g, '');
  if (ru) {
    // Russian shell: nav and footer in Russian, links to the English-only pages say so
    sub(/<a class="link" href="about\.html">About<\/a>/, '<a class="link" href="about.html" hreflang="en">\u041e \u043f\u0440\u043e\u0435\u043a\u0442\u0435</a>');
    sub(/<p>Ledgertone is an independent project and is not affiliated with Pandora\. Pandora is a trademark of its respective owner\.<\/p>/, '<p>Ledgertone \u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442 \u0438 \u043d\u0438\u043a\u0430\u043a \u043d\u0435 \u0441\u0432\u044f\u0437\u0430\u043d \u0441 Pandora. Pandora \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u0442\u043e\u0432\u0430\u0440\u043d\u044b\u043c \u0437\u043d\u0430\u043a\u043e\u043c \u0441\u0432\u043e\u0435\u0433\u043e \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430.</p>');
    sub(/<p class="flinks">[\s\S]*?<button type="button" class="linkbtn glass" id="cookie-settings" hidden>Cookie settings<\/button><\/p>/, '<p class="flinks"><a href="index.html" hreflang="en">\u0420\u0435\u0439\u0442\u0438\u043d\u0433</a><a href="about.html" hreflang="en">\u041e \u043f\u0440\u043e\u0435\u043a\u0442\u0435 (English)</a><a href="' + a.fileRu + '">SETTWOR \u043d\u0430 Pandora</a><a href="privacy.html" hreflang="en">\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438 (English)</a><button type="button" class="linkbtn glass" id="cookie-settings" hidden>\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 cookie</button></p>');
    sub(/<p class="ver">Version /, '<p class="ver">\u0412\u0435\u0440\u0441\u0438\u044f ');
  }
  writeCRLF(file, h);
  console.log('built ' + file + (isStatic ? ' (static): ' + r.answer : ' (shell)'));
  return { hist: r.hist, latest: r.latest, lk: r.lk };
}

ARTISTS.forEach((a) => {
  if (banned.has(norm(a.name))) throw new Error(a.name + ' is banned');
  const en = buildPage(a, 'en');
  if (a.csv) { // the readings of the owner as a download, linked from the page and from the Dataset JSON-LD (distribution)
    const q = (v) => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    const rows = [['snapshot_date', 'genre', 'listeners_28d', 'shown_on_pandora', 'place', 'ranked_artists', 'artists_in_genre']].concat(en.hist.map((r) => [r.date, genreName(r.genre), Number.isFinite(r.x.listeners) ? r.x.listeners : 'Few', r.x.text || '', r.place || '', r.of || '', r.total || '']));
    writeCRLF(a.csv, rows.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
    console.log('built ' + a.csv + ': ' + en.hist.length + ' rows');
  }
  if (!a.fileRu) return;
  buildPage(a, 'ru');

  // Fragment for the artist's own site (no numbers in it, so it never goes stale). Paste it by hand, nothing here touches that site.
  const url = SITE + a.file, urlRu = SITE + a.fileRu, lk = en.lk;
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'MusicGroup', '@id': a.site + '#artist', name: a.name, url: a.site, sameAs: [lk.pandora, lk.spotify].filter(Boolean),
      subjectOf: [{ '@type': 'WebPage', '@id': url + '#page', url, name: a.name + ' on Pandora: 28-day listeners', inLanguage: 'en' }, { '@type': 'WebPage', '@id': urlRu + '#page', url: urlRu, name: a.name + ' на Pandora: слушатели за 28 дней', inLanguage: 'ru' }] },
    { '@type': 'Organization', '@id': SITE + '#org', name: 'Ledgertone', url: SITE, founder: { '@id': a.site + '#artist' } }
  ] };
  writeCRLF('docs/settwor-site-snippet.html', [
    '<!--',
    '  Fragment for ' + a.site + ' (generated by scripts/build-artist-pages.js, do not edit here).',
    '  Paste part 1 into the <head> of the main page and part 2 where a link fits (footer or a "listed in" line).',
    '  It holds no figures on purpose, so it does not go stale when a new snapshot is published.',
    '  If the page already has JSON-LD, merge the two nodes into it instead of adding a second block.',
    '  Nobody can guarantee that Google or an AI answer will use it.',
    '-->',
    '',
    '<!-- Part 1: head -->',
    '<script type="application/ld+json">' + JSON.stringify(ld, null, 2).replace(/</g, '\\u003c') + '</script>',
    '',
    '<!-- Part 2: visible link -->',
    '<p>' + a.name + ' is listed in the Ledgertone ranking of phonk artists on Pandora. <a href="' + url + '" rel="noopener">' + a.name + ' on Pandora: 28-day listeners</a> (<a href="' + urlRu + '" rel="noopener" hreflang="ru" lang="ru">по-русски</a>). Ledgertone is run by ' + a.name + '.</p>',
    ''
  ].join('\n'));
  console.log('built docs/settwor-site-snippet.html');
});

// Map for assets/app.js: lowercase accent-free name to page file (owner decision, v0.82.0). Generated, never edited by hand.
const mapBody = ARTISTS.slice().sort((x, y) => (x.key < y.key ? -1 : 1)).map((a) => '  ' + JSON.stringify(a.key) + ': ' + JSON.stringify(a.file)).join(',\n');
writeCRLF('data/artist-pages.js', '// Generated by scripts/build-artist-pages.js (AGENTS.md rule 13), do not edit by hand.\n// Artists that have their own page: key (lowercase, accent-free name, same as data/links.js) to file.\nwindow.LEDGERTONE_PAGES = {\n' + mapBody + '\n};\n');
console.log('built data/artist-pages.js: ' + ARTISTS.length + ' artists');

// sitemap.xml: home, every artist page (SETTWOR with its Russian twin), About and Privacy
const dateOf = (a) => { const h = historyOf(a.name); return h.length ? h[0].date : null; };
const allDates = L.snapshots.map((x) => x.capturedAt).filter(Boolean).sort();
const lastAll = allDates[allDates.length - 1];
const loc = (f, d, alts) => '  <url><loc>' + SITE + f + '</loc><lastmod>' + d + '</lastmod>' + (alts ? '\n' + alts + '\n  ' : '') + '</url>';
const altX = (a) => ['en', 'ru', 'x-default'].map((h) => '    <xhtml:link rel="alternate" hreflang="' + h + '" href="' + SITE + (h === 'ru' ? a.fileRu : a.file) + '"/>').join('\n');
const urls = [loc('', lastAll), loc('all.html', lastAll)];
ARTISTS.forEach((a) => { urls.push(loc(a.file, dateOf(a), a.fileRu ? altX(a) : null)); if (a.fileRu) urls.push(loc(a.fileRu, dateOf(a), altX(a))); });
urls.push(loc('about.html', '2026-10-24'), loc('privacy.html', '2026-10-24'));
writeCRLF('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.join('\n') + '\n</urlset>\n');
console.log('built sitemap.xml: ' + urls.length + ' urls');
