# LifeOps GitHub Upload Notes

Use this package as the clean GitHub base for LifeOps `v2.12.0`.

## Upload These

Upload the contents of the GitHub-ready folder to the root of the GitHub repository:

- `index.html`
- `lifeops-dashboard.html`
- `lifeops-preview-server.js`
- `README.md`
- `CHANGELOG.md`
- `UPLOAD_NOTES.md`
- `.gitignore`
- `PHASE3_STORAGE_AUDIT.md`
- `PHASE4_EXTRACTION_AUDIT.md`
- `PHASE5_ATLAS_AUDIT.md`
- `PHASE6_TIMELINE_AUDIT.md`
- `PHASE7_MEMORY_PRIVACY_AUDIT.md`
- `PHASE8_LIFE_GRAPH_AUDIT.md`
- `PHASE9_COMMAND_CENTER_AUDIT.md`
- `PHASE10_ONBOARDING_REDESIGN_AUDIT.md`
- `assets/brand/`
- `css/`
- `js/`
  - includes `js/atlas/`
  - includes `js/timeline/`
  - includes `js/memory/`
  - includes `js/graph/`
  - includes `js/command/`
  - includes `js/modules/command-center.js`
- `tests/`
  - includes `tests/command-phase9.test.js`
  - includes `tests/onboarding-phase10.test.js`

Keep the `assets/brand` folder structure exactly the same so logo, favicon, and avatar paths continue working.

## Do Not Upload These

Do not upload:

- `backups/`
- `work/`
- Old `outputs/upload-these-to-github-*` folders
- Old `lifeops-dashboard-github-ready-*.zip` files
- Personal JSON exports
- Private backups
- Browser localStorage dumps
- Files containing real financial, health, school, career, legal, or family data
- API keys, tokens, passwords, or credentials

## Recommended GitHub Cleanup

Delete old `lifeops-dashboard-github-ready-*.zip` files from the GitHub repo root. Keep the source files instead.

For GitHub Pages, keep `index.html` in the repo root. It is a copy of the current app so the site can open from the repository root.

## Current Version

Current packaged version: `v2.12.0`

Package date: `2026-07-25`

## Phase 10 Notes

- Upload `PHASE10_ONBOARDING_REDESIGN_AUDIT.md` and `tests/onboarding-phase10.test.js` with this release.
- Keep the existing storage key. The app migrates old backups to schema version `4` automatically.
- Phase 10/10.1 adds optional onboarding mission fields, Blueprint Mission buckets, a live Life Map, first-command state, and the `v2.12.0` seven-screen setup refinement.
- The first-launch setup is now Today's Win, Biggest Blocker, Desired Outcome, Optional Deadline, Available Time, Energy Level, and Guidance Style.
- Complete My Blueprint now lives under Settings and no longer blocks launch.
- Do not upload personal JSON exports or browser localStorage dumps.

## Phase 9 Notes

- Upload the full `js/command/` folder and `tests/command-phase9.test.js` with this release.
- Phase 9 added optional `commandCenter` and `commandHistory` fields to exported backups. Schema 3 backups now migrate onward to schema 4 in v2.11.0.
- Atlas Command Center is local deterministic planning. It is not a remote AI system.
- Do not upload personal JSON exports or browser localStorage dumps.


