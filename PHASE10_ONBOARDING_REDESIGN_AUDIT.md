# Phase 10 Onboarding Redesign Audit And Plan

Date: 2026-07-25
Starting version: v2.10.0
Target version: v2.11.0
Backup: `backups/lifeops-v2.10.0-before-onboarding-redesign-20260725-142514`

## Current Onboarding Architecture

Current onboarding is implemented primarily in `js/app.js` with DOM markup in both `index.html` and `lifeops-dashboard.html`, and styling in `css/components.css` and responsive overrides in `css/responsive.css`.

Important current functions:

- `defaultOnboardingSettings()`
- `allAtlasOnboardingQuestions()`
- `atlasEssentialQuestions()`
- `atlasDeepPersonalizationQuestions()`
- `atlasOnboardingQuestions()`
- `atlasOnboarding()`
- `openAtlasOnboarding()` / `closeAtlasOnboarding()`
- `renderAtlasOnboardingQuestion()`
- `applyAtlasOnboardingAnswer()`
- `atlasOnboardingNext()` / `atlasOnboardingBack()` / `atlasOnboardingAskLater()`
- `completeAtlasOnboarding()`
- `applyAtlasFinalProfile()`
- `atlasFirstMission()`
- `renderAtlasFinalSummary()`

## Current Long-Form Questions

The old long-form setup contains 34 saved question definitions in `allAtlasOnboardingQuestions()`. The active first-run essential flow contains 12 questions. The new work will replace the first-run flow with 8 missions and preserve the deeper questions as Blueprint Missions.

## State Paths

Current onboarding state path:

- `state.onboarding.completed`
- `state.onboarding.skipped`
- `state.onboarding.mode`
- `state.onboarding.path`
- `state.onboarding.currentStep`
- `state.onboarding.muted`
- `state.onboarding.transcript`
- `state.onboarding.answers`
- `state.onboarding.recommendedModules`
- `state.onboarding.deepCompleted`
- `state.onboarding.completedAt`

Phase 10 will add optional fields under the same `onboarding` object:

- `version`
- `status`
- `startedAt`
- `currentMission`
- `completedMissions`
- `skippedMissions`
- `essentialSetup`
- `lifeMap`
- `firstCommandId`
- `blueprints`

## Storage And Migration

Current storage key is `lifeops-dashboard-v1` and must remain unchanged.

Current schema version is `3`. The new onboarding structure is a persistent data shape change, so schema version `4` is justified. The migration will preserve old onboarding fields and answers, then map useful old answers into `essentialSetup` and Blueprint Mission answers.

## Old Question Mapping

- `mode`: essential setup / Atlas Style, migratable
- `name`, `preferredName`, `age`, `country`, `timezone`, `occupation`, `studentStatus`: Identity and Schedule Blueprint; name/student status also essential when available
- `priorities`: essential setup priority area, migratable
- `monthlyIncome`, `monthlyExpenses`, `savings`, `emergencyFund`, `debt`, `budgetStyle`: Money Blueprint
- `height`, `weight`, `workoutFrequency`, `nutritionGoals`, `sleepGoal`, `medicalReminders`: Health Blueprint
- `school`, `currentClasses`, `learningGoals`: Education Blueprint
- `currentRole`, `targetRole`, `salaryGoal`, `resumeStatus`, `professionalGoals`: Career Blueprint
- `energyRhythm`, `workHours`, `productivityStyle`, `dailyStruggle`: Schedule/Goals Blueprint; dailyStruggle maps to essential blocker when useful
- `privacy`: Privacy Blueprint and essential privacy choices

No useful question is discarded. Redundant first-run questions are moved out of blocking onboarding.

## Integration Points

- Atlas Decision Engine: use `getAtlasContext()` and `evaluateAtlasPriorities()` after applying essential setup.
- Command Center: use `LifeOpsCommandActions.recalculate()` and `LifeOpsCommandActions.start()` for the first command.
- Timeline: add a sparse `LifeOps setup completed` milestone.
- Atlas Memory: only create preference/correction-style memories when privacy choices allow local remembering.
- Life Graph: add meaningful setup nodes and relationships for priority, blocker, goal, deadline, capacity, guidance style, and first command.

## Files To Modify

- `js/app.js`
- `js/storage.js`
- `index.html`
- `lifeops-dashboard.html`
- `css/components.css`
- `css/responsive.css`
- `tests/storage-phase3.test.js`
- `tests/phase4-runtime-smoke.test.js`
- `README.md`
- `CHANGELOG.md`
- `UPLOAD_NOTES.md`

## Files To Create

- `PHASE10_ONBOARDING_REDESIGN_AUDIT.md`
- `tests/onboarding-phase10.test.js`

## Files To Leave Untouched

- Existing Atlas, Timeline, Memory, Graph, and Command Center engine modules unless a test proves an integration bug.
- Brand assets.
- Storage key.

## Regression Risks

- Existing completed users could be forced through onboarding again.
- Old backups could fail if onboarding fields are missing or corrupted.
- First command generation could create a fake command instead of using Command Center.
- Voice controls could clutter the new flow.
- Life Graph could become noisy if every answer becomes a graph node.

## Testing Plan

- Storage migration from legacy/v1/v2/v3 to v4.
- Old onboarding answers map into essential setup and blueprints.
- New mission definitions count is exactly 8.
- Skip/back/complete functions preserve answers.
- First command generation uses Command Center state.
- Runtime smoke and existing phase tests still pass.
- Local preview server returns HTTP 200.
