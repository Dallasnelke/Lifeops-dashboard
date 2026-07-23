# LifeOps Changelog

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
