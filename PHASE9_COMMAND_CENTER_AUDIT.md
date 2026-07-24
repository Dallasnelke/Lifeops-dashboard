# LifeOps Phase 9 Command Center Audit

Date: 2026-07-24
Starting version: v2.0.0
Target version: v2.10.0
Backup created: `backups/lifeops-v2.0.0-before-phase9-20260724-075113`

## Scope

Phase 9 builds the Atlas Command Center and graph-driven planning workspace. The phase must preserve existing local-first behavior, current storage key, current UI identity, navigation, Atlas Decision Engine, Life Graph, Memory, Timeline, onboarding, voice/startup, import/export, and existing forms.

No backend, remote AI, OAuth, cloud sync, framework, or external dependency is introduced.

## Current Architecture

- `js/app.js` remains the primary application coordinator and still contains legacy dashboard rendering, Atlas chat, onboarding, score, voice, startup, modal forms, and many event listeners.
- `js/state.js` owns the centralized in-memory state facade and subscription API.
- `js/storage.js` owns localStorage, backup export/import, shape validation, rollback/corrupt-data handling, and schema migration. Current schema is `2`.
- `js/navigation.js` owns section activation, route sync, secondary nav, and header rendering.
- `js/ui.js` owns shared rendering helpers, modals, focus behavior, status/toast output, formatting helpers, and reusable controls.
- `js/atlas/` contains the Phase 5 deterministic Atlas Decision Engine, candidate generation, scoring, explanations, evidence, and candidate actions.
- `js/timeline/` contains Phase 6 local milestones, proposals, insights, renderer, and timeline-to-Atlas signals.
- `js/memory/` contains Phase 7 local Atlas Memory, reinforcement, conflict handling, renderer, and privacy-safe export helpers.
- `js/graph/` contains Phase 8 Life Graph normalization, source-node extraction, analysis, Atlas graph signals, rendering, and privacy-safe export helpers.
- `js/modules/` contains thin controllers for settings, documents, calendar, relationships, education, career, goals, health, finance, dashboard, life tree, timeline, memory, and graph.

## Existing Atlas Command-Like Behavior

`js/app.js` already includes a transient command UI:

- `getAtlasContext()`
- `currentAtlasDecision()`
- `atlasCandidateToAction()`
- `atlasAction()`
- `evaluateAtlasPriorities()`
- `renderAtlasCommandCenter()`
- `renderTodayCommand()`
- `atlasRowsFromAction()`
- `atlasLocalRowsForQuestion()`
- `updateCurrentAtlasAction()`
- `showAtlasAlternatives()`
- `openAtlasCorrectionModal()`
- `recalculateAtlasDecision()`

The existing UI shows:

- Next highest impact action
- Why now
- Evidence
- Expected result
- Confidence
- Chosen over
- Dependency
- Freshness
- Risk if ignored
- Effort
- Alternatives/correct/recalculate buttons

Current limitation: these values are rendered directly from the current decision and are not represented as a durable command object with command lifecycle, plan steps, work session, source context, command history, or before/after summary.

## DOM Targets Already Present

The main tree dashboard in `index.html` and `lifeops-dashboard.html` contains these useful Phase 9 targets:

- `#atlasCommandTitle`
- `#atlasCommandConfidence`
- `#atlasCommandAction`
- `#atlasCommandReason`
- `#atlasCommandWhyNow`
- `#atlasCommandEvidence`
- `#atlasCommandOutcome`
- `#atlasCommandStartBtn`
- `#atlasCommandAskBtn`
- `#atlasCommandCompleteBtn`
- `#atlasCommandSnoozeBtn`
- `#atlasCommandDismissBtn`
- `#atlasCommandAlternativesBtn`
- `#atlasCommandCorrectBtn`
- `#atlasCommandRecalculateBtn`
- `#atlasCommandChosenOver`
- `#atlasCommandDependency`
- `#atlasThinkingFreshness`
- `#atlasThinkingRisk`
- `#atlasThinkingTime`
- `#atlasCommandBenefit`
- `#atlasCommandTime`
- `#atlasCommandRisk`
- `#atlasCommandConfidenceMetric`

Safe additive DOM targets can be inserted inside the existing Atlas command card for:

- command plan builder
- work session status
- command history
- before/after summary
- command context provenance

## State And Storage Audit

Current persisted Atlas-related fields:

