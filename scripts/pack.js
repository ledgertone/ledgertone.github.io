// Builds the archive for the owner (AGENTS.md rules 5, 9 and 17). Run after node scripts/build-all.js and the checks.
// usage: node scripts/pack.js --out <dir> [--prev <previous-archive.zip>]
// Name: "Ledgertone v<version>.zip". Never contains data/artist-media*.js (rule 9) or .git.
// Artist pages (rule 17): a generated artist page is left out when it is identical to the same page in the previous archive
// once the two version numbers are masked, because the owner already has those pages. New or changed pages are included.
// Without --prev every page is included (safe default). Needs the zip and unzip programs.
// Manifest (v1.24.0): every archive carries data/pages-manifest.json, the SHA-256 of each generated artist page with the version masked. The next run compares against
// the manifest of the previous archive, so it no longer needs the pages themselves to be in that archive. If the previous archive has no manifest, the old way
// (compare with the page inside the previous archive) is used. --baseline: for the first archive with a manifest, a page found in neither place is left out
// (use it only when the owner is known to have all pages, for example when only the version changed).
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
const out = arg('--out'), prev = arg('--prev'), baseline = process.argv.includes('--baseline');
if (!out) { console.error('usage: node scripts/pack.js --out <dir> [--prev <previous-archive.zip>] [--baseline]'); process.exit(1); }
const version = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version;
const name = 'Ledgertone v' + version + '.zip';
const target = path.resolve(out, name);

const map = fs.readFileSync(path.join(root, 'data/artist-pages.js'), 'utf8');
const pages = [...new Set([...map.matchAll(/: "([^"]+\.html)"/g)].map((m) => m[1]).concat(['settwor.html', 'settwor-ru.html']))].filter((f) => fs.existsSync(path.join(root, f)));
const unzipP = (f) => { try { return cp.execFileSync('unzip', ['-p', prev, f], { stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 }).toString('utf8'); } catch (e) { return null; } };

const mask = (s, v) => s.split(v).join('<V>');
const hashOf = (s) => crypto.createHash('sha256').update(mask(s, version)).digest('hex');
const manifest = { version, pages: {} };
for (const f of pages.slice().sort()) manifest.pages[f] = hashOf(fs.readFileSync(path.join(root, f), 'utf8'));
fs.writeFileSync(path.join(root, 'data/pages-manifest.json'), JSON.stringify(manifest, null, 1) + '\n');

// Top list (rule 19, owner decision v1.30.0): the current top list always travels INSIDE the archive, in the folder top100/.
// Written here from the data so it can never be stale or forgotten.
cp.execFileSync(process.execPath, [path.join(__dirname, 'export-top.js'), '--out', path.join(root, 'top100')], { stdio: 'inherit' });

const skip = [], keep = [], gone = [];
if (prev) {
  const pv = (unzipP('version.json') || '').match(/"version"\s*:\s*"([^"]+)"/);
  if (!pv) { console.error('cannot read version.json from the previous archive'); process.exit(1); }
  let oldM = null; try { oldM = JSON.parse(unzipP('data/pages-manifest.json') || 'null'); } catch (e) { oldM = null; }
  const viaManifest = !!(oldM && oldM.pages);
  for (const f of pages) {
    let same;
    if (viaManifest && Object.prototype.hasOwnProperty.call(oldM.pages, f)) same = oldM.pages[f] === manifest.pages[f];
    else {
      const old = unzipP(f);
      same = old !== null ? mask(old, pv[1]) === mask(fs.readFileSync(path.join(root, f), 'utf8'), version) : baseline;
    }
    if (same) skip.push(f); else keep.push(f);
  }
  const list = cp.execFileSync('unzip', ['-Z1', prev], { maxBuffer: 1 << 26 }).toString('utf8').split(/\r?\n/);
  const have = new Set(pages);
  const map0 = unzipP('data/artist-pages.js') || '';
  const oldPages = new Set([...map0.matchAll(/: "([^"]+\.html)"/g)].map((m) => m[1]).concat(viaManifest ? Object.keys(oldM.pages) : []));
  for (const f of oldPages) if (!have.has(f) && (list.includes(f) || viaManifest)) gone.push(f);
  console.log('compared with: ' + (viaManifest ? 'the manifest of the previous archive' : 'the pages inside the previous archive') + (baseline ? ' (baseline)' : ''));
} else keep.push(...pages);

if (fs.existsSync(target)) fs.unlinkSync(target);
const args = ['-q', '-r', target, '.', '-x', '.git/*', '-x', 'data/artist-media*.js'];
for (const f of skip) args.push('-x', f);
cp.execFileSync('zip', args, { cwd: root, stdio: 'inherit' });
const listing = cp.execFileSync('unzip', ['-Z1', target], { maxBuffer: 1 << 26 }).toString('utf8');
if (/artist-media/.test(listing)) { console.error('FAIL: artist-media file in the archive'); process.exit(1); }
if (!/^top100\/Ledgertone top100\.txt$/m.test(listing) || !/^top100\/Ledgertone top100\.json$/m.test(listing)) { console.error('FAIL: top100 files missing in the archive'); process.exit(1); }
console.log('archive: ' + target);
console.log('artist pages: ' + pages.length + ' total, ' + skip.length + ' left out (unchanged), ' + keep.length + ' included' + (prev ? '' : ' (no --prev, all included)'));
if (keep.length && keep.length <= 30) console.log('included pages: ' + keep.join(', '));
if (gone.length) console.log('DELETE these pages from the site folder (they are gone): ' + gone.join(', '));
