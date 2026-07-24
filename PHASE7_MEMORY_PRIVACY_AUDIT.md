# LifeOps Phase 7 Memory And Privacy Audit

Verified baseline: v1.50.0  
Audit date: 2026-07-23  
Scope: Phase 7 only, Timeline modularization, explicit Timeline privacy controls, and local Atlas Memory. No remote AI, backend, authentication, cloud sync, analytics, framework, or external integration work.

## Remaining Timeline Responsibilities In `js/app.js`

### Timeline Renderer

- `timelinePreviewItems()`  
  Class: Timeline renderer / shared dashboard preview. Reads `LifeOpsTimelineEngine.allEvents(state)`, filters hidden events, and formats preview rows for Home.

- `renderTimelinePreview()`  
  Class: Timeline renderer. Writes Home preview rows into `#homeTimelinePreview`.

- `generatedTimelineItems()`  
  Class: legacy / duplicate. Old generated event builder still remains but should be removed because Phase 6 moved safe generation into `js/timeline/timeline-events.js`.

- `combinedTimelineItems()`  
  Class: legacy / Timeline renderer. Delegates to `LifeOpsTimelineEngine.allEvents(state)` when available and falls back to legacy manual records.

- `timelineFilters()`  
  Class: Timeline controller. Reads Timeline filter DOM fields.

- `setSelectOptions()`  
  Class: shared UI / Timeline helper. Used only by Timeline filter option rendering in current code.

- `syncTimelineFilterOptions()`  
  Class: Timeline renderer. Writes category/type/source/year filter options.

- `timelineActionButton()`  
  Class: Timeline renderer. Creates card action buttons.

- `renderTimelineEventList()`  
  Class: Timeline renderer. Renders Timeline event cards, privacy status, redacted sensitive summaries, and action buttons.

- `renderTimelineProposals()`  
  Class: Timeline renderer. Renders proposed milestone confirmation cards.

- `renderTimeline()`  
  Class: Timeline renderer. Builds the full Timeline section from `LifeOpsTimelineEngine.viewModel()`, progress summary, pinned events, proposals, and filtered list.

### Timeline Controller

- `resetTimelineForm()`  
  Class: Timeline controller. Resets Timeline form fields and conservative privacy defaults.

- `timelineFormEvent()`  
  Class: Timeline controller / privacy policy. Reads create form fields and maps hidden/sensitive flags to include-in-Atlas and include-in-progress defaults.

- `editTimelineEvent(item)`  
  Class: Timeline controller. Opens shared edit modal for a manual Timeline event.

- `handleTimelineAction(action, id)`  
  Class: Timeline controller. Owns edit, pin, hide, restore, delete, confirm proposal, and reject proposal behavior.

### Timeline Event Listeners In `js/app.js`

- `#viewTimelinePreviewBtn`: navigates to the Timeline tab.
- `#openTimelineMilestoneBtn`: navigates to Timeline and focuses title input.
- `#addTimelineBtn`: creates a Timeline event from form fields.
- `#timelineList`: delegated click handler for event actions.
- `#timelinePinnedList`: delegated click handler for pinned event actions.
- `#timelineProposalList`: delegated click handler for proposal actions.
- Timeline filter controls: change listeners for category, type, year, significance, source, origin, sort, range, and show-hidden.
- `#timelineSearchInput`: debounced search listener.
- `#timelineCopySummaryBtn`: copies the "How far I have come" text.

Classification: Timeline controller. These should move into `js/modules/timeline.js` and/or `js/timeline/timeline-renderer.js`.

## Timeline DOM Selectors Still Owned By `js/app.js`

- `#homeTimelinePreview`
- `#timelineList`
- `#timelineSummaryList`
- `#timelineProgressSummaryList`
- `#timelinePinnedList`
- `#timelineProposalList`
- `#timelineHowFarText`
- `#timelineSearchInput`
- `#timelineCategoryFilter`
- `#timelineTypeFilter`
- `#timelineYearFilter`
- `#timelineSignificanceFilter`
- `#timelineSourceFilter`
- `#timelineOriginFilter`
- `#timelineSortSelect`
- `#timelineRangeSelect`
- `#timelineShowHiddenToggle`
- `#timelineTitleInput`
- `#timelineDateInput`
- `#timelineCategoryInput`
- `#timelineEventTypeInput`
- `#timelineSignificanceInput`
- `#timelineRelatedGoalInput`
- `#timelinePrivacyInput`
- `#timelineNoteInput`
- `#timelinePinnedInput`
- `#timelineSensitiveInput`
- `#timelineHiddenInput`
- `#timelineTagsInput`
- `#addTimelineBtn`
- `#openTimelineMilestoneBtn`
- `#timelineCopySummaryBtn`

Classification: Timeline renderer/controller selectors. Move ownership into Timeline module.

## Atlas Reads Timeline Data

- `js/atlas/atlas-candidates.js` has `timelineCandidates()`, which calls `LifeOpsTimelineEngine.atlasSignal(state, { now })`.
- `js/timeline/timeline-engine.js` excludes hidden and sensitive events in `atlasSignal()` by filtering `!item.hidden && !item.sensitive && item.includeInAtlas !== false`.

Classification: Atlas integration / privacy policy. Phase 7 should keep the adapter low priority and add Memory signals separately.

## Summaries Read Timeline Data

- `renderTimeline()` currently renders progress summary rows from `LifeOpsTimelineInsights.buildSummary()`.
- `js/timeline/timeline-insights.js` excludes hidden events and items with `includeInProgress === false`.
- `weeklyReviewReportText()` and monthly/daily report areas use `combinedTimelineItems()` in places such as current-month milestone summaries.
- Home uses `timelinePreviewItems()` to show recent visible events.

