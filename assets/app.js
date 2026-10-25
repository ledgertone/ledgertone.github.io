(() => {
  const snaps = ((window.LEDGERTONE || {}).snapshots || []).slice().sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));
  const $ = (s) => document.querySelector(s);
  const list = $('#list'), tbl = $('#tbl'), empty = $('#empty'), picker = $('#picker'), status = $('#status'), meta = $('#meta');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const nf = new Intl.NumberFormat('en-US');
  const fmt = (d, style = 'long') => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { dateStyle: style, timeZone: 'UTC' });
  const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

  const safeImg = (u) => (typeof u === 'string' && /^assets\/artists\/[a-z0-9._-]+\.(png|jpe?g|webp|svg)$/i.test(u)) ? u : null;
  const initials = (n) => String(n).trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase();
  function avatar(a) {
    const mono = () => el('span', 'av mono', initials(a.name));
    const src = safeImg(a.image);
    if (!src) return mono();
    const img = el('img', 'av');
    img.src = src; img.alt = ''; img.width = 36; img.height = 36; img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('error', () => img.replaceWith(mono()), { once: true });
    return img;
  }

  const state = { rows: [], q: '', size: 10, page: 1 };
  const tools = $('#tools'), foot = $('#foot'), pager = $('#pager'), count = $('#count'), sizes = $('#sizes'), q = $('#q');
  const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  function render(i) {
    const s = snaps[i];
    const valid = (a) => a && a.name && Number.isFinite(a.streams);
    const arts = (s.artists || []).filter(valid).sort((a, b) => b.streams - a.streams);
    meta.textContent = 'Pandora snapshot \u00b7 ' + fmt(s.capturedAt) + ' \u00b7 ' + arts.length + (arts.length === 1 ? ' artist' : ' artists') + (s.note && !s.sample ? ' \u00b7 ' + s.note : '');
    // the rank always comes from the full snapshot, so it stays correct while searching
    state.rows = arts.map((a, n) => ({ a, rank: n + 1, key: norm(a.name) }));
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
    slice.forEach((r, n) => {
      const a = r.a, rank = r.rank;
      const tr = el('tr');
      const url = a.profileUrl && safeUrl(a.profileUrl);
      let name;
      if (url) { name = el('a', 'nm', a.name); name.href = url; name.rel = 'noopener'; } else { name = el('span', 'nm', a.name); }
      const info = el('div', 'info'); info.append(name);
      const wh = el('div', 'wh'); wh.append(avatar(a), info);
      const who = el('td', 'who'); who.append(wh);
      const rk = el('td', 'rk');
      if (rank <= 3) { const m = el('span', 'mdl ' + ['gold', 'silver', 'bronze'][rank - 1], String(rank)); m.setAttribute('aria-label', 'Place ' + rank); rk.append(m); } else { rk.textContent = String(rank); }
      tr.append(rk, who, el('td', 'st', nf.format(a.streams)));
      list.append(tr);
      if (!reduce.matches) tr.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: Math.min(n, 14) * 20, easing: 'ease-out', fill: 'backwards' });
    });
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

  if (!snaps.length) {
    if (empty) empty.hidden = false;
    if (tbl) tbl.hidden = true;
    if (meta) meta.hidden = true;
    if (tools) tools.hidden = true;
    if (foot) foot.hidden = true;
  } else {
    if (status) status.textContent = snaps[0].sample ? 'Sample data, not real' : 'Latest Pandora snapshot: ' + fmt(snaps[0].capturedAt);
    if (list && picker && meta) {
      snaps.forEach((s, i) => { const b = el('button', '', fmt(s.capturedAt, 'medium')); b.type = 'button'; b.addEventListener('click', () => select(i)); picker.append(b); });
      picker.hidden = snaps.length < 2; const more = $('#more'); if (more) more.hidden = snaps.length < 2;
      select(0);
    }
  }

  ['pointermove', 'pointerdown'].forEach((t) => addEventListener(t, (e) => {
    const g = e.target.closest && e.target.closest('.glass');
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', e.clientX - r.left + 'px');
    g.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true }));
})();
