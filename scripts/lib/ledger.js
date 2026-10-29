// Shared data and ranking logic for the build scripts (v0.81.0). Since v0.85.0 the logic itself lives in assets/ledger-core.js (the artist pages use it in the browser too), this file loads it and adds the file helpers.
// It mirrors assets/app.js render(): if the ranking logic in app.js changes, change assets/ledger-core.js too.
// Nothing is typed by hand: every number comes from data/snapshots.js, data/unverified.js and data/links.js.
const fs = require('fs');
const path = require('path');
global.window = global.window || {};
const root = path.join(__dirname, '..', '..');
['snapshots', 'unverified', 'links'].forEach((f) => require(path.join(root, 'data', f + '.js')));

const core = require(path.join(root, 'assets', 'ledger-core.js'))(window);
const { L, LINKS, homeId, norm, esc, banned, genreName, byName, month, num, snapsOf, verifiedKeys, rosterOf, unverifiedOf, rankedAt, topLimit, topOf, artistCount, safeUrl, pandoraLink, spotifyLink, linksOf, OWNER, ownerNode, hasReading, earlierPlaceAt, moveAt, pageArtists, pageFileOf, historyOf } = core;
const SITE = 'https://ledgertone.github.io/';

const CRLF = (s) => s.replace(/\r?\n/g, '\r\n');
const readCRLF = (f) => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const writeCRLF = (f, s) => fs.writeFileSync(path.join(root, f), CRLF(s));

module.exports = { earlierPlaceAt, moveAt, historyOf, pageArtists, pageFileOf, verifiedKeys, OWNER, ownerNode, hasReading, root, L, LINKS, SITE, homeId, norm, esc, banned, genreName, byName, month, num, snapsOf, rosterOf, unverifiedOf, rankedAt, topLimit, topOf, artistCount, safeUrl, pandoraLink, spotifyLink, linksOf, readCRLF, writeCRLF, CRLF };
