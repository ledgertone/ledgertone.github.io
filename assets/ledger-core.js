// Ledgertone shared data logic (owner decision, v0.85.0). One implementation for the browser (artist pages) and for node (scripts/lib/ledger.js).
// It only reads window.LEDGERTONE (data/snapshots.js), window.LEDGERTONE_UNVERIFIED (data/unverified.js) and window.LEDGERTONE_LINKS (data/links.js).
// The ranking rules mirror render() in assets/app.js: if the ranking in app.js changes, change this file too.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory; else root.LedgerCore = factory;
})(typeof window !== 'undefined' ? window : this, function (W) {
  'use strict';
  var L = W.LEDGERTONE, LINKS = W.LEDGERTONE_LINKS || {}, UNV = (W.LEDGERTONE_UNVERIFIED || {}).groups || {};
  var homeId = L.genres[0].id;
  var norm = function (t) { return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var banned = new Set((L.banned || []).map(norm));
  var genreName = function (id) { return (L.genres.find(function (g) { return g.id === id; }) || {}).name || id; };
  var byName = function (a, b) { return String(a.name).localeCompare(String(b.name), 'en'); };
  var MONTHS = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ru: ['\u044f\u043d\u0432\u0430\u0440\u044c', '\u0444\u0435\u0432\u0440\u0430\u043b\u044c', '\u043c\u0430\u0440\u0442', '\u0430\u043f\u0440\u0435\u043b\u044c', '\u043c\u0430\u0439', '\u0438\u044e\u043d\u044c', '\u0438\u044e\u043b\u044c', '\u0430\u0432\u0433\u0443\u0441\u0442', '\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c', '\u043e\u043a\u0442\u044f\u0431\u0440\u044c', '\u043d\u043e\u044f\u0431\u0440\u044c', '\u0434\u0435\u043a\u0430\u0431\u0440\u044c']
  };
  var month = function (d, lang) { return MONTHS[lang || 'en'][Number(d.slice(5, 7)) - 1] + ' ' + d.slice(0, 4); };
  var num = function (n, lang) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'ru' ? '\u00a0' : ','); };

  var cleanSnap = function (s) { return Object.assign({}, s, { artists: (s.artists || []).filter(function (x) { return x && x.name && !banned.has(norm(x.name)); }) }); };
  var snapsOf = function (genreId) { return L.snapshots.filter(function (s) { return (s.genre || homeId) === genreId; }).map(cleanSnap).sort(function (a, b) { return a.capturedAt < b.capturedAt ? 1 : -1; }); };

  var verifiedKeys = new Set();
  L.genres.forEach(function (g) { (g.roster || []).forEach(function (n) { verifiedKeys.add(norm(n)); }); });
  L.snapshots.map(cleanSnap).forEach(function (s) { s.artists.forEach(function (x) { verifiedKeys.add(norm(x.name)); }); });

  var rosterOf = function (genreId) {
    var g = L.genres.find(function (x) { return x.id === genreId; }) || {}, seen = new Set();
    return (g.roster || []).map(function (n) { return String(n).trim(); }).filter(function (n) { var k = norm(n); if (!n || banned.has(k) || seen.has(k)) return false; seen.add(k); return true; });
  };
  var unverifiedOf = function (genreId) {
    var seen = new Set();
    return (UNV[genreId] || []).map(function (x) { return typeof x === 'string' ? { name: x } : (x || {}); })
      .map(function (x) { return { name: String(x.name || '').trim(), src: x.genre ? String(x.genre) : '', listeners: Number.isFinite(x.listeners) ? x.listeners : null, text: x.text ? String(x.text) : null, few: !x.listeners && x.few === true }; })
      .filter(function (x) { var k = norm(x.name); if (!x.name || banned.has(k) || verifiedKeys.has(k) || seen.has(k)) return false; seen.add(k); return true; });
  };
  var rankedAt = function (genreId, idx) {
    var snaps = snapsOf(genreId), s = snaps[idx];
    if (!s) return [];
    var arts = s.artists.filter(function (a) { return Number.isFinite(a.listeners); }).map(function (a) { return Object.assign({}, a, { unverified: false }); });
    var uv = idx === 0 ? unverifiedOf(genreId).filter(function (u) { return u.listeners !== null; }).map(function (u) { return { name: u.name, listeners: u.listeners, unverified: true, src: u.src }; }) : [];
    return arts.concat(uv).sort(function (a, b) { return b.listeners - a.listeners || byName(a, b); }).map(function (a, i) { return Object.assign(a, { rank: i + 1 }); });
  };
  // Owner mark (rule 21): the place an artist would have in snapshot idx of a genre with L.earlierListeners listeners, counted among the other ranked artists
  // (same order as rankedAt: listeners descending, then the name). The artist's own row is left out. null when earlierListeners is not set.
  var earlierPlaceAt = function (genreId, idx, name) {
    var v = L.earlierListeners; if (!Number.isFinite(v)) return null;
    var k = norm(name), n = 1;
    rankedAt(genreId, idx).forEach(function (a) { if (norm(a.name) === k) return; if (a.listeners > v || (a.listeners === v && byName(a, { name: name }) < 0)) n++; });
    return n;
  };
  // Change pills (owner request, v1.22.0, AGENTS.md rule 22): how many places an artist moved between snapshot idx and the next older snapshot of the same genre.
  // Both places are counted among the verified artists with a number (listeners descending, then the name), so the unverified rows that only exist in the latest
  // snapshot never move anybody. Positive = went up. Only artists with a number in both snapshots and a different place are in the map. Mirrors assets/app.js.
  var verifiedPlaces = function (genreId, idx) {
    var s = snapsOf(genreId)[idx], m = new Map();
    if (s) s.artists.filter(function (a) { return Number.isFinite(a.listeners); }).sort(function (a, b) { return b.listeners - a.listeners || byName(a, b); }).forEach(function (a, n) { m.set(norm(a.name), n + 1); });
    return m;
  };
  var moveAt = function (genreId, idx) {
    var out = new Map(), cur = verifiedPlaces(genreId, idx), prev = verifiedPlaces(genreId, idx + 1);
    cur.forEach(function (r, k) { var p = prev.get(k); if (p !== undefined && p !== r) out.set(k, p - r); });
    return out;
  };
  // Top list (owner decision, v1.14.0, AGENTS.md rule 19): the places 1 to topLimit of the latest snapshot, counted like render() in app.js:
  // numbered artists by listeners, then the "Few" artists (verified and unverified together, by name) with the next places. Mirrors assets/app.js.
  var topLimit = Number.isFinite(L.topLimit) && L.topLimit > 0 ? L.topLimit : Infinity;
  var topOf = function (genreId) {
    var ranked = rankedAt(genreId, 0), s = snapsOf(genreId)[0];
    var have = new Set(ranked.filter(function (a) { return !a.unverified; }).map(function (a) { return norm(a.name); }));
    var fewSet = new Set(s ? s.artists.filter(function (a) { return a && a.few; }).map(function (a) { return norm(a.name); }) : []);
    var few = rosterOf(genreId).filter(function (n) { return !have.has(norm(n)) && fewSet.has(norm(n)); }).map(function (n) { return { name: n, few: true, unverified: false }; })
      .concat(unverifiedOf(genreId).filter(function (u) { return u.listeners === null && u.few; }).map(function (u) { return { name: u.name, few: true, unverified: true, src: u.src }; }))
      .sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
    var place = ranked.length;
    return ranked.concat(few.map(function (a) { return Object.assign(a, { rank: ++place }); })).filter(function (a) { return a.rank <= topLimit; });
  };
  var artistCount = function (genreId) {
    var s = snapsOf(genreId)[0];
    var have = new Set(s ? s.artists.filter(function (a) { return Number.isFinite(a.listeners); }).map(function (a) { return norm(a.name); }) : []);
    var arts = have.size, rest = rosterOf(genreId).filter(function (n) { return !have.has(norm(n)); }).length;
    return arts + rest + unverifiedOf(genreId).length;
  };

  var safeUrl = function (u) { try { var x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } };
  var pandoraLink = function (u) { var x = safeUrl(u); try { return x && /^(www\.)?pandora\.com$/.test(new URL(x).hostname) ? x : null; } catch (e) { return null; } };
  var spotifyLink = function (id) { return (typeof id === 'string' && /^[A-Za-z0-9]{22}$/.test(id)) ? 'https://open.spotify.com/artist/' + id : null; };
  var linksOf = function (name) { var lk = LINKS[norm(name)] || {}; return { pandora: pandoraLink(lk.p), spotify: spotifyLink(lk.s) }; };

  var RESERVED = new Set(['index', 'about', 'privacy', '404', 'settwor', 'settwor-ru', 'artist-pages', 'all']);
  var OWNER = { name: 'SETTWOR', file: 'settwor.html', fileRu: 'settwor-ru.html', site: 'https://settwor.github.io/', owner: true, csv: 'settwor-listeners.csv' };
  var slugOf = function (n) { return norm(n).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); };
  var hasReading = function (x) { return Number.isFinite(x.listeners) || x.few === true; };
  var pageArtists = function () {
    var seen = new Map();
    L.genres.forEach(function (g) {
      snapsOf(g.id).forEach(function (s) { s.artists.forEach(function (x) { if (hasReading(x) && !seen.has(norm(x.name))) seen.set(norm(x.name), { name: x.name, verified: true }); }); });
      unverifiedOf(g.id).forEach(function (u) { if (hasReading(u) && !seen.has(norm(u.name))) seen.set(norm(u.name), { name: u.name, verified: false }); });
    });
    var out = [], used = new Set(RESERVED), n = 0;
    Array.from(seen.entries()).sort(function (a, b) { return a[1].name.toLowerCase() < b[1].name.toLowerCase() ? -1 : 1; }).forEach(function (e) {
      var k = e[0], a = e[1];
      if (k === norm(OWNER.name)) { out.push(Object.assign({ key: k }, a, OWNER)); return; }
      var base = slugOf(a.name) || 'artist-' + (++n), f = base, i = 2;
      while (used.has(f)) f = base + '-' + (i++);
      used.add(f);
      out.push(Object.assign({ key: k, file: f + '.html' }, a));
    });
    return out;
  };
  var pageFileOf = (function () { var m = null; return function (name) { if (!m) { m = new Map(); pageArtists().forEach(function (a) { m.set(a.key, a.file); }); } return m.get(norm(name)) || null; }; })();

  // every reading of the artist (a number or "few"), newest snapshot first; the place is counted like on the home page
  var historyOf = function (name) {
    var out = [];
    L.genres.forEach(function (g, gi) {
      snapsOf(g.id).forEach(function (s, i) {
        var x = s.artists.find(function (y) { return norm(y.name) === norm(name); });
        if (!x || !(Number.isFinite(x.listeners) || x.few === true)) return;
        var place = null, of = null;
        if (Number.isFinite(x.listeners)) { var r = rankedAt(g.id, i); var k = r.find(function (y) { return norm(y.name) === norm(name); }); if (k) { place = k.rank; of = r.length; } }
        out.push({ genre: g.id, gi: gi, i: i, date: s.capturedAt, x: x, place: place, of: of, total: i === 0 ? artistCount(g.id) : of });
      });
    });
    L.genres.forEach(function (g, gi) {
      var s = snapsOf(g.id)[0], u = unverifiedOf(g.id).find(function (y) { return norm(y.name) === norm(name); });
      if (!s || !u || !(u.listeners !== null || u.few)) return;
      var x = u.listeners !== null ? { name: u.name, listeners: u.listeners, text: u.text || String(u.listeners) } : { name: u.name, few: true };
      var place = null, of = null;
      if (x.listeners !== undefined) { var r = rankedAt(g.id, 0); var k = r.find(function (y) { return norm(y.name) === norm(name); }); if (k) { place = k.rank; of = r.length; } }
      out.push({ genre: g.id, gi: gi, i: 0, date: s.capturedAt, x: x, place: place, of: of, total: artistCount(g.id) });
    });
    return out.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : a.gi - b.gi; });
  };

  return { L: L, LINKS: LINKS, homeId: homeId, norm: norm, esc: esc, banned: banned, genreName: genreName, byName: byName, month: month, num: num, snapsOf: snapsOf, verifiedKeys: verifiedKeys,
    rosterOf: rosterOf, unverifiedOf: unverifiedOf, rankedAt: rankedAt, topLimit: topLimit, topOf: topOf, artistCount: artistCount, safeUrl: safeUrl, pandoraLink: pandoraLink, spotifyLink: spotifyLink, linksOf: linksOf,
    OWNER: OWNER, hasReading: hasReading, earlierPlaceAt: earlierPlaceAt, moveAt: moveAt, pageArtists: pageArtists, pageFileOf: pageFileOf, historyOf: historyOf };
});
