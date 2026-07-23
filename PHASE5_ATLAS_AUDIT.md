# LifeOps Phase 5 Atlas Audit

Verified baseline: v1.37.0  
Audit date: 2026-07-23  
Scope: Phase 5 only, local-first Atlas Decision Engine. No remote AI, backend, authentication, cloud sync, new integrations, Life Timeline, or dashboard redesign.

## Current Atlas Architecture

Atlas behavior is still primarily implemented inside `js/app.js`. The files under `js/atlas/` are Phase 4 placeholders and do not currently drive behavior.

Current placeholder files:

- `js/atlas/atlas-engine.js`
- `js/atlas/atlas-scoring.js`
- `js/atlas/atlas-recommendations.js`
- `js/atlas/atlas-explanations.js`

Current Atlas UI is already present in `index.html` and `lifeops-dashboard.html`:

- Onboarding overlay: `#atlasOnboardingOverlay`
- Home command card: `#atlasCommandAction`, `#atlasCommandReason`, `#atlasCommandWhyNow`, `#atlasCommandEvidence`, `#atlasCommandOutcome`
- Decision trace: `#atlasThinkingPriority`, `#atlasCommandChosenOver`, `#atlasCommandDependency`, `#atlasThinkingFreshness`, `#atlasThinkingRisk`, `#atlasThinkingTime`
- Impact strip: `#atlasCommandBenefit`, `#atlasCommandTime`, `#atlasCommandRisk`, `#atlasCommandConfidenceMetric`
- Atlas center panel: `#atlasCenterPanel`
- Companion drawer and chat: `#companionDrawer`
- Legacy Atlas card in the dashboard section: `#atlasRecommendedAction`, `#atlasPriorityList`

## Top-Level Atlas Constants And Variables

- `chatMessages`: mutable session-only companion messages.
- `atlasRecognition`: mutable speech recognition handle for onboarding.
- `startupSteps`: includes the existing startup "Atlas ready" step.
- `defaultCompanionSettings()`: Atlas display and personality defaults.
- `defaultVoiceSettings()`: speech/startup audio preferences.
- `defaultOnboardingSettings()`: onboarding progress, answers, path, and completion state.

Classification: shared app state, onboarding, voice/startup, Atlas.

## Existing Atlas Context Functions

- `atlasFreshnessLabel()`  
  Class: Atlas. Creates a human data freshness label from recent history.

- `atlasConfidence(context)`  
  Class: Atlas. Computes a coarse High/Medium/Low confidence label from available data categories.

- `getAtlasContext()`  
  Class: Atlas / cross-module dependency. Builds a large local context object from profile, finance, nutrition, fitness, wellness, education, career, goals, calendar, recent actions, Life Score, and privacy. This is the main bridge from the monolithic app to Atlas.

- `atlasAction(title, config)`  
  Class: Atlas. Normalizes legacy action-like objects, but not enough for Phase 5 candidate scoring.

Phase 5 plan: keep `getAtlasContext()` as a compatibility bridge for UI, but introduce normalized candidates and decision output in `js/atlas/`.

## Existing Recommendation Logic

- `evaluateAtlasPriorities(context)`  
  Class: Atlas. Hand-authored priority rules for overdue bills, upcoming payments, negative cash flow, nutrition gaps, workout goal, sleep target, education deadlines, career follow-ups, goal actions, privacy review, weakest score fallback, and missing data fallback.

- `atlasPrioritySignals()`  
  Class: legacy Atlas. Similar logic used by the older dashboard Atlas card.

- `atlasRecommendation()`  
  Class: legacy Atlas. Converts priority signals into the old dashboard card shape.

- `nextBestActionText()`  
  Class: legacy Atlas / Life Score. Fallback based mostly on weakest score area and open plan actions.

Phase 5 plan: replace ranking responsibility with `LifeOpsAtlasEngine.generateDecision()`, preserve old functions as adapters/fallbacks where needed, and avoid a user-facing behavior break.

## Existing Explanation And Chat Logic

- `atlasSummaryRows(context, priorities)`
- `atlasIgnoredSignal(priorities)`
- `atlasChosenOverLabel(priorities)`
- `atlasDependencyLabel(action)`
- `atlasRiskLabel(action)`
- `atlasBenefitLabel(context, action)`
- `atlasOutcomeLabel(context, action)`
- `atlasAttentionReason(action)`
- `atlasRowsFromAction(action, context)`
- `atlasUnsupportedRows()`
- `atlasLocalRowsForQuestion(question, context)`
- `formatAtlasRows(rows)`
- `sendAtlasRequest(question, context)`

Class: Atlas explanations / companion local Q&A. These functions are deterministic and local, but the explanation layer is embedded in `js/app.js`.

Phase 5 plan: add `js/atlas/atlas-explanations.js` and call it from existing UI surfaces. Keep unsupported-question behavior honest: no remote AI connection.

## Existing Atlas Rendering

- `renderAtlasCommandCenter(context, priorities, chartStats)`  
  Class: Atlas UI. Populates the new command card and decision trace.

- `atlasStatusRows(context, priorities, chartStats)`
- `atlasDailyBriefRows(context, priorities)`
- `atlasDailyDebriefRows(context, priorities, chartStats)`
- `renderAtlasDashboard()`  

Class: UI / Atlas. These functions should remain in `js/app.js` for Phase 5 integration unless a small helper extraction is low-risk.

Phase 5 plan: update these renderers to use new decision output while preserving the current DOM and layout.

## Existing Atlas Actions

- `applyConfirmedAtlasAction(action)`  
  Class: Atlas action / navigation. Currently only navigates to the related tab.

- `atlasCommandStartBtn` listener  
  Class: event handler / Atlas action. Navigates to `data-open-atlas-tab`.

