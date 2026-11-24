// Redirect pages for the old root addresses of artist pages (v1.76.0, AGENTS.md rule 29).
// GitHub Pages has no server redirects (a _redirects file is ignored there), so every old address /<slug>.html listed in data/old-pages.js
// gets a small page in the root: canonical to the new address, meta refresh 0 and location.replace. Google treats this as a permanent redirect.
// A slug is written only while its page artists/<slug>.html is in the page map (banned or removed artists get nothing).
// The page has no version stamp, so it stays byte-identical from version to version. Generated, never edit by hand. Run by build-all.js.
const fs = require('fs');
const path = require('path');
const { root, SITE, esc, pageArtists, writeCRLF } = require('./lib/ledger.js');
require(path.join(root, 'data', 'old-pages.js'));
const OLD = window.LEDGERTONE_OLD_PAGES || [];
const byFile = new Map(pageArtists().map((a) => [a.file, a]));
let n = 0;
const stale = [];
OLD.forEach((slug) => {
  const file = 'artists/' + slug + '.html';
  const a = byFile.get(file);
  if (!a) { if (fs.existsSync(path.join(root, slug + '.html'))) stale.push(slug + '.html'); return; }
  writeCRLF(slug + '.html', [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="ledgertone-redirect" content="' + file + '">',
    '<title>' + esc(a.name) + ' moved | Ledgertone</title>',
    '<link rel="canonical" href="' + SITE + file + '">',
    '<meta http-equiv="refresh" content="0; url=' + file + '">',
    '<script>location.replace(' + JSON.stringify(file) + ' + location.search + location.hash);</script>',
    '</head>',
    '<body>',
    '<p>This page moved to <a href="' + file + '">' + esc(a.name) + ' on Ledgertone</a></p>',
    '</body>',
    '</html>',
    ''
  ].join('\n'));
  n++;
});
console.log('built ' + n + ' redirect pages for old root addresses' + (stale.length ? '; DELETE (no page any more): ' + stale.join(', ') : ''));
