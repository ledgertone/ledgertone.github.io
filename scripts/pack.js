// Builds the archive for the owner (AGENTS.md rules 5, 9 and 17). Run after node scripts/build-all.js and the checks.
// usage: node scripts/pack.js --out <dir> [--prev <previous-archive.zip>]
// Name: "Ledgertone v<version>.zip". Never contains data/artist-media*.js (rule 9) or .git.
// Artist pages (rule 17): a generated artist page is left out when it is identical to the same page in the previous archive
// once the two version numbers are masked, because the owner already has those pages. New or changed pages are included.
// Without --prev every page is included (safe default). Needs the zip and unzip programs.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
const out = arg('--out'), prev = arg('--prev');
if (!out) { console.error('usage: node scripts/pack.js --out <dir> [--prev <previous-archive.zip>]'); process.exit(1); }
const version = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version;
const name = 'Ledgertone v' + version + '.zip';
const target = path.resolve(out, name);

const map = fs.readFileSync(path.join(root, 'data/artist-pages.js'), 'utf8');
const pages = [...new Set([...map.matchAll(/: "([^"]+\.html)"/g)].map((m) => m[1]).concat(['settwor.html', 'settwor-ru.html']))].filter((f) => fs.existsSync(path.join(root, f)));
const unzipP = (f) => { try { return cp.execFileSync('unzip', ['-p', prev, f], { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 }).toString('utf8'); } catch (e) { return null; } };

const skip = [], keep = [], gone = [];
if (prev) {
  const pv = (unzipP('version.json') || '').match(/"version"\s*:\s*"([^"]+)"/);
  if (!pv) { console.error('cannot read version.json from the previous archive'); process.exit(1); }
  const mask = (s, v) => s.split(v).join('<V>');
  for (const f of pages) {
    const old = unzipP(f);
    const cur = fs.readFileSync(path.join(root, f), 'utf8');
    if (old !== null && mask(old, pv[1]) === mask(cur, version)) skip.push(f); else keep.push(f);
  }
  const list = cp.execFileSync('unzip', ['-Z1', prev], { maxBuffer: 1 << 26 }).toString('utf8').split(/\r?\n/);
  const have = new Set(pages);
  const map0 = unzipP('data/artist-pages.js') || '';
  const oldPages = new Set([...map0.matchAll(/: "([^"]+\.html)"/g)].map((m) => m[1]));
  for (const f of oldPages) if (!have.has(f) && list.includes(f)) gone.push(f);
} else keep.push(...pages);

if (fs.existsSync(target)) fs.unlinkSync(target);
const args = ['-q', '-r', target, '.', '-x', '.git/*', '-x', 'data/artist-media*.js'];
for (const f of skip) args.push('-x', f);
cp.execFileSync('zip', args, { cwd: root, stdio: 'inherit' });
const listing = cp.execFileSync('unzip', ['-Z1', target], { maxBuffer: 1 << 26 }).toString('utf8');
if (/artist-media/.test(listing)) { console.error('FAIL: artist-media file in the archive'); process.exit(1); }
console.log('archive: ' + target);
console.log('artist pages: ' + pages.length + ' total, ' + skip.length + ' left out (unchanged), ' + keep.length + ' included' + (prev ? '' : ' (no --prev, all included)'));
if (keep.length && keep.length <= 30) console.log('included pages: ' + keep.join(', '));
if (gone.length) console.log('DELETE these pages from the site folder (they are gone): ' + gone.join(', '));
