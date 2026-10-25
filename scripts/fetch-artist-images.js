#!/usr/bin/env node
/*
  Fetch artist picture URLs from Spotify for the roster and snapshot artists of one genre (or all genres) and write them to each genre's own file.
  The site stores no image files: browsers load the pictures from Spotify's image host (https://i.scdn.co) at view time.

  Run it on the owner's own computer (Node 18 or newer). The client secret must never be put into the site or committed.
  Easiest way on Windows: the launcher .bat file kept OUTSIDE the repository (it holds the keys and asks the questions below).

    SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/fetch-artist-images.js [--genre <id> | --all-genres] [--new | --refresh]

  - Started in a terminal without options, the script asks two questions: what to search (only new pictures, or all pictures again)
    and for which genre (one genre or all genres). Any option below skips the matching question, and without a terminal (no questions possible)
    the defaults are used: only new pictures, first genre.
      --genre <id>    one genre          --all-genres  every genre that has names
      --new           only artists without a picture yet (default)          --refresh  search all artists again
  - One file per genre (owner decision, v0.55.0), so a run for one genre never touches the other genre's file:
      first genre (phonk)                -> data/artist-media.js                  (window.LEDGERTONE_MEDIA), review: scripts/artist-images-review.txt
      any other genre, e.g. brazilian-phonk -> data/artist-media-<id>.js          (window.LEDGERTONE_MEDIA_<ID>), review: scripts/artist-images-review-<id>.txt
  - Credentials come from a Spotify developer app (Client Credentials flow, no user login).
  - Matching is strict: a search result is used only when its name equals the artist name (case and accents ignored).
    Everything else is listed in the review file and gets no picture (the site shows an initials monogram).
  - Exact matches by Spotify artist ID skip the search (one request per artist instead of two). Sources, first wins:
      1. scripts/spotify-ids.json, a JSON object { "Artist name": "spotifyArtistId" } (optional, trusted without a name check)
      2. data/links.js, the Spotify ids stored for the artist links (used only when the artist's name on Spotify equals ours, else the search runs)
  - Requests are spaced out. When Spotify answers "rate limited" the script waits and slows down. When Spotify asks to wait more than 5 minutes,
    the script saves what it has and stops, and says how long to wait. Run it again later with "only new pictures" to continue.
  - Names already present in the genre's file are skipped unless "all pictures again" (--refresh) is chosen. Progress is saved every 25 artists.
    With --refresh an artist whose new lookup fails keeps the picture it already had.
*/
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.join(__dirname, '..');
const IDS_FILE = path.join(__dirname, 'spotify-ids.json');
const IMAGE_HOST = 'i.scdn.co';
const MIN_GAP_MS = 350;       // minimum pause between two Spotify requests
const MAX_GAP_MS = 2000;      // the pause grows after every rate limit answer, up to this
const MAX_WAIT_S = 300;       // longer waits asked by Spotify stop the run instead of blocking it

const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class RateLimitStop extends Error {
  constructor(seconds) {
    super('Spotify rate limit, asked to wait ' + fmtDuration(seconds));
    this.seconds = seconds;
  }
}

function fmtDuration(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h) return h + ' h ' + m + ' min';
  if (m) return m + ' min' + (sec % 60 ? ' ' + (sec % 60) + ' s' : '');
  return sec + ' s';
}

function loadWindowFile(file) {
  const saved = global.window;
  global.window = {};
  try {
    delete require.cache[require.resolve(file)];
    require(file);
    return global.window;
  } finally {
    global.window = saved;
  }
}

function readData() {
  return loadWindowFile(path.join(ROOT, 'data', 'snapshots.js')).LEDGERTONE || {};
}

// Spotify ids stored for the artist links (data/links.js), keyed like norm(name)
function readLinkIds() {
  const file = path.join(ROOT, 'data', 'links.js');
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  const links = loadWindowFile(file).LEDGERTONE_LINKS || {};
  Object.keys(links).forEach((k) => {
    const s = links[k] && links[k].s;
    if (typeof s === 'string' && /^[A-Za-z0-9]{10,40}$/.test(s)) map.set(k, s);
  });
  return map;
}

