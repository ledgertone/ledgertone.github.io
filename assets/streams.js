// Streams of SETTWOR (owner request, v1.57.0, AGENTS.md rule 28). Only on settwor.html and settwor-ru.html.
// Reads https://settwor.com.pl/streams.json (made by the owner's own site from its _data folder, see docs/DATA.md, section "Streams from settwor.com.pl")
// every time the page opens and fills <div id="streams-live">. The page holds no figures, so a change on the owner's site shows here
// without a new Ledgertone version. Text: data/artist-text.js (keys str*). Nothing is kept on the visitor's device.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory; return; }
  var host = root.document && root.document.getElementById('streams-live');
  if (host) factory(root, host);
})(typeof window !== 'undefined' ? window : this, function (win, host) {
  'use strict';
  var DATA_URL = 'https://settwor.com.pl/streams.json';
  var NAMES = { spotify: 'Spotify', pandora: 'Pandora', youtube_music: 'YouTube Music', apple_music: 'Apple Music', amazon_music: 'Amazon Music', deezer: 'Deezer', soundcloud: 'SoundCloud', tidal: 'TIDAL', vk_music: 'VK Music', yandex_music: 'Yandex Music' };
  var doc = win.document, lang = doc.documentElement.lang === 'ru' ? 'ru' : 'en';
  var T = (win.LEDGERTONE_TEXT || {})[lang];
  if (!T || !T.strH) return;

  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(v, k) ? v[k] : m; }); };
  var n = function (x) { return x.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US'); };
  // a figure is a whole number of 0 or more (a number, or digits in a string); anything else is "no figure" and is left out, never guessed
  var whole = function (v) {
    if (typeof v === 'string' && /^\d{1,15}$/.test(v.trim())) v = Number(v);
    return typeof v === 'number' && isFinite(v) && v >= 0 && Math.floor(v) === v ? v : null;
  };
  var statCard = function (k, v, of) { return '<div class="stat glass glass-flat"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + (of ? '<span class="of"> ' + esc(of) + '</span>' : '') + '</div></div>'; };
  var isObj = function (x) { return x && typeof x === 'object' && !Array.isArray(x); };

  // JSON of the owner's site to a plain model: platforms (total plays, plays per year), year totals, YouTube figures
  function parse(d) {
    if (!isObj(d) || !isObj(d.platforms)) return null;
    var plats = [], years = {};
    Object.keys(d.platforms).forEach(function (key) {
      var p = d.platforms[key];
      if (!isObj(p)) return;
      var per = [], total = 0, earlier = null;
      Object.keys(p).forEach(function (k) {
        var m = /^y(\d{4})$/.exec(k), v = whole(p[k]);
        if (v === null) return;
        if (m) { per.push({ year: Number(m[1]), n: v }); years[m[1]] = (years[m[1]] || 0) + v; total += v; }
        else if (k === 'earlier') { earlier = v; total += v; }
      });
      if (!per.length && earlier === null) return;
      per.sort(function (a, b) { return b.year - a.year; });
      var url = typeof p.url === 'string' && /^https:\/\//.test(p.url) ? p.url : null;
      plats.push({ key: key, name: NAMES[key] || (key === 'other' ? T.strOther : key.replace(/_/g, ' ').replace(/^./, function (c) { return c.toUpperCase(); })), url: url, per: per, earlier: earlier, total: total });
    });
    if (!plats.length) return null;
    plats.sort(function (a, b) { return b.total - a.total; });
    var music = plats.reduce(function (s, p) { return s + p.total; }, 0);
    var yt = isObj(d.auto_stats) && isObj(d.auto_stats.youtube) ? d.auto_stats.youtube : {};
    var fb = isObj(d.streams) && isObj(d.streams.youtube) ? d.streams.youtube : {};
    var clips = whole(yt.clips_views); if (clips === null) clips = whole(fb.clips_views_fallback);
    var channel = whole(yt.channel_total_views);
    var upd = isObj(d.auto_stats) && /^\d{4}-\d{2}-\d{2}$/.test(d.auto_stats.updated || '') ? d.auto_stats.updated : null;
    return { plats: plats, years: years, music: music, clips: clips, channel: channel, updated: upd };
  }

  function render(m) {
    var yl = Object.keys(m.years).sort(function (a, b) { return b - a; });
    var cards = [statCard(T.strTotalL, n(m.music + (m.clips || 0)), m.clips !== null ? T.strTotalOf : T.strMusicL), statCard(T.strMusicL, n(m.music))];
    if (m.clips !== null) cards.push(statCard(T.strClipsL, n(m.clips)));
    if (m.channel !== null) cards.push(statCard(T.strChannelL, n(m.channel)));
    var yearCards = yl.map(function (y) { return statCard(fmt(T.strYearL, { year: y }), n(m.years[y])); });
    var rows = m.plats.map(function (p) {
      var nm = p.url ? '<a class="nm" href="' + esc(p.url) + '" rel="noopener">' + esc(p.name) + '</a>' : '<span class="nm">' + esc(p.name) + '</span>';
      var ex = p.per.map(function (x) { return x.year + ' ' + n(x.n); }).concat(p.earlier !== null ? [T.strEarlierL + ' ' + n(p.earlier)] : []).join(' · ');
      return '<tr><td class="who">' + nm + '<small class="ex">' + esc(ex) + '</small></td><td class="st">' + esc(n(p.total)) + '</td></tr>';
    }).join('\n');
    var table = '<div class="tbl hist glass glass-flat"><table><caption class="sr">' + esc(fmt(T.strCap, {})) + '</caption>\n<thead><tr><th scope="col">' + esc(T.strTh[0]) + '</th><th scope="col" class="c-st">' + esc(T.strTh[1]) + '</th></tr></thead>\n<tbody>\n' + rows + '\n</tbody></table></div>';
    var asOf = m.updated ? ' ' + fmt(T.strAsOf, { date: m.updated }) : '';
    return '<div class="stats" role="group" aria-label="' + esc(T.strH) + '">\n' + cards.join('\n') + '\n</div>\n'
      + (yearCards.length ? '<div class="stats" role="group" aria-label="' + esc(T.strYearsL) + '">\n' + yearCards.join('\n') + '\n</div>\n' : '')
      + table + '\n<p>' + esc(T.strNote + asOf) + '</p>';
  }

  var fail = function () { host.innerHTML = '<p class="nd">' + esc(T.strFail) + '</p>'; host.setAttribute('data-state', 'error'); };
  if (typeof win.fetch !== 'function') return fail();
  var ctl = typeof win.AbortController === 'function' ? new win.AbortController() : null;
  var timer = ctl ? win.setTimeout(function () { ctl.abort(); }, 10000) : null;
  win.fetch(DATA_URL, { cache: 'no-cache', credentials: 'omit', referrerPolicy: 'no-referrer', signal: ctl ? ctl.signal : undefined })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (d) {
      var m = parse(d);
      if (!m) throw new Error('no figures');
      host.innerHTML = render(m);
      host.setAttribute('data-state', 'ready');
    })
    .catch(fail)
    .then(function () { if (timer) win.clearTimeout(timer); });
});
