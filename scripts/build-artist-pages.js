// Builds the static artist pages (owner decision, v0.76.0) so search engines and AI answers can read the number
// without running JavaScript. Every number and date comes from data/snapshots.js and data/links.js, nothing is typed by hand.
// v0.81.0: the page has a snapshot history table, a Russian twin (settwor-ru.html, owner decision) linked by hreflang,
// and the fragment for the artist's own site is written to docs/settwor-site-snippet.html.
// Run after ANY data change and after every version bump: node scripts/build-artist-pages.js (or node scripts/build-all.js)
// The page shell is copied from about.html (head snippet with Consent Mode, nav, footer, version tags).
const lib = require('./lib/ledger.js');
const { L, SITE, norm, esc, banned, genreName, month, num, snapsOf, rankedAt, linksOf, readCRLF, writeCRLF } = lib;

const ARTISTS = [{ name: 'SETTWOR', file: 'settwor.html', fileRu: 'settwor-ru.html', site: 'https://settwor.github.io/', owner: true }];
const statCard = (k, v, of) => '<div class="stat glass glass-flat"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + (of ? '<span class="of"> ' + esc(of) + '</span>' : '') + '</div></div>';

// Copy for both languages. English is the source, Russian is the owner-approved twin (AGENTS.md rule 1).
const T = {
  en: {
    lang: 'en', locale: 'en_US', month: (d) => month(d, 'en'), num: (n) => num(n, 'en'),
    h1: (n) => n + ' on Pandora: 28-day listeners',
    q: (n) => 'How many listeners does ' + n + ' have on Pandora?',
    answerNum: (n, x, latest, tail) => n + ' had ' + T.en.num(x.listeners) + ' listeners over 28 days on Pandora in the Ledgertone snapshot of ' + T.en.month(latest) + ' (Pandora showed ' + x.text + ')' + tail + '.',
    answerFew: (n, latest) => 'In the Ledgertone snapshot of ' + T.en.month(latest) + ', Pandora showed "Few" as the 28-day listeners of ' + n + ', not a number.',
    placeTail: (sig) => (sig.length ? ', ' + sig.map((x) => 'place ' + x.p.place + ' of ' + x.p.of + ' ranked artists in ' + x.name).join(' and ') + ' (artists with a number)' : ''),
    same: (g) => 'The same reading is listed in ' + g.join(' and ') + '.', listed: (g) => 'Listed in ' + g.join(' and ') + '.',
    title: (n, x, sig, latest) => n + ' on Pandora: ' + (x ? x.text + ' listeners' + (sig.length ? ', No. ' + sig[0].p.place + ' in ' + sig[0].name : '') : '28-day listeners') + ' (' + T.en.month(latest) + ') | Ledgertone',
    descTail: ' A hand-collected snapshot, not live data.',
    dsName: (n) => n + ' 28-day listeners on Pandora',
    dsDesc: (answer, latest) => answer + ' Collected by hand from the artist profile on Pandora, snapshot dated ' + latest + '. Not the Pandora API, not live.',
    metric: '28-day listeners on Pandora', placeVar: (g, latest) => 'Place in the Ledgertone ' + g + ' ranking, ' + T.en.month(latest),
    placeDesc: (of) => 'Out of ' + of + ' ranked artists (artists with a 28-day listeners number)', unit: 'listeners',
    cardL: '28-day listeners on Pandora', cardShown: (t) => 'shown as ' + t, cardSnap: 'Snapshot', cardPlace: (g) => 'Place in ' + g, cardOf: (o) => 'of ' + o + ' ranked',
    srcH: 'Where the number comes from',
    src: '<p>The figure is the number of listeners over the last 28 days shown on the artist profile on Pandora, collected by hand on the snapshot date. It is a record of one moment, it is not live and it is not from the Pandora API, so it may differ from what Pandora shows today. More on the method is on the <a href="about.html">About page</a>.</p>',
    histH: 'Snapshot history', histP: (n) => 'Every Ledgertone snapshot that has a Pandora 28-day listeners reading for ' + n + ', newest first. Each row is one snapshot of one genre, the place is counted among the artists with a number in that snapshot.',
    histCap: (n) => n + ': Pandora 28-day listeners by snapshot', th: ['Snapshot', 'Genre', '28-day listeners', 'Place'], few: 'Few',
    links: (n) => ({ site: n + ' website', pandora: n + ' on Pandora', spotify: n + ' on Spotify', rank: 'Full ranking' }), otherLang: ['\u0420\u0443\u0441\u0441\u043a\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f', 'ru'],
    ownerH: 'Who runs Ledgertone',
    owner: (n) => '<p>Ledgertone is run by ' + esc(n) + ', who is listed in the ranking and checks the accuracy of the data by hand. ' + esc(n) + ' is placed by the same rule as every other artist: by the 28-day listeners number in the snapshot. See the <a href="about.html">About page</a>.</p>'
  },
  ru: {
    lang: 'ru', locale: 'ru_RU', month: (d) => month(d, 'ru'), num: (n) => num(n, 'ru'),
    h1: (n) => n + ' на Pandora: слушатели за 28 дней',
    q: (n) => 'Сколько слушателей у ' + n + ' на Pandora?',
    answerNum: (n, x, latest, tail) => 'У ' + n + ' было ' + T.ru.num(x.listeners) + ' слушателей за 28 дней на Pandora в снимке Ledgertone за ' + T.ru.month(latest) + ' (Pandora показывала ' + x.text + ')' + tail + '.',
    answerFew: (n, latest) => 'В снимке Ledgertone за ' + T.ru.month(latest) + ' Pandora показывала у ' + n + ' «Few» вместо числа слушателей за 28 дней.',
    placeTail: (sig) => (sig.length ? ', ' + sig.map((x) => 'место ' + x.p.place + ' из ' + x.p.of + ' в рейтинге ' + x.name).join(' и ') + ' (учитываются артисты с числом слушателей)' : ''),
    same: (g) => 'Тот же показатель указан в жанрах ' + g.join(' и ') + '.', listed: (g) => 'Указан в жанрах ' + g.join(' и ') + '.',
    title: (n, x, sig, latest) => n + ' на Pandora: ' + (x ? x.text + ' слушателей' + (sig.length ? ', место ' + sig[0].p.place + ' в ' + sig[0].name : '') : 'слушатели за 28 дней') + ' (' + T.ru.month(latest) + ') | Ledgertone',
    descTail: ' Снимок, собранный вручную, а не данные в реальном времени.',
    dsName: (n) => n + ': слушатели за 28 дней на Pandora',
    dsDesc: (answer, latest) => answer + ' Собрано вручную из профиля артиста на Pandora, снимок от ' + latest + '. Это не API Pandora и не данные в реальном времени.',
    metric: 'Слушатели за 28 дней на Pandora', placeVar: (g, latest) => 'Место в рейтинге Ledgertone ' + g + ', ' + T.ru.month(latest),
    placeDesc: (of) => 'Из ' + of + ' артистов с числом слушателей за 28 дней', unit: 'слушателей',
    cardL: 'Слушатели за 28 дней на Pandora', cardShown: (t) => 'показано как ' + t, cardSnap: 'Снимок', cardPlace: (g) => 'Место в ' + g, cardOf: (o) => 'из ' + o,
    srcH: 'Откуда это число',
    src: '<p>Число слушателей за последние 28 дней, показанное в профиле артиста на Pandora, собрано вручную в день снимка. Это запись одного момента: она не обновляется сама, взята не из API Pandora и может отличаться от того, что Pandora показывает сегодня. О методе подробнее на странице <a href="about.html" hreflang="en">About</a> (на английском).</p>',
    histH: 'История снимков', histP: (n) => 'Все снимки Ledgertone, в которых есть число слушателей ' + n + ' за 28 дней на Pandora, новые сверху. Строка соответствует одному снимку одного жанра, место считается среди артистов с числом в этом снимке.',
    histCap: (n) => n + ': слушатели за 28 дней на Pandora по снимкам', th: ['Снимок', 'Жанр', 'Слушатели за 28 дней', 'Место'], few: 'Few',
    links: (n) => ({ site: 'Сайт ' + n, pandora: n + ' на Pandora', spotify: n + ' на Spotify', rank: 'Полный рейтинг (на английском)' }), otherLang: ['English version', 'en'],
    ownerH: 'Кто ведёт Ledgertone',
    owner: (n) => '<p>Ledgertone ведёт ' + esc(n) + ': он сам есть в рейтинге и вручную проверяет точность данных. ' + esc(n) + ' стоит на своём месте по тому же правилу, что и любой другой артист: по числу слушателей за 28 дней в снимке. См. страницу <a href="about.html" hreflang="en">About</a> (на английском).</p>'
  }
};