- `atlasHistory` array
- `atlasMemory` array
- `atlasCandidateState` object
- `graphNodes` array
- `graphEdges` array
- `timeline` array
- `timelineProposals` array

Current storage schema:

- `CURRENT_SCHEMA_VERSION = 2`
- schema v2 adds Life Graph arrays
- allowed arrays do not include command history
- allowed objects do not include command center settings/session

Phase 9 needs persisted command lifecycle data. This requires schema v3 because new durable state fields are added:

- `commandCenter` object
- `commandHistory` array

## Proposed Phase 9 State Fields

`commandCenter`:

- `activeCommand`
- `lastCompletedCommand`
- `currentSession`
- `availableMinutes`
- `energyPreference`
- `lastGeneratedAt`
- `lastViewedAt`
- `plansByCommandId`

`commandHistory`:

- concise local metadata about generated, started, planned, paused, resumed, completed, snoozed, dismissed, corrected, recalculated, and session events

No passwords, tokens, banking credentials, health credentials, or remote identifiers will be added.

## Existing Context Sources

Atlas command context can be built from:

- Atlas candidate and decision trace: `LifeOpsAtlasEngine.generateDecision`
- Atlas explanation rows: `LifeOpsAtlasExplanations`
- Life Graph: `LifeOpsGraphEngine.build`, `LifeOpsGraphEngine.atlasSignal`, `LifeOpsGraphEngine.applyToCandidates`
- Memory: `LifeOpsMemoryEngine.activeForAtlas`, `LifeOpsMemoryEngine.atlasSignal`
- Timeline: `LifeOpsTimelineEngine.atlasSignal`, `LifeOpsTimelineEngine.viewModel`
- Life Score helpers in `js/app.js`
- Calendar/task/plan/finance/health/education/career arrays in state

Context records must be classified as:

- recorded fact
- user confirmed
- inference
- stale
- missing
- privacy excluded

## Functions Safe To Add

Safe new module files:

- `js/command/command-types.js`
- `js/command/command-context.js`
- `js/command/command-plan.js`
- `js/command/command-session.js`
- `js/command/command-history.js`
- `js/command/command-actions.js`
- `js/command/command-engine.js`
- `js/command/command-renderer.js`
- `js/modules/command-center.js`

Safe `js/app.js` changes:

- version constant
- default/empty/merge/sanitize state additions
- module initialization list
- shared context additions for command module
- render hook for the command module
- legacy Atlas command button event handler adjustments only where needed

## Functions To Temporarily Leave In `js/app.js`

These are high-risk to move during Phase 9 because many existing panels, buttons, and reports depend on them:

- `getAtlasContext()`
- `evaluateAtlasPriorities()`
- `renderAtlasCommandCenter()`
- `renderTodayCommand()`
- `renderHomeScreen()`
- `renderLifeScoreExplanation()`
- `setAtlasCenterPanel()`
- `atlasLocalRowsForQuestion()`
- onboarding, startup, and voice functions
- legacy modal form functions

Phase 9 can use these through deliberate context hooks without extracting them.

## Event Listener Risks

Current `registerLifeOpsEventListeners()` attaches named and inline handlers once behind `eventListenersInitialized`. The Phase 9 module should:

- use a one-time initialization guard
- use event delegation for new command buttons
- avoid adding listeners during render
- avoid extra document-level Escape handlers
- call shared modal/focus helpers where possible

## Privacy Risks And Controls

Risks:

- command evidence could accidentally expose sensitive document notes or exact financial amounts in exports
- inferred relationships between domains could be mistaken for facts
- stale memory could be presented too strongly

Controls:

- context rows include source type and freshness
- command exports use privacy-safe summaries
- sensitive document notes are not copied into command history
- exact sensitive values are not spoken automatically
- graph, memory, and timeline context is labeled local-only

## Test Plan

Required tests:

- command object normalization
- command context assembly
- plan step add/edit/reorder/complete/skip/delete
- session start/pause/resume/stop/complete
- command actions complete/snooze/dismiss/recalculate
- graph/memory/timeline context labels
- v2 to v3 migration
- old backup import compatibility
- privacy-safe export behavior
- no undefined/NaN output in command render
- browser runtime smoke for both HTML entry points

## Implementation Decision

Do not create a separate visual redesign. Phase 9 will upgrade the current Atlas command card into a durable command center and add local command state, plan, session, history, and before/after support. This keeps the premium black/gold UI intact and reduces risk.
