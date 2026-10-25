(() => {
  const data = window.LEDGERTONE || {};
  const genres = data.genres && data.genres.length ? data.genres : [{ id: 'phonk', name: 'Phonk' }];
  // Same key as everywhere else on the page: lowercase, accents stripped. A banned name is matched by this key, so "Sinitizer" also blocks "Sinitízer".
  const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const banned = new Set((data.banned || []).map((n) => norm(n)));
  const clean = (s) => banned.size ? Object.assign({}, s, { artists: (s.artists || []).filter((x) => !banned.has(norm(x.name))) }) : s;
  const allSnaps = (data.snapshots || []).map(clean).sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));
  let snaps = [];
  const $ = (s) => document.querySelector(s);
  const list = $('#list'), tbl = $('#tbl'), empty = $('#empty'), picker = $('#picker'), status = $('#status'), meta = $('#meta');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const nf = new Intl.NumberFormat('en-US');
  // snapshot dates are shown as month and year only, for example "October 2026" (owner decision, v0.51.0)
  const fmt = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

  const safeImg = (u) => (typeof u === 'string' && /^assets\/artists\/[a-z0-9._-]+\.(png|jpe?g|webp|svg)$/i.test(u)) ? u : null;
  const initials = (n) => String(n).trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase();
  // Artist pictures from the generated data/artist-media.js: only https URLs on Spotify's image host (owner decision, v0.43.0).
  // One file per genre (owner decision, v0.55.0): the first genre reads data/artist-media.js (LEDGERTONE_MEDIA), the others read data/artist-media-<id>.js (LEDGERTONE_MEDIA_<ID>).
  // A non-first genre falls back to the first genre's file for artists that appear in both lists.
  const mediaObj = (name) => (window[name] && typeof window[name] === 'object') ? window[name] : {};
  const mediaFor = (g, key) => {
    if (!g || g.id === genres[0].id) return mediaObj('LEDGERTONE_MEDIA')[key];
    return mediaObj('LEDGERTONE_MEDIA_' + g.id.toUpperCase().replace(/-/g, '_'))[key] || mediaObj('LEDGERTONE_MEDIA')[key];
  };
  const safeExt = (u) => { try { const x = new URL(u); return x.protocol === 'https:' && x.hostname === 'i.scdn.co' ? x.href : null; } catch (e) { return null; } };
  function avatar(a) {
    const mono = () => el('span', 'av mono', initials(a.name));
    const src = safeImg(a.image) || safeExt(mediaFor(cur, norm(a.name)));
    if (!src) return mono();
    const img = el('img', 'av');
    img.src = src; img.alt = ''; img.width = 56; img.height = 56; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => img.replaceWith(mono()), { once: true });
    return img;
  }

  const state = { rows: [], q: '', size: 25, page: 1 };
  let moreIO = null;
  const sentinel = el('div', 'rowsend'); sentinel.setAttribute('aria-hidden', 'true'); sentinel.style.height = '1px';
  let cur = genres[0];
  // Roster names of a genre: banned names and duplicates dropped. Shown with "No data" until a snapshot has a 28-day listeners reading for them.
  const rosterOf = (g) => {
    const seen = new Set();
    return (g.roster || []).map((n) => String(n).trim()).filter((n) => {
      const k = norm(n);
      if (!n || banned.has(k) || seen.has(k)) return false;
      seen.add(k); return true;
    });
  };
  // Unverified artists (owner decision, v0.58.0): names only, from data/unverified.js. They are never merged into rosters or snapshots,
  // never counted as verified and never ranked. A name that is in the verified base or banned is dropped here as a second guard.
  const unvGroups = (window.LEDGERTONE_UNVERIFIED && window.LEDGERTONE_UNVERIFIED.groups) || {};
  const verified = new Set();
  genres.forEach((g) => (g.roster || []).forEach((n) => verified.add(norm(n))));
  allSnaps.forEach((s) => (s.artists || []).forEach((x) => { if (x && x.name) verified.add(norm(x.name)); }));
  const unverifiedOf = (g) => {
    const seen = new Set();
    // an item is a name or { name, genre?, listeners?, text?, few? }; a reading (number or few) is shown, the row stays unverified and unranked
    return (unvGroups[g.id] || []).map((x) => (typeof x === 'string' ? { name: x } : (x || {})))
      .map((x) => ({ name: String(x.name || '').trim(), src: x.genre ? String(x.genre) : '', listeners: Number.isFinite(x.listeners) ? x.listeners : null, few: !x.listeners && x.few === true }))
      .filter((x) => {
        const k = norm(x.name);
        if (!x.name || banned.has(k) || verified.has(k) || seen.has(k)) return false;
        seen.add(k); return true;
      })
      .sort((p, q2) => ((q2.listeners !== null) - (p.listeners !== null)) || ((q2.listeners || 0) - (p.listeners || 0)) || (q2.few - p.few) || p.name.localeCompare(q2.name, 'en'));
  };
  // Artist links (owner decision, v0.61.0) from data/links.js, keyed like norm(name): p = Pandora page, s = Spotify artist id. Only these two hosts are accepted.
  const linkMap = (window.LEDGERTONE_LINKS && typeof window.LEDGERTONE_LINKS === 'object') ? window.LEDGERTONE_LINKS : {};
  // Artist pages (owner decision, v0.82.0): data/artist-pages.js maps the same key to a generated page. The name opens that page, the Pandora pill still opens Pandora.
  const pageMap = (window.LEDGERTONE_PAGES && typeof window.LEDGERTONE_PAGES === 'object') ? window.LEDGERTONE_PAGES : {};
  const pageOf = (n) => { const f = pageMap[norm(n)]; return (typeof f === 'string' && /^[a-z0-9-]+\.html$/.test(f)) ? f : null; };
  const pandoraLink = (u) => { const x = safeUrl(u); try { return x && /^(www\.)?pandora\.com$/.test(new URL(x).hostname) ? x : null; } catch (e) { return null; } };
  const spotifyLink = (id) => (typeof id === 'string' && /^[A-Za-z0-9]{22}$/.test(id)) ? 'https://open.spotify.com/artist/' + id : null;
  // Open Spotify links in the Spotify app (owner request, v0.72.0). Phones and tablets keep the plain https link: open.spotify.com is a universal link (iOS) and an app link (Android), so the installed app opens it by itself. Desktop browsers have no such handoff, so a plain click launches the app through the spotify: URI and falls back to the web page in a new tab if the browser never left the page (no app installed). Modified clicks (Ctrl, Cmd, Shift, middle button) keep the normal https behavior.
  const isTouchOS = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const spotifyUri = (id) => 'spotify:artist:' + id;
  const launchSpotifyApp = (uri, web) => {
    let left = false;
    const mark = () => { left = true; };
    window.addEventListener('blur', mark); document.addEventListener('visibilitychange', mark);
    if (/Firefox/i.test(navigator.userAgent)) { const f = document.createElement('iframe'); f.style.display = 'none'; f.src = uri; document.body.append(f); setTimeout(() => f.remove(), 3000); }
    else { window.location.href = uri; }
    setTimeout(() => {
      window.removeEventListener('blur', mark); document.removeEventListener('visibilitychange', mark);
      if (!left && !document.hidden) window.open(web, '_blank', 'noopener');
    }, 2000);
  };
  // small external link button: label plus an up-right arrow, glass look from styles.css (.lk)
  const linkBtn = (label, href, aria, appUri) => {
    const b = el('a', 'lk glass glass-flat'); b.href = href; b.rel = 'noopener'; b.setAttribute('aria-label', aria);
    if (appUri && !isTouchOS) b.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); launchSpotifyApp(appUri, href);
    });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 10 10'); svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', 'M3 1.5h5.5V7M8.5 1.5 1.5 8.5'); svg.append(p);
    b.append(el('span', '', label), svg); return b;
  };
  const tools = $('#tools'), foot = $('#foot'), pager = $('#pager'), count = $('#count'), sizes = $('#sizes'), q = $('#q');

  // two small glass cards with "value / total" and a thin bar (only for the latest snapshot)
  const statsBox = $('#stats');
  function drawStats(items) {
    if (!statsBox) return;
    statsBox.replaceChildren();
    const show = items.length && items[0][2] > 0;
    statsBox.hidden = !show;
    if (!show) return;
    items.forEach(([label, n, t]) => {
      const c = el('div', 'stat glass glass-flat'); c.setAttribute('aria-label', label + ': ' + nf.format(n) + ' of ' + nf.format(t));
      const v = el('div', 'v', nf.format(n)); v.append(el('span', 'of', ' / ' + nf.format(t)));
      const bar = el('div', 'bar'), fill = el('i'); fill.style.transform = 'scaleX(' + (t ? n / t : 0) + ')'; bar.append(fill);
      c.append(el('div', 'k', label), v, bar); statsBox.append(c);
      if (!reduce.matches) fill.animate([{ transform: 'scaleX(0)' }, { transform: fill.style.transform }], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }

  function render(i) {
    const s = i === null ? null : snaps[i];
    const valid = (a) => a && a.name && Number.isFinite(a.listeners);
    const arts = s ? (s.artists || []).filter(valid).sort((a, b) => b.listeners - a.listeners || String(a.name).localeCompare(String(b.name), 'en')) : [];
    // "few" readings: the source shows only "few listeners", no number
    const few = new Set(s ? (s.artists || []).filter((a) => a && a.few).map((a) => norm(a.name)) : []);
    // roster artists without a number follow the ranked ones: "Few" first, then "No data" (latest snapshot only)
    const have = new Set(arts.map((a) => norm(a.name)));
    const rest = (i === 0 || !s) ? rosterOf(cur).filter((n) => !have.has(norm(n))).sort((a, b) => (few.has(norm(b)) - few.has(norm(a))) || a.localeCompare(b, 'en')) : [];
    const uv = (i === 0 || !s) ? unverifiedOf(cur) : [];
    const total = arts.length + rest.length;
    // all artists on the page: verified plus unverified (owner request, v0.70.0)
    const all = total + uv.length;
    const parts = [s ? fmt(s.capturedAt) : 'Pandora'];
    if (all) parts.push(nf.format(all) + (all === 1 ? ' artist' : ' artists'));
    if (!s) parts.push('No data yet');
    if (s && s.note && !s.sample) parts.push(s.note);
    meta.textContent = parts.join(' \u00b7 ');
    // coverage cards (owner request, v0.70.0): "Has data" counts a number or "Few" (both mean the source has a reading), verified is out of all artists
    const hasData = arts.length + rest.filter((n) => few.has(norm(n))).length + uv.filter((u) => u.listeners !== null || u.few).length;
    drawStats((i === 0 || !s) ? [['Has data', hasData, all], ['Verified', total, all]] : []);
    // One common table (owner decision, v0.60.0): unverified artists with a number sit among the verified ones by listeners and get a place too,
    // each with the red note. Unverified artists without a number follow the "Few" and "No data" rows. The data stays in two files, this only merges the display.
    const uvRow = (u) => ({ name: u.name, unverified: true, src: u.src, listeners: u.listeners === null ? undefined : u.listeners, few: u.few });
    const ranked = arts.concat(uv.filter((u) => u.listeners !== null).map(uvRow))
      .sort((a, b) => b.listeners - a.listeners || String(a.name).localeCompare(String(b.name), 'en'));
    const flat = rest.map((n) => ({ name: n, few: few.has(norm(n)) })).concat(uv.filter((u) => u.listeners === null).map(uvRow))
      .sort((a, b) => (!!b.few - !!a.few) || a.name.localeCompare(b.name, 'en'));
    // the rank always comes from the full list, so it stays correct while searching
    // "Few" artists have a reading too (owner decision, v0.71.0), so they get a place after the numbered ones, in the order they are listed; "No data" rows keep "-"
    let place = ranked.length;
    state.rows = ranked.map((a, n) => ({ a, rank: n + 1, key: norm(a.name) }))
      .concat(flat.map((a) => ({ a, rank: a.few ? ++place : null, key: norm(a.name) })));
    state.page = 1;
    draw();
  }

  function pageList(cur, total) {
    const set = new Set([1, total, cur - 1, cur, cur + 1]);
    const nums = [...set].filter((n) => n >= 1 && n <= total).sort((x, y) => x - y);
    const out = [];
    nums.forEach((n, k) => { if (k && n - nums[k - 1] > 1) out.push('gap'); out.push(n); });
    return out;
  }

  function drawPager(pages) {
    pager.replaceChildren();
    pager.hidden = pages <= 1;
    if (pages <= 1) return;
    const btn = (label, page, extra) => {
      const b = el('button', '', label); b.type = 'button';
      if (extra && extra.aria) b.setAttribute('aria-label', extra.aria);
      if (extra && extra.current) b.setAttribute('aria-current', 'page');
      if (extra && extra.disabled) b.disabled = true;
      b.addEventListener('click', () => { state.page = page; draw(true); });
      return b;
    };
    pager.append(btn('Prev', state.page - 1, { aria: 'Previous page', disabled: state.page === 1 }));
    pageList(state.page, pages).forEach((n) => {
      if (n === 'gap') pager.append(el('em', 'gap', '\u2026'));
      else pager.append(btn(String(n), n, { aria: 'Page ' + n, current: n === state.page }));
    });
    pager.append(btn('Next', state.page + 1, { aria: 'Next page', disabled: state.page === pages }));
  }

  function draw(scroll) {
    const key = norm(state.q);
    const rows = key ? state.rows.filter((r) => r.key.includes(key)) : state.rows;
    const size = state.size || rows.length || 1;
    const pages = Math.max(1, Math.ceil(rows.length / size));
    state.page = Math.min(Math.max(state.page, 1), pages);
    const from = (state.page - 1) * size;
    const slice = rows.slice(from, from + size);
    list.replaceChildren();
    if (!slice.length) {
      const tr = el('tr'), td = el('td', 'none', 'No artists match your search.');
      td.colSpan = 3; tr.append(td); list.append(tr);
    }
    // Performance (owner request, v0.93.0): "All" made the iPhone freeze (thousands of rows, each with two glass buttons). Rows are now built in small chunks, the next chunk
    // only when the end of the table comes near the screen (IntersectionObserver), and a long list drops the blur behind the small link buttons (class big, see styles.css).
    if (moreIO) { moreIO.disconnect(); moreIO = null; }
    sentinel.remove();
    if (tbl) tbl.classList.toggle('big', slice.length > 60);
    const makeRow = (r, n) => {
      const a = r.a, rank = r.rank;
      const tr = el('tr');
      const lk = linkMap[norm(a.name)] || {};
      const url = (a.profileUrl && safeUrl(a.profileUrl)) || pandoraLink(lk.p);
      let name;
      const pg = pageOf(a.name);
      if (pg) { name = el('a', 'nm', a.name); name.href = pg; } else if (url) { name = el('a', 'nm', a.name); name.href = url; name.rel = 'noopener'; } else { name = el('span', 'nm', a.name); } name.title = a.name;
      // the whole row opens the artist page (owner request, v0.82.2); the name stays the real link for keyboards and screen readers, links, buttons and selected text keep their own behavior
      if (pg) {
        tr.classList.add('go');
        tr.addEventListener('click', (e) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.target.closest('a,button')) return;
          const sel = window.getSelection && window.getSelection();
          if (sel && String(sel).trim()) return;
          window.location.href = pg;
        });
      }
      const info = el('div', 'info'); info.append(name);
      const sp = spotifyLink(lk.s);
      // link buttons (owner request, v0.66.0): Spotify and Pandora as small glass pills under the name, each only when its link exists
      const lks = el('div', 'lks');
      if (sp) lks.append(linkBtn('Spotify', sp, 'Open ' + a.name + ' on Spotify', spotifyUri(lk.s)));
      if (url) lks.append(linkBtn('Pandora', url, 'Open ' + a.name + ' on Pandora'));
      if (lks.children.length) info.append(lks);
      const wh = el('div', 'wh'); wh.append(avatar(a), info);
      if (a.unverified) {
        const full = 'Genre not verified' + (a.src ? ' (listed as ' + a.src + ')' : '') + ', may be here by mistake';
        const fl = el('span', 'flag'); fl.title = full; wh.classList.add('hasfl');
        fl.append(el('span', 'fl', full), el('span', 'fs', 'Not verified'));
        wh.append(fl);
      }
      const who = el('td', 'who'); who.append(wh);
      const rk = el('td', 'rk');
      if (rank === null) { rk.textContent = '-'; } else if (rank <= 3) { const m = el('span', 'mdl ' + ['gold', 'silver', 'bronze'][rank - 1], String(rank)); m.setAttribute('aria-label', 'Place ' + rank); rk.append(m); } else { rk.textContent = String(rank); }
      tr.append(rk, who, Number.isFinite(a.listeners) ? el('td', 'st', nf.format(a.listeners)) : el('td', 'st nodata', a.few ? 'Few' : 'No data'));
      return tr;
    };
    const CHUNK = 40;
    let shown = 0;
    const addChunk = () => {
      const end = Math.min(slice.length, shown + CHUNK), frag = document.createDocumentFragment(), start = shown;
      for (; shown < end; shown++) frag.append(makeRow(slice[shown], shown));
      list.append(frag);
      if (start === 0 && !reduce.matches && !window.LTMotion) Array.from(list.children).slice(0, 15).forEach((tr, n) => tr.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: n * 20, easing: 'ease-out', fill: 'backwards' }));
    };
    if (!window.IntersectionObserver) { shown = 0; while (shown < slice.length) addChunk(); }
    else {
      addChunk();
      if (shown < slice.length) {
        tbl.after(sentinel);
        moreIO = new IntersectionObserver((es) => {
          if (!es.some((e) => e.isIntersecting)) return;
          addChunk();
          if (shown >= slice.length) { moreIO.disconnect(); moreIO = null; sentinel.remove(); } else { moreIO.unobserve(sentinel); moreIO.observe(sentinel); }
        }, { rootMargin: '1500px 0px' });
        moreIO.observe(sentinel);
      }
    }
    count.textContent = rows.length ? 'Showing ' + (from + 1) + ' to ' + (from + slice.length) + ' of ' + rows.length : '';
    drawPager(pages);
    if (scroll && tbl && tbl.getBoundingClientRect().top < 0) tbl.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
  }

  if (q) q.addEventListener('input', () => { state.q = q.value; state.page = 1; draw(); });
  if (sizes) sizes.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.size = Number(b.dataset.size) || 0; state.page = 1;
    sizes.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  }));

  function select(i) {
    picker.querySelectorAll('button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    render(i);
  }

  const devwarn = $('#devwarn'), devwarnTitle = $('#devwarn-title'), devwarnText = $('#devwarn-text'), caption = document.querySelector('#tbl caption'), gbox = $('#genres'), h1 = $('h1'), more = $('#more'), emptyTitle = $('#empty h3');
  const homeId = genres[0].id;
  // The chip above the title shows only a warning (no snapshot yet, sample data). The normal "Latest Pandora snapshot" label was removed by the owner (v0.86.0), so an empty text hides the chip.
  const setStatus = (t) => { if (status) { status.textContent = t; status.hidden = !t; } };
  const fromHash = () => genres.find((g) => g.id === decodeURIComponent(location.hash.slice(1))) || genres[0];

  function setGenre(g) {
    cur = g;
    snaps = allSnaps.filter((s) => (s.genre || homeId) === g.id);
    if (gbox) gbox.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === g.id)));
    if (h1) {
      // bold "Top <genre> Artists", then "on Pandora" in the Regular cut (weight contrast only, same color)
      h1.replaceChildren('Top ' + g.name + ' Artists ', el('span', 'lt', 'on Pandora'));
    }
    document.title = 'Ledgertone | Top ' + g.name + ' Artists on Pandora';
    state.q = ''; state.page = 1; if (q) q.value = '';
    picker.querySelectorAll('button').forEach((b) => b.remove());
    const has = snaps.length > 0 || rosterOf(g).length > 0 || unverifiedOf(g).length > 0;
    [[empty, !has], [tbl, has], [meta, has], [tools, has], [foot, has]].forEach(([n, show]) => { if (n) n.hidden = !show; });
    if (tbl) tbl.classList.toggle('pending', !!g.pending);
    // Large warning for a genre the owner unlocked while it is still raw (genre.devwarn, v0.84.0)
    if (devwarn) { const w = g.devwarn; devwarn.hidden = !(w && w.text); if (w && w.text) { devwarnTitle.textContent = w.title || 'Under development'; devwarnText.textContent = w.text; } }
    if (more) more.hidden = snaps.length < 2;
    picker.hidden = snaps.length < 2;
    if (!has) {
      list.replaceChildren(); count.textContent = ''; pager.hidden = true;
      setStatus('No snapshot published yet');
      if (emptyTitle) emptyTitle.textContent = 'The first ' + g.name + ' snapshot is not published yet';
      return;
    }
    if (!snaps.length) {
      setStatus('No snapshot published yet');
      if (caption) caption.textContent = g.name + ' artists on Pandora';
      render(null);
      return;
    }
    if (caption) caption.textContent = g.name + ' artists on Pandora, ordered by 28-day listeners';
    setStatus(snaps[0].sample ? 'Sample data, not real' : '');
    snaps.forEach((s, i) => { const b = el('button', '', fmt(s.capturedAt)); b.type = 'button'; b.addEventListener('click', () => select(i)); picker.append(b); });
    select(0);
  }

  if (gbox && genres.length > 1) {
    genres.forEach((g) => {
      const b = el('button', '', g.name); b.type = 'button'; b.dataset.id = g.id; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        history.replaceState(null, '', g.id === homeId ? location.pathname + location.search : '#' + g.id);
        setGenre(g);
      });
      gbox.append(b);
    });
    gbox.hidden = false;
    addEventListener('hashchange', () => setGenre(fromHash()));
  }
  setGenre(fromHash());

  ['pointermove', 'pointerdown'].forEach((t) => addEventListener(t, (e) => {
    const g = e.target.closest && e.target.closest('.glass');
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', e.clientX - r.left + 'px');
    g.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true }));
})();
