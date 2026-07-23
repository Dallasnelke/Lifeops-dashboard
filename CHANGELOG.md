# LifeOps Changelog

## v1.37.0 - Phase 4 Navigation, UI Infrastructure, and Controller Extraction

Date: 2026-07-23

### Added

- Added `PHASE4_EXTRACTION_AUDIT.md`.
- Added `js/navigation.js` as the owner of primary navigation, secondary tabs, active states, and page-header rendering.
- Added `js/ui.js` as the owner of shared formatting helpers, reusable list/card renderers, edit modal behavior, and modal focus trapping.
- Added guarded module controllers for settings, education, career, calendar, documents, and Life Tree controls.
- Added explicit `bootstrapLifeOps()`, shared-infrastructure initialization, and module-controller initialization.

### Changed

- `js/app.js` now delegates navigation to `LifeOpsNavigation`.
- `js/app.js` now delegates shared UI helpers to `LifeOpsUI`.
- Top-level startup is now coordinated through a guarded bootstrap function.
- Stable module controls are initialized once through module-controller APIs instead of remaining as ungrouped app-level bindings.
- `index.html` and `lifeops-dashboard.html` now load navigation, UI, and module-controller scripts before `js/app.js`.

### Preserved

- Storage key remains `lifeops-dashboard-v1`.
- Schema version remains `1`.
- Existing data, imports, exports, reset behavior, startup, voice controls, Atlas onboarding, Atlas command, Life Score, Life Tree, dashboard visuals, navigation labels, and module renderers are preserved.

### Notes

- Atlas Brain, dashboard redesign, Life Timeline expansion, integrations, cloud sync, and storage-schema changes were intentionally not included.
- Some high-risk renderers and Atlas/Life Score logic remain in `js/app.js` until Phase 5.

## v1.36.0 - Phase 3 State, Storage, and Migration Foundation

Date: 2026-07-23

### Added

- Added `js/state.js` centralized state store.
- Added `js/storage.js` storage adapter.
- Added schema version `1` support.
- Added legacy/no-schema to v1 migration.
- Added rollback backup storage before migration, import, reset, and full state replacement.
- Added corrupted raw-data preservation.
- Added storage-owned import validation and export generation.
- Added `tests/storage-phase3.test.js` with synthetic fixtures.
- Added `PHASE3_STORAGE_AUDIT.md`.

### Changed

- `js/app.js` now loads state through `LifeOpsStorage.loadState()`.
- `js/app.js` now persists through `LifeOpsStorage.saveState()`.
- Import parsing now uses `LifeOpsStorage.parseImportText()`.
- Backup validation now uses `LifeOpsStorage.validateImportData()`.
- Export now uses `LifeOpsStorage.exportState()`.
- Reset now uses `LifeOpsStorage.resetState()`.

### Preserved

- Primary storage key remains `lifeops-dashboard-v1`.
- Existing saved data remains compatible.
- Existing UI, Atlas onboarding, Life Tree, Life Score, navigation, startup, voice controls, import/export flow, and dashboard behavior are preserved.

### Notes

- `js/app.js` still keeps the legacy mutable working state object for behavior compatibility.
- Future phases should move direct mutations into state API calls gradually by module.

## v1.35.0 - Phase 1 Audit and Phase 2 Modular Foundation

Date: 2026-07-23

### Added

- Created local `css/` architecture with ordered stylesheet files:
  - `variables.css`
  - `base.css`
  - `layout.css`
  - `components.css`
  - `modules.css`
  - `responsive.css`
- Created local `js/` architecture:
  - `app.js`
  - `state.js`
  - `storage.js`
  - `navigation.js`
  - `ui.js`
  - `atlas/`
  - `modules/`
- Added placeholder module boundary files for future Phase 3 and Phase 4 extraction.
- Added this changelog.

### Changed

- Moved the active JavaScript behavior from the inline HTML script block into `js/app.js`.
- Moved the inline CSS into local CSS files while preserving source order.
- Updated `lifeops-dashboard.html` to load local CSS and JavaScript files.
- Updated README project structure and version history.

### Preserved

- Existing `localStorage` key: `lifeops-dashboard-v1`.
- Current data shape and backup compatibility.
- Existing visual identity, navigation, Atlas onboarding, Life Tree, Life Score, import/export, startup, voice controls, and dashboard behavior.

### Notes

- This is a behavior-preserving modular foundation, not a full logic rewrite.
- `js/app.js` remains the active app bundle. Later phases should move state, storage, Atlas scoring, navigation, and module renderers into the prepared files in controlled steps.
