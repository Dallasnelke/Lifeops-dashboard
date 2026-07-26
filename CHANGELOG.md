# LifeOps Changelog

## v2.14.3 - Centered Atlas Companion Welcome

Date: 2026-07-26

### Changed

- Enlarged and recentered the Atlas welcome orb.
- Tightened the first-launch card into a true centered companion greeting stack.
- Increased the soft gold core glow and ring depth so the first screen reads more clearly.

### Preserved

- Existing onboarding state, setup questions, Ready screen, button handlers, storage key, schema `4`, import/export behavior, and old backup compatibility are preserved.

## v2.14.2 - Atlas Greeting Refinement

Date: 2026-07-26

### Changed

- Added a minimal visible Atlas greeting: "Let's get started."
- Kept the first screen interaction-led with the animated clickable Atlas orb as the primary focus.
- Added a subtle listening/thinking pulse to make Atlas feel more alive without adding fake AI behavior.

### Preserved

- Existing onboarding state, setup questions, Ready screen, button handlers, storage key, schema `4`, import/export behavior, and old backup compatibility are preserved.

## v2.14.1 - Interactive Atlas Welcome

Date: 2026-07-26

### Changed

- Reworked the first Atlas welcome screen into an interaction-first entry moment.
- Centered the Atlas emblem, made it clickable, narrowed the welcome card, and removed visible explanatory setup copy.
- Renamed the secondary launch action from "Launch with Defaults" to "Skip for now".
- Added a subtle gold breathing glow and ring motion behind the Atlas emblem.

### Preserved

- Existing onboarding state, setup questions, Ready screen, storage key, schema `4`, import/export behavior, Atlas branding, Command Center, Life Graph, Timeline, and old backup compatibility are preserved.
- No backend, cloud sync, account system, external AI service, framework, or paid dependency was added.

## v2.14.0 - Atlas Onboarding Friction Reduction

Date: 2026-07-26

### Changed

- Removed Realistic Capacity from first-launch onboarding.
- Kept a safe 15-minute default estimate internally so Atlas can still produce a useful first mission.
- Improved the Ready screen payoff with clearer "Start here" copy, one stronger mission card, and cleaner summary chips for priority, action, estimated time, and reason.
- Updated onboarding tests, version labels, README, and upload notes.

### Preserved

- Existing storage key, schema `4`, import/export behavior, Blueprint in Settings, Atlas branding, black/gold theme, Command Center, Life Graph, Timeline, and old backup compatibility are preserved.
- No backend, cloud sync, account system, external AI service, framework, or paid dependency was added.

## v2.13.0 - First-Principles Atlas Onboarding

Date: 2026-07-25

### Changed

- Rebuilt first-launch Atlas onboarding into six focused questions plus one Ready screen.
- Replaced early category-choice screens with large text areas for Today's Biggest Win, Biggest Blocker, and Desired Outcome.
- Replaced the right-side Life Map card grid with a vertical progress timeline that only expands completed answers.
- Added a dedicated Realistic Capacity screen with a time slider and Low/Medium/High energy choices.
- Simplified guidance choices to Light Guidance, Balanced, and Coach Mode.
- Kept Blueprint outside launch under Settings, where it now saves one optional answer at a time.
- Updated onboarding defaults, timing helpers, Life Map labels, tests, and documentation for the new flow.

### Preserved

- Existing Atlas branding, black/gold theme, Ready screen, Command Center, Life Graph, Timeline, Atlas Memory, storage key, schema `4`, import/export behavior, and old backup compatibility are preserved.
- No backend, cloud sync, account system, external AI service, remote API, analytics, framework, or paid dependency was added.

## v2.12.0 - Atlas Onboarding Master Refactor

Date: 2026-07-25

### Changed

- Reduced first-launch Atlas onboarding from eight essential missions to seven focused screens: Today's Win, Biggest Blocker, Desired Outcome, Optional Deadline, Available Time, Energy Level, and Guidance Style.
- Removed launch-blocking review, privacy, and first-command screens from initial setup.
- Simplified the Ready screen so it shows only the mission, today's priority, recommended action, estimated time, why Atlas chose it, and the Launch Atlas action.
- Moved Complete My Blueprint out of first launch and into Settings.
- Added safe default assumptions so users can skip onboarding and still launch Atlas with a useful local command.
- Updated Live Life Map labels and compact layout to reflect the seven setup signals.
- Updated button wiring with guarded listeners and removed the old Traditional Forms diversion from the main setup path.

### Preserved

- Existing Atlas branding, black/gold theme, Live Life Map, Mission card, Ready screen, Command Center, Life Graph, Timeline, Atlas Memory, storage key, schema `4`, import/export behavior, and old backup compatibility are preserved.
- No backend, cloud sync, account system, external AI service, remote API, analytics, framework, or paid dependency was added.

## v2.11.0 - Phase 10 Atlas Onboarding Missions And Live Life Map

Date: 2026-07-25

### Added

