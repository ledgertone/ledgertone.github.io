/*
  Ledgertone Liquid Glass: real refraction for .glass elements in Chromium browsers.
  Builds a displacement map per element (bent light along the rim) and applies it through an
  SVG filter used as backdrop-filter. Safari and Firefox cannot do this, they keep the CSS
  fallback in styles.css (blur, saturation, specular edges). Nothing here changes layout.
*/
(function () {
  "use strict";
  var uad = navigator.userAgentData;
  if (!uad || !uad.brands || !uad.brands.some(function (b) { return /Chromium/.test(b.brand); })) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return; // phones and tablets: CSS fallback only
  if (!(window.CSS && CSS.supports && CSS.supports("backdrop-filter", "url(#a)"))) return;

  var NS = "http://www.w3.org/2000/svg";
  var root = document.documentElement;
  var MAX_SHIFT = 18;            // px of bend at the very rim
  var SCALE = MAX_SHIFT * 2.01;  // feDisplacementMap scale for that shift
  var BEZEL = 30;                // px from the rim over which light bends
  var opts = [matchMedia("(prefers-reduced-transparency: reduce)"), matchMedia("(prefers-contrast: more)")];
  var counter = 0;

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  var defs = document.createElementNS(NS, "defs");
  svg.appendChild(defs);
  document.body.insertBefore(svg, document.body.firstChild);

  function enabled() { return !opts.some(function (m) { return m.matches; }); }
  function sync() { root.classList.toggle("lg-refract", enabled()); }
  opts.forEach(function (m) { if (m.addEventListener) m.addEventListener("change", sync); });
  sync();

  function mapUrl(w, h, r, bezel) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var ctx = c.getContext("2d");
    var img = ctx.createImageData(w, h), d = img.data, i = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++, i += 4) {
        var px = x + 0.5, py = y + 0.5;
        var cx = Math.min(Math.max(px, r), w - r), cy = Math.min(Math.max(py, r), h - r);
        var dx = px - cx, dy = py - cy, dist = Math.sqrt(dx * dx + dy * dy);
        var depth = r - dist; // distance inward from the rim
        var m = 0, nx = 0, ny = 0;
        if (dist > 0) { nx = dx / dist; ny = dy / dist; }
        if (depth < bezel) { var t = 1 - Math.max(depth, 0) / bezel; m = Math.pow(t, 1.7) * (1 - Math.pow(1 - t, 4) * 0.15); }
        // sample from further inside the glass, so the rim shows bent content
        d[i] = 128 - nx * m * 127;
        d[i + 1] = 128 - ny * m * 127;
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL("image/png");
  }

  function build(el) {
    var w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (w < 8 || h < 8) return;
    var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    r = Math.min(r, w / 2, h / 2);
    var bezel = Math.min(BEZEL, Math.max(r, 6));
    var id = el.__lgId || (el.__lgId = "lg-" + ++counter);
    var old = document.getElementById(id);
    if (old) old.remove();
    var f = document.createElementNS(NS, "filter");
    f.setAttribute("id", id);
    f.setAttribute("x", "0"); f.setAttribute("y", "0");
    f.setAttribute("width", String(w)); f.setAttribute("height", String(h));
    f.setAttribute("filterUnits", "userSpaceOnUse");
    f.setAttribute("color-interpolation-filters", "sRGB");
    var im = document.createElementNS(NS, "feImage");
    im.setAttribute("href", mapUrl(w, h, r, bezel));
    im.setAttribute("x", "0"); im.setAttribute("y", "0");
    im.setAttribute("width", String(w)); im.setAttribute("height", String(h));
    im.setAttribute("preserveAspectRatio", "none");
    im.setAttribute("result", "map");
    f.appendChild(im);
    // One displacement per color channel with slightly different strength: a faint color fringe at the rim, like real glass
    var parts = [["R", 1, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"], ["G", 0.94, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"], ["B", 0.88, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"]];
    parts.forEach(function (c) {
      var dm = document.createElementNS(NS, "feDisplacementMap");
      dm.setAttribute("in", "SourceGraphic");
      dm.setAttribute("in2", "map");
      dm.setAttribute("scale", String(SCALE * c[1]));
      dm.setAttribute("xChannelSelector", "R");
      dm.setAttribute("yChannelSelector", "G");
      dm.setAttribute("result", "d" + c[0]);
      var cm = document.createElementNS(NS, "feColorMatrix");
      cm.setAttribute("in", "d" + c[0]);
      cm.setAttribute("type", "matrix");
      cm.setAttribute("values", c[2]);
      cm.setAttribute("result", "c" + c[0]);
      f.appendChild(dm); f.appendChild(cm);
    });
    var b1 = document.createElementNS(NS, "feBlend");
    b1.setAttribute("in", "cR"); b1.setAttribute("in2", "cG"); b1.setAttribute("mode", "screen"); b1.setAttribute("result", "rg");
    var b2 = document.createElementNS(NS, "feBlend");
    b2.setAttribute("in", "rg"); b2.setAttribute("in2", "cB"); b2.setAttribute("mode", "screen");
    f.appendChild(b1); f.appendChild(b2);
    defs.appendChild(f);
    el.style.setProperty("--lg", "url(#" + id + ")");
  }

  var pending = new Set(), queued = false;
  function flush() { queued = false; pending.forEach(build); pending.clear(); }
  function schedule(el) { pending.add(el); if (!queued) { queued = true; requestAnimationFrame(flush); } }

  var ro = "ResizeObserver" in window ? new ResizeObserver(function (entries) { entries.forEach(function (e) { schedule(e.target); }); }) : null;
  function observe(el) { if (ro) ro.observe(el); schedule(el); }
  document.querySelectorAll(".glass:not(.glass-flat)").forEach(observe);
  // For glass elements created after load (the cookie banner)
  window.ledgertoneGlass = { observe: observe };
})();