const tpl = readCRLF('about.html');

// every reading of the artist (a number or "few"), newest snapshot first; the place is counted like on the home page
const historyOf = (name) => {
  const out = [];
  L.genres.forEach((g, gi) => snapsOf(g.id).forEach((s, i) => {
    const x = s.artists.find((y) => norm(y.name) === norm(name));
    if (!x || !(Number.isFinite(x.listeners) || x.few === true)) return;
    let place = null, of = null;
    if (Number.isFinite(x.listeners)) { const r = rankedAt(g.id, i); const k = r.find((y) => norm(y.name) === norm(name)); if (k) { place = k.rank; of = r.length; } }
    out.push({ genre: g.id, gi, i, date: s.capturedAt, x, place, of });
  }));
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.gi - b.gi));
};

function buildPage(a, lang) {
  const t = T[lang], ru = lang === 'ru';
  const file = ru ? a.fileRu : a.file, other = ru ? a.file : a.fileRu;
  const hist = historyOf(a.name);
  if (!hist.length) throw new Error('No reading for ' + a.name + ', page not built');
  const latest = hist[0].date;
  // latest reading per genre (the first row of each genre in the newest-first history)
  const rows = L.genres.map((g) => hist.find((r) => r.genre === g.id)).filter(Boolean);
  const topRows = rows.filter((r) => r.date === latest);
  const top = topRows[0];
  const isNum = Number.isFinite(top.x.listeners);
  const places = topRows.map((r) => ({ id: r.genre, name: genreName(r.genre), p: r.place ? { place: r.place, of: r.of } : null })).filter((x) => x.p && isNum);
  // a place out of fewer than 3 ranked artists ("1 of 1") stays in the cards but is left out of the sentence and the title
  const sig = places.filter((x) => x.p.of >= 3);
  const answer = isNum ? t.answerNum(a.name, top.x, latest, t.placeTail(sig)) : t.answerFew(a.name, latest);
  const genres = rows.map((r) => genreName(r.genre));
  const same = rows.length > 1 && rows.every((r) => r.x.listeners === top.x.listeners && r.x.few === top.x.few);
  const second = same ? t.same(genres) : t.listed(genres);
  const lk = linksOf(a.name);
  const url = SITE + file, urlEn = SITE + a.file, urlRu = SITE + a.fileRu;
  const title = t.title(a.name, isNum ? top.x : null, sig, latest);
  const desc = answer + t.descTail;
  const dates = hist.map((r) => r.date).sort();
  const coverage = dates[0] === dates[dates.length - 1] ? dates[0] : dates[0] + '/' + dates[dates.length - 1];

  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url + '#page', url, name: title, description: desc, inLanguage: t.lang, dateModified: latest, isPartOf: { '@type': 'WebSite', name: 'Ledgertone', url: SITE }, about: { '@id': url + '#artist' }, mainEntity: { '@id': url + '#faq' } },
    { '@type': 'MusicGroup', '@id': url + '#artist', name: a.name, url: a.site, sameAs: [a.site, lk.pandora, lk.spotify].filter(Boolean) },
    { '@type': 'Dataset', '@id': url + '#data', name: t.dsName(a.name), description: t.dsDesc(answer, latest), creator: Object.assign({ '@type': 'Organization', name: 'Ledgertone', url: SITE }, a.owner ? { founder: { '@id': url + '#artist' } } : {}), dateModified: latest, temporalCoverage: coverage, inLanguage: t.lang, about: { '@id': url + '#artist' },
      variableMeasured: (isNum ? [{ '@type': 'PropertyValue', name: t.metric, value: top.x.listeners, unitText: t.unit }] : [{ '@type': 'PropertyValue', name: t.metric, value: 'Few' }])
        .concat(places.map((x) => ({ '@type': 'PropertyValue', name: t.placeVar(x.name, latest), value: x.p.place, description: t.placeDesc(x.p.of) }))) },
    { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: [{ '@type': 'Question', name: t.q(a.name), acceptedAnswer: { '@type': 'Answer', text: answer + ' ' + second } }] }
  ] };

  // history table: one row per snapshot and genre, newest first (reuses the .tbl glass panel, `hist` only widens the columns)
  const histRows = hist.map((r) => '<tr><td>' + esc(t.month(r.date)) + '<br><span class="of">' + esc(r.date) + '</span></td><td>' + esc(genreName(r.genre)) + '</td>'
    + (Number.isFinite(r.x.listeners) ? '<td class="st">' + esc(t.num(r.x.listeners)) + '</td>' : '<td class="st nodata">' + t.few + '</td>')
    + '<td class="rk">' + (r.place ? r.place : '-') + '</td></tr>').join('\n');
  const histTable = '<div class="tbl hist glass glass-flat"><table><caption class="sr">' + esc(t.histCap(a.name)) + '</caption>\n<thead><tr><th scope="col">' + t.th[0] + '</th><th scope="col">' + t.th[1] + '</th><th scope="col" class="c-st">' + t.th[2] + '</th><th scope="col" class="c-rk">' + t.th[3] + '</th></tr></thead>\n<tbody>\n' + histRows + '\n</tbody></table></div>';

  const lt = t.links(a.name);
  const body = [
    '<main>', '<section class="wrap doc">',
    '<h1>' + esc(t.h1(a.name)) + '</h1>',
    '<h2>' + esc(t.q(a.name)) + '</h2>',
    '<p>' + esc(answer) + ' ' + esc(second) + '</p>',
    '<div class="stats" role="group" aria-label="' + esc(a.name + (ru ? ' на Pandora' : ' on Pandora')) + '">',
    statCard(t.cardL, isNum ? t.num(top.x.listeners) : 'Few', isNum ? t.cardShown(top.x.text) : ''),
    statCard(t.cardSnap, t.month(latest), latest),
    places.map((x) => statCard(t.cardPlace(x.name), String(x.p.place), t.cardOf(x.p.of))).join('\n'),
    '</div>',
    '<h2>' + t.srcH + '</h2>', t.src,
    '<h2>' + t.histH + '</h2>', '<p>' + esc(t.histP(a.name)) + '</p>', histTable,
    '<p>' + [a.site ? '<a href="' + esc(a.site) + '" rel="noopener">' + esc(lt.site) + '</a>' : '', lk.pandora ? '<a href="' + esc(lk.pandora) + '" rel="noopener">' + esc(lt.pandora) + '</a>' : '', lk.spotify ? '<a href="' + esc(lk.spotify) + '" rel="noopener">' + esc(lt.spotify) + '</a>' : '', '<a href="index.html"' + (ru ? ' hreflang="en"' : '') + '>' + esc(lt.rank) + '</a>', '<a href="' + other + '" hreflang="' + t.otherLang[1] + '" lang="' + t.otherLang[1] + '">' + t.otherLang[0] + '</a>'].filter(Boolean).join(' &middot; ') + '</p>',
    a.owner ? '<h2>' + t.ownerH + '</h2>\n' + t.owner(a.name) : '',
    '</section>', '</main>'
  ].join('\n');

  let h = tpl;
  const sub = (re, s) => { if (!re.test(h)) throw new Error('template changed, pattern missing: ' + re); h = h.replace(re, () => s); };
  const alt = '<link rel="alternate" hreflang="en" href="' + urlEn + '">\n<link rel="alternate" hreflang="ru" href="' + urlRu + '">\n<link rel="alternate" hreflang="x-default" href="' + urlEn + '">';
  sub(/<html lang="en">/, '<html lang="' + t.lang + '">');
  sub(/<title>.*?<\/title>/, '<title>' + esc(title) + '</title>');
  sub(/<meta name="description" content=".*?">/, '<meta name="description" content="' + esc(desc) + '">');
  sub(/<meta name="robots" content=".*?">/, '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">');
  sub(/<link rel="canonical" href=".*?">/, '<link rel="canonical" href="' + url + '">\n' + alt + '\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="Ledgertone">\n<meta property="og:locale" content="' + t.locale + '">\n<meta property="og:title" content="' + esc(title) + '">\n<meta property="og:description" content="' + esc(desc) + '">\n<meta property="og:url" content="' + url + '">\n<meta property="og:image" content="' + SITE + 'assets/og-image.png">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>');
  sub(/<main>[\s\S]*?<\/main>/, body);
  h = h.replace(/ aria-current="page"/g, '');
  if (ru) {
    // Russian shell: nav and footer in Russian, links to the English-only pages say so
    sub(/<a class="link" href="about\.html">About<\/a>/, '<a class="link" href="about.html" hreflang="en">О проекте</a>');
    sub(/<p>Ledgertone is an independent project and is not affiliated with Pandora\. Pandora is a trademark of its respective owner\.<\/p>/, '<p>Ledgertone независимый проект и никак не связан с Pandora. Pandora является товарным знаком своего владельца.</p>');
    sub(/<p class="flinks">[\s\S]*?<button type="button" class="linkbtn glass" id="cookie-settings" hidden>Cookie settings<\/button><\/p>/, '<p class="flinks"><a href="index.html" hreflang="en">Рейтинг</a><a href="about.html" hreflang="en">О проекте (English)</a><a href="' + a.fileRu + '">SETTWOR на Pandora</a><a href="privacy.html" hreflang="en">Политика конфиденциальности (English)</a><button type="button" class="linkbtn glass" id="cookie-settings" hidden>Настройки cookie</button></p>');
    sub(/<p class="ver">Version /, '<p class="ver">Версия ');
  }
  writeCRLF(file, h);
  console.log('built ' + file + ': ' + answer);
  return { hist, latest, lk };
}

