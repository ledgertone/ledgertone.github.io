/*
  Ledgertone consent and analytics.
  Google Analytics 4 loads ONLY after the visitor accepts. Until then no Google request is made
  and no cookie is set. While GA_ID is empty this file would do nothing and show no banner.
  The choice is stored in localStorage (not a cookie) under "ledgertone-consent".
*/
(function () {
  "use strict";
  var GA_ID = "G-R9G4YSEG77"; // GA4 measurement ID. Never paste the raw Google snippet into HTML, it would load before consent.
  var KEY = "ledgertone-consent";
  if (!GA_ID) return;

  var bar = null, loaded = false;
  var settingsBtn = document.getElementById("cookie-settings");

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function consentState(granted) {
    return {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    };
  }

  // Consent Mode v2 defaults: everything denied until the visitor chooses.
  gtag("consent", "default", consentState(false));

  function loadGA() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }

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
      gtag("consent", "update", consentState(true));
      loadGA();
    } else {
      gtag("consent", "update", consentState(false));
      if (loaded) { window["ga-disable-" + GA_ID] = true; clearGACookies(); }
    }
  }

  function closeBar() { if (bar) { bar.remove(); bar = null; } }

  function openBar() {
    if (bar) return;
    bar = document.createElement("div");
    bar.className = "consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-labelledby", "consent-title");
    bar.innerHTML =
      '<h2 id="consent-title">Analytics cookies</h2>' +
      "<p>Ledgertone would like to use Google Analytics cookies to count visits and see which parts of the page are used. " +
      'Nothing is loaded from Google unless you accept. You can change your mind at any time. See the <a href="/privacy.html">privacy policy</a>.</p>' +
      '<div class="consent-actions"><button type="button" class="cbtn" data-c="denied">Reject</button>' +
      '<button type="button" class="cbtn" data-c="granted">Accept</button></div>';
    bar.addEventListener("click", function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute("data-c");
      if (!c) return;
      write(c); apply(c); closeBar();
    });
    document.body.appendChild(bar);
    var first = bar.querySelector("button"); if (first) first.focus({ preventScroll: true });
  }

  if (settingsBtn) { settingsBtn.hidden = false; settingsBtn.addEventListener("click", openBar); }

  var saved = read();
  if (saved === "granted" || saved === "denied") apply(saved); else openBar();
})();
