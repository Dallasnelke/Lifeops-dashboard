# LifeOps Phase 4 Extraction Audit

Version before extraction: `v1.36.0`

Date: 2026-07-23

## Scope

Phase 4 extracts navigation, shared UI infrastructure, and module-controller wiring from `js/app.js` without changing user-facing behavior. It does not implement Atlas Brain, redesign the dashboard, add Life Timeline, change storage keys, or change schema version.

## Current Top-Level Constants

- `appVersion`: visible version string.
- `storageKey`: compatibility alias for `LifeOpsStorage.STORAGE_KEYS.primary`.
- `initialStateLoad`: state loaded through `LifeOpsStorage`.
- `stateStore`: store created through `LifeOpsState`.
- `state`: legacy mutable working state reference.
- `chatMessages`: session-only companion messages.
- `startupSteps`: startup overlay progress text.
- `titles`: page header titles and subtitles.
- `headerMeta`: page header icons/status/actions.
- `primaryRoutes`: primary navigation groups and secondary tabs.
- `sectionPrimary`: reverse map from tab to primary section.

## Mutable Variables

- `availableVoices`: browser speech voices.
- `startupHasFinished`: prevents duplicate startup completion.
- `entranceHasPlayed`: prevents dashboard entrance animation replay.
- `audioContext`: Web Audio context.
- `activeStartupOscillators`: currently active startup tone nodes.
- `lastFocusedBeforeModal`: focus restoration target for edit modal.
- `lifeReplayIndex`: current replay card index.
- `lifeReplayTimer`: Life Replay interval handle.
- `barcodeScannerStream`: active camera stream.
- `barcodeScannerTimer`: barcode scan interval.
- `atlasRecognition`: active speech-recognition instance.

## Initialization Sequence

1. Load state through `loadState()`.
2. Create `LifeOpsState` store.
3. Build derived navigation maps.
4. Define default state factories, calculations, rendering, handlers, and UI helpers.
5. Register all event listeners at script evaluation time.
6. Call `render()`.
7. Run startup sequence, falling back to `finishStartup()` if startup fails.

Phase 4 target sequence:

1. Load state through `LifeOpsStorage`.
2. Initialize `LifeOpsState`.
3. Initialize `LifeOpsUI`.
4. Initialize `LifeOpsNavigation`.
5. Initialize module/controller event bindings.
6. Render initial application.
7. Start startup sequence with graceful fallback.

## DOM Query Groups

- Navigation: `.nav button`, `.bottom-nav button`, `[data-open-tab]`, `[data-tree-area]`, `#secondaryNav`, `#pageHeader`.
- Atlas panels: `#atlasCenterPanel`, `#companionDrawer`, `#atlasOnboardingOverlay`, Atlas onboarding controls.
- Life Tree: `#treeDetailPanel`, `#treeMenuToggleBtn`, category buttons.
- Settings: theme, appearance, density, personalization, voice, modules, privacy controls.
- Forms: profile inputs, checks, finance inputs, nutrition inputs, wellness inputs, task/expense/workout/meal/goal forms.
- Module actions: education, career, calendar, documents, connections, timeline, reports, barcode scanner, Life Replay.
- Dialogs: `#editModalBackdrop`, modal fields, barcode scanner backdrop.
- Import/export/reset: `#exportBtn`, `#importBtn`, `#importFileInput`, `#emptyTestBtn`, `#resetBtn`.

## Event Listener Registration

Current listeners are mostly attached directly at the bottom of `js/app.js`. Some listeners are also attached during render helpers:

- Dynamic list templates attach edit/delete/change listeners per row.
- Secondary navigation attaches click listeners every time it is rendered.
- Several dashboard cards attach click handlers after rendering.

Phase 4 extraction should move stable top-level listener registration into module/controller initializers with initialization guards. Dynamic render-time handlers may remain temporarily because moving them requires renderer extraction.

## Function Classification

### Bootstrap

- Current bootstrap is implicit: top-level load, top-level listener binding, `render()`, `runStartupSequence()`.
- Safe to convert into `bootstrapLifeOps()`.

### State

