# LifeOps Phase 6 Timeline Audit

Verified baseline: v1.40.0  
Audit date: 2026-07-23  
Scope: Phase 6 only, local-first Life Timeline and Progress Memory System. No remote AI, backend, authentication, cloud sync, external integrations, analytics, or framework changes.

## Existing Timeline Surface

- `index.html` and `lifeops-dashboard.html` include a `#timeline` tab under the Goals primary route.
- The current Timeline UI has a permanent "Add Manual Milestone" form with title, date, category, related goal, privacy, note, and `#addTimelineBtn`.
- `#timelineSummaryList` displays static summary rows.
- `#timelineList` displays manual timeline records plus generated timeline rows.
- Existing manual records use a legacy shape: `id`, `title`, `date`, `category`, `note`, `relatedGoal`, `privacy`.
- Existing generated rows are not stored. They are built from current expenses, meals, workouts, education assignments/exams, career follow-ups, calendar events, completed goals, Atlas recommendation, and latest history snapshot.

Classification: suitable for migration, but the stored manual array needs normalized event fields. Generated rows contain useful signals but must be filtered to avoid spam and sensitive details.

## Atlas Decision History

- `state.atlasHistory` is an optional array added in Phase 5.
- Atlas history records action metadata such as action id, title, category, action type, status, and timestamp.
- It is sanitized in `sanitizeState()` and capped at the latest records.
- It does not store full private source data.

Classification: suitable for timeline signals only when an action is completed or confirmed. Low-priority for Atlas recommendations. Avoid surfacing snoozes/dismissals as milestones.

## Task Completion History

- `state.tasks` stores current tasks with `id`, `name`, `area`, and `done`.
- No completion timestamp exists.
- Task data is useful for current module state, but not reliable as a dated milestone.

Classification: suitable only for detailed module history unless future tasks gain completion timestamps. Missing timestamp.

## Goal Progress History

- `state.goals` stores `id`, `name`, `area`, `targetDate`, and `progress`.
- Goal completion can be inferred when `progress >= 100`.
- Completion date is not explicitly recorded, so current implementation uses `targetDate` or today's date in generated rows.

Classification: suitable for safe automatic timeline events when completed, with clear wording that the date is from target date or current local state. Deduplicate by goal id.

## Finance History

- `state.expenses` stores bills, variable expenses, and debt payments with amount and optional due date.
- `state.profile` stores income, savings, current savings, and emergency target.
- `state.history` stores daily money score and food-cost snapshots.
- The old generated timeline creates a row for every dated expense, including amount.

Classification: many finance details are sensitive. Upcoming payments belong in Finance, Calendar, or Atlas decision evidence, not default Timeline. Only broad milestones such as emergency fund target reached or debt payoff confirmed are suitable for automatic Timeline. Exact amounts should not be surfaced in timeline summaries by default.

## Health And Habit History

- `state.meals`, `state.workouts`, `state.checks`, and `state.profile` hold nutrition, workout, wellness, and habit data.
- Most health records do not include dates.
- The old generated timeline creates one row for every meal and workout using today's date.

Classification: meals/workouts are useful module activity but too noisy for Timeline. Health details may be sensitive. Only user-confirmed major health milestones or safe aggregate milestones should appear in Timeline.

## Education And Career History

- Education arrays: courses, assignments, exams, goals, costs.
- Career arrays: applications, interviews, contacts, goals, skills, achievements.
- Some records include dates, statuses, progress, and privacy fields.
- Old generated timeline includes education deadlines and career follow-up dates.

Classification: selected completions, applications, interviews, achievements, and education milestones are suitable when privacy is Private and content is concise. Deadlines alone are better shown in Calendar/Upcoming unless user confirms they are meaningful.

## Calendar History

- `state.calendarEvents` stores title, date, category, source, privacy, and notes.
- Calendar events are useful for upcoming plans, but not every event should be a milestone.

Classification: suitable only when user marks an event as meaningful or when a future module confirms completion. Otherwise detailed module history / upcoming schedule.

## Document Activity

