// Runs every generated-page script in order (v0.81.0). Run after ANY data change and after every version bump: node scripts/build-all.js
require('./build-artist-pages.js');
require('./build-ranking-files.js');
require('./build-home.js');
require('./build-feed.js');
require('./build-spotify.js');
require('./build-platforms.js');