Classification: Timeline renderer / privacy policy. Summaries must move to Timeline modules and use explicit include-in-progress rules.

## Hidden Event Handling

- Normalization supports `hidden`.
- `filterEvents()` excludes hidden unless show-hidden is enabled.
- `hideEvent()` sets `hidden: true`, `includeInAtlas: false`, and `includeInProgress: false`.
- `restoreEvent()` sets `hidden: false` and `includeInProgress: true`, but does not automatically re-enable Atlas.
- `atlasSignal()` excludes hidden.

Classification: privacy policy. Good baseline; Phase 7 should add visible aggregate counts and edit controls.

## Sensitive Event Handling

- Normalization supports `sensitive`.
- Sensitive events default to `includeInAtlas: false`.
- Event cards redact sensitive descriptions with a generic message.
- Proposed sensitive events are not automatically published.
- Current UI has a create checkbox for sensitive, but edit modal does not yet expose privacy toggles.

Classification: privacy policy / high-risk. Strengthen edit controls and aggregate panel.

## Export Inclusion Rules

- Timeline events include `includeInExport`, but current JSON export is a full backup through `LifeOpsStorage.exportState()`.
- No privacy-safe summary export exists yet.
- `includeInExport` is not currently used during report export.

Classification: privacy gap. Phase 7 should add privacy-safe export helpers without claiming encryption.

## Import Normalization Rules

- `sanitizeState()` calls `LifeOpsTimelineNormalization.normalizeEvents()` for `state.timeline` and `state.timelineProposals`.
- Storage schema remains `1`.
- Old legacy fields such as `note`, `relatedGoal`, and `privacy` are preserved in normalized fields/metadata.

Classification: import normalization. Continue schema `1` if memory fields are optional and safe defaults are supplied.

## Deletion Behavior

- `deleteEvent()` permanently removes events from the normal Timeline array.
- Deletion uses `confirm()`.
- No deletion recovery branch exists.

Classification: deletion behavior. Permanent delete is acceptable if clearly confirmed.

## Current Atlas History Versus Timeline History

- `state.atlasHistory` logs Atlas action metadata and preferences, not full Timeline memory.
- `state.timeline` stores milestones and normalized Timeline events.
- `state.history` stores daily Life Score and category snapshots.

Classification: distinct local histories. Do not merge destructively.

## Existing Memory Candidates

- `state.profile`: display name, priority, notes, financial targets, health targets, wellness targets. Some fields can become stable facts or goal context, but exact finance/health values can be sensitive.
- `state.onboarding.answers`: explicit answers from setup; useful for user-confirmed preferences and current priorities.
- `state.companion`: Atlas name, tone, personality, form, focus. Useful as communication preferences.
- `state.voice`: voice mode, rate, selection, sound preferences. Useful as accessibility/interaction preferences.
- `state.appearance`: theme/density/effects preferences. Useful as UI preferences.
- `state.dashboardSettings`: visible categories and quick actions. Useful as preference memory.
- `state.atlasCandidateState`: snoozed/dismissed/completed recommendations. Useful as behavior feedback but not a direct memory item.
- `state.timeline`: user-confirmed milestones. Useful as milestone-summary memory only when include-in-Atlas is allowed.
- `state.tasks`, `expenses`, `meals`, `workouts`, `documents`, `relationships`: not safe for automatic memory conversion. Use only with explicit user confirmation.

Classification: Atlas memory candidates. Phase 7 should add a dedicated `state.atlasMemory` branch and not infer sensitive memories automatically.

## Duplicated Or Conflicting Facts

- Profile priority, onboarding priorities, and goals can conflict.
- Companion tone and Atlas involvement level can conflict with later user corrections.
- Timeline milestones can overlap with career/education/goals arrays.
- Atlas snooze/dismiss behavior can conflict with an explicit user correction.

Classification: duplicate/conflict. Memory conflict handling must prefer explicit corrections and newer user-confirmed facts.

## Inferred But Not User-Confirmed Data

- Automatic Timeline events.
- Atlas candidate rankings and priority categories.
- Score-derived weakest/strongest areas.
- Generated progress observations.
- Any "recent win" derived from app state.

Classification: inferred. Do not store as active Atlas Memory without confirmation.

## Privacy Settings And Gaps

Current privacy settings:

- `privacySettings.defaultSharing`
- `privacySettings.voiceSensitiveData`
- `privacySettings.socialSensitiveData`
- `privacySettings.exportWarningAcknowledged`
- Timeline event fields: `hidden`, `sensitive`, `includeInAtlas`, `includeInProgress`, `includeInExport`
- Document fields: `privacy`, `sensitivity`
- Sharing preview permissions: local-only labels

Gaps:

- No Timeline Privacy panel with aggregate counts.
- Timeline edit modal lacks explicit Atlas/progress/export toggles.
- No privacy-safe export helper for Timeline/Memory summaries.
- No Atlas Memory branch.
- No Memory management UI.
- Atlas decision trace does not yet show memory use.
- No correction flow near Atlas explanations.

## Phase 7 Implementation Boundary

Proceed with:

- Move Timeline renderer/controller functions and listeners out of `js/app.js`.
- Add `js/timeline/timeline-renderer.js`.
- Strengthen Timeline normalization with explicit privacy aliases.
- Add Timeline privacy aggregate panel and edit/create controls.
- Add `js/memory/` modules and `js/modules/memory.js`.
- Add optional `state.atlasMemory` branch and conservative normalization.
- Add Memory UI under More/Memory.
- Add low-weight Memory scoring/trace support for Atlas.
- Add tests for Timeline extraction, privacy, Memory normalization/conflicts, and Atlas memory integration.

Do not proceed with:

- Remote AI, backend, auth, cloud sync, analytics, external services, or broad redesign.
