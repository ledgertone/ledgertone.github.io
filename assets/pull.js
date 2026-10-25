/*
  Ledgertone pull to refresh for touch screens. Reloads the page after a deliberate pull down from the very top.
  Guards against false triggers: touch only, one finger, page must be at scroll position 0 the whole time,
  the finger must start in the top strip of the screen (START_ZONE), the gesture must be mostly vertical and
  downward, it must not start on inputs, the snapshot pickers or the cookie banner, and it only fires when the
  finger is released past the threshold. While the pull gesture is active and while the page is refreshing the
  page does not scroll at all (touchmove is cancelled, html gets the ptr-lock class). Nothing is stored.
*/
(function () {
  "use strict";
  if (!("ontouchstart" in window) || !matchMedia("(pointer: coarse)").matches) return;

  var THRESH = 64;   // px of indicator travel needed to refresh
  var RESIST = 0.55; // finger travel to indicator travel
  var LOCK = 12;     // px of movement before the direction is decided
  var HIDE = -56;    // resting offset, tucked under the top bar
  var START_ZONE = 150; // px from the top of the screen: the finger must touch down inside this strip
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");

  var ind = document.createElement("div");
  ind.className = "ptr glass glass-flat";
  ind.setAttribute("aria-hidden", "true");
  ind.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4.5h-4.5"/></svg>';
  var live = document.createElement("div");
  live.className = "sr";
  live.setAttribute("role", "status");
  document.body.append(ind, live);

  var state = "off", sx = 0, sy = 0, pull = 0, busy = false;
  var top = function () { return (window.scrollY || document.documentElement.scrollTop || 0) <= 0; };

  function paint(p) {
    var r = p / THRESH;
    var ty = HIDE - HIDE * Math.min(r, 1) + Math.max(0, p - THRESH) * 0.4;
    ind.style.transform = "translate(-50%," + ty + "px)";
    ind.style.opacity = String(Math.min(r * 1.3, 1));
    ind.style.setProperty("--r", Math.round(r * 200) + "deg");
    ind.classList.toggle("ready", r >= 1);
  }
  function release() {
    state = "off"; pull = 0;
    ind.classList.add("back");
    ind.classList.remove("ready");
    ind.style.transform = "translate(-50%," + HIDE + "px)";
    ind.style.opacity = "0";
    setTimeout(function () { ind.classList.remove("back"); }, 300);
  }
  function fire() {
    busy = true; state = "off";
    document.documentElement.classList.add("ptr-lock");
    ind.classList.add("back", "busy");
    ind.style.transform = "translate(-50%,0)";
    ind.style.opacity = "1";
    live.textContent = "Refreshing";
    setTimeout(function () { location.reload(); }, reduce.matches ? 0 : 350);
  }

  addEventListener("touchstart", function (e) {
    if (busy) return;
    state = "off";
    if (e.touches.length !== 1 || !top()) return;
    if (e.touches[0].clientY > START_ZONE) return;
    var t = e.target;
    if (t && t.closest && t.closest("input,textarea,select,.picker,.consent,[contenteditable]")) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; pull = 0;
    state = "armed";
  }, { passive: true });

  addEventListener("touchmove", function (e) {
    if (busy) { if (e.cancelable) e.preventDefault(); return; } // no scrolling while the page refreshes
    if (state === "off") return;
    if (e.touches.length !== 1) { if (state === "pull") release(); state = "off"; return; }
    if (state === "pull") { if (e.cancelable) e.preventDefault(); } // the gesture owns the touch until the finger lifts
    else if (!top()) { state = "off"; return; }
    var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
    if (state === "pull" && Math.abs(dx) > Math.abs(dy)) { paint(0); pull = 0; return; }
    if (state === "armed") {
      if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
      if (dy <= 0 || Math.abs(dx) > Math.abs(dy) * 0.6) { state = "off"; return; }
      state = "pull";
    }
    pull = Math.max(dy - LOCK, 0) * RESIST;
    if (e.cancelable) e.preventDefault(); // stops the browser's own pull to refresh and rubber band
    paint(pull);
  }, { passive: false });

  function end(e) {
    if (state !== "pull") { state = "off"; return; }
    if (e.type === "touchend" && pull >= THRESH) fire(); else release();
  }
  addEventListener("touchend", end, { passive: true });
  addEventListener("touchcancel", end, { passive: true });
  addEventListener("pagehide", function () { busy = false; document.documentElement.classList.remove("ptr-lock"); });
})();
