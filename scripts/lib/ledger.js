// Shared data and ranking logic for the build scripts (v0.81.0).
// It mirrors assets/app.js render(): if the ranking logic in app.js changes, change it here too.
// Nothing is typed by hand: every number comes from data/snapshots.js, data/unverified.js and data/links.js.
const fs = require('fs');
const path = require('path');
global.window = global.window || {};
const root = path.join(__dirname, '..', '..');
['snapshots', 'unverified', 'links'].forEach((f) => require(path.join(root, 'data', f + '.js')));

const L = window.LEDGERTONE;
const LINKS = window.LEDGERTONE_LINKS || {};
const UNV = (window.LEDGERTONE_UNVERIFIED || {}).groups || {};
const SITE = 'https://ledgertone.github.io/';
const homeId = L.genres[0].id;

const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const banned = new Set((L.banned || []).map(norm));
const genreName = (id) => (L.genres.find((g) => g.id === id) || {}).name || id;
const byName = (a, b) => String(a.name).localeCompare(String(b.name), 'en');

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
};
const month = (d, lang) => MONTHS[lang || 'en'][Number(d.slice(5, 7)) - 1] + ' ' + d.slice(0, 4);
// thousands separator: a comma in English, a no-break space in Russian
const num = (n, lang) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'ru' ? '\u00a0' : ',');

const cleanSnap = (s) => Object.assign({}, s, { artists: (s.artists || []).filter((x) => x && x.name && !banned.has(norm(x.name))) });
const snapsOf = (genreId) => L.snapshots.filter((s) => (s.genre || homeId) === genreId).map(cleanSnap).sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));

const verifiedKeys = new Set();
L.genres.forEach((g) => (g.roster || []).forEach((n) => verifiedKeys.add(norm(n))));
L.snapshots.map(cleanSnap).forEach((s) => s.artists.forEach((x) => verifiedKeys.add(norm(x.name))));

const rosterOf = (genreId) => {
  const g = L.genres.find((x) => x.id === genreId) || {}, seen = new Set();
  return (g.roster || []).map((n) => String(n).trim()).filter((n) => { const k = norm(n); if (!n || banned.has(k) || seen.has(k)) return false; seen.add(k); return true; });
};
const unverifiedOf = (genreId) => {
  const seen = new Set();
  return (UNV[genreId] || []).map((x) => (typeof x === 'string' ? { name: x } : (x || {})))
    .map((x) => ({ name: String(x.name || '').trim(), src: x.genre ? String(x.genre) : '', listeners: Number.isFinite(x.listeners) ? x.listeners : null, text: x.text ? String(x.text) : null, few: !x.listeners && x.few === true }))
    .filter((x) => { const k = norm(x.name); if (!x.name || banned.has(k) || verifiedKeys.has(k) || seen.has(k)) return false; seen.add(k); return true; });
};

// Numbered rows of snapshot number idx (0 = latest) of a genre, in table order. Unverified artists with a number join the latest snapshot only.
const rankedAt = (genreId, idx) => {
  const snaps = snapsOf(genreId), s = snaps[idx];
  if (!s) return [];
  const arts = s.artists.filter((a) => Number.isFinite(a.listeners)).map((a) => Object.assign({}, a, { unverified: false }));
  const uv = idx === 0 ? unverifiedOf(genreId).filter((u) => u.listeners !== null).map((u) => ({ name: u.name, listeners: u.listeners, unverified: true, src: u.src })) : [];
  return arts.concat(uv).sort((a, b) => b.listeners - a.listeners || byName(a, b)).map((a, i) => Object.assign(a, { rank: i + 1 }));
};

// "October 2026 \u00b7 2,775 artists": verified (arts + roster names without a number) plus unverified, latest snapshot
const artistCount = (genreId) => {
  const s = snapsOf(genreId)[0];
  const have = new Set(s ? s.artists.filter((a) => Number.isFinite(a.listeners)).map((a) => norm(a.name)) : []);
  const arts = have.size, rest = rosterOf(genreId).filter((n) => !have.has(norm(n))).length;
  return arts + rest + unverifiedOf(genreId).length;
};

const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } };
const pandoraLink = (u) => { const x = safeUrl(u); try { return x && /^(www\.)?pandora\.com$/.test(new URL(x).hostname) ? x : null; } catch (e) { return null; } };
const spotifyLink = (id) => (typeof id === 'string' && /^[A-Za-z0-9]{22}$/.test(id)) ? 'https://open.spotify.com/artist/' + id : null;
const linksOf = (name) => { const lk = LINKS[norm(name)] || {}; return { pandora: pandoraLink(lk.p), spotify: spotifyLink(lk.s) }; };

// Artist pages (owner decision, v0.82.0): every artist with a reading (a number or "Few") in any snapshot of any genre, or in the
// unverified list, gets a static page. File names are slugs of the English name, SETTWOR keeps settwor.html. Sorted by name so the
// slugs stay the same from build to build (a collision gets -2, -3 ...). Names with no Latin letters or digits get artist-<n>.
const RESERVED = new Set(['index', 'about', 'privacy', '404', 'settwor', 'settwor-ru', 'artist-pages']);
const OWNER = { name: 'SETTWOR', file: 'settwor.html', fileRu: 'settwor-ru.html', site: 'https://settwor.github.io/', owner: true };
const slugOf = (n) => norm(n).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const hasReading = (x) => Number.isFinite(x.listeners) || x.few === true;
const pageArtists = () => {
  const seen = new Map();
  L.genres.forEach((g) => {
    snapsOf(g.id).forEach((s) => s.artists.forEach((x) => { if (hasReading(x) && !seen.has(norm(x.name))) seen.set(norm(x.name), { name: x.name, verified: true }); }));
    unverifiedOf(g.id).forEach((u) => { if (hasReading(u) && !seen.has(norm(u.name))) seen.set(norm(u.name), { name: u.name, verified: false }); });
  });
  const out = [], used = new Set(RESERVED);
  let n = 0;
  [...seen.entries()].sort((a, b) => (a[1].name.toLowerCase() < b[1].name.toLowerCase() ? -1 : 1)).forEach(([k, a]) => {
    if (k === norm(OWNER.name)) { out.push(Object.assign({ key: k }, a, OWNER)); return; }
    let base = slugOf(a.name) || 'artist-' + (++n), f = base, i = 2;
    while (used.has(f)) f = base + '-' + (i++);
    used.add(f);
    out.push(Object.assign({ key: k, file: f + '.html' }, a));
  });
  return out;
};
const pageFileOf = (() => { let m = null; return (name) => { if (!m) { m = new Map(); pageArtists().forEach((a) => m.set(a.key, a.file)); } return m.get(norm(name)) || null; }; })();

const CRLF = (s) => s.replace(/\r?\n/g, '\r\n');
const readCRLF = (f) => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const writeCRLF = (f, s) => fs.writeFileSync(path.join(root, f), CRLF(s));

module.exports = { pageArtists, pageFileOf, verifiedKeys, OWNER, hasReading, root, L, LINKS, SITE, homeId, norm, esc, banned, genreName, byName, month, num, snapsOf, rosterOf, unverifiedOf, rankedAt, artistCount, safeUrl, pandoraLink, spotifyLink, linksOf, readCRLF, writeCRLF, CRLF };
