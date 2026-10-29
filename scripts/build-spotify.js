// spotify.html (v1.50.0, owner request): "Top Phonk Artists on Spotify" and "Top Brazilian Phonk Artists on Spotify".
// There is no Spotify reading in the data yet, so every number reads "No data" and no place is given (AGENTS.md rule 2, rule 24).
// The artist names are the top-list roster of each genre (the same artists as ranking-<genre>.csv), listed alphabetically.
// Generated from about.html (head, nav, footer) and the ranking CSV files, never edited by hand. Run by node scripts/build-all.js after build-home.js.
const fs = require('fs'), path = require('path');
const lib = require('./lib/ledger.js');
const { SITE, esc, readCRLF, writeCRLF, norm, OWNER } = lib;
const root = lib.root;

const parseCsv = (text) => {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
};
const rosterOf = (file) => {
  const t = parseCsv(fs.readFileSync(path.join(root, file), 'utf8'));
  const h = t[0], ia = h.indexOf('artist');
  if (ia < 0) throw new Error(file + ': no artist column');
  return [...new Set(t.slice(1).filter((r) => r[ia]).map((r) => r[ia]))].sort((x, y) => x.localeCompare(y, 'en', { sensitivity: 'base' }));
};
const GENRES = [
  { key: 'phonk', name: 'Phonk', file: 'ranking-phonk.csv' },
  { key: 'br', name: 'Brazilian Phonk', file: 'ranking-brazilian-phonk.csv' }
].map((g) => Object.assign({}, g, { artists: rosterOf(g.file) }));

const initial = (n) => String(n).trim().charAt(0).toUpperCase();
const row = (n) => {
  const own = norm(n) === norm(OWNER.name);
  const nm = own ? '<a class="nm" href="settwor.html" title="' + esc(n) + '">' + esc(n) + '</a>' : '<span class="nm">' + esc(n) + '</span>';
  return '<tr><td class="rk">-</td><td class="who"><div class="wh"><span class="av mono">' + esc(initial(n)) + '</span><div class="info">' + nm + '</div></div></td><td class="st nd">No data</td></tr>';
};
const table = (g, hidden) => '    <div class="tbl glass glass-flat" data-t="' + g.key + '"' + (hidden ? ' hidden' : '') + '>\n      <table>\n        <caption class="sr">' + g.name + ' artists on Spotify, ordered by monthly listeners</caption>\n        <thead><tr><th scope="col" class="c-rk">#</th><th scope="col">Artist</th><th scope="col" class="c-st">Spotify listeners</th></tr></thead>\n        <tbody>\n' + g.artists.map(row).join('\n') + '\n        </tbody>\n      </table>\n    </div>';

const TITLE = 'Top Phonk and Brazilian Phonk Artists on Spotify | Ledgertone';
const DESC = 'Top phonk and Brazilian phonk artists on Spotify by monthly listeners. The Spotify figures are not collected yet, so every number reads No data. The Pandora ranking is on the home page.';
const ld = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', '@id': SITE + 'spotify.html#page', url: SITE + 'spotify.html', name: TITLE, description: DESC, inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Ledgertone', url: SITE } },
  { '@type': 'ItemList', name: 'Phonk artists on Spotify (no listener figures yet)', numberOfItems: GENRES[0].artists.length, itemListElement: GENRES[0].artists.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n })) },
  { '@type': 'ItemList', name: 'Brazilian Phonk artists on Spotify (no listener figures yet)', numberOfItems: GENRES[1].artists.length, itemListElement: GENRES[1].artists.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n })) }
] };

let s = readCRLF('about.html');
const sub = (re, to) => { if (!re.test(s)) throw new Error('about.html pattern missing: ' + re); s = s.replace(re, () => to); };
sub(/<title>[^<]*<\/title>/, '<title>' + esc(TITLE) + '</title>');
sub(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(DESC) + '">');
sub(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + SITE + 'spotify.html">\n<script type="application/ld+json">' + JSON.stringify(ld) + '</script>');
sub(/<a class="link" href="about\.html" aria-current="page">About<\/a>/, '<a class="link" href="index.html">Pandora</a><a class="link" href="spotify.html" aria-current="page">Spotify</a><a class="link" href="about.html">About</a>');
sub(/<main>[\s\S]*<\/main>/, '<main id="top">\n  <section class="hero wrap">\n    <h1 class="gh">Top <span class="gn" id="gn">Phonk</span> Artists <span class="lt">on Spotify</span></h1>\n    <div class="picker glass glass-flat genres" id="sp-genres" role="group" aria-label="Genre">\n      <button type="button" data-g="phonk" aria-pressed="true">Phonk</button>\n      <button type="button" data-g="br" aria-pressed="false">Brazilian Phonk</button>\n    </div>\n  </section>\n  <section class="wrap rks">\n    <p class="meta">Spotify monthly listeners · no snapshot yet</p>\n    <p class="note">The Spotify figures are not collected yet, so every number reads No data and no place is given. The artists are the top list of each genre on Ledgertone, in alphabetical order. The ranking by Spotify monthly listeners appears after the first Spotify snapshot. The existing ranking, by Pandora 28-day listeners, is on the <a href="index.html">home page</a>.</p>\n' + table(GENRES[0], false) + '\n' + table(GENRES[1], true) + '\n  </section>\n</main>');
sub(/is not affiliated with Pandora\. Pandora is a trademark of its respective owner\./, 'is not affiliated with Spotify or Pandora. Spotify and Pandora are trademarks of their respective owners.');
sub(/<a href="index\.html">Rankings<\/a>/, '<a href="index.html">Rankings</a><a href="spotify.html">Spotify</a><a href="settwor-platforms.html">SETTWOR on every platform</a>');
sub(/<script src="assets\/motion\.js/, '<script>\n(function(){var gn=document.getElementById("gn"),bs=document.querySelectorAll("#sp-genres button");bs.forEach(function(b){b.addEventListener("click",function(){bs.forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});document.querySelectorAll("[data-t]").forEach(function(t){t.hidden=t.dataset.t!==b.dataset.g});gn.textContent=b.dataset.g==="br"?"Brazilian Phonk":"Phonk"})})})();\n</script>\n<script src="assets/motion.js');
writeCRLF('spotify.html', s);
console.log('built spotify.html: ' + GENRES.map((g) => g.name + ' ' + g.artists.length).join(', '));
