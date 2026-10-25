/*
  Ledgertone motion (owner request, v0.73.0). Fluid, physical, interruptible motion for the whole site, following the
  Apple Design skill (WWDC "Designing Fluid Interfaces"):
  - Response: every press answers on pointer down, not on release.
  - Springs, not timed tweens: critically damped (damping 1.0) everywhere; the only bounce (damping 0.8) is a dragged
    picture let go with speed. A spring keeps its position and velocity, so any motion can be grabbed or reversed at any
    instant and starts from the value that is on screen.
  - Direct manipulation: a picture follows the finger or mouse 1:1, resists softly at the edge (rubber band) and on release
    inherits the release velocity.
  - Hover is for mouse and pen only (fine pointer); touch gets press feedback. Pressing and dragging away cancels the press,
    coming back resumes it.
  - Only transform and opacity are animated (project rule). No library, no request, nothing stored.
  - prefers-reduced-motion: no scale, slide or spring; feedback becomes a short opacity change, entrances become fades.
  Loaded before assets/app.js on the home page so the table rows can enter with it. Public API: window.LTMotion.
*/
(function () {
  "use strict";
  if (!window.requestAnimationFrame || !window.Map || !document.documentElement.closest) return;

  var root = document.documentElement;
  var rm = matchMedia("(prefers-reduced-motion: reduce)");
  var fine = matchMedia("(hover: hover) and (pointer: fine)");
  root.classList.add("mo");

  /* ---------- spring engine ---------- */
  var KEYS = ["x", "y", "s", "sx", "r", "o"]; // translate x and y (px), uniform scale, extra horizontal scale, rotate (deg), opacity
  var IDENT = { x: 0, y: 0, s: 1, sx: 1, r: 0, o: 1 };
  var EPS = { x: 0.04, y: 0.04, s: 0.0004, sx: 0.0004, r: 0.04, o: 0.002 };
  var states = new Map(), raf = 0, last = 0;
  var clamp = function (lo, hi, v) { return Math.min(hi, Math.max(lo, v)); };
  var allowed = function (k, snap) { return !rm.matches || k === "o" || snap; };

  function get(el) {
    var s = states.get(el);
    if (!s) {
      s = { el: el, p: {}, v: {}, t: {}, w: {}, z: {}, wait: 0, done: [], hasO: false, orig: false, dirty: false };
      KEYS.forEach(function (k) { s.p[k] = IDENT[k]; s.v[k] = 0; s.t[k] = IDENT[k]; s.w[k] = 17; s.z[k] = 1; });
      states.set(el, s);
      el.style.willChange = "transform";
    }
    return s;
  }

  function paint(s) {
    var p = s.p, st = s.el.style;
    var id = p.x === 0 && p.y === 0 && p.s === 1 && p.sx === 1 && p.r === 0;
    st.transform = id ? "" : "translate(" + p.x.toFixed(2) + "px," + p.y.toFixed(2) + "px) rotate(" + p.r.toFixed(2) + "deg) scale(" + (p.s * p.sx).toFixed(4) + "," + p.s.toFixed(4) + ")";
    if (s.hasO) st.opacity = (p.o >= 0.999 && s.t.o === 1) ? "" : String(Math.max(0, Math.min(1, p.o)).toFixed(3));
    s.dirty = false;
  }

  function settle(s) {
    var d = s.done; s.done = [];
    d.forEach(function (f) { f(s.el); });
    if (states.get(s.el) !== s) return;
    for (var i = 0; i < KEYS.length; i++) if (s.t[KEYS[i]] !== IDENT[KEYS[i]]) return;
    states.delete(s.el);
    var st = s.el.style;
    st.transform = ""; st.willChange = "";
    if (s.hasO) st.opacity = "";
    if (s.orig) st.transformOrigin = "";
  }

  function frame(ts) {
    raf = 0;
    var dt = (ts - last) / 1000; last = ts;
    if (!(dt > 0)) dt = 1 / 60;
    dt = Math.min(dt, 0.05);
    var any = false;
    states.forEach(function (s) {
      if (s.wait && ts < s.wait) { any = true; return; }
      s.wait = 0;
      var moving = false;
      for (var i = 0; i < KEYS.length; i++) {
        var k = KEYS[i];
        if (Math.abs(s.p[k] - s.t[k]) <= EPS[k] && Math.abs(s.v[k]) <= EPS[k] * 8) { s.p[k] = s.t[k]; s.v[k] = 0; continue; }
        var w = s.w[k], z = s.z[k], n = Math.ceil(dt / 0.004), h = dt / n;
        for (var j = 0; j < n; j++) { // semi-implicit Euler: stable for these stiffness values
          s.v[k] += (-w * w * (s.p[k] - s.t[k]) - 2 * z * w * s.v[k]) * h;
          s.p[k] += s.v[k] * h;
        }
        moving = true;
      }
      if (moving || s.dirty) paint(s);
      if (moving) any = true; else settle(s);
    });
    if (any) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  // Aim channels at new targets. Position and velocity are kept (interruptible). o.t = response in seconds, o.z = damping ratio.
  function to(el, t, o) {
    o = o || {};
    var s = get(el), w = 2 * Math.PI / (o.t || 0.38), z = o.z == null ? 1 : o.z;
    KEYS.forEach(function (k) {
      if (t[k] === undefined) return;
      s.t[k] = t[k]; s.w[k] = w; s.z[k] = z;
      if (k === "o") s.hasO = true;
      if (!allowed(k, o.snap)) { s.t[k] = IDENT[k]; return; }
      if (rm.matches && k !== "o") { s.p[k] = t[k]; s.v[k] = 0; }
      if (o.v && o.v[k] != null) s.v[k] = o.v[k];
    });
    if (o.origin !== undefined) { el.style.transformOrigin = o.origin; s.orig = true; }
    if (o.done) s.done.push(o.done);
    if (o.delay) s.wait = performance.now() + o.delay;
    s.dirty = true;
    kick();
  }
  // Put channels exactly at values (1:1 tracking, starting states). Targets follow, so nothing springs.
  function set(el, p) {
    var s = get(el);
    KEYS.forEach(function (k) {
      if (p[k] === undefined || !allowed(k, p.snap)) return;
      s.p[k] = p[k]; s.t[k] = p[k]; s.v[k] = 0;
      if (k === "o") s.hasO = true;
    });
    paint(s);
  }
  // Move the displayed value and velocity without touching the target (start of a spring from somewhere else).
  function jump(el, p, v) {
    var s = get(el);
    KEYS.forEach(function (k) {
      if (p[k] === undefined || !allowed(k)) return;
      s.p[k] = p[k]; s.v[k] = (v && v[k] != null) ? v[k] : 0;
    });
    paint(s);
  }
  function forget(el) { var s = states.get(el); if (s) { states.delete(el); el.style.willChange = ""; } }
  function enter(el, i, from) {
    from = from || {};
    var o = rm.matches ? { o: 0 } : { y: from.y == null ? 12 : from.y, s: from.s == null ? 1 : from.s, o: 0 };
    set(el, o);
    to(el, { x: 0, y: 0, s: 1, o: 1 }, { t: 0.5, delay: Math.min(i || 0, 14) * 24 });
  }

  /* ---------- pointer feedback ---------- */
  var PRESS = ".link,.btn,.text,.theme,.picker button,.cbtn,.linkbtn,.brand,.tbl .lk,.flinks a,.consent a";
  var NAME = ".tbl .nm";
  var PUCK = ".av,.mono,.mdl";
  var CARD = ".stat,.status,.empty";
  var TXT = "h1,h2,h3,.lede,.sub,.meta,.note,.count,.ver,footer p,.doc p,.doc li,.tbl th,.tbl td.rk,.tbl td.st,.plogo,.mh,.hero p";

  function pick(t) {
    var el;
    if ((el = t.closest(PRESS)) && !el.disabled) return { el: el, kind: "btn" };
    if ((el = t.closest(NAME))) return { el: el, kind: "name" };
    if ((el = t.closest(PUCK))) return { el: el, kind: "puck" };
    if ((el = t.closest(CARD))) return { el: el, kind: "card" };
    if ((el = t.closest(TXT))) return { el: el, kind: "text" };
    return null;
  }
  function depth(kind, el, r) {
    var w = Math.max(r.width, r.height, 1);
    if (kind === "btn") return clamp(0.02, 0.045, 5 / w);
    if (kind === "name") return 0.03;
    if (kind === "puck") return el.matches(".mdl") ? 0.14 : 0.1;
    if (kind === "card") return clamp(0.012, 0.03, 8 / w);
    return clamp(0.01, 0.03, 4 / w);
  }
  function hoverTarget(h) {
    switch (h.kind) {
      case "btn": return { s: 1 + h.d * 0.5, x: h.mx || 0, y: h.my || 0 };
      case "name": return { x: 2.5 };
      case "puck": return { s: 1.07 };
      case "card": return { y: -2 };
    }
    return {};
  }
  var REST = { x: 0, y: 0, s: 1, r: 0 };

  var act = new Map(); // pointerId -> press record
  var hv = null;       // hovered element record (mouse and pen)
  var lens = null, rowH = null, px = -1, py = -1;

  function feelDown(a, e) {
    var r = a.el.getBoundingClientRect();
    a.d = depth(a.kind, a.el, r);
    if (rm.matches) { to(a.el, { o: 0.72 }, { t: 0.1 }); return; }
    var tgt = { s: 1 - a.d }, opt = { t: 0.22 };
    if (a.kind === "text" || a.kind === "card") opt.origin = (e.clientX - r.left) + "px " + (e.clientY - r.top) + "px";
    if (a.kind === "name") { opt.origin = "0 50%"; tgt.x = 1; }
    if (a.kind === "puck" && a.el.matches(".mdl")) tgt.r = -12;
    to(a.el, tgt, opt);
  }
  function feelUp(a) {
    if (rm.matches) { to(a.el, { o: 1 }, { t: 0.18 }); return; }
    to(a.el, (hv && hv.el === a.el) ? hoverTarget(hv) : REST, { t: 0.4 });
  }

  function onDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    var t = e.target; if (!t || !t.closest) return;
    var p = pick(t);
    var row = t.closest("#list tr");
    if (row && row.querySelector("td.none")) row = null;
    if (!p && !row) return;
    var a = { id: e.pointerId, x0: e.clientX, y0: e.clientY, touch: e.pointerType !== "mouse", on: false, drag: false, hist: [] };
    if (p) { a.el = p.el; a.kind = p.kind; a.on = true; a.canDrag = p.kind === "puck" && p.el.matches(".av"); feelDown(a, e); }
    if (row) rowDown(a, e, row, !p);
    act.set(e.pointerId, a);
  }

  function resist(d) { // 1:1 near the origin, then a rubber band that soon stops following the pointer
    var a = Math.abs(d), L = 18;
    if (a <= L) return d;
    var o = a - L;
    return (d < 0 ? -1 : 1) * (L + (o * 110 * 0.55) / (110 + 0.55 * o));
  }
  function dragStart(a, e) {
    a.drag = true; a.sx = e.clientX; a.sy = e.clientY; a.hist = [];
    try { a.el.setPointerCapture(a.id); } catch (x) {}
    a.el.classList.add("drag");
    if (!rm.matches) to(a.el, { s: 1.1 }, { t: 0.2 });
  }
  function dragMove(a, e) {
    var dx = resist(e.clientX - a.sx), dy = resist(e.clientY - a.sy);
    a.hist.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    while (a.hist.length > 2 && e.timeStamp - a.hist[0].t > 100) a.hist.shift();
    if (rm.matches) return;
    set(a.el, { x: dx, y: dy, r: clamp(-14, 14, dx * 0.14), s: 1.1 });
  }
  function dragEnd(a) {
    var h = a.hist, v = { x: 0, y: 0 };
    if (h.length > 1) {
      var dt = (h[h.length - 1].t - h[0].t) / 1000;
      if (dt > 0.008) { v.x = clamp(-3000, 3000, (h[h.length - 1].x - h[0].x) / dt) * 0.55; v.y = clamp(-3000, 3000, (h[h.length - 1].y - h[0].y) / dt) * 0.55; }
    }
    var el = a.el;
    // the finger carried momentum: this is the one place with bounce (damping 0.8), and the release velocity is handed to the spring
    to(el, { x: 0, y: 0, r: 0, s: (hv && hv.el === el) ? 1.07 : 1 }, { z: 0.8, t: 0.42, v: { x: v.x, y: v.y, r: v.x * 0.05 }, done: function () { el.classList.remove("drag"); } });
  }

  function onMove(e) {
    px = e.clientX; py = e.clientY;
    var a = act.get(e.pointerId);
    if (a) {
      if (a.canDrag && !a.drag && Math.hypot(e.clientX - a.x0, e.clientY - a.y0) > 8) dragStart(a, e);
      if (a.drag) { dragMove(a, e); return; }
      if (a.el) { // press, drag away and the press cancels; come back and it resumes (10 px of hysteresis)
        var r = a.el.getBoundingClientRect();
        var inside = e.clientX >= r.left - 10 && e.clientX <= r.right + 10 && e.clientY >= r.top - 10 && e.clientY <= r.bottom + 10;
        if (a.on && !inside) { a.on = false; feelUp(a); } else if (!a.on && inside) { a.on = true; feelDown(a, e); }
      }
      return;
    }
    if (e.pointerType === "touch" || !fine.matches) return;
    hoverAt(e.clientX, e.clientY, e.target);
  }

  function hoverAt(x, y, t) {
    if (!t || !t.closest) return;
    var p = pick(t);
    if (p && p.kind === "text") p = null;
    if ((p && p.el) !== (hv && hv.el)) {
      if (hv) to(hv.el, REST, { t: 0.4 });
      hv = p ? { el: p.el, kind: p.kind, d: depth(p.kind, p.el, p.el.getBoundingClientRect()), mx: 0, my: 0 } : null;
      if (hv) to(hv.el, hoverTarget(hv), { t: 0.3, origin: hv.kind === "name" ? "0 50%" : undefined });
    }
    if (hv && hv.kind === "btn" && !rm.matches) { // the control leans a little toward the pointer
      var s = states.get(hv.el), r = hv.el.getBoundingClientRect();
      var cx = r.left + r.width / 2 - (s ? s.p.x : 0), cy = r.top + r.height / 2 - (s ? s.p.y : 0);
      hv.mx = clamp(-2.5, 2.5, (x - cx) * 0.12); hv.my = clamp(-2.5, 2.5, (y - cy) * 0.12);
      to(hv.el, hoverTarget(hv), { t: 0.3 });
    }
    var row = t.closest("#list tr");
    if (row && row.querySelector("td.none")) row = null;
    if (row !== rowH) { rowH = row; if (row) moveLens(row, false); else lensTo(0, 0.4); }
  }
  function clearHover() {
    if (hv) { to(hv.el, REST, { t: 0.4 }); hv = null; }
    if (rowH) { rowH = null; lensTo(0, 0.4); }
  }

  function onUp(e) {
    var a = act.get(e.pointerId);
    if (!a) return;
    act.delete(e.pointerId);
    if (a.drag) dragEnd(a);
    else if (a.el && a.on) feelUp(a);
    if (a.wh) to(a.wh, { s: 1, o: 1 }, { t: 0.4 });
    if (a.row) lensTo(a.touch ? 0 : 0.7, a.touch ? 0.6 : 0.3);
  }
  function releaseAll() { act.forEach(function (a, id) { onUp({ pointerId: id }); }); }

  /* ---------- table row lens and tap ripple ---------- */
  function ensureLens(tbl) {
    var l = tbl.querySelector(":scope > .rl");
    if (!l) {
      l = document.createElement("div"); l.className = "rl"; l.setAttribute("aria-hidden", "true");
      tbl.insertBefore(l, tbl.firstChild); set(l, { o: 0 });
    }
    lens = l;
    return l;
  }
  function moveLens(row, instant) {
    var tbl = row.closest(".tbl"); if (!tbl) return;
    var l = ensureLens(tbl), rr = row.getBoundingClientRect(), tr = tbl.getBoundingClientRect();
    var y = rr.top - tr.top - tbl.clientTop, s = states.get(l);
    l.style.height = rr.height + "px";
    var shown = s && s.t.o > 0.02;
    if (instant || !shown) set(l, { y: y, o: 0, snap: true });
    to(l, { y: y, o: 0.7 }, { t: 0.3, snap: rm.matches });
  }
  function lensTo(o, t) { if (lens) to(lens, { o: o }, { t: t }); }
  function rowDown(a, e, row, blank) {
    a.row = row;
    if (a.touch || !rowH) { moveLens(row, true); rowH = a.touch ? null : row; }
    lensTo(1, 0.12);
    var l = lens, rr = row.getBoundingClientRect(), tr = l.parentNode.getBoundingClientRect();
    if (!rm.matches && !(a.kind === "btn")) { // ripple from the touch point, inside the row only
      var i = document.createElement("i");
      i.style.left = (e.clientX - tr.left - l.parentNode.clientLeft) + "px"; i.style.top = (e.clientY - rr.top) + "px";
      l.appendChild(i);
      set(i, { s: 0.2, o: 0.85 });
      to(i, { s: 1.5 }, { t: 0.55 });
      to(i, { o: 0 }, { t: 0.7, done: function (n) { forget(n); n.remove(); } });
    }
    if (blank && !rm.matches) {
      var wh = row.querySelector(".wh");
      if (wh) { a.wh = wh; var r = wh.getBoundingClientRect(); to(wh, { s: 0.985 }, { t: 0.22, origin: (e.clientX - r.left) + "px " + (e.clientY - r.top) + "px" }); }
    }
  }

  /* ---------- keyboard: Enter and Space press like a pointer ---------- */
  var kact = null;
  function onKeyDown(e) {
    if (e.repeat || (e.key !== "Enter" && e.key !== " ")) return;
    var p = e.target.closest && pick(e.target);
    if (!p || p.kind !== "btn") return;
    kact = { el: p.el, kind: "btn", on: true }; feelDown(kact, { clientX: 0, clientY: 0 });
  }
  function onKeyUp() { if (kact) { feelUp(kact); kact = null; } }

  /* ---------- clicks: the control acknowledges what it opened ---------- */
  function onClick(e) {
    var t = e.target; if (!t.closest) return;
    var lk = t.closest(".tbl .lk");
    if (lk && !rm.matches) { // the arrow shoots out and settles back
      var ar = lk.querySelector("svg");
      if (ar) { to(ar, { x: 3, y: -3 }, { t: 0.14 }); setTimeout(function () { to(ar, { x: 0, y: 0 }, { t: 0.4 }); }, 130); }
    }
    var th = t.closest("#theme-toggle");
    if (th) { var ic = th.querySelector("svg"); if (ic && !rm.matches) { set(ic, { r: -90, s: 0.6, o: 0 }); to(ic, { r: 0, s: 1, o: 1 }, { t: 0.5 }); } }
  }
  // the cookie banner leaves along the way it came in: a copy flies out because the original is removed on click
  function onClickCapture(e) {
    var b = e.target.closest && e.target.closest(".consent .cbtn");
    if (!b || rm.matches) return;
    var bar = b.closest(".consent"), g = bar.cloneNode(true);
    g.removeAttribute("role"); g.setAttribute("aria-hidden", "true"); g.style.pointerEvents = "none";
    g.querySelectorAll("button,a").forEach(function (n) { n.tabIndex = -1; });
    document.body.appendChild(g);
    set(g, { y: 0 });
    to(g, { y: 28, s: 0.94, o: 0 }, { t: 0.4, origin: "50% 100%", done: function (n) { forget(n); n.remove(); } });
  }

  /* ---------- search field breathes on focus ---------- */
  document.addEventListener("focusin", function (e) { var s = e.target.closest && e.target.closest(".search"); if (s && !rm.matches) to(s, { s: 1.02 }, { t: 0.35, origin: "0 50%" }); });
  document.addEventListener("focusout", function (e) { var s = e.target.closest && e.target.closest(".search"); if (s) to(s, { s: 1 }, { t: 0.4 }); });

  /* ---------- segmented controls: one indicator glides to the chosen button ---------- */
  function segInit(p) {
    var ind = document.createElement("i");
    ind.className = "sg"; ind.setAttribute("aria-hidden", "true");
    var S = { ind: ind, left: 0, top: 0, w: 0, h: 0, shown: false, queued: false };
    p.classList.add("sgd");
    function sync() {
      S.queued = false;
      var b = p.querySelector('button[aria-pressed="true"],button[aria-current="page"]');
      if (!b || !p.offsetWidth || !b.offsetWidth) { ind.style.display = "none"; S.shown = false; return; }
      if (ind.parentNode !== p) p.insertBefore(ind, p.firstChild);
      var x = b.offsetLeft, y = b.offsetTop, w = b.offsetWidth, h = b.offsetHeight;
      var cur = S.shown ? states.get(ind) : null;
      var moved = S.shown && (x !== S.left || w !== S.w || y !== S.top);
      var fromX = 0, fromS = 1, vx = 0, vs = 0;
      if (cur) { fromX = S.left + cur.p.x - x; fromS = S.w * cur.p.sx / w; vx = cur.v.x; vs = cur.v.sx * S.w / w; }
      ind.style.cssText = "display:block;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px";
      S.left = x; S.top = y; S.w = w; S.h = h;
      if (moved || (cur && (cur.p.x !== 0 || cur.p.sx !== 1))) {
        jump(ind, { x: fromX, sx: fromS }, { x: vx, sx: vs });
        to(ind, { x: 0, sx: 1 }, { t: 0.4, origin: "0 50%", snap: rm.matches });
      }
      S.shown = true;
    }
    var queue = function () { if (!S.queued) { S.queued = true; requestAnimationFrame(sync); } };
    new MutationObserver(queue).observe(p, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-pressed", "aria-current", "hidden"] });
    new MutationObserver(queue).observe(p.parentNode, { attributes: true, attributeFilter: ["hidden"] });
    addEventListener("resize", queue);
    queue();
  }

  /* ---------- entrances: page load, table rows, cards, cookie banner ---------- */
  function watchList() {
    var list = document.getElementById("list");
    if (list) new MutationObserver(function (ms) {
      var added = [];
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1 && n.tagName === "TR") added.push(n); }); });
      rowH = null; if (lens) set(lens, { o: 0 });
      added.forEach(function (tr, i) { if (i < 30) enter(tr, i, { y: 14 }); }); // rows below the first screen just appear
    }).observe(list, { childList: true });
    var stats = document.getElementById("stats");
    if (stats) new MutationObserver(function (ms) {
      var i = 0;
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) enter(n, i++, { y: 10, s: 0.95 }); }); });
    }).observe(stats, { childList: true });
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
        if (n.nodeType === 1 && n.classList.contains("consent") && !rm.matches) {
          set(n, { y: 28, s: 0.94, o: 0 });
          to(n, { y: 0, s: 1, o: 1 }, { t: 0.55, origin: "50% 100%" });
        }
      }); });
    }).observe(document.body, { childList: true });
  }

  function reveal() {
    var nodes = [].slice.call(document.querySelectorAll(".nav,main section > *,footer .wrap > *")).filter(function (n) { return !n.hidden && n.getClientRects().length; });
    var vh = window.innerHeight, n = 0, io = null, waiting = [];
    nodes.forEach(function (el) {
      var top = el.getBoundingClientRect().top, nav = el.classList.contains("nav");
      var from = nav ? { y: -10, s: 0.96 } : { y: 14 };
      if (top < vh) { enter(el, n++, from); return; }
      if (!("IntersectionObserver" in window)) return;
      if (!io) io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); enter(en.target, 0, { y: 14 }); } });
      }, { rootMargin: "0px 0px -6% 0px" });
      set(el, rm.matches ? { o: 0 } : { y: 14, o: 0 });
      io.observe(el); waiting.push(el);
    });
    // safety net: printing and tools that never scroll must still see everything
    var all = function () { waiting.forEach(function (el) { forget(el); el.style.transform = ""; el.style.opacity = ""; }); waiting = []; };
    addEventListener("beforeprint", all); setTimeout(function () { if (waiting.length && document.hidden) all(); }, 6000);
  }

  /* ---------- wire up ---------- */
  document.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerup", onUp, { passive: true });
  document.addEventListener("pointercancel", onUp, { passive: true });
  document.addEventListener("lostpointercapture", function (e) { if (act.has(e.pointerId) && !act.get(e.pointerId).drag) onUp(e); }, { passive: true });
  document.addEventListener("pointerout", function (e) { if (!e.relatedTarget && e.pointerType !== "touch") clearHover(); }, { passive: true });
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("click", onClick);
  document.addEventListener("click", onClickCapture, true);
  document.addEventListener("dragstart", function (e) { if (e.target.closest && e.target.closest(".av")) e.preventDefault(); });
  addEventListener("blur", releaseAll);
  var sc = 0;
  addEventListener("scroll", function () { // the row under a resting mouse changes while the page scrolls
    if (sc || px < 0 || !fine.matches || act.size) return;
    sc = requestAnimationFrame(function () { sc = 0; var t = document.elementFromPoint(px, py); if (t) hoverAt(px, py, t); });
  }, { passive: true });

  function init() {
    watchList();
    [].forEach.call(document.querySelectorAll(".picker"), segInit);
    try { reveal(); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.LTMotion = { to: to, set: set, enter: enter };
})();
