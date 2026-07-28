# LifeOps GitHub Upload Notes

Use this package as the clean GitHub base for LifeOps `v2.16.3`.

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
- `PHASE11_ATLAS_FIRST_AUDIT.md`
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

Current packaged version: `v2.16.3`

Package date: `2026-07-28`

## Phase 12 Onboarding Launch Patch Notes

- Atlas ready screen now focuses on a single first mission.
- The launch mission is based on the user's setup answers first.
- Existing overdue bills, tasks, or demo data no longer take over the onboarding ready screen.
- Extra summary chips were hidden so launch feels cleaner and less crowded.

## Phase 12 Navigation Patch Notes

- Life Tree navigation now behaves like a sticky app dock.
- Medium-width dashboard cards no longer scroll underneath the left tree app rail.
- Navigation remains grouped by Core, Life, Personal, and System.

## Phase 12 Patch Notes

- Fixed the blank onboarding answer panels by giving onboarding its own renderer name.
- Tightened onboarding layout so choices, text fields, and Life Map progress fit cleanly.
- Improved the final Atlas ready screen.

## Phase 12 Notes

- Atlas onboarding now uses the profile-first question flow from the latest product prompt.
- Required setup asks for preferred name, improvement areas, Atlas behavior, privacy mode, and one immediate-value concern.
- Old detailed setup questions remain compatible as deeper context but no longer block launch.

## Phase 11 Notes

- Upload `PHASE11_ATLAS_FIRST_AUDIT.md` with this release.
- Phase 11 keeps the existing deterministic local Atlas Command system and makes it the dominant Home starting point.
- Phase 11.1 updates the first-time welcome actions and removes the misleading `today-command` wrapper name.
- The storage key remains `lifeops-dashboard-v1` and schema remains `4`.
- No real AI API, cloud service, account system, or external integration was added.

## Phase 10 Notes

- Upload `PHASE10_ONBOARDING_REDESIGN_AUDIT.md` and `tests/onboarding-phase10.test.js` with this release.
- Keep the existing storage key. The app migrates old backups to schema version `4` automatically.
- Phase 10/10.3 adds optional onboarding mission fields, Blueprint Mission buckets, a vertical Life Map progress timeline, first-command state, and the `v2.14.0` friction-reduced setup refinement.
- The first-launch setup is now Today's Biggest Win, Biggest Blocker, Desired Outcome, Optional Deadline, Guidance Style, and Ready.
- Realistic Capacity is no longer a first-launch question. Atlas uses a safe short default estimate and can collect more detail later.
- Complete My Blueprint now lives under Settings and no longer blocks launch.
- Do not upload personal JSON exports or browser localStorage dumps.

## Phase 9 Notes

- Upload the full `js/command/` folder and `tests/command-phase9.test.js` with this release.
- Phase 9 added optional `commandCenter` and `commandHistory` fields to exported backups. Schema 3 backups now migrate onward to schema 4 in v2.11.0.
- Atlas Command Center is local deterministic planning. It is not a remote AI system.
- Do not upload personal JSON exports or browser localStorage dumps.


