# TODO

## Done
- [x] Pull to refresh on touch screens (v0.29.0), emulated touch only
- [x] Search, pages and per-page selector in the ranking (v0.28.0)
- [x] Earlier snapshots always open, shorter snapshot line, smaller logo (v0.27.0)
- [x] New title, shorter hero, picker moved deep (v0.26.0)
- [x] Richer Liquid Glass: rim highlight, color fringe, depth (v0.25.0), headless Chromium only
- [x] Gold, silver, bronze badges, no underline on names, taller rows (v0.24.0)
- [x] SF Pro Rounded for text and interface, Neue Machina kept for headings (v0.23.0), NOT checked in a browser
- [x] Y2K holographic glow restyle (v0.15.0), NOT yet seen in any browser
- [x] Neue Machina as the only typeface (v0.14.0), checked in headless Chromium only
- [x] Artist images, Pandora links and explicit Pandora wording (v0.13.0), checked in headless Chromium only
- [x] Sample snapshots with fictional artists added for the design preview (v0.12.0)
- [x] Theme switch Auto, Light, Dark and a cooler palette (v0.11.0), checked in headless Chromium only
- [x] Strict look, compact headings, softer background (v0.10.0), checked in headless Chromium only
- [x] SF Pro and New York through system stacks, Instrument Sans as non-Apple fallback (v0.9.0), NOT visually checked on Apple devices
- [x] Glass on all buttons, chips, rows and the cookie banner (v0.8.0), checked in headless Chromium only
- [x] Instrument Sans self-hosted as the site font (v0.7.0), checked in headless Chromium only
- [x] Smaller cookie banner in glass style (v0.6.1), checked in headless Chromium only
- [x] Refraction glass for Chromium and design refresh (v0.6.0), checked in headless Chromium 141 only
- [x] Separate pages for rankings and about, top bar opens pages (v0.5.0)
- [x] Site information moved to `about.html` (v0.4.0)
- [x] SEO files, privacy policy, consent banner, GA4 loader (v0.2.0)
- [x] Name chosen: Ledgertone
- [x] Static site scaffold: hero, rankings, method, footer
- [x] Liquid Glass functional layer with accessibility fallbacks
- [x] Snapshot data format and picker with change vs previous snapshot
- [x] Instructions for AI agents, skills, changelog
- [x] Liquid Glass made maximally transparent (v0.1.1)
- [x] Rule: archive name carries the site version

## Next
- [ ] Owner: try pull to refresh on a real iPhone and Android phone (no false triggers while scrolling up, swiping the pickers, typing in search)
- [ ] Owner: send a new `assets/og-image.png` with the title "Top Phonk Artists on Pandora" (the current image shows the old wording)
- [ ] Owner: look at v0.23.0 in Chrome and Safari: SF Pro Rounded text next to Neue Machina headings, button and table legibility, light and dark
- [ ] Owner: confirm the SF Pro Rounded license covers use on a public website (Apple fonts are normally licensed for Apple platforms only)
- [ ] Owner: look at v0.17.0 in Chrome and Safari, light and dark: button size, text legibility on glass over the plain background
- [ ] Owner: confirm the Neue Machina license covers use on a public website (the font files carry no license text; Pangram Pangram sells separate web licenses)
- [ ] BEFORE LAUNCH: replace the placeholder images in `assets/artists/` with real images the owner may use, and put real Pandora artist URLs into `profileUrl` (the sample ones point to the Pandora home page)
- [ ] BEFORE LAUNCH: delete all snapshots with `sample: true` from `data/snapshots.js` (the site must not show fictional artists as real data)
- [ ] Test the theme switch on a real phone and in Safari (saved choice, no flash on load, theme-color bar)
- [ ] Owner: check the site on an iPhone and a Mac (Safari and Chrome): New York headings, SF Pro body, heading size and wrapping, tracking
- [ ] Check text legibility on glass rows and tinted buttons in light and dark, and performance of the rankings list with many rows
- [ ] Artist names with non-Latin letters (for example Cyrillic) fall back to the system font, the subset is Latin only. Extend the subset if such names appear in `data/snapshots.js`
- [ ] Check the glass cookie banner in Safari and Firefox (CSS fallback) and on a real phone
- [ ] Check the glass in Safari and Firefox (CSS fallback) and on a real phone
- [ ] Owner: decide whether the cookie-free pings before consent are acceptable, or switch back to loading the tag only after Accept (basic mode)
- [ ] Owner: in GA4 turn off Google signals and advertising features, set data retention to 14 months or less (see `docs/SEO.md`)
- [ ] Test the consent flow in a clean browser profile (steps in `docs/SEO.md`)
- [ ] Verify the site in Search Console, submit `sitemap.xml`, request indexing after the first snapshot is live
- [ ] Check legibility of nav and picker text over the colorful page background with the new transparent glass, light and dark
- [ ] Owner: collect the first snapshot by hand and add it to `data/snapshots.js`
- [ ] Create the GitHub repository `ledgertone.github.io` and enable Pages (see README)
- [ ] Test in Safari, Chrome, and Firefox, light and dark, with reduced motion, reduced transparency, and increased contrast

## Later
- [ ] Artist detail view with history across snapshots
- [ ] CSV download of each snapshot
- [ ] Structured data (schema.org Dataset) after the first snapshot exists
- [ ] Lighthouse accessibility and performance pass

## Open questions
- What exactly is the metric on Pandora profiles (name it precisely on the site)?
- Inclusion rule: which artists count as phonk, and is there a minimum?
- GitHub username, which sets the final URL
