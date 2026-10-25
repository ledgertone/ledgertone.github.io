/*
  Ledgertone theme switch: Auto (follows the system), Light, Dark.
  Loaded in the <head> of every page so the saved theme is applied before first paint.
  The choice is stored in localStorage (not a cookie) under "ledgertone-theme".
  Auto removes the key and the data-theme attribute, the CSS then follows prefers-color-scheme.
*/
(function () {
  "use strict";
  var KEY = "ledgertone-theme";
  var ORDER = ["auto", "light", "dark"];
  var RU = document.documentElement.lang === "ru"; // Russian page (settwor-ru.html, v0.81.0)
  var LABEL = RU ? { auto: "Авто", light: "Светлая", dark: "Тёмная" } : { auto: "Auto", light: "Light", dark: "Dark" };
  var BAR = { light: "#F1EEFB", dark: "#120E26" };
  var root = document.documentElement;
  var mode = "auto";

  function read() { try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : "auto"; } catch (e) { return "auto"; } }
  function write(v) { try { if (v === "auto") localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch (e) {} }

  function bar(m) {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var meta = metas[i];
      if (!meta.hasAttribute("data-orig")) meta.setAttribute("data-orig", meta.getAttribute("content"));
      meta.setAttribute("content", m === "auto" ? meta.getAttribute("data-orig") : BAR[m]);
    }
  }

  function apply(m) {
    mode = m;
    if (m === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", m);
    bar(m);
  }

  apply(read());

  var ICONS = {
    auto: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
  };

  function init() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    function paint() {
      var next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
      btn.innerHTML = ICONS[mode];
      btn.setAttribute("aria-label", RU ? "Тема: " + LABEL[mode] + ". Следующая: " + LABEL[next] + "." : "Theme: " + LABEL[mode] + ". Switch to " + LABEL[next] + ".");
      btn.title = (RU ? "Тема: " : "Theme: ") + LABEL[mode];
    }
    btn.hidden = false;
    paint();
    btn.addEventListener("click", function () {
      var next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
      apply(next); write(next); paint();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