// where a genre's pictures go: the first genre keeps data/artist-media.js, the others get data/artist-media-<id>.js
function targets(data, genreId) {
  const genres = data.genres || [];
  const first = genres[0] ? genres[0].id : 'phonk';
  const id = genreId || first;
  if (genres.length && !genres.some((g) => g.id === id)) throw new Error('Unknown genre "' + id + '". Known: ' + genres.map((g) => g.id).join(', '));
  const home = id === first;
  const genre = genres.find((g) => g.id === id);
  return {
    id,
    first,
    title: genre && genre.name ? genre.name : id,
    out: path.join(ROOT, 'data', home ? 'artist-media.js' : 'artist-media-' + id + '.js'),
    rel: home ? 'data/artist-media.js' : 'data/artist-media-' + id + '.js',
    review: path.join(__dirname, home ? 'artist-images-review.txt' : 'artist-images-review-' + id + '.txt'),
    globalName: home ? 'LEDGERTONE_MEDIA' : 'LEDGERTONE_MEDIA_' + id.toUpperCase().replace(/-/g, '_'),
  };
}

function collectNames(data, t) {
  const banned = new Set((data.banned || []).map((n) => norm(n)));
  const seen = new Map();
  const add = (n) => {
    const name = String(n || '').trim();
    const k = norm(name);
    if (name && !banned.has(k) && !seen.has(k)) seen.set(k, name);
  };
  (data.genres || []).filter((g) => g.id === t.id).forEach((g) => (g.roster || []).forEach(add));
  (data.snapshots || []).filter((s) => (s.genre || t.first) === t.id).forEach((s) => (s.artists || []).forEach((a) => add(a && a.name)));
  return [...seen.values()];
}

function loadMedia(t) {
  if (!fs.existsSync(t.out)) return {};
  const m = loadWindowFile(t.out)[t.globalName];
  return m && typeof m === 'object' ? Object.assign({}, m) : {};
}

function saveMedia(media, t) {
  const keys = Object.keys(media).sort();
  const body = keys.map((k) => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(media[k])).join(',\n');
  const text = '/*\n  Generated by scripts/fetch-artist-images.js. Do not edit by hand.\n' +
    '  Artist picture URLs only (Spotify image host), keyed by the lowercase, accent-free artist name. No image files are stored in the repository.\n' +
    '*/\nwindow.' + t.globalName + ' = {' + (body ? '\n' + body + '\n' : '') + '};\n';
  fs.writeFileSync(t.out, text.replace(/\n/g, '\r\n'));
}

// the smallest picture that is at least 150 px wide (the list shows up to 56 px, this keeps retina sharp), else the largest
function pickImage(images) {
  const list = (images || []).filter((i) => i && typeof i.url === 'string');
  if (!list.length) return null;
  const wide = list.filter((i) => Number(i.width) >= 150).sort((a, b) => a.width - b.width);
  if (wide.length) return wide[0].url;
  return list.slice().sort((a, b) => (b.width || 0) - (a.width || 0))[0].url;
}

function makeClient(id, secret) {
  let token = null;
  let expires = 0;
  let gap = MIN_GAP_MS;
  let last = 0;
  async function auth() {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) throw new Error('Token request failed: HTTP ' + res.status + ' (check the client ID and secret)');
    const j = await res.json();
    token = j.access_token;
    expires = Date.now() + (Number(j.expires_in) || 3600) * 1000 - 60000;
  }
  async function get(url) {
    let limited = 0;
    for (let attempt = 0; attempt < 6; attempt++) {
      if (!token || Date.now() > expires) await auth();
      const wait = last + gap - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
      if (res.status === 401) { token = null; continue; }
      if (res.status === 429) {
        const asked = Number(res.headers.get('retry-after')) || 5;
        if (asked > MAX_WAIT_S) throw new RateLimitStop(asked);
        limited = asked;
        gap = Math.min(gap + 250, MAX_GAP_MS);
        console.log('  rate limited, waiting ' + asked + ' s (requests are now ' + gap + ' ms apart)');
        await sleep((asked + 1) * 1000);
        continue;
      }
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
      return res.json();
    }
    if (limited) throw new RateLimitStop(limited);
    throw new Error('Too many retries for ' + url);
  }
  return { get };
}

