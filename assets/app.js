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

  function render(i) {
    const s = snaps[i];
    const valid = (a) => a && a.name && Number.isFinite(a.streams);
    const arts = (s.artists || []).filter(valid).sort((a, b) => b.streams - a.streams);
    meta.textContent = 'Pandora snapshot \u00b7 ' + fmt(s.capturedAt) + ' \u00b7 ' + arts.length + (arts.length === 1 ? ' artist' : ' artists') + (s.note && !s.sample ? ' \u00b7 ' + s.note : '');
    list.replaceChildren();
    arts.forEach((a, n) => {
      const tr = el('tr');
      const url = a.profileUrl && safeUrl(a.profileUrl);
      let name;
      if (url) { name = el('a', 'nm', a.name); name.href = url; name.rel = 'noopener'; } else { name = el('span', 'nm', a.name); }
      const info = el('div', 'info'); info.append(name);
      const wh = el('div', 'wh'); wh.append(avatar(a), info);
      const who = el('td', 'who'); who.append(wh);
      const rk = el('td', 'rk');
      if (n < 3) { const m = el('span', 'mdl ' + ['gold', 'silver', 'bronze'][n], String(n + 1)); m.setAttribute('aria-label', 'Place ' + (n + 1)); rk.append(m); } else { rk.textContent = String(n + 1); }
      tr.append(rk, who, el('td', 'st', nf.format(a.streams)));
      list.append(tr);
      if (!reduce.matches) tr.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: Math.min(n, 14) * 20, easing: 'ease-out', fill: 'backwards' });
    });
  }

  function select(i) {
    picker.querySelectorAll('button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    render(i);
  }

  if (!snaps.length) {
    if (empty) empty.hidden = false;
    if (tbl) tbl.hidden = true;
    if (meta) meta.hidden = true;
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