- Added `PHASE10_ONBOARDING_REDESIGN_AUDIT.md` documenting the old onboarding flow, state paths, migration plan, and old-question mapping.
- Added `tests/onboarding-phase10.test.js` to guard the eight essential missions, live Life Map markup, schema 4 migration, and first-command wiring.
- Added an eight-mission Atlas onboarding flow: Today's Win, Main Blocker, Important Outcome, Realistic Capacity, Atlas Style, Life Map, Privacy, and First Command.
- Added a visible live Life Map panel during onboarding on desktop and a compact responsive layout on mobile.
- Added onboarding integration with the real Atlas Command Center, Life Graph, Timeline, and optional Atlas Memory.

### Changed

- Storage schema is now `4` while preserving the existing `lifeops-dashboard-v1` storage key.
- Schema `3` backups migrate to schema `4` by preserving old onboarding answers and moving detailed answers into Blueprint Mission buckets.
- The first launch setup now focuses on one useful local command instead of a long questionnaire.
- Voice controls and transcript stay hidden unless voice mode is active.
- The app version is now `v2.11.0`.

### Preserved

- Existing dashboard, navigation, storage rollback/corrupt preservation, import/export/reset, Atlas Decision Engine, Command Center, Life Graph, Timeline, Atlas Memory, startup, voice controls, and module behavior are preserved.
- No backend, cloud sync, account system, remote AI service, OAuth, analytics, framework, or paid dependency was added.

### Notes

- Blueprint Missions are optional follow-up data buckets. They do not block first launch.
- Atlas Memory only receives onboarding context when the user explicitly allows local memory during setup.
## v2.10.0 - Phase 9 Atlas Command Center And Graph-Driven Planning Workspace

Date: 2026-07-24

### Added

- Added `PHASE9_COMMAND_CENTER_AUDIT.md`.
- Added `js/command/` modules for command types, context assembly, plan steps, work sessions, history, engine orchestration, actions, and rendering.
- Added `js/modules/command-center.js` as the guarded Atlas Command Center module controller.
- Added durable local `commandCenter` and `commandHistory` state.
- Added command context from the Atlas Decision Engine, Life Graph, Atlas Memory, Life Timeline, Life Score, open tasks, and plan actions.
- Added local command plan steps, work session lifecycle, command alternatives, command history, and before/after summaries.
- Added privacy-safe command export helper behavior.
- Added `tests/command-phase9.test.js`.

### Changed

- Storage schema is now `3` while preserving the existing `lifeops-dashboard-v1` storage key.
- Legacy/no-schema backups migrate through schema `1`, schema `2`, and schema `3`.
- Schema `2` backups migrate to schema `3` with optional `commandCenter` and `commandHistory` defaults.
- The existing Atlas command card now renders a focused command workspace without changing the dashboard route or core business logic.
- The app version is now `v2.10.0`.

### Preserved

- Existing dashboard, Atlas Decision Engine, Life Score, Life Tree, Timeline, Atlas Memory, Life Graph, import/export/reset, startup, voice, navigation, and module behavior are preserved.
- No remote AI, backend, authentication, cloud sync, OAuth, external API, analytics, framework, or account system was added.

### Notes

- Atlas Command Center is deterministic local planning, not a remote AI assistant.
- Command context is labeled as recorded fact, user confirmed, inference, stale, missing, or privacy excluded.
- Sensitive details are not copied into command history by default.
## v2.0.0 - Phase 8 Local Life Graph And Dependency Intelligence

Date: 2026-07-23

### Added

- Added `PHASE8_LIFE_GRAPH_AUDIT.md`.
- Added `js/graph/` modules for graph types, normalization, source-node generation, inferred edges, analysis, paths, actions, import validation, engine orchestration, and rendering.
- Added `js/modules/graph.js` as the guarded Life Graph module controller.
- Added a Life Graph section under More for visual graph review, filters, selected-item explanations, manual relationship creation, relationship management, and privacy-safe export.
- Added graph source nodes for local goals, tasks, plan actions, expenses, education, career, calendar, documents, timeline events, Atlas Memory, and core life areas.
- Added deterministic graph insights for blockers, cycles, orphan items, stale relationships, upstream/downstream paths, and leverage scoring.
- Added Atlas graph candidates and graph relationship influence rows in Atlas explanations.
- Added `tests/graph-phase8.test.js` and optional `tests/browser-phase8-smoke.js`.

### Changed

- Storage schema is now `2` while preserving the existing `lifeops-dashboard-v1` storage key.
- Legacy/no-schema backups migrate to schema `1`, then schema `1` backups migrate to schema `2` with empty `graphNodes` and `graphEdges` arrays.
- Future exports include optional `graphNodes` and `graphEdges` arrays.
- Privacy-safe summary export can include a privacy-filtered graph summary.
- The app version is now `v2.0.0`.

### Preserved

- Existing dashboard, Atlas Decision Engine, Life Score, Life Tree, Timeline, Atlas Memory, import/export/reset, startup, voice, navigation, and module behavior are preserved.
- No remote AI, backend, authentication, cloud sync, OAuth, external API, analytics, framework, or account system was added.

### Notes

- Life Graph is local deterministic dependency intelligence, not a remote AI memory system.
- Hidden and sensitive graph nodes or relationships are excluded from Atlas by default unless explicitly allowed.
- Inferred graph relationships are explainable suggestions and can be confirmed, hidden, edited, or deleted by the user.
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