async function findArtist(client, name) {
  const base = 'https://api.spotify.com/v1/search?type=artist&limit=5&q=';
  const queries = ['artist:"' + name.replace(/"/g, '') + '"', name];
  let candidates = [];
  for (const q of queries) {
    const j = await client.get(base + encodeURIComponent(q));
    const items = (j && j.artists && j.artists.items) || [];
    candidates = candidates.concat(items.map((i) => i.name));
    const exact = items.filter((i) => i && norm(i.name) === norm(name));
    if (exact.length) {
      exact.sort((a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0));
      return { artist: exact[0], candidates };
    }
  }
  return { artist: null, candidates };
}

// One lookup per artist name. The answer is kept for the whole run, so an artist that is in two genres is asked only once.
// Returns { url } on success or { note } (a line for the review file) when there is no picture. Rate limit stops are thrown.
async function lookup(ctx, name) {
  const key = norm(name);
  if (ctx.cache.has(key)) return ctx.cache.get(key);
  let result;
  try {
    let artist = null;
    let candidates = [];
    let note = '';
    if (ctx.idByName.has(key)) {
      artist = await ctx.client.get('https://api.spotify.com/v1/artists/' + encodeURIComponent(ctx.idByName.get(key)));
      if (!artist) note = name + ' | the ID in spotify-ids.json was not found';
    } else {
      if (ctx.linkIdByName.has(key)) {
        const byId = await ctx.client.get('https://api.spotify.com/v1/artists/' + encodeURIComponent(ctx.linkIdByName.get(key)));
        if (byId && norm(byId.name || '') === key) artist = byId;
      }
      if (!artist) {
        ({ artist, candidates } = await findArtist(ctx.client, name));
        if (!artist) note = name + ' | no exact name match' + (candidates.length ? ' | candidates: ' + [...new Set(candidates)].join(', ') : ' | no results');
      }
    }
    if (!artist) {
      result = { note };
    } else {
      const url = pickImage(artist.images);
      let host = '';
      try { host = new URL(url).hostname; } catch (e) { /* no url */ }
      if (!url) result = { note: name + ' | matched on Spotify but the artist has no picture' };
      else if (host !== IMAGE_HOST) result = { note: name + ' | unexpected image host ' + host + ', not used' };
      else result = { url };
    }
  } catch (e) {
    if (e instanceof RateLimitStop) throw e;
    return { note: name + ' | error: ' + e.message }; // not kept, a later run asks again
  }
  ctx.cache.set(key, result);
  return result;
}

function writeReview(t, review, stopped) {
  const head = stopped ? 'Run stopped early (' + stopped + '). Only the artists handled before the stop are listed.\n' : '';
  fs.writeFileSync(t.review, head + (review.length ? review.join('\n') + '\n' : (stopped ? '' : 'Nothing to review.\n')));
}

async function runGenre(ctx, t, refresh) {
  const names = collectNames(ctx.data, t);
  const media = loadMedia(t);
  const review = [];
  const todo = refresh ? names : names.filter((n) => !media[norm(n)]);
  console.log('');
  console.log('Genre: ' + t.title + ' -> ' + t.rel);
  console.log(names.length + ' names, ' + (names.length - todo.length) + ' skipped (picture already there), ' + todo.length + ' to look up' +
    (todo.length ? ', about ' + fmtDuration(todo.length * 0.5) + ' or more' : ''));
  let done = 0, added = 0;
  try {
    for (const name of todo) {
      const res = await lookup(ctx, name);
      if (res.url) { media[norm(name)] = res.url; added++; }
      else if (res.note) review.push(res.note);
      if (++done % 25 === 0) { saveMedia(media, t); console.log(done + ' of ' + todo.length + ' artists processed, ' + added + ' pictures found'); }
    }
  } catch (e) {
    if (e instanceof RateLimitStop) {
      saveMedia(media, t);
      writeReview(t, review, 'rate limit');
      e.partial = { done, added, total: todo.length };
    }
    throw e;
  }
  saveMedia(media, t);
  writeReview(t, review, '');
  console.log('Done. ' + added + ' pictures found now, ' + Object.keys(media).length + ' in ' + t.rel + ', ' + review.length + ' names need a look (' + path.relative(ROOT, t.review).replace(/\\/g, '/') + ').');
}

// ---- questions (only in a terminal, only when the matching option was not given) ----
function makeAsker() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const lines = [];
  const waiting = [];
  let closed = false;
  // lines are queued, so an answer typed or pasted before the next question is shown is not lost
  rl.on('line', (l) => { if (waiting.length) waiting.shift()(String(l).trim()); else lines.push(String(l).trim()); });
  rl.on('close', () => { closed = true; while (waiting.length) waiting.shift()(''); });
  const ask = (q) => {
    process.stdout.write(q);
    if (lines.length) return Promise.resolve(lines.shift());
    if (closed) return Promise.resolve('');
    return new Promise((resolve) => waiting.push(resolve));
  };
  return { ask, close: () => rl.close() };
}

async function choose(asker, title, options, defaultIndex) {
  console.log('');
  console.log(title);
  options.forEach((o, i) => console.log('  ' + (i + 1) + ') ' + o));
  for (;;) {
    const a = await asker.ask('Number [' + (defaultIndex + 1) + ']: ');
    if (!a) return defaultIndex;
    const n = Number(a);
    if (Number.isInteger(n) && n >= 1 && n <= options.length) return n - 1;
    console.log('Type a number from 1 to ' + options.length + '.');
  }
}

async function main() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (Spotify developer dashboard, Client Credentials).');
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const gi = args.indexOf('--genre');
  const data = readData();
  const genres = data.genres || [];
  const info = genres.map((g) => {
    const t = targets(data, g.id);
    const names = collectNames(data, t);
    const have = fs.existsSync(t.out) ? loadMedia(t) : {};
    return { t, names: names.length, have: names.filter((n) => have[norm(n)]).length };
  });

  let refresh = args.includes('--refresh') ? true : (args.includes('--new') ? false : null);
  let chosen = null; // array of targets
  if (args.includes('--all-genres')) chosen = info.filter((x) => x.names).map((x) => x.t);
  else if (gi > -1) chosen = [targets(data, args[gi + 1])];

  const interactive = process.stdin.isTTY && (refresh === null || chosen === null);
  if (interactive) {
    const asker = makeAsker();
    try {
      if (refresh === null) {
        const m = await choose(asker, 'What should be searched?', [
          'Only new pictures (artists that have no picture yet)',
          'All pictures again (every artist is searched anew)',
        ], 0);
        refresh = m === 1;
      }
      if (chosen === null) {
        const usable = info.filter((x) => x.names);
        const opts = usable.map((x) => x.t.title + ' (' + x.names + ' names, ' + x.have + ' with a picture)');
        opts.push('All genres');
        const g = await choose(asker, 'Which genre?', opts, opts.length - 1);
        chosen = g === usable.length ? usable.map((x) => x.t) : [usable[g].t];
      }
    } finally {
      asker.close();
    }
  }
  if (refresh === null) refresh = false;
  if (chosen === null) chosen = [targets(data, null)];
  if (!chosen.length) { console.log('No genre has any names.'); return; }

  const ids = fs.existsSync(IDS_FILE) ? JSON.parse(fs.readFileSync(IDS_FILE, 'utf8')) : {};
  const ctx = {
    data,
    client: makeClient(id, secret),
    cache: new Map(),
    idByName: new Map(Object.entries(ids).map(([n, v]) => [norm(n), String(v)])),
    linkIdByName: readLinkIds(),
  };
  console.log('');
  console.log('Mode: ' + (refresh ? 'all pictures again' : 'only new pictures') + '. Genres: ' + chosen.map((t) => t.title).join(', ') + '.');

  for (const t of chosen) {
    try {
      await runGenre(ctx, t, refresh);
    } catch (e) {
      if (e instanceof RateLimitStop) {
        console.error('');
        console.error('Spotify says: too many requests. It asks to wait ' + fmtDuration(e.seconds) + '.');
        if (e.partial) console.error('Saved so far for ' + t.title + ': ' + e.partial.added + ' new pictures from ' + e.partial.done + ' of ' + e.partial.total + ' artists handled.');
        console.error('Nothing is lost. Run the script again later and choose "Only new pictures" to continue where it stopped.');
        process.exit(2);
      }
      throw e;
    }
  }
}

if (require.main === module) main().catch((e) => { console.error(e.message); process.exit(1); });
module.exports = { norm, pickImage };
