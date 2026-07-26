# Phase 11 Atlas-First Experience Audit

Date: 2026-07-26

## Goal

Refocus the current LifeOps experience around the product promise:

> LifeOps stores the user's life. Atlas determines the next useful move.

This checkpoint avoids a risky rewrite. The existing local Atlas Command Engine, command history, Life Score, Life Tree, Timeline, onboarding, storage, and import/export systems are preserved.

## Current Architecture Observed

- `index.html` and `lifeops-dashboard.html` are duplicate entry files and both need to stay synchronized.
- `js/app.js` remains the largest coordinator file and still contains onboarding rendering, dashboard rendering, Life Score calculation, Life Tree rendering, Atlas panel behavior, startup, voice, and many event registrations.
- `js/state.js` owns centralized state access.
- `js/storage.js` owns localStorage and schema migration. Storage key remains `lifeops-dashboard-v1`.
- `js/command/` already contains the current local Atlas Command architecture:
  - `command-types.js` normalizes command and history shapes.
  - `command-engine.js` converts the current Atlas priority into a durable command.
  - `command-actions.js` starts, pauses, completes, snoozes, dismisses, corrects, and updates command plan steps.
  - `command-renderer.js` writes command state into the existing dashboard UI.
  - `command-history.js`, `command-plan.js`, `command-session.js`, and `command-context.js` support the command loop.
- `js/modules/command-center.js` provides event delegation for the command workspace and avoids rebinding duplicate workspace listeners.
- `js/modules/dashboard.js` is still a placeholder; dashboard rendering has not yet been extracted from `js/app.js`.

## Onboarding Logic

Current onboarding still lives primarily in `js/app.js`:

- `atlasEssentialQuestions`
- `atlasDeepPersonalizationQuestions`
- `atlasOnboardingQuestions`
- `atlasOnboarding`
- `renderAtlasLifeMap`
- `renderAtlasOnboardingQuestion`
- `atlasOnboardingNext`
- `atlasOnboardingAskLater`
- `atlasOnboardingBack`
- `completeAtlasOnboarding`
- `renderAtlasFinalSummary`

Risk: extracting onboarding in one pass would touch several saved-state and startup paths. This should be the next dedicated architecture checkpoint, not mixed with visual command hierarchy work.

## Dashboard And Atlas Command Logic

Home/Today command logic exists in these areas:

- `renderAtlasCommandCenter(context, priorities, chartStats)` in `js/app.js`
- `renderHomeScreen()`
- `renderHomeV2()`
- `renderAtlasDashboard()`
- `LifeOpsCommandRenderer.render(state)` in `js/command/command-renderer.js`
- `LifeOpsModules.commandCenter` in `js/modules/command-center.js`

The command already supports:

- recommended action
- why now
- evidence summary
- expected outcome
- expected benefit
- estimated minutes
- risk if ignored
- confidence
- freshness
- alternatives
- command plan
- command history
- command session state

Gap: the UI does not yet make this the unmistakable first decision on the Home screen.

## Life Score Logic

Life Score still lives in `js/app.js`:

- `lifeScore()`
- `lifeScoreParts()`
- `renderLifeScoreExplanation(context, top, chartStats)`

The current score is transparent but still visually competes with the command in the side panel. The safest improvement is presentation hierarchy first, then extraction later.

## Native Browser Dialogs Found

Native dialogs remain in:

- `js/app.js`
- `js/modules/timeline.js`
- `js/modules/graph.js`
- `js/modules/memory.js`

Examples include unsupported barcode scanning alerts, import validation alerts, restore confirmations, empty-data confirmations, timeline delete confirmations, graph delete confirmations, and memory delete confirmations.

Risk: replacing all native dialogs should be a dedicated modal migration checkpoint because it touches destructive actions, import/restore, and multiple modules.

## Local Storage And Data Safety

- Current storage key remains `lifeops-dashboard-v1`.
- Current schema remains schema `4`.
- New work in this checkpoint should not introduce a schema migration.
- Command state already persists through existing `commandCenter` and `commandHistory` fields.

## Event Listener Risks

- `js/modules/command-center.js` uses `root.dataset.bound` and event delegation for workspace actions.
- Several top-level listeners in `js/app.js` are still direct bindings.
- Dynamic dashboard rows still attach individual click listeners during render in places.
- Full duplicate-listener cleanup should happen when onboarding and dashboard modules are extracted.

## Safe Implementation Plan For This Checkpoint

1. Preserve storage, scoring, timeline, onboarding, and command business logic.
2. Make the Atlas Command card visually and semantically lead Home with a clear `START HERE` framing.
3. Add visible command labels for Priority, Recommended Action, Why Now, Evidence, Expected Benefit, Estimated Time, Risk If Ignored, and Confidence.
4. Change the primary command action label from `Do this now` to `Start Command`.
5. Improve command renderer output so the title and priority area stay in sync with the active command.
6. Reduce Life Score side-panel dominance without removing it.
7. Update documentation and version to `v2.15.0`.
8. Run existing tests and browser smoke checks.

## Deferred Work

- Extract onboarding into `js/modules/onboarding.js`.
- Extract Life Score into a dedicated module.
- Replace all `alert()`, `confirm()`, and `prompt()` calls with premium modal APIs.
- Move dashboard rendering out of `js/app.js`.
- Tighten remaining direct render-time event listeners.
