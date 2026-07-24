# LifeOps GitHub Upload Notes

Use this package as the clean GitHub base for LifeOps `v2.0.0`.

## Upload These

Upload the contents of this folder to the root of the GitHub repository:

- `index.html`
- `lifeops-dashboard.html`
- `lifeops-preview-server.js`
- `README.md`
- `CHANGELOG.md`
- `PHASE3_STORAGE_AUDIT.md`
- `PHASE4_EXTRACTION_AUDIT.md`
- `PHASE5_ATLAS_AUDIT.md`
- `PHASE6_TIMELINE_AUDIT.md`
- `PHASE7_MEMORY_PRIVACY_AUDIT.md`
- `PHASE8_LIFE_GRAPH_AUDIT.md`
- `UPLOAD_NOTES.md`
- `.gitignore`
- `assets/brand/`
- `css/`
- `js/`
  - includes `js/graph/` and `js/modules/graph.js`
- `tests/`

Keep the `assets/brand` folder structure exactly the same so logo, favicon, and avatar paths continue working.

## Do Not Upload These

Do not upload:

- `backups/`
- `work/`
- Old `outputs/upload-these-to-github-*` folders
- Old `lifeops-dashboard-github-ready-*.zip` files
- Personal JSON exports
- Private backups
- Files containing real financial, health, school, career, legal, or family data
- API keys, tokens, passwords, or credentials

## Recommended GitHub Cleanup

Delete old `lifeops-dashboard-github-ready-*.zip` files from the GitHub repo root. Keep the source files instead.

For GitHub Pages, keep `index.html` in the repo root. It is a copy of the current app so the site can open from the repository root.

## Current Version

Current packaged version: `v2.0.0`

Package date: `2026-07-23`

## Phase 8 Notes

- Upload the full `js/graph/` folder and `tests/graph-phase8.test.js` with this release.
- Keep the existing storage key. The app migrates old backups to schema version `2` automatically.
- Do not upload personal JSON exports or browser localStorage dumps.

