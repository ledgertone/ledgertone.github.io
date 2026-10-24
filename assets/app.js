(() => {
  const snaps = ((window.LEDGERTONE || {}).snapshots || []).slice().sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));
  const $ = (s) => document.querySelector(s);
  const list = $('#list'), empty = $('#empty'), picker = $('#picker'), status = $('#status'), meta = $('#meta');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const nf = new Intl.NumberFormat('en-US');
  const fmt = (d, style = 'long') => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { dateStyle: style, timeZone: 'UTC' });
  const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; } };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

  function render(i) {
    const s = snaps[i], prev = snaps[i + 1];
    const valid = (a) => a && a.name && Number.isFinite(a.streams);
    const arts = (s.artists || []).filter(valid).sort((a, b) => b.streams - a.streams);
    const before = new Map(((prev && prev.artists) || []).filter(valid).map((a) => [String(a.name).toLowerCase(), a.streams]));
    const max = arts.length ? arts[0].streams || 1 : 1;
    meta.textContent = 'Snapshot of ' + fmt(s.capturedAt) + '. ' + arts.length + ' artists.' + (s.note ? ' ' + s.note : '');
    list.replaceChildren();
    arts.forEach((a, n) => {
      const li = el('li', 'row');
      const url = a.profileUrl && safeUrl(a.profileUrl);
      let name;
      if (url) { name = el('a', 'nm', a.name); name.href = url; name.rel = 'noopener'; } else { name = el('span', 'nm', a.name); }
      li.append(el('span', 'rk', String(n + 1)), name, el('span', 'st', nf.format(a.streams)));
      const track = el('div', 'tr'), fill = el('i');
      fill.style.setProperty('--w', Math.max(a.streams / max, 0.01));
      track.append(fill);
      li.append(track);
      if (prev) {
        const old = before.get(String(a.name).toLowerCase());
        const text = old === undefined ? 'New in this snapshot' : (a.streams >= old ? '+' : '-') + nf.format(Math.abs(a.streams - old)) + ' vs ' + fmt(prev.capturedAt, 'medium');
        li.append(el('span', 'dl', text));
      }
      list.append(li);
      if (!reduce.matches) li.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: Math.min(n, 14) * 28, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    });
  }

  function select(i) {
    picker.querySelectorAll('button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    render(i);
  }

  if (!snaps.length) {
    if (empty) empty.hidden = false;
    if (meta) meta.hidden = true;
  } else {
    if (status) status.textContent = 'Latest snapshot: ' + fmt(snaps[0].capturedAt);
    if (list && picker && meta) {
      snaps.forEach((s, i) => { const b = el('button', '', fmt(s.capturedAt, 'medium')); b.type = 'button'; b.addEventListener('click', () => select(i)); picker.append(b); });
      picker.hidden = snaps.length < 2;
      select(0);
    }
  }

  addEventListener('pointermove', (e) => {
    const g = e.target.closest && e.target.closest('.glass');
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', e.clientX - r.left + 'px');
    g.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });
})();
