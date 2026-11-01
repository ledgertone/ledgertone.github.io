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
  var SITE = 'https://ledgertone.settwor.com.pl/';
  var esc = core.esc, num = core.num, month = core.month, genreName = core.genreName;
  var fmt = function (s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(v, k) ? v[k] : m; }); };
  var fmtH = function (s, v) { var e = {}; Object.keys(v).forEach(function (k) { e[k] = esc(v[k]); }); return fmt(s, e); };
  var statCard = function (k, v, of, extra) { return '<div class="stat glass glass-flat"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + (of ? '<span class="of"> ' + esc(of) + '</span>' : '') + (extra || '') + '</div></div>'; };
  // owner mark (owner decision, v1.19.0, AGENTS.md rule 21): only the owner page, only while the place is worse than the place with earlierListeners (core.earlierPlaceAt); same markup as in assets/app.js
  var dropMark = function (a, place, e, t) { return a.owner && e !== null && e !== undefined && place > e ? '<span class="dn" aria-label="' + esc(fmt(t.earlier, { place: e })) + '"><svg class="ar" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false"><path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>#' + e + '</span>' : ''; };

  // CDRA award cards (owner decision, v1.54.0, AGENTS.md rule 27): plain iframes of the two embed pages of the CDRA site, no script on this site.
  // The light card is shown in the light theme, the dark card in the dark theme (CSS in assets/styles.css, .awards); a hidden lazy iframe does not load.
  var CDRA = 'https://cdra.settwor.com.pl/';
  var awardsBlock = function (t, v) {
    var frame = function (item, dark) {
      return '<iframe class=\"' + (dark ? 'aw-d' : 'aw-l') + '\" src=\"' + CDRA + 'embed/' + esc(item.file) + (dark ? '-dark' : '') + '.html\" title=\"' + esc(item.title) + '\" loading=\"lazy\" referrerpolicy=\"no-referrer\"' + (dark ? ' style=\"color-scheme:dark\"' : ' style=\"color-scheme:light\"') + '></iframe>';
    };
    return '<h2>' + esc(t.awardsH) + '</h2>\n<p>' + esc(fmt(t.awardsLead, v)) + '</p>\n<div class=\"awards\">\n'
      + t.awardsItems.map(function (it) { return '<div class=\"award\">' + frame(it, false) + frame(it, true) + '</div>'; }).join('\n')
      + '\n</div>\n<p><a href=\"' + CDRA + '\" rel=\"noopener\">' + esc(t.awardsMore) + '</a></p>';
  };

  function model(a, lang) {
    var t = TEXT[lang], ru = lang === 'ru', n = function (x) { return num(x, lang); }, m = function (d) { return month(d, lang); };
    var file = ru ? a.fileRu : a.file, other = ru ? a.file : a.fileRu, twin = !!a.fileRu;
    var hist = core.historyOf(a.name);
    if (!hist.length) return null;
    var latest = hist[0].date;
    var rows = core.L.genres.map(function (g) { return hist.find(function (r) { return r.genre === g.id; }); }).filter(Boolean);
    var topRows = rows.filter(function (r) { return r.date === latest; });
    var top = topRows[0], isNum = Number.isFinite(top.x.listeners);
    var places = topRows.map(function (r) { return { id: r.genre, name: genreName(r.genre), p: r.place ? { place: r.place, of: r.total, ranked: r.of } : null, e: a.owner ? core.earlierPlaceAt(r.genre, r.i, a.name) : null }; }).filter(function (x) { return x.p && isNum; });
    // a place among fewer than 3 ranked artists stays in the cards but is left out of the sentence and the title
    var sig = places.filter(function (x) { return x.p.ranked >= 3; });
    var placeTail = sig.length ? fmt(t.placeTail, {
      items: sig.map(function (x) { return fmt(t.placeItem, { place: x.p.place, of: n(x.p.of), genre: x.name }); }).join(t.and)
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
    // owner page (v1.56.0): the page is a profile with every platform, so title and description say so
    if (a.owner && t.ownTitle) { title = fmt(t.ownTitle, { name: a.name, month: m(latest) }); desc = fmt(t.ownDesc, { name: a.name, answer: answer }); }
    var dates = hist.map(function (r) { return r.date; }).sort();
    var coverage = dates[0] === dates[dates.length - 1] ? dates[0] : dates[0] + '/' + dates[dates.length - 1];
    // v1.52.0: on the owner pages the artist is the ONE shared entity (core.ownerNode, @id https://settwor.com.pl/#artist), on every other
    // page it stays the page's own #artist node.
    // profile links of the owner by host (brand names, not translated) and the listeners on every platform (data/settwor-platforms.js, Pandora from the latest snapshot)
    var HOSTS = { 'www.pandora.com': 'Pandora', 'open.spotify.com': 'Spotify', 'www.shazam.com': 'Shazam', 'musicbrainz.org': 'MusicBrainz', 'www.musixmatch.com': 'Musixmatch', 'genius.com': 'Genius', 'www.deezer.com': 'Deezer', 'www.amazon.com': 'Amazon Music', 'www.tiktok.com': 'TikTok', 'music.apple.com': 'Apple Music', 'music.youtube.com': 'YouTube Music', 'www.youtube.com': 'YouTube' };
    var profiles = [], plat = [], counted = [], sum = 0;
    if (a.owner) {
      profiles = [lk.pandora, lk.spotify].concat(lk.extra || []).filter(Boolean).map(function (u) { var h = ''; try { h = new URL(u).hostname; } catch (e) {} return { label: HOSTS[h] || h, url: u }; });
      var ph = hist.filter(function (r) { return Number.isFinite(r.x.listeners); })[0];
      var has = function (p) { return Number.isFinite(p.listeners) && p.listeners >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(p.date || ''); };
      plat = [{ name: 'Pandora', metric: '28-day listeners', listeners: ph ? ph.x.listeners : null, date: ph ? ph.date : null }].concat((core.PLATFORMS || []).map(function (p) { return Object.assign({}, p); }))
        .map(function (p) { var pr = profiles.filter(function (x) { return x.label === p.name; })[0]; p.url = pr ? pr.url : null; p.has = has(p); return p; });
      counted = plat.filter(function (p) { return p.has; });
      sum = counted.reduce(function (x, p) { return x + p.listeners; }, 0);
    }
    var metricName = function (x) { return (t.metrics && t.metrics[x]) || x; };
    var platAnswer = a.owner && counted.length && t.platA ? fmt(t.platA, { name: a.name, items: counted.map(function (p) { return fmt(t.platItem, { platform: p.name, n: n(p.listeners), metric: metricName(p.metric), date: p.date }); }).join('; '), sum: n(sum), k: counted.length, all: plat.length }) : '';
    var artistId = a.owner ? a.site + '#artist' : url + '#artist';
    var ld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': url + '#page', url: url, name: title, description: desc, inLanguage: lang, dateModified: latest, isPartOf: { '@type': 'WebSite', name: 'Ledgertone', url: SITE }, publisher: { '@id': SITE + '#org' }, breadcrumb: { '@id': url + '#crumbs' }, about: { '@id': artistId }, mainEntity: { '@id': url + '#faq' } },
      Object.assign({ '@type': 'Organization', '@id': SITE + '#org', name: 'Ledgertone', url: SITE, logo: SITE + 'assets/icons/favicon-192.png' }, a.owner ? { founder: { '@id': artistId } } : {}),
      { '@type': 'BreadcrumbList', '@id': url + '#crumbs', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Ledgertone', item: SITE }, { '@type': 'ListItem', position: 2, name: a.name, item: url }] },
      a.owner ? core.ownerNode(lk) : { '@type': 'MusicGroup', '@id': artistId, name: a.name, url: a.site, image: a.photo || undefined, sameAs: [a.site, lk.pandora, lk.spotify].filter(Boolean) },
      { '@type': 'Dataset', '@id': url + '#data', name: fmt(t.dsName, { name: a.name }), description: fmt(t.dsDesc, { answer: answer, date: latest }), creator: a.owner ? core.ownerCreator() : { '@type': 'Organization', name: 'Ledgertone', url: SITE }, license: 'https://creativecommons.org/licenses/by/4.0/', url: url, isAccessibleForFree: true, publisher: { '@id': SITE + '#org' }, measurementTechnique: t.dsMethod, keywords: fmt(t.dsKeywords, { name: a.name }), distribution: a.csv ? [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: SITE + a.csv }] : undefined, dateModified: latest, temporalCoverage: coverage, inLanguage: lang, about: { '@id': artistId },
        variableMeasured: (isNum ? [{ '@type': 'PropertyValue', name: t.metric, value: top.x.listeners, unitText: t.unit }] : [{ '@type': 'PropertyValue', name: t.metric, value: 'Few' }])
          .concat(places.map(function (x) { return { '@type': 'PropertyValue', name: fmt(t.placeVar, { genre: x.name, month: m(latest) }), value: x.p.place, description: fmt(t.placeDesc, { of: n(x.p.of), ranked: n(x.p.ranked) }) }; })) },
      { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: [{ '@type': 'Question', name: fmt(t.q, { name: a.name }), acceptedAnswer: { '@type': 'Answer', text: answer + ' ' + second } }].concat(platAnswer ? [{ '@type': 'Question', name: fmt(t.platQ, { name: a.name }), acceptedAnswer: { '@type': 'Answer', text: platAnswer } }] : []).concat(a.owner && t.growItems ? [{ '@type': 'Question', name: fmt(t.growQ, { name: a.name }), acceptedAnswer: { '@type': 'Answer', text: fmt(t.growLead, { name: a.name }) + ' ' + t.growItems.join(' ') } }] : []) }
    ] };

    var histRows = hist.map(function (r) {
      return '<tr><td>' + esc(m(r.date)) + '<br><span class="of">' + esc(r.date) + '</span></td><td>' + esc(genreName(r.genre)) + '</td>'
        + (Number.isFinite(r.x.listeners) ? '<td class="st">' + esc(n(r.x.listeners)) + '</td>' : '<td class="st nodata">' + esc(t.few) + '</td>')
        + '<td class="rk">' + (r.place ? r.place : '-') + '</td></tr>';
    }).join('\n');
    var histTable = '<div class="tbl hist glass glass-flat"><table><caption class="sr">' + esc(fmt(t.histCap, { name: a.name })) + '</caption>\n<thead><tr><th scope="col">' + esc(t.th[0]) + '</th><th scope="col">' + esc(t.th[1]) + '</th><th scope="col" class="c-st">' + esc(t.th[2]) + '</th><th scope="col" class="c-rk">' + esc(t.th[3]) + '</th></tr></thead>\n<tbody>\n' + histRows + '\n</tbody></table></div>';

    var vn = { name: a.name };
    // link row: a plain paragraph under the history on every page
    var linkRow = function (open, close, sep, cls) {
      return open + [a.site ? '<a' + cls + ' href="' + esc(a.site) + '" rel="noopener">' + esc(fmt(t.linkSite, vn)) + '</a>' : '', lk.pandora ? '<a' + cls + ' href="' + esc(lk.pandora) + '" rel="noopener">' + esc(fmt(t.linkPandora, vn)) + '</a>' : '', lk.spotify ? '<a' + cls + ' href="' + esc(lk.spotify) + '" rel="noopener">' + esc(fmt(t.linkSpotify, vn)) + '</a>' : '', a.csv ? '<a' + cls + ' href="' + esc(a.csv) + '" type="text/csv">' + esc(fmt(t.linkCsv, vn)) + '</a>' : '', '<a' + cls + ' href="index.html"' + (ru ? ' hreflang="en"' : '') + '>' + esc(t.linkRank) + '</a>', twin ? '<a' + cls + ' href="' + other + '" hreflang="' + (ru ? 'en' : 'ru') + '" lang="' + (ru ? 'en' : 'ru') + '">' + esc(t.otherLang) + '</a>' : ''].filter(Boolean).join(sep) + close;
    };
    var body = [
      '<main>', '<section class="wrap doc' + (a.owner ? ' own' : '') + '">',
      a.owner && a.photo ? '<div class="ownhead">\n<img class="ownphoto" src="' + esc(a.photo) + '" alt="' + esc(fmt(t.photoAlt, vn)) + '" width="88" height="88" decoding="async" referrerpolicy="no-referrer">\n<h1>' + esc(fmt(t.h1, vn)) + '</h1>\n</div>' : '<h1>' + esc(fmt(t.h1, vn)) + '</h1>',
      '<h2>' + esc(fmt(t.q, vn)) + '</h2>',
      '<p>' + esc(answer) + ' ' + esc(second) + '</p>'
    ].concat(a.verified === false ? ['<p>' + esc(fmt(t.unvNote, vn)) + '</p>'] : []).concat([
      '<div class="stats" role="group" aria-label="' + esc(fmt(t.aria, vn)) + '">',
      statCard(t.cardL, isNum ? n(top.x.listeners) : 'Few', isNum ? fmt(t.cardShown, { text: top.x.text }) : ''),
      statCard(t.cardSnap, m(latest), latest),
      places.map(function (x) { return statCard(fmt(t.cardPlace, { genre: x.name }), String(x.p.place), fmt(t.cardOf, { of: n(x.p.of) }), dropMark(a, x.p.place, x.e, t)); }).join('\n'),
      '</div>',
      '<h2>' + esc(t.srcH) + '</h2>', '<p>' + t.srcP + '</p>',
      '<h2>' + esc(t.histH) + '</h2>', '<p>' + esc(fmt(t.histLead, vn)) + '</p>', histTable,
      linkRow('<p>', '</p>', ' &middot; ', ''),
      a.owner && t.growItems ? '<h2>' + esc(t.growH) + '</h2>\n<p>' + esc(fmt(t.growLead, vn)) + '</p>\n<ul class="grow">\n' + t.growItems.map(function (x) { return '<li class="glass glass-flat">' + esc(x) + '</li>'; }).join('\n') + '\n</ul>\n<p>' + fmtH(t.growSrc, vn) + '</p>' : '',
      a.owner && t.awardsItems && t.awardsItems.length ? awardsBlock(t, vn) : '',
      a.owner ? '<div class="ownabout glass glass-flat">\n<h2>' + esc(t.ownerH) + '</h2>\n<p>' + fmtH(t.ownerP, vn) + '</p>\n</div>' : '',
      '</section>', '</main>'
    ]).join('\n');
    if (a.owner && t.ownTitle) {
      var sec = function (id, inner) { return '<section class="blk" id="' + id + '">\n' + inner + '\n</section>'; };
      var cards = [];
      if (isNum) cards.push(statCard(t.cardL, n(top.x.listeners), fmt(t.cardShown, { text: top.x.text })));
      counted.forEach(function (p) {
        if (p.name === 'Pandora') return;
        cards.push(statCard(p.name + ': ' + metricName(p.metric), n(p.listeners), p.date));
        if (Number.isFinite(p.followers) && p.followers >= 0) cards.push(statCard(p.name + ': ' + t.followers, n(p.followers), p.date));
        if (Number.isFinite(p.popularity) && p.popularity >= 0 && p.popularity <= 100) cards.push(statCard(p.name + ': ' + t.popularity, String(p.popularity), t.popOf, '<span class="of"> ' + esc(p.date) + '</span>'));
      });
      var platRows = plat.map(function (p) {
        var nm = p.url ? '<a class="nm" href="' + esc(p.url) + '" rel="noopener">' + esc(p.name) + '</a>' : '<span class="nm">' + esc(p.name) + '</span>';
        var ex = [];
        if (p.has && Number.isFinite(p.followers) && p.followers >= 0) ex.push(t.followers + ' ' + n(p.followers));
        if (p.has && Number.isFinite(p.popularity) && p.popularity >= 0 && p.popularity <= 100) ex.push(t.popularity + ' ' + p.popularity + ' ' + t.popOf);
        return '<tr><td class="who">' + nm + '</td><td>' + esc(metricName(p.metric)) + (ex.length ? '<small class="ex">' + esc(ex.join(' \u00b7 ')) + '</small>' : '') + '</td><td class="st">' + (p.has ? esc(n(p.listeners)) + '<small>' + esc(p.date) + '</small>' : '<span class="nd">' + esc(t.noData) + '</span>') + '</td></tr>';
      }).join('\n');
      var platTable = '<div class="tbl hist glass glass-flat"><table><caption class="sr">' + esc(fmt(t.platCap, vn)) + '</caption>\n<thead><tr><th scope="col">' + esc(t.platTh[0]) + '</th><th scope="col">' + esc(t.platTh[1]) + '</th><th scope="col" class="c-st">' + esc(t.platTh[2]) + '</th></tr></thead>\n<tbody>\n' + platRows + '\n</tbody></table></div>';
      var sumCard = '<div class="stats sumrow" role="group" aria-label="' + esc(t.sumL) + '">' + statCard(t.sumL, counted.length ? n(sum) : t.noData, counted.length ? fmt(t.sumOf, { k: counted.length, all: plat.length }) : '') + '</div>';
      var chips = genres.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('');
      var links = [];
      if (a.site) links.push([fmt(t.linkSite, vn), a.site]);
      links.push([t.profBio, a.site + 'bio.html']);
      links.push([t.profCdra, CDRA]);
      profiles.forEach(function (p) { links.push([p.label, p.url]); });
      var plinks = '<ul class="plinks">\n' + links.map(function (x) { return '<li><a class="plink glass glass-flat" href="' + esc(x[1]) + '" rel="noopener"><span class="pl-n">' + esc(x[0]) + '</span></a></li>'; }).join('\n') + '\n</ul>';
      var jump = '<nav class="jump" aria-label="' + esc(t.jumpL) + '">' + t.jump.map(function (x) { return '<a class="glass glass-flat" href="#' + x[0] + '">' + esc(x[1]) + '</a>'; }).join('') + '</nav>';
      body = [
        '<main>', '<section class="wrap doc own prof">',
        '<div class="ownhead">\n' + (a.photo ? '<img class="ownphoto" src="' + esc(a.photo) + '" alt="' + esc(fmt(t.photoAlt, vn)) + '" width="160" height="160" decoding="async" referrerpolicy="no-referrer">\n' : '') + '<div class="ownid">\n<h1>' + esc(fmt(t.ownH1, vn)) + '</h1>\n<p class="tagline">' + esc(fmt(t.tagline, vn)) + '</p>\n</div>\n</div>',
        '<ul class="chips" aria-label="' + esc(t.genresL) + '">' + chips + '</ul>',
        jump,
        '<div class="stats" role="group" aria-label="' + esc(t.keyL) + '">\n' + cards.join('\n') + '\n</div>',
        sec('platforms', '<h2>' + esc(t.platH) + '</h2>\n<p>' + esc(fmt(t.platLead, vn)) + '</p>\n' + platTable + '\n' + sumCard + '\n<p>' + esc(t.platNote) + '</p>'),
        // v1.57.0 (rule 28): plays and views from the owner's site, filled in the browser by assets/streams.js, so no figure is written here
        t.strH ? sec('streams', '<h2>' + esc(t.strH) + '</h2>\n<p>' + esc(fmt(t.strLead, vn)) + '</p>\n<div id="streams-live" data-state="loading" aria-live="polite"><p class="nd">' + esc(t.strLoad) + '</p></div>\n<noscript><p class="nd">' + esc(t.strNoJs) + '</p></noscript>\n<p><a href="' + esc(a.site + 'streams') + '" rel="noopener">' + esc(t.strOpen) + '</a></p>') : '',
        sec('pandora', '<h2>' + esc(fmt(t.pandoraH, vn)) + '</h2>\n<p>' + esc(answer) + ' ' + esc(second) + '</p>\n<div class="stats" role="group" aria-label="' + esc(fmt(t.aria, vn)) + '">\n' + statCard(t.cardL, isNum ? n(top.x.listeners) : 'Few', isNum ? fmt(t.cardShown, { text: top.x.text }) : '') + '\n' + statCard(t.cardSnap, m(latest), latest) + '\n' + places.map(function (x) { return statCard(fmt(t.cardPlace, { genre: x.name }), String(x.p.place), fmt(t.cardOf, { of: n(x.p.of) }), dropMark(a, x.p.place, x.e, t)); }).join('\n') + '\n</div>\n<h3>' + esc(t.srcH) + '</h3>\n<p>' + t.srcP + '</p>\n<h3>' + esc(t.histH) + '</h3>\n<p>' + esc(fmt(t.histLead, vn)) + '</p>\n' + histTable + '\n' + linkRow('<p>', '</p>', ' &middot; ', '')),
        t.growItems ? sec('growth', '<h2>' + esc(t.growH) + '</h2>\n<p>' + esc(fmt(t.growLead, vn)) + '</p>\n<ul class="grow">\n' + t.growItems.map(function (x) { return '<li class="glass glass-flat">' + esc(x) + '</li>'; }).join('\n') + '\n</ul>\n<p>' + fmtH(t.growSrc, vn) + '</p>') : '',
        t.awardsItems && t.awardsItems.length ? sec('awards', awardsBlock(t, vn)) : '',
        sec('profiles', '<h2>' + esc(t.profH) + '</h2>\n<p>' + esc(fmt(t.profLead, vn)) + '</p>\n' + plinks),
        sec('about', '<div class="ownabout glass glass-flat">\n<h2>' + esc(t.ownerH) + '</h2>\n<p>' + fmtH(t.ownerP, vn) + '</p>\n</div>'),
        '</section>', '</main>'
      ].filter(Boolean).join('\n');
    }
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
