// Release check (v1.23.0): one command that runs the checks an agent did by hand before every archive.
// usage: node scripts/check-release.js [--no-build]
// 1 node --check on every script; 2 check-banned.js; 3 build-all.js (skipped with --no-build); 4 no em-dash or emoji in the sources;
// 5 version: CHANGELOG top entry equals version.json, the meta tag, the footer line and every ?v= stamp of every HTML page;
// 6 JSON-LD of index.html, settwor.html, settwor-ru.html and one artist shell parses and every referenced @id is defined on the same page;
// 7 every local href and src of every HTML page points to an existing file (data/artist-media*.js are expected to be missing, rule 9).
// 8 feed.xml: one entry per snapshot, unique ids, linked from index.html.
// 9 ranking files (v1.26.0): one CSV and one JSON per snapshotted genre, row count equals the top list, CSV and JSON agree, linked from index.html, Dataset in the JSON-LD.
// Exit code 1 when anything fails.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
let fails = 0;
const SITE_URL = 'https://ledgertone.github.io/';
const ok = (m) => console.log('ok    ' + m);
const bad = (m) => { fails++; console.log('FAIL  ' + m); };
const run = (args) => { try { return { ok: true, out: cp.execFileSync('node', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString() }; } catch (e) { return { ok: false, out: String(e.stdout || '') + String(e.stderr || '') }; } };

// 1 syntax
const jsFiles = [];
['assets', 'scripts', 'scripts/lib'].forEach((d) => fs.readdirSync(path.join(root, d)).forEach((f) => { if (f.endsWith('.js')) jsFiles.push(d + '/' + f); }));
const synt = jsFiles.filter((f) => !run(['--check', f]).ok);
synt.length ? bad('syntax error in ' + synt.join(', ')) : ok('node --check on ' + jsFiles.length + ' scripts');

// 2 banned
const b = run(['scripts/check-banned.js']);
b.ok ? ok(b.out.trim()) : bad('check-banned: ' + b.out.trim());

// 3 build
if (!process.argv.includes('--no-build')) {
  const r = run(['scripts/build-all.js']);
  r.ok ? ok('build-all ran') : bad('build-all: ' + r.out.trim().split('\n').slice(-3).join(' '));
}

// 4 characters
const srcFiles = jsFiles.concat(['CLAUDE.md', 'AGENTS.md', 'CHANGELOG.md', 'TODO.md', 'README.md', 'assets/styles.css', 'docs/DATA.md', 'docs/SEO.md']);
const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/u;
const chars = [];
srcFiles.forEach((f) => { if (!fs.existsSync(path.join(root, f))) return; const t = rd(f); if (t.includes('\u2014')) chars.push(f + ' (em-dash)'); if (emoji.test(t)) chars.push(f + ' (emoji)'); });
chars.length ? bad('forbidden characters: ' + chars.join(', ')) : ok('no em-dash and no emoji in ' + srcFiles.length + ' sources');

// 5 version
const ver = (rd('CHANGELOG.md').match(/^## \[([0-9.]+)\]/m) || [])[1];
const htmls = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const verBad = [];
if (JSON.parse(rd('version.json')).version !== ver) verBad.push('version.json');
htmls.forEach((f) => {
  const t = rd(f);
  if (!/ledgertone-version/.test(t)) return; // for example the Google verification file
  if (!t.includes('name="ledgertone-version" content="' + ver + '"')) verBad.push(f + ' meta');
  if (!new RegExp('<p class="ver">[^<]*' + ver.replace(/\./g, '\\.') + '</p>').test(t)) verBad.push(f + ' footer');
  [...t.matchAll(/\?v=([0-9.]+)/g)].forEach((m) => { if (m[1] !== ver) verBad.push(f + ' ?v=' + m[1]); });
});
verBad.length ? bad('version differs from ' + ver + ': ' + [...new Set(verBad)].slice(0, 8).join(', ')) : ok('version ' + ver + ' in CHANGELOG, version.json, meta, footer and ?v= stamps of ' + htmls.length + ' pages');

// 6 JSON-LD
const map = rd('data/artist-pages.js'), shell = (map.match(/: "([^"]+\.html)"/) || [])[1];
const ldPages = ['index.html', 'settwor.html', 'settwor-ru.html'].concat(shell ? [shell] : []).filter((f) => fs.existsSync(path.join(root, f)));
ldPages.forEach((f) => {
  const blocks = [...rd(f).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) { if (f === 'index.html' || f.startsWith('settwor')) bad(f + ': no JSON-LD'); else ok(f + ': no JSON-LD (shell, filled in the browser)'); return; }
  const defined = new Set(), refs = new Set();
  const walk = (o, top) => { if (Array.isArray(o)) return o.forEach((x) => walk(x, top)); if (o && typeof o === 'object') { const keys = Object.keys(o); if (o['@id']) { if (keys.length > 1 || top) defined.add(o['@id']); else refs.add(o['@id']); } keys.forEach((k) => walk(o[k], false)); } };
  try { blocks.forEach((s) => walk(JSON.parse(s), true)); } catch (e) { return bad(f + ': JSON-LD does not parse (' + e.message + ')'); }
  const miss = [...refs].filter((r) => !defined.has(r));
  miss.length ? bad(f + ': @id not defined: ' + miss.join(', ')) : ok(f + ': JSON-LD parses, ' + defined.size + ' @id defined, ' + refs.size + ' references resolve');
});

// 7 links
const missing = new Map();
htmls.forEach((f) => {
  const t = rd(f);
  [...t.matchAll(/\s(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].forEach((m) => {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|spotify:|\/\/)/.test(u)) return;
    if (/^data\/artist-media[a-z0-9-]*\.js$/.test(u)) return;
    if (!fs.existsSync(path.join(root, u))) { const k = u; missing.set(k, (missing.get(k) || []).concat(f)); }
  });
});
missing.size ? bad('missing files: ' + [...missing.entries()].slice(0, 8).map(([u, fs2]) => u + ' (in ' + fs2[0] + (fs2.length > 1 ? ' and ' + (fs2.length - 1) + ' more' : '') + ')').join(', ')) : ok('every local href and src of ' + htmls.length + ' pages exists');

// 8 feed (v1.25.0): feed.xml has one entry per snapshot, unique ids, every entry has a date and a summary, the home page links to it
(function () {
  if (!fs.existsSync(path.join(root, 'feed.xml'))) return bad('feed.xml is missing');
  global.window = global.window || {}; require(path.join(root, 'data/snapshots.js'));
  const snaps = window.LEDGERTONE.snapshots.filter((s) => s.capturedAt).length;
  const f = rd('feed.xml'), entries = f.match(/<entry>[\s\S]*?<\/entry>/g) || [], ids = entries.map((e) => (e.match(/<id>([^<]+)<\/id>/) || [])[1]);
  const problems = [];
  if (entries.length !== snaps) problems.push(entries.length + ' entries for ' + snaps + ' snapshots');
  if (new Set(ids).size !== ids.length) problems.push('duplicate ids');
  if (entries.some((e) => !/<updated>\d{4}-\d{2}-\d{2}T00:00:00Z<\/updated>/.test(e) || !/<summary>[^<]+<\/summary>/.test(e))) problems.push('entry without date or summary');
  if (!/<feed xmlns="http:\/\/www.w3.org\/2005\/Atom">/.test(f) || !/<\/feed>\s*$/.test(f)) problems.push('feed element');
  if (!/<link rel="alternate" type="application\/atom\+xml"[^>]*href="feed.xml"/.test(rd('index.html'))) problems.push('index.html does not link feed.xml');
  problems.length ? bad('feed.xml: ' + problems.join(', ')) : ok('feed.xml: ' + entries.length + ' entries, one per snapshot, linked from index.html');
})();

// 9 ranking files (v1.26.0)
(function () {
  global.window = global.window || {}; ['snapshots', 'unverified', 'links'].forEach((f) => require(path.join(root, 'data', f + '.js')));
  const core = require(path.join(root, 'assets/ledger-core.js'))(window);
  const problems = [], idx = rd('index.html');
  let n = 0;
  core.L.genres.forEach((g) => {
    const s = core.snapsOf(g.id)[0];
    if (!s || !s.capturedAt) return;
    n++;
    const csvF = 'ranking-' + g.id + '.csv', jsonF = 'ranking-' + g.id + '.json';
    if (!fs.existsSync(path.join(root, csvF)) || !fs.existsSync(path.join(root, jsonF))) return problems.push(g.id + ': file missing');
    const want = core.topOf(g.id).length;
    let j; try { j = JSON.parse(rd(jsonF)); } catch (e) { return problems.push(jsonF + ' does not parse'); }
    const lines = rd(csvF).split(/\r?\n/).filter(Boolean);
    if (j.artists.length !== want || j.count !== want) problems.push(jsonF + ': ' + j.artists.length + ' rows, top list has ' + want);
    if (lines.length - 1 !== want) problems.push(csvF + ': ' + (lines.length - 1) + ' rows, top list has ' + want);
    if (j.snapshot !== s.capturedAt || !lines[1] || lines[1].indexOf(s.capturedAt) !== 0) problems.push(g.id + ': snapshot date differs');
    if (j.artists.some((a, i) => a.place !== i + 1)) problems.push(jsonF + ': places are not 1..N');
    if (!/not live data/.test(j.note)) problems.push(jsonF + ': note must say not live data');
    [csvF, jsonF].forEach((f) => { if (!idx.includes('href="' + f + '"')) problems.push('index.html does not link ' + f); if (!idx.includes(SITE_URL + f)) problems.push('Dataset of index.html lacks ' + f); });
  });
  if (!n) problems.push('no snapshots');
  problems.length ? bad('ranking files: ' + problems.slice(0, 6).join('; ')) : ok('ranking files: ' + n + ' genres, CSV and JSON agree with the top list, linked and in the Dataset JSON-LD');
})();

// 10 permalink line (v1.28.0, rule 23): index.html and all.html carry the dated permalink of the latest snapshot of the first genre
(function () {
  global.window = global.window || {}; ['snapshots', 'unverified', 'links'].forEach((f) => require(path.join(root, 'data', f + '.js')));
  const core = require(path.join(root, 'assets/ledger-core.js'))(window);
  const g = core.L.genres[0], s = core.snapsOf(g.id)[0], problems = [];
  if (!s) return problems.push('no snapshot') && bad('permalink line: no snapshot');
  [['index.html', ''], ['all.html', 'all.html']].forEach(([f, pre]) => {
    const want = '<p class="cite" id="cite">Cite this snapshot: <a href="' + pre + '#' + g.id + '-' + s.capturedAt + '">' + SITE_URL + pre + '#' + g.id + '-' + s.capturedAt + '</a></p>';
    if (!rd(f).includes(want)) problems.push(f + ': permalink line missing or wrong');
  });
  problems.length ? bad('permalink line: ' + problems.join('; ')) : ok('permalink line: index.html and all.html point to #' + g.id + '-' + s.capturedAt);
})();

console.log(fails ? '\n' + fails + ' check(s) failed' : '\nall checks passed');
process.exit(fails ? 1 : 0);