ARTISTS.forEach((a) => {
  if (banned.has(norm(a.name))) throw new Error(a.name + ' is banned');
  const en = buildPage(a, 'en');
  buildPage(a, 'ru');

  // Fragment for the artist's own site (no numbers in it, so it never goes stale). Paste it by hand, nothing here touches that site.
  const url = SITE + a.file, urlRu = SITE + a.fileRu, lk = en.lk;
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'MusicGroup', '@id': a.site + '#artist', name: a.name, url: a.site, sameAs: [lk.pandora, lk.spotify].filter(Boolean),
      subjectOf: [{ '@type': 'WebPage', '@id': url + '#page', url, name: a.name + ' on Pandora: 28-day listeners', inLanguage: 'en' }, { '@type': 'WebPage', '@id': urlRu + '#page', url: urlRu, name: a.name + ' на Pandora: слушатели за 28 дней', inLanguage: 'ru' }] },
    { '@type': 'Organization', '@id': SITE + '#org', name: 'Ledgertone', url: SITE, founder: { '@id': a.site + '#artist' } }
  ] };
  writeCRLF('docs/settwor-site-snippet.html', [
    '<!--',
    '  Fragment for ' + a.site + ' (generated by scripts/build-artist-pages.js, do not edit here).',
    '  Paste part 1 into the <head> of the main page and part 2 where a link fits (footer or a "listed in" line).',
    '  It holds no figures on purpose, so it does not go stale when a new snapshot is published.',
    '  If the page already has JSON-LD, merge the two nodes into it instead of adding a second block.',
    '  Nobody can guarantee that Google or an AI answer will use it.',
    '-->',
    '',
    '<!-- Part 1: head -->',
    '<script type="application/ld+json">' + JSON.stringify(ld, null, 2).replace(/</g, '\\u003c') + '</script>',
    '',
    '<!-- Part 2: visible link -->',
    '<p>' + a.name + ' is listed in the Ledgertone ranking of phonk artists on Pandora. <a href="' + url + '" rel="noopener">' + a.name + ' on Pandora: 28-day listeners</a> (<a href="' + urlRu + '" rel="noopener" hreflang="ru" lang="ru">по-русски</a>). Ledgertone is run by ' + a.name + '.</p>',
    ''
  ].join('\n'));
  console.log('built docs/settwor-site-snippet.html');
});
