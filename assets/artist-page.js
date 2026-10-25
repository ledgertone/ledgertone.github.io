// Ledgertone artist pages (owner decision, v0.85.0). Builds the whole content of an artist page from the data files, so the page file holds no figures and no text:
//   numbers, places, links: data/snapshots.js, data/unverified.js, data/links.js (through assets/ledger-core.js)
//   every line of text: data/artist-text.js
// In the browser it fills <main> of a page whose <body> has data-artist="<key>". In node (scripts/build-artist-pages.js) the same code
// renders settwor.html and settwor-ru.html as static pages (and every page with --static), so there is one implementation and no copy to keep in sync.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory; return; }
  root.LedgertoneArtistPage = factory;
  // in the browser it starts by itself when the data files and ledger-core.js are loaded
  if (root.LEDGERTONE && root.LedgerCore && root.LEDGERTONE_TEXT) factory(root.LedgerCore(root), root.LEDGERTONE_TEXT);
})(typeof window !== 'undefined' ? window : this, function (core, TEXT) {
  'use strict';
  var SITE = 'https://ledgertone.github.io/';
  var esc = core.esc, num = core.num, month = core.month, genreName = core.genreName;
  var fmt = function (s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(v, k) ? v[k] : m; }); };
  var fmtH = function (s, v) { var e = {}; Object.keys(v).forEach(function (k) { e[k] = esc(v[k]); }); return fmt(s, e); };
  var statCard = function (k, v, of) { return '<div class="stat glass glass-flat"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + (of ? '<span class="of"> ' + esc(of) + '</span>' : '') + '</div></div>'; };

  function model(a, lang) {
    var t = TEXT[lang], ru = lang === 'ru', n = function (x) { return num(x, lang); }, m = function (d) { return month(d, lang); };
    var file = ru ? a.fileRu : a.file, other = ru ? a.file : a.fileRu, twin = !!a.fileRu;
    var hist = core.historyOf(a.name);
    if (!hist.length) return null;
    var latest = hist[0].date;
    var rows = core.L.genres.map(function (g) { return hist.find(function (r) { return r.genre === g.id; }); }).filter(Boolean);
    var topRows = rows.filter(function (r) { return r.date === latest; });
    var top = topRows[0], isNum = Number.isFinite(top.x.listeners);
    var places = topRows.map(function (r) { return { id: r.genre, name: genreName(r.genre), p: r.place ? { place: r.place, of: r.total, ranked: r.of } : null }; }).filter(function (x) { return x.p && isNum; });
    // a place among fewer than 3 ranked artists stays in the cards but is left out of the sentence and the title
    var sig = places.filter(function (x) { return x.p.ranked >= 3; });
    var placeTail = sig.length ? fmt(t.placeTail, {
      items: sig.map(function (x) { return fmt(t.placeItem, { place: x.p.place, of: n(x.p.of), genre: x.name }); }).join(t.and),
      ranked: sig.map(function (x) { return n(x.p.ranked); }).join(t.and)
    }) : '';
    var answer = isNum ? fmt(t.answerNum, { name: a.name, listeners: n(top.x.listeners), month: m(latest), text: top.x.text, placeTail: placeTail }) : fmt(t.answerFew, { name: a.name, month: m(latest) });
    var genres = rows.map(function (r) { return genreName(r.genre); });
    var same = rows.length > 1 && rows.every(function (r) { return r.x.listeners === top.x.listeners && r.x.few === top.x.few; });
    var second = fmt(same ? t.same : t.listed, { genres: genres.join(t.and) });
    var lk = core.linksOf(a.name);
    var url = SITE + file, urlEn = SITE + a.file, urlRu = a.fileRu ? SITE + a.fileRu : null;
    var titlePlace = isNum && sig.length ? fmt(t.titlePlace, { place: sig[0].p.place, genre: sig[0].name }) : '';
    var title = isNum ? fmt(t.titleNum, { name: a.name, text: top.x.text, titlePlace: titlePlace, month: m(latest) }) : fmt(t.titleFew, { name: a.name, month: m(latest) });
    var desc = answer + t.descTail;
    var dates = hist.map(function (r) { return r.date; }).sort();
    var coverage = dates[0] === dates[dates.length - 1] ? dates[0] : dates[0] + '/' + dates[dates.length - 1];
    var ld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': url + '#page', url: url, name: title, description: desc, inLanguage: lang, dateModified: latest, isPartOf: { '@type': 'WebSite', name: 'Ledgertone', url: SITE }, about: { '@id': url + '#artist' }, mainEntity: { '@id': url + '#faq' } },
      { '@type': 'MusicGroup', '@id': url + '#artist', name: a.name, url: a.site, sameAs: [a.site, lk.pandora, lk.spotify].filter(Boolean) },
      { '@type': 'Dataset', '@id': url + '#data', name: fmt(t.dsName, { name: a.name }), description: fmt(t.dsDesc, { answer: answer, date: latest }), creator: Object.assign({ '@type': 'Organization', name: 'Ledgertone', url: SITE }, a.owner ? { founder: { '@id': url + '#artist' } } : {}), dateModified: latest, temporalCoverage: coverage, inLanguage: lang, about: { '@id': url + '#artist' },
        variableMeasured: (isNum ? [{ '@type': 'PropertyValue', name: t.metric, value: top.x.listeners, unitText: t.unit }] : [{ '@type': 'PropertyValue', name: t.metric, value: 'Few' }])
          .concat(places.map(function (x) { return { '@type': 'PropertyValue', name: fmt(t.placeVar, { genre: x.name, month: m(latest) }), value: x.p.place, description: fmt(t.placeDesc, { of: n(x.p.of), ranked: n(x.p.ranked) }) }; })) },
      { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: [{ '@type': 'Question', name: fmt(t.q, { name: a.name }), acceptedAnswer: { '@type': 'Answer', text: answer + ' ' + second } }] }
    ] };

    var histRows = hist.map(function (r) {
      return '<tr><td>' + esc(m(r.date)) + '<br><span class="of">' + esc(r.date) + '</span></td><td>' + esc(genreName(r.genre)) + '</td>'
        + (Number.isFinite(r.x.listeners) ? '<td class="st">' + esc(n(r.x.listeners)) + '</td>' : '<td class="st nodata">' + esc(t.few) + '</td>')
        + '<td class="rk">' + (r.place ? r.place : '-') + '</td></tr>';
    }).join('\n');
    var histTable = '<div class="tbl hist glass glass-flat"><table><caption class="sr">' + esc(fmt(t.histCap, { name: a.name })) + '</caption>\n<thead><tr><th scope="col">' + esc(t.th[0]) + '</th><th scope="col">' + esc(t.th[1]) + '</th><th scope="col" class="c-st">' + esc(t.th[2]) + '</th><th scope="col" class="c-rk">' + esc(t.th[3]) + '</th></tr></thead>\n<tbody>\n' + histRows + '\n</tbody></table></div>';

    var vn = { name: a.name };
    var body = [
      '<main>', '<section class="wrap doc">',
      '<h1>' + esc(fmt(t.h1, vn)) + '</h1>',
      '<h2>' + esc(fmt(t.q, vn)) + '</h2>',
      '<p>' + esc(answer) + ' ' + esc(second) + '</p>'
    ].concat(a.verified === false ? ['<p>' + esc(fmt(t.unvNote, vn)) + '</p>'] : []).concat([
      '<div class="stats" role="group" aria-label="' + esc(fmt(t.aria, vn)) + '">',
      statCard(t.cardL, isNum ? n(top.x.listeners) : 'Few', isNum ? fmt(t.cardShown, { text: top.x.text }) : ''),
      statCard(t.cardSnap, m(latest), latest),
      places.map(function (x) { return statCard(fmt(t.cardPlace, { genre: x.name }), String(x.p.place), fmt(t.cardOf, { of: n(x.p.of) })); }).join('\n'),
      '</div>',
      '<h2>' + esc(t.srcH) + '</h2>', '<p>' + t.srcP + '</p>',
      '<h2>' + esc(t.histH) + '</h2>', '<p>' + esc(fmt(t.histLead, vn)) + '</p>', histTable,
      '<p>' + [a.site ? '<a href="' + esc(a.site) + '" rel="noopener">' + esc(fmt(t.linkSite, vn)) + '</a>' : '', lk.pandora ? '<a href="' + esc(lk.pandora) + '" rel="noopener">' + esc(fmt(t.linkPandora, vn)) + '</a>' : '', lk.spotify ? '<a href="' + esc(lk.spotify) + '" rel="noopener">' + esc(fmt(t.linkSpotify, vn)) + '</a>' : '', '<a href="index.html"' + (ru ? ' hreflang="en"' : '') + '>' + esc(t.linkRank) + '</a>', twin ? '<a href="' + other + '" hreflang="' + (ru ? 'en' : 'ru') + '" lang="' + (ru ? 'en' : 'ru') + '">' + esc(t.otherLang) + '</a>' : ''].filter(Boolean).join(' &middot; ') + '</p>',
      a.owner ? '<h2>' + esc(t.ownerH) + '</h2>\n<p>' + fmtH(t.ownerP, vn) + '</p>' : '',
      '</section>', '</main>'
    ]).join('\n');
    return { lang: lang, locale: ru ? 'ru_RU' : 'en_US', url: url, file: file, answer: answer, second: second, title: title, desc: desc, ld: ld, body: body, hist: hist, latest: latest, lk: lk, twin: twin, urlEn: urlEn, urlRu: urlRu };
  }

  function ogBlock(r) {
    return ['<meta property="og:type" content="article">', '<meta property="og:site_name" content="Ledgertone">', '<meta property="og:locale" content="' + r.locale + '">', '<meta property="og:title" content="' + esc(r.title) + '">', '<meta property="og:description" content="' + esc(r.desc) + '">', '<meta property="og:url" content="' + r.url + '">', '<meta property="og:image" content="' + SITE + 'assets/og-image.png">', '<meta name="twitter:card" content="summary_large_image">'].join('\n');
  }
  var ldTag = function (r) { return '<script type="application/ld+json">' + JSON.stringify(r.ld).replace(/</g, '\\u003c') + '</script>'; };

  // Browser: fill the page from the database (body has data-artist="<key>")
  function boot() {
    var doc = document, key = doc.body.getAttribute('data-artist');
    var main = doc.querySelector('main');
    if (!key || !main) return;
    var lang = doc.documentElement.lang === 'ru' ? 'ru' : 'en';
    var a = core.pageArtists().find(function (x) { return x.key === key; });
    var r = a && model(a, lang);
    var set = function (sel, make) { var el = doc.head.querySelector(sel); if (!el) { el = make(); doc.head.appendChild(el); } return el; };
    if (!r) { main.innerHTML = '<section class="wrap doc"><p>' + esc(TEXT[lang].missing) + '</p><p><a href="index.html">' + esc(TEXT[lang].linkRank) + '</a></p></section>'; return; }
    main.innerHTML = r.body.replace(/^<main>\n/, '').replace(/\n<\/main>$/, '');
    doc.title = r.title;
    set('meta[name="description"]', function () { var e = doc.createElement('meta'); e.name = 'description'; return e; }).setAttribute('content', r.desc);
    var tmp = doc.createElement('div'); tmp.innerHTML = ogBlock(r);
    Array.prototype.slice.call(tmp.children).forEach(function (e) { var old = doc.head.querySelector(e.getAttribute('property') ? 'meta[property="' + e.getAttribute('property') + '"]' : 'meta[name="' + e.getAttribute('name') + '"]'); if (old) old.remove(); doc.head.appendChild(e); });
    var ld = doc.head.querySelector('script[type="application/ld+json"]') || doc.head.appendChild(doc.createElement('script'));
    ld.type = 'application/ld+json'; ld.textContent = JSON.stringify(r.ld).replace(/</g, '\\u003c');
    doc.body.setAttribute('data-ready', '1');
  }

  var api = { model: model, ogBlock: ogBlock, ldTag: ldTag, fmt: fmt };
  if (typeof document !== 'undefined' && typeof window !== 'undefined' && window.LEDGERTONE && document.body && document.body.hasAttribute('data-artist')) boot();
  return api;
});