- `defaultCompanionSettings`, `defaultVoiceSettings`, `defaultAppearanceSettings`, `defaultOnboardingSettings`, `defaultPersonalizationSettings`, `defaultPrivacySettings`, `defaultIntegrationPreferences`, `defaultModulePreferences`, `defaultDashboardSettings`, `defaultState`, `emptyState`, `mergeState`, `validateBackupData`, `sanitizeState`, `restoreState`.
- Temporarily remain in `js/app.js` because `LifeOpsStorage` still receives these adapters and several sanitizers are app-shape-specific.

### Storage

- `loadState`, `persistState`, `save`, `downloadText`.
- `loadState` and `persistState` should remain as thin app adapters to `LifeOpsStorage`.

### Navigation

- `renderSecondaryNav`, `renderPageHeader`, `activateTab`.
- `titles`, `headerMeta`, `primaryRoutes`, and `sectionPrimary` are navigation data.
- Safe to move to `js/navigation.js` with a small context API for page-header action handlers and labels.

### Shared UI

- `cleanNumber`, `daysUntil`, `money`, `percent`, `setNumberInput`, `emptyStateConfig`, `createEmptyState`, `renderList`, `itemShell`, `openEditModal`, `closeEditModal`, `focusableElements`, `trapModalFocus`, `renderTextRows`, `renderSummaryCards`, `renderBars`.
- Safe to move several helpers to `js/ui.js`.
- Modal helpers need a context callback for `save()`.

### Module-Specific

- Finance: `cashLeft`, `upcomingPayments`, `totalExpenses`, `moneyHealthScore`, `expenseTemplate`, `editExpense`, `openAddExpenseModal`.
- Health/nutrition: `mealTotals`, `remainingNutrition`, `fitnessCompletion`, `nutritionHealthScore`, barcode scanner, recipe builder, meal modals, workout modals, water/sleep quick actions.
- Goals/rewards/history: missions, rewards, timeline, reviews, Life Replay, snapshot/history helpers.
- Education: education renderers and add modals.
- Career: career renderers and add modals.
- Calendar: calendar renderers and add modal.
- Documents: document renderer and add modal.
- Relationships/connections: connection renderers and shared preview handlers.
- These should remain mostly in `js/app.js` until their renderers are extracted, but stable controller bindings can move into module controller files.

### Atlas

- Atlas onboarding, Atlas command evaluation, companion panels, local coach answers, Atlas page insight, Atlas dashboard.
- High-risk and intentionally left in `js/app.js` for this phase because Atlas Brain is explicitly out of scope.

### Life Tree

- `renderLifeTreeDashboard`, category scoring/rows/narratives, tree detail panel behavior.
- Rendering remains in `js/app.js`; controller wiring can be extracted.

### Life Score

- `lifeScore`, score breakdown, score trend chart, explanation renderers.
- Remains in `js/app.js`; no scoring changes in Phase 4.

### Voice/Startup

- Speech support, startup audio, LifeOps Pulse, startup overlay, voice settings, morning briefing.
- Remains in `js/app.js` except stable control bindings may be initialized by a controller.

### Legacy/Dead Candidates

- Duplicate report/coach row helpers and older dashboard render paths are candidates for later cleanup.
- `storageKey` is a compatibility alias and may be removable later.
- No deletion in Phase 4.

### Unknown/High-Risk

- Helpers shared across Atlas, scoring, modules, and rendering: `recommendedDailyFocus`, `lowestScoreArea`, `formatMetric`, `metricAverage`, `currentSnapshot`, `todayKey`, and similar.
- Keep in place until Atlas/module extraction clarifies ownership.

## Functions Safe To Move In Phase 4

- Navigation data and routing functions.
- Shared formatting helpers that do not mutate state.
- Shared modal/focus helpers with a save callback.
- Stable top-level event listener registration grouped by feature.
- Settings, documents, calendar, relationships, education, career, goals, health, finance controller bindings where they call existing app functions through a context object.

## Functions That Must Temporarily Remain

- `defaultState`, `mergeState`, `sanitizeState`, `restoreState`.
- Atlas recommendation, Atlas onboarding, and companion reasoning functions.
- Life Score calculations and explanations.
- Life Tree rendering and side-panel data generation.
- Startup, voice, Web Audio, and speech synthesis logic.
- Domain renderers that currently write directly into the page.
- Dynamic list row template handlers.

## Cross-Module Dependencies

