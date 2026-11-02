# Skills

Three upstream skills. The two Apple ones are both published as "apple-design" and are renamed here to tell them apart. Do not edit any of them.

| Folder | What it is | Use it for |
| --- | --- | --- |
| `apple-design-fluid-web/` | Apple's fluid interface principles translated to the web: springs, interruptibility, momentum, materials, reduced motion, typography | Motion, interaction, and material decisions in `styles.css` and `app.js` |
| `apple-design-hig/` | Design review skill with 123 Apple HIG pages, a Liquid Glass guide, and a code audit list | Reviewing the page, checking Liquid Glass usage, accessibility audits |
| `unslop/` | Redline pass that removes the tells of AI-looking UI: audit list, direction, nine ordered passes (spacing, color, icons, copy, type, layout, details, visuals, motion), exact tokens, checklist | Every change of look, layout, type, color, motion or interface copy (AGENTS.md rule 30, mandatory) |

Notes:
- The HIG skill loads about 8 to 12 reference files per review, never the whole directory. Its own `AGENTS.md` describes that skill, not this project. The project manual is the root `AGENTS.md`.
- Upstream `SKILL.md` of the fluid skill answers with a fixed greeting when invoked without a question. Ask a concrete question to get past it.
- Unslop is by Damir Sokolovsky (https://x.com/heydamir, https://heydamir.design/unslop), licensed CC BY 4.0. The credit stays in `unslop/SKILL.md`, `unslop/LICENSE` and `unslop/CITATION.cff`. `scripts/check-release.js` check 14 fails if `SKILL.md` is changed.
- Where Unslop and an owner decision in `AGENTS.md` disagree (Liquid Glass, Signature None, fonts, owner pills), the owner decision wins, nothing else does. The list is in AGENTS.md rule 30.
- Its scripts `unslop/scripts/snapshot.mjs` and `story.mjs` need network, Playwright and ffmpeg and are not run here unless the owner asks.