- `state.documents` stores local document references and sensitivity metadata.
- Document records can include sensitive categories.

Classification: high-risk for Timeline. Only safe document renewal/completion milestones should be proposed, not automatically published.

## Relationship Activity

- Connection and sharing prototype arrays include local profiles, groups, shared lists, shared goals, shared challenges, and shared plans.
- Current app clearly labels these as local previews.

Classification: relationship data can be sensitive. Keep out of automatic Timeline unless user manually creates a milestone or confirms a proposal.

## Dashboard Reflections

- Weekly/daily review surfaces read from current data and history.
- Reflections are not persisted as independent dated records.

Classification: missing timestamp and stable object model. Not a Phase 6 automatic source.

## Life Score Trend Data

- `state.history` stores dated daily snapshots with Life Score and category scores.
- Current generated timeline creates a "Life Score snapshot" from the latest history entry.

Classification: useful for progress insights and threshold-crossing events. Do not create a timeline event for every snapshot. Only threshold crossings or meaningful changes should be automatic.

## Existing Generic Activity Arrays

- There is no single generic activity log.
- Timeline currently acts as the generic milestone array.
- Atlas history is separate and should remain separate.

Classification: no destructive migration needed. Keep dedicated `state.timeline` and add optional `state.timelineProposals`.

## Event Timestamps

- Strong date support: `history.date`, expenses `dueDate`, education assignments `dueDate`, education exams `date`, career follow-up/interview dates, calendar events `date`, documents `date`, timeline `date`.
- Weak/missing timestamp support: tasks, meals, workouts, daily checks, some goals, some achievements.

Classification: missing timestamps should not produce automatic dated milestones.

## Duplicated Logs

- Existing generated rows can duplicate Calendar, Education, Career, Goals, and History surfaces.
- Completed goals can appear as both goal progress and generated timeline.
- Atlas recommendation can appear daily and become noisy.

Classification: generated events must be deduplicated by source module, source entity id, event type, and date. Atlas recommendations should become proposals or low-priority signals only when completed.

## LocalStorage And Import/Export Behavior

- Storage key remains `lifeops-dashboard-v1`.
- `schemaVersion` is currently `1`.
- `js/storage.js` allows arrays including `history`, `timeline`, and `atlasHistory`.
- Import validation requires known LifeOps signals and validates array/object field types.
- Export includes the entire current state plus schema version.
- Rollback and corrupt-data preservation are already handled by the storage adapter.

Classification: Phase 6 can keep schema version `1` if new timeline fields are optional and old events are normalized into the same `state.timeline` branch. Add `timelineProposals` as an optional array without changing the storage key.

## Existing Timeline Placeholder Gaps

- No normalized event schema.
- No edit, hide, pin, restore, sensitivity, tags, event type, or significance fields.
- No search, filters, pinned milestones, year filtering, or source filtering.
- No "How far I have come" view.
- No progress-memory calculations.
- No proposed-event confirmation flow.
- No Timeline-specific Atlas candidate adapter.
- Automatic generated events are too broad and include low-value actions.

## Migration Risk

- Low risk: normalizing legacy manual timeline records in place.
- Medium risk: changing generated timeline behavior because current users may expect generated rows. Mitigation: retain generated events in the view through a safe Timeline engine rather than storing every generated row.
- High risk: automatically surfacing sensitive finance, health, document, or relationship details. Mitigation: mark uncertain events as proposals, hide sensitive details from summaries, and exclude hidden/sensitive events from Atlas by default.

## Phase 6 Implementation Boundary

Proceed with:

- New `js/timeline/` modules for normalization, event generation, insights, actions, and engine orchestration.
- Optional `state.timelineProposals` branch.
- Normalization of `state.timeline` and `state.timelineProposals`.
- Timeline UI controls for search, filters, sorting, pinned milestones, progress memory, and milestone actions.
- Low-priority Atlas candidate adapter using safe timeline signals only.

Do not proceed with:

- Remote AI.
- Cloud sync.
- Real integrations.
- Authentication.
- Broad dashboard redesign.
- Storing raw sensitive source details in Timeline.
