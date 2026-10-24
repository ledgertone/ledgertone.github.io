/*
  Ledgertone consent banner.
  The Google tag is in the <head> of every page (Consent Mode v2, all storage denied by default).
  Before consent the tag sends only limited cookie-free pings. This file shows the banner and
  sends the visitor's choice to the tag. Analytics cookies are set only after Accept.
  The choice is stored in localStorage (not a cookie) under "ledgertone-consent".
  Keep the measurement ID in sync with the head snippet in every HTML page.
*/
(function () {
  "use strict";
  var GA_ID = "G-R9G4YSEG77";
  var KEY = "ledgertone-consent";
  var bar = null;
  var settingsBtn = document.getElementById("cookie-settings");

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function clearGACookies() {
    var names = document.cookie.split(";").map(function (c) { return c.split("=")[0].trim(); });
    var host = location.hostname, parts = host.split("."), domains = [host, "." + host];
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
    names.forEach(function (n) {
      if (n === "_ga" || n.indexOf("_ga_") === 0 || n === "_gid" || n.indexOf("_gat") === 0) {
        domains.forEach(function (d) {
          document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + d;
        });
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
    });
  }

  function apply(choice) {
    if (choice === "granted") {
      gtag("consent", "update", { analytics_storage: "granted" });
    } else {
      gtag("consent", "update", { analytics_storage: "denied" });
      clearGACookies();
    }
  }

  function closeBar() { if (bar) { bar.remove(); bar = null; } }

  function openBar() {
    if (bar) return;
    bar = document.createElement("div");
    bar.className = "consent glass";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-labelledby", "consent-title");
    bar.innerHTML =
      '<h2 id="consent-title">Analytics cookies</h2>' +
      "<p>Ledgertone would like to use Google Analytics cookies to count visits. " +
      "Without your consent no cookies are set. " +
      'See the <a href="/privacy.html">privacy policy</a>.</p>' +
      '<div class="consent-actions"><button type="button" class="cbtn glass glass-flat" data-c="denied">Reject</button>' +
      '<button type="button" class="cbtn glass glass-flat" data-c="granted">Accept</button></div>';
    bar.addEventListener("click", function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute("data-c");
      if (!c) return;
      write(c); apply(c); closeBar();
    });
    document.body.appendChild(bar);
    if (window.ledgertoneGlass) window.ledgertoneGlass.observe(bar);
    var first = bar.querySelector("button"); if (first) first.focus({ preventScroll: true });
  }

  if (!GA_ID) return;
  if (settingsBtn) { settingsBtn.hidden = false; settingsBtn.addEventListener("click", openBar); }

  var saved = read();
  if (saved === "granted" || saved === "denied") apply(saved); else openBar();
})();