- `atlasStartTaskBtn` listener  
  Class: event handler / legacy Atlas action. Navigates to related tab.

- `atlasExplainMoreBtn` listener  
  Class: companion / explanation. Opens drawer and appends explanation.

Phase 5 plan: add local action logging and support `start`, `complete`, `snooze`, `dismiss`, `viewSource`, `showAlternatives`, `explain`, and `recalculate` through `js/atlas/atlas-actions.js`. Preserve existing button behavior and add lightweight optional controls if a target area is available.

## Existing Onboarding Logic

- `allAtlasOnboardingQuestions()`
- `atlasEssentialQuestions()`
- `atlasDeepPersonalizationQuestions()`
- `atlasOnboardingQuestions()`
- `atlasOnboarding()`
- `currentAtlasQuestion()`
- `showAtlasOnboardingScreen(screen)`
- `setAtlasOnboardingVisualState(stateName)`
- `openAtlasOnboarding(force)`
- `closeAtlasOnboarding()`
- `renderAtlasOnboardingQuestion()`
- `beginAtlasInterview()`
- `speakAtlasQuestion(text)`
- `stopAtlasRecognition()`
- `startAtlasRecognition()`
- `handleAtlasVoiceCommand(transcript)`
- `applyAtlasOnboardingAnswer(question)`
- `recommendAtlasModules(priorities)`
- `atlasOnboardingNext(skip)`
- `atlasOnboardingAskLater()`
- `atlasOnboardingBack()`
- `completeAtlasOnboarding(skipped)`
- `applyAtlasFinalProfile()`
- `atlasFirstMission(answers)`
- `renderAtlasFinalSummary()`

Class: Atlas onboarding / voice. This remains working and should not be reworked in Phase 5. Phase 5 engine should handle missing or partial onboarding data and produce a setup recommendation when needed.

## Life Tree And Life Score Dependencies

- `treeAreaScore(area, context)`
- `treeAreaRows(area, config, context)`
- `openTreeDetailPanel(area)`
- `lifeScoreParts()`
- `renderLifeScoreExplanation(context, top, chartStats)`
- `lowestScoreArea()`
- `lifeScore()`
- `scoreBreakdown()`

Class: Life Tree / Life Score / shared UI. Atlas currently consumes Life Score as a signal. Phase 5 must document that Life Score is one input, not the sole ranking driver, and avoid circular "lowest score always wins" behavior.

## Import, Export, Reset, And Storage Dependencies

Current storage is centralized in `js/storage.js`; direct `localStorage` access is only allowed there. Atlas currently has no persisted decision history.

Phase 5 decision history requirement creates a new optional local array. Low-risk approach:

- Add `atlasHistory: []` as a safe optional array in default state.
- Add `atlasHistory` to storage validation allowlist.
- Keep `schemaVersion` at 1 because old backups remain valid and the new field is optional/backward-compatible.
- Cap Atlas history length and store only non-sensitive metadata.

## Event Listener Risks

Current Phase 4 guard:

- `eventListenersInitialized` prevents duplicate global listeners.

Atlas listeners currently attach to fixed IDs:

- `#openAtlasOrbBtn`
- `#closeAtlasCenterBtn`
- `#atlasCenterPanel`
- `#atlasCenterAskBtn`
- `#atlasCenterInput`
- `#atlasCommandAskBtn`
- `#atlasCommandStartBtn`
- `#atlasStartTaskBtn`
- `#atlasExplainMoreBtn`

Risk: dynamically adding new Atlas action controls must not attach repeated anonymous listeners during render. Phase 5 should use delegated listeners or static IDs.

## Functions Safe To Move Or Supersede In Phase 5

Safe to supersede with new engine modules while keeping wrappers:

- `evaluateAtlasPriorities`
- `atlasAction`
- `atlasRowsFromAction`
- `atlasChosenOverLabel`
- `atlasRiskLabel`
- `atlasBenefitLabel`
- `atlasOutcomeLabel`
- `atlasAttentionReason`
- parts of `atlasLocalRowsForQuestion`
- parts of `atlasRecommendation`

Must temporarily remain in `js/app.js`:

- `getAtlasContext()` because it depends on many app-local functions and state helpers.
- `renderAtlasCommandCenter()` because it writes existing DOM.
- `renderAtlasDashboard()` because the older dashboard card still depends on existing DOM.
- onboarding and voice functions.
- Life Tree and Life Score functions.

## Duplicated Or Dead-Code Candidates

- `evaluateAtlasPriorities()` and `atlasPrioritySignals()` duplicate several finance, health, career, education, and calendar rules.
- `atlasRecommendation()` is a legacy adapter for the older dashboard card.
- `atlasSummaryRows()` and companion status rows duplicate privacy/freshness/confidence metadata.

These should not be deleted in Phase 5. They can become compatibility wrappers over the new engine.

## Phase 5 Extraction Plan

1. Create a timestamped backup of v1.37.0 files.
2. Add local Atlas modules:
   - `atlas-types.js`
   - `atlas-evidence.js`
   - `atlas-candidates.js`
   - `atlas-scoring.js`
   - `atlas-explanations.js`
   - `atlas-history.js`
   - `atlas-actions.js`
   - `atlas-engine.js`
3. Add scripts to both HTML entry points before `js/app.js`.
4. Add optional `atlasHistory` state support and storage validation.
5. Integrate engine output into:
   - `evaluateAtlasPriorities()`
   - `renderAtlasCommandCenter()`
   - `sendAtlasRequest()`
   - `atlasRecommendation()`
   - `applyConfirmedAtlasAction()`
6. Add repeatable Atlas unit tests with synthetic fixtures only.
7. Update app version and documentation to v1.40.0.

