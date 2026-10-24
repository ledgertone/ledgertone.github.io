# Ledgertone

Snapshot-based ranking of phonk artists on Pandora by verified streams. Numbers are collected by hand from artist profiles, are not live, and every snapshot is dated. This is not an official Pandora API and the project is not affiliated with Pandora.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Create a repository named `ledgertone` and push this folder to the `main` branch.
2. Open Settings, then Pages. Under Source choose "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site is served at `https://<your-username>.github.io/ledgertone/`. All paths are relative, so the subpath works.

## Add a snapshot

See `docs/DATA.md`.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page |
| `assets/styles.css` | Design tokens, Liquid Glass layer, accessibility fallbacks |
| `assets/app.js` | Renders snapshots, comparison against the previous snapshot |
| `data/snapshots.js` | All published data |
| `AGENTS.md`, `CLAUDE.md` | Instructions for AI agents |
| `skills/` | Design skills used for this project |
| `TODO.md`, `CHANGELOG.md` | Plan and history |
