# TODO

## Done
- [x] SEO files, privacy policy, consent banner, GA4 loader (v0.2.0)
- [x] Name chosen: Ledgertone
- [x] Static site scaffold: hero, rankings, method, footer
- [x] Liquid Glass functional layer with accessibility fallbacks
- [x] Snapshot data format and picker with change vs previous snapshot
- [x] Instructions for AI agents, skills, changelog
- [x] Liquid Glass made maximally transparent (v0.1.1)
- [x] Rule: archive name carries the site version

## Next
- [ ] Owner: fill `REPLACE_OWNER_NAME` in `privacy.html`
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
