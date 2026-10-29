// settwor-platforms.html (v1.51.0, owner request): SETTWOR listeners on each platform and the platforms added together.
// Pandora comes from the latest snapshot (one reading, counted once even though he is in two genres), the other platforms from data/settwor-platforms.js.
// A platform without a number reads "No data" and is left out of the sum; the page says how many platforms the sum counts (AGENTS.md rules 2 and 25).
// Generated from about.html (head, nav, footer), never edited by hand. Run by node scripts/build-all.js.
const fs = require('fs'), path = require('path'), vm = require('vm');
const lib = require('./lib/ledger.js');
const { SITE, esc, readCRLF, writeCRLF, OWNER, historyOf, linksOf, root } = lib;

const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, 'data/settwor-platforms.js'), 'utf8'), ctx);
const others = ctx.window.LEDGERTONE_PLATFORMS || [];
const h = historyOf(OWNER.name).filter((x) => Number.isFinite(x.x.listeners)).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
const links = linksOf(OWNER.name);
const platforms = [{ name: 'Pandora', metric: '28-day listeners', listeners: h ? h.x.listeners : null, date: h ? h.date : null, url: links.pandora }]
  .concat(others.map((p) => Object.assign({}, p, { url: p.name === 'Spotify' ? links.spotify : null })));
const has = (p) => Number.isFinite(p.listeners) && p.listeners >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(p.date || '');
const n = (v) => v.toLocaleString('en-US');
const counted = platforms.filter(has), sum = counted.reduce((s, p) => s + p.listeners, 0);

const rows = platforms.map((p) => {
  const nm = p.url ? '<a class="nm" href="' + esc(p.url) + '" rel="noopener">' + esc(p.name) + '</a>' : '<span class="nm">' + esc(p.name) + '</span>';
  return '<tr><td class="who">' + nm + '</td><td>' + esc(p.metric) + '</td><td class="st">' + (has(p) ? n(p.listeners) + '<small>' + p.date + '</small>' : '<span class="nd">No data</span>') + '</td></tr>';
}).join('\n          ');

const TITLE = 'SETTWOR listeners on every platform | Ledgertone';
const DESC = counted.length
  ? 'SETTWOR, phonk and Brazilian phonk artist: listeners on Pandora, Spotify, Apple Music and YouTube, and the platforms added together (' + n(sum) + ' from ' + counted.length + ' of ' + platforms.length + ' platforms).'
  : 'SETTWOR, phonk and Brazilian phonk artist: listeners on Pandora, Spotify, Apple Music and YouTube.';
const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', '@id': SITE + 'settwor-platforms.html#page', url: SITE + 'settwor-platforms.html', name: TITLE, description: DESC, inLanguage: 'en', about: { '@id': OWNER.site + '#artist' }, isPartOf: { '@type': 'WebSite', name: 'Ledgertone', url: SITE } },
  lib.ownerNode() // the one shared SETTWOR entity (v1.52.0), no second MusicGroup per page
] };

let s = readCRLF('about.html');
const sub = (re, to) => { if (!re.test(s)) throw new Error('about.html pattern missing: ' + re); s = s.replace(re, () => to); };
sub(/<title>[^<]*<\/title>/, '<title>' + esc(TITLE) + '</title>');
sub(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(DESC) + '">');
sub(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + SITE + 'settwor-platforms.html">\n<script type="application/ld+json">' + JSON.stringify(ld) + '</script>');
sub(/<a class="link" href="about\.html" aria-current="page">About<\/a>/, '<a class="link" href="index.html">Pandora</a><a class="link" href="spotify.html">Spotify</a><a class="link" href="about.html">About</a>');
sub(/<a href="settwor\.html">SETTWOR on Pandora<\/a>/, '<a href="settwor.html">SETTWOR on Pandora</a><a href="settwor-platforms.html">SETTWOR on every platform</a>');
sub(/<main>[\s\S]*<\/main>/, '<main id="top">\n  <section class="hero wrap">\n    <h1 class="gh"><span class="gn">SETTWOR</span> listeners <span class="lt">on every platform</span></h1>\n  </section>\n  <section class="wrap rks">\n    <div class="total glass" id="total">\n      <span class="v">' + (counted.length ? n(sum) : 'No data') + '</span>\n      <span class="l">All platforms added together' + (counted.length ? ' (' + counted.length + ' of ' + platforms.length + ' platforms have a figure)' : '') + '</span>\n    </div>\n    <div class="tbl glass glass-flat">\n      <table>\n        <caption class="sr">SETTWOR listeners on each platform</caption>\n        <thead><tr><th scope="col">Platform</th><th scope="col">Metric</th><th scope="col" class="c-st">Listeners</th></tr></thead>\n        <tbody>\n          ' + rows + '\n        </tbody>\n      </table>\n    </div>\n    <p class="note">The sum counts only the platforms that have a figure. It is not a count of unique people: a listener who uses two platforms is counted twice, and the platforms measure different periods (Pandora 28 days). Each figure is a hand-collected snapshot of the date shown, not live data. SETTWOR also runs Ledgertone. See <a href="settwor.html">SETTWOR on Pandora</a> and the <a href="spotify.html">Spotify page</a>.</p>\n  </section>\n</main>');
sub(/is not affiliated with Pandora\. Pandora is a trademark of its respective owner\./, 'is not affiliated with Pandora, Spotify, Apple Music or YouTube. All are trademarks of their respective owners.');
writeCRLF('settwor-platforms.html', s);
console.log('built settwor-platforms.html: ' + counted.length + ' of ' + platforms.length + ' platforms, sum ' + sum);
