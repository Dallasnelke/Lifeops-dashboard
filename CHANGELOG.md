# LifeOps Changelog

## v1.60.0 - Phase 7 Timeline Privacy And Local Atlas Memory

Date: 2026-07-23

### Added

- Added `PHASE7_MEMORY_PRIVACY_AUDIT.md`.
- Added `js/timeline/timeline-renderer.js` and moved Timeline DOM rendering, filters, privacy summaries, form parsing, proposal rendering, and Home preview rendering out of `js/app.js`.
- Added `js/memory/` modules for Atlas Memory normalization, actions, conflict resolution, memory engine behavior, and rendering.
- Added `js/modules/memory.js` as the guarded Atlas Memory module controller.
- Added a local Atlas Memory section under More for preferences, corrections, stable facts, routines, temporary context, constraints, communication preferences, milestone summaries, and user instructions.
- Added Atlas correction buttons that let the user save a local correction memory when Atlas uses the wrong assumption.
- Added privacy-safe summary export for local memory and timeline summaries.
- Added `tests/memory-phase7.test.js`.

### Changed

- Timeline privacy controls now include Atlas use, progress summary use, export use, hidden, sensitive, and privacy note fields.
- Sensitive Timeline events and sensitive memories stay out of Atlas by default, but can be explicitly allowed by the user.
- Hidden, disabled, expired, deleted, and superseded memories are excluded from Atlas.
- Atlas explanations now show whether local memory influenced a recommendation.
- Memory conflict grouping now lets explicit corrections supersede older memories with the same category and title.
- The app version is now `v1.60.0`.

### Preserved

- Storage key remains `lifeops-dashboard-v1`.
- Schema version remains `1`.
- Old backups remain compatible; missing `atlasMemory` safely defaults to an empty local list.
- Existing dashboard, Atlas Decision Engine, Life Score, Life Tree, import/export/reset, startup, voice, navigation, and module behavior are preserved.
- No remote AI, backend, authentication, cloud sync, OAuth, external API, analytics, framework, or account system was added.

### Notes

- Atlas Memory is a local user-controlled memory layer, not a remote AI memory service.
- Privacy-safe exports exclude sensitive, hidden, disabled, superseded, and export-blocked details.

## v1.50.0 - Phase 6 Local Life Timeline And Progress Memory

Date: 2026-07-23

### Added

- Added `PHASE6_TIMELINE_AUDIT.md`.
- Added `js/timeline/` modules for normalization, safe event generation, Timeline actions, progress insights, and engine orchestration.
- Added `js/modules/timeline.js` as the Timeline module controller.
- Added normalized Timeline event fields while preserving legacy milestone import compatibility.
- Added optional `timelineProposals` for suggested milestones that need confirmation.
- Added Timeline filters, search, pinned milestones, suggested milestones, progress-memory observations, and "How far I have come" copy summary.
- Added user actions for create, edit, delete, hide, restore, pin, confirm proposal, and reject proposal.
- Added a low-priority Atlas Timeline candidate adapter that excludes hidden and sensitive events.
- Added `tests/timeline-phase6.test.js`.

### Changed

- Timeline rendering now uses the Phase 6 Timeline engine instead of the old generated-row-only renderer.
- Legacy manual milestones are normalized into the new event shape during save/import.
- The app version is now `v1.50.0`.

### Preserved

- Storage key remains `lifeops-dashboard-v1`.
- Schema version remains `1`.
- Old Timeline records and old backups remain compatible.
- Existing Atlas Decision Engine, Life Score, Life Tree, import/export/reset, startup, voice, navigation, and module behavior are preserved.
- No remote AI, backend, authentication, cloud sync, OAuth, external API, analytics, or framework was added.

### Notes

- Timeline observations are local patterns, not diagnoses or proof of causation.
- Sensitive and hidden Timeline events are excluded from Atlas by default.

## v1.40.0 - Phase 5 Local Atlas Decision Engine

Date: 2026-07-23

### Added

- Added `PHASE5_ATLAS_AUDIT.md`.
- Added local Atlas modules for candidate types, evidence, module adapters, scoring, explanations, history, actions, engine orchestration, and recommendation compatibility.
- Added normalized Atlas action candidates across finance, health, goals, education, career, calendar, documents, relationships, and setup completeness.
- Added deterministic scoring with transparent weights for impact, urgency, risk, confidence, freshness, effort, and dependency readiness.
- Added local Atlas action history and candidate preferences for completed, snoozed, and dismissed recommendations.
- Added Atlas Command controls for completing, snoozing, dismissing, viewing alternatives, and recalculating recommendations.
- Added `tests/atlas-phase5.test.js` with synthetic fixtures.

### Changed

- Atlas Command, Ask Atlas, and the legacy Atlas dashboard card now use the same local decision output.
- Existing Atlas UI remains visually intact while the recommendation source is centralized in `js/atlas/`.
- `index.html` and `lifeops-dashboard.html` now load Atlas modules before `js/app.js`.
- App version updated to `v1.40.0`.

### Preserved

- Storage key remains `lifeops-dashboard-v1`.
- Schema version remains `1`.
- Old backups remain compatible; new Atlas fields are optional.
- No remote AI, backend, authentication, cloud sync, OAuth, external API, or framework was added.

### Notes

- Atlas is still local deterministic intelligence, not a connected AI backend.
- Life Score is used as one signal only; Atlas ranking also considers urgency, risk, impact, confidence, freshness, effort, and dependencies.

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