- Navigation depends on `brandAssetMarkup`, `atlasPageInsight`, and action handlers.
- UI modal helpers depend on `save()` after successful form submission.
- Module controllers depend on existing app functions and the legacy `state` reference.
- Atlas depends on nearly every domain calculation.
- Dashboard rendering depends on Atlas, Life Score, Life Tree, history, modules, and settings.
- Storage adapters depend on app-specific default/merge/sanitize functions.

## Duplicate Or Dead Code Candidates

- Multiple dashboard render paths still coexist: home V2, Today command, full overview, legacy daily summary.
- Coach/Atlas response helpers overlap.
- Report row generation and summary card generation can be consolidated later.
- Several top-level direct listeners can become delegated handlers after renderer extraction.

## Phase 4 Risk Notes

- Moving renderers before controller wiring would be high risk because most renderers read/write shared global state.
- Moving Atlas logic now would conflict with the explicit boundary to not start Atlas Brain.
- The safest immediate win is extracting navigation and event-controller infrastructure while preserving every existing function signature used by the app.

## Phase 4 Completion Notes

Completed version: `v1.37.0`

### New Bootstrap Sequence

`js/app.js` now starts through `bootstrapLifeOps()`:

1. `initializeLifeOpsInfrastructure()`
2. `LifeOpsUI.initialize(...)`
3. `LifeOpsNavigation.initialize(...)`
4. `initializeLifeOpsModuleControllers()`
5. `registerLifeOpsEventListeners()`
6. `render()`
7. `runStartupSequence()`
8. graceful fallback to `finishStartup()` if startup fails

### Functions Moved Or Delegated

- `js/navigation.js`
  - `titles`
  - `headerMeta`
  - `primaryRoutes`
  - `sectionPrimary`
  - `renderSecondaryNav`
  - `renderPageHeader`
  - `activateTab` behavior through `navigateTo`
  - primary sidebar and bottom-navigation click binding
- `js/ui.js`
  - `cleanNumber`
  - `daysUntil`
  - `money`
  - `percent`
  - `setNumberInput`
  - `emptyStateConfig`
  - `createEmptyState`
  - `renderList`
  - `itemShell`
  - `openEditModal`
  - `closeEditModal`
  - `focusableElements`
  - `trapModalFocus`
  - `renderTextRows`
  - `renderSummaryCards`
  - `renderBars`
- `js/modules/settings.js`
  - sidebar collapse control
  - settings-panel tab controls
  - appearance inputs
  - personalization inputs
  - companion settings save
  - voice and startup control bindings
- `js/modules/education.js`
  - education add-button bindings
- `js/modules/career.js`
  - career add-button bindings
- `js/modules/calendar.js`
  - calendar add event and view toggle bindings
- `js/modules/documents.js`
  - document reference add binding
- `js/modules/life-tree.js`
  - Life Tree rail toggle, category panel, open, and quick-add bindings

### Intentionally Left In `js/app.js`

- default state, merge, sanitize, restore adapters
- Atlas onboarding and Atlas command logic
- Life Score formulas and explanation rendering
- Life Tree rendering and data summaries
- startup animation, LifeOps Pulse, speech synthesis, and voice text generation
- domain renderers for finance, health, goals, calendar, career, education, documents, relationships, reports, and dashboard sections
- barcode scanner lifecycle and camera cleanup
- remaining app-level event bindings that still depend on several high-risk shared renderers

### Event Listener Safety

- Navigation, settings, education, career, calendar, documents, and Life Tree controllers now use initialization guards.
- Primary navigation is no longer bound directly in `js/app.js`.
- `registerLifeOpsEventListeners()` is guarded to avoid duplicate app-level listener registration.
- Dynamic list-row listeners remain in render templates temporarily and should be addressed when those renderers move.

### Browser Smoke Checklist Result

- `lifeops-dashboard.html`: pass
- `index.html`: pass by script-order/static checks
- preview server on `127.0.0.1:4198`: pass
- visible app version `1.37.0`: pass
- sidebar navigation to Calendar: pass
- Calendar Add Event modal open/close: pass
- mobile width 390px with bottom navigation: pass
- no console errors: pass
- no visible `undefined`: pass
- no visible `NaN`: pass
- storage tests from Phase 3: pass
- Phase 4 smoke test: pass
