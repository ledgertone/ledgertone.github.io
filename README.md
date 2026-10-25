# Ledgertone

Snapshot-based ranking of phonk artists on Pandora by verified streams. Numbers are collected by hand from artist profiles, are not live, and every snapshot is dated. This is not an official Pandora API and the project is not affiliated with Pandora.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Create a repository named `ledgertone.github.io` (a user site) and push this folder to the `main` branch.
2. Open Settings, then Pages. Under Source choose "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site is served at `https://<your-username>.github.io/`. Page paths are relative, but `404.html`, the consent banner link, and the canonical tags assume the site root. Launch steps: `docs/SEO.md`.

## Add a snapshot

See `docs/DATA.md`.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Home page: hero, snapshot picker and rankings |
| `about.html` | What the site is and how the data is collected |
| `assets/styles.css` | Design tokens, Liquid Glass styles (buttons, chips, cards, bars), accessibility fallbacks |
| `assets/app.js` | Renders the snapshot picker and the ranking table |
| `data/snapshots.js` | All published data |
| `assets/glass.js` | Real refraction for Liquid Glass in Chromium browsers |
| `assets/theme.js` | Auto, Light, Dark theme switch |
| `assets/consent.js` | Cookie banner, passes the consent choice to the Google tag |
| `privacy.html`, `404.html`, `robots.txt`, `sitemap.xml` | Privacy policy, error page, search files |
| `AGENTS.md`, `CLAUDE.md` | Instructions for AI agents |
| `skills/` | Design skills used for this project |
| `TODO.md`, `CHANGELOG.md` | Plan and history |
