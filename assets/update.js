/*
  Ledgertone update check. A site saved to the iPhone home screen keeps showing an old copy because the app is
  often resumed instead of reloaded and static hosting allows cached files. This script compares the version of
  the open page (meta ledgertone-version) with version.json on the server, fetched past every cache, and
  reloads the page once when they differ. Runs on load and when the app comes back to the foreground.
  Stores one sessionStorage key (ledgertone-updated, cleared when the tab or app session ends) to avoid reload loops.
*/
(function () {
  "use strict";
  var m = document.querySelector('meta[name="ledgertone-version"]');
  if (!m || !window.fetch) return;
  var mine = m.getAttribute("content"), last = 0, KEY = "ledgertone-updated";

  function check() {
    var now = Date.now();
    if (now - last < 20000) return; // at most every 20 seconds
    last = now;
    fetch("/version.json?t=" + now, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.version || j.version === mine) return;
        try { if (sessionStorage.getItem(KEY) === j.version) return; sessionStorage.setItem(KEY, j.version); } catch (e) { return; }
        // refresh the cached copy of this page first, then reload so it pulls the new, versioned files
        fetch(location.href, { cache: "reload" }).catch(function () {}).then(function () { location.reload(); });
      })
      .catch(function () {});
  }

  check();
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") check(); });
  addEventListener("pageshow", function (e) { if (e.persisted) check(); });
})();
