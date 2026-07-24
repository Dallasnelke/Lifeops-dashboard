# Phase 8 Life Graph Audit

Date: 2026-07-23
Current verified version before changes: v1.60.0
Target version: v2.0.0

## Scope

Phase 8 adds a local-first Life Graph and dependency intelligence system. The graph answers how goals, tasks, decisions, milestones, constraints, deadlines, documents, memory, and life areas connect. It must stay deterministic, inspectable, local-first, privacy-aware, and user-controlled.

## Existing Relationship-Like Data

### Goals and Subgoals
- Source fields: `goals[].id`, `goals[].name`, `goals[].area`, `goals[].targetDate`, `goals[].progress`.
- Relationship quality: explicit goal records, inferred category relationships.
- Classification: explicit, safe to migrate, user-entered, sometimes stale if no update date.
- Graph use: create `goal` nodes and connect them to `life_area` nodes with `contributes_to` or `part_of` edges.

### Tasks and Parent Goals
- Source fields: `tasks[].area`, `planActions[].goal`, `planActions[].area`, `planActions[].deadline`, `planActions[].impact`, `planActions[].done`.
- Relationship quality: `planActions[].goal` is manually entered text, not a stable ID.
- Classification: explicit task/action records, ambiguous goal link, safe for inferred/proposed edges only when text matches.
- Graph use: create `task` nodes. Connect to matching goals when title/name text is similar; otherwise connect to matching life area.

### Recurring Actions and Daily Checks
- Source fields: `checks`, `profile.workoutGoal`, `profile.stepGoal`, water/sleep targets, habits implied by tasks and workouts.
- Classification: inferred, low-risk for broad category support, unsuitable for causation.
- Graph use: create `habit` or `routine` nodes only when visible user records exist; connect with `supports` to Health/Fitness/Wellness.

### Dependencies
- Existing direct dependency fields are limited. Atlas candidates have dependency status fields, but persisted source modules rarely store dependency arrays.
- Classification: mostly missing or inferred.
- Graph use: user-created edges and deterministic inferred dependencies only; proposed edges for uncertain relationships.

### Atlas Candidate Source Entities
- Source fields: `sourceModule`, `sourceEntityId`, `navigationTarget`, `supportingEvidence`, `actionType`.
- Classification: explicit runtime relationship, not persisted as source records.
- Graph use: Graph can enrich Atlas candidates by matching source module/entity IDs. Do not persist raw candidate payloads.

### Timeline Links
- Source fields: `timeline[].relatedGoalId`, `timeline[].relatedDecisionId`, legacy `relatedGoal`, `sourceModule`, `sourceEntityId`.
- Classification: explicit when ID exists; ambiguous when text-only; sensitive when event is sensitive; hidden when hidden.
- Graph use: create `milestone` nodes for visible Timeline items; edges to related goal/decision if safe and valid.

### Memory Links
- Source fields: `atlasMemory[].sourceEntityId`, `source`, `category`, `type`, privacy fields.
- Classification: explicit source when ID exists, user-controlled, sensitive possible.
- Graph use: create `memory`, `constraint`, or `resource` nodes only when not hidden and privacy allows. Memory can support Atlas explanations but must not expose sensitive value text.

### Atlas History
- Source fields: `atlasHistory[].candidateId`, `candidateTitle`, `category`, `sourceModule`, action, timestamps.
- Classification: explicit decision/action metadata, local, low-risk if titles are non-sensitive.
- Graph use: create `decision` nodes and `evidence_for` edges to matching source nodes where available.

### Life Score Categories
- Source areas: Money, Nutrition, Fitness, Wellness, Goals, Daily Checks and broader Life Tree domains.
- Classification: inferred and calculated, safe as `life_area` nodes.
- Graph use: create stable life area nodes and connect domain objects to them.

### Career Applications and Interviews
- Source fields: applications, interviews, contacts, goals, skills, achievements.
- Classification: explicit, user-entered, privacy marked.
- Graph use: create `career_opportunity`, `deadline`, `goal`, `resource`, and `milestone` nodes. Interviews can `prepares_for` or `scheduled_by` career opportunities when safe.

### Education Courses and Deadlines
- Source fields: courses, assignments, exams, goals, costs.
- Classification: explicit, user-entered, privacy marked.
- Graph use: create `education_item` and `deadline` nodes. Assignments and exams can be `part_of` courses.

### Finance Goals, Bills, Debts, Savings Targets, Purchases
- Source fields: profile savings/emergency targets, expenses, bill/debt payment types, goal areas.
- Classification: explicit for amounts and dates; sensitive by domain.
- Graph use: create broad `financial_goal`, `deadline`, `debt`, and `savings_goal` nodes with redacted summaries. Avoid exposing exact amounts in graph explanations unless source UI already shows them.

### Health Goals, Workouts, Habits, Appointments, Routines
- Source fields: workouts, meals, profile health targets, wellness checks, calendar/document records.
- Classification: explicit but health-sensitive possible.
- Graph use: create broad health nodes and support edges; no medical inference or diagnosis.

### Calendar Events
- Source fields: `calendarEvents[].id`, title, date, category, source, privacy.
- Classification: explicit, user-entered, may be personal or sensitive.
- Graph use: create `calendar_event` or `deadline` nodes and `scheduled_by` edges to matching tasks/goals only when safe.

### Documents and Renewal Dates
- Source fields: documents title, category, date, related, privacy, sensitivity.
- Classification: explicit, sensitivity-labeled.
- Graph use: create `document` nodes for non-hidden records; redact sensitive titles in Atlas-safe views; create proposed edges to related fields.

### Relationship Contacts and Follow-Ups
- Source fields: connections, groups, shared goals/lists/challenges/plans, career contacts.
- Classification: prototype/local preview; sensitive social context possible.
- Graph use: create relationship nodes only with conservative labels. No motive or emotional inference.

### Onboarding Goals and Setup Items
- Source fields: onboarding answers, recommended modules, profile priorities.
- Classification: explicit answers, local; some fields personal.
- Graph use: setup items can become low-risk `setup_item` nodes and connect to life areas.

### Dashboard Priorities
- Source fields: `profile.priority`, `profile.notes`, `profile.tomorrowFocus`.
- Classification: explicit but free-text.
- Graph use: create a `setup_item` or `goal` context node only in broad terms.

### Life Tree Relationships
- Source: visual categories and category scores.
- Classification: inferred structure, safe broad categories.
- Graph use: creates stable `life_area` nodes and category grouping.

## Identifier Audit

- Most arrays have `id` fields. `connections` use `connectionId`.
- Some relationship fields are text-only: `planActions.goal`, `timeline.relatedGoal`, `documents.related`.
- Duplicate IDs are possible from imported JSON and must be normalized.
- Missing IDs are common in legacy or manually edited backups and must be filled deterministically where possible or generated safely.

## Privacy Audit

- Hidden Timeline and Memory items must not create visible or Atlas-active graph nodes.
- Sensitive Timeline, Memory, Documents, Health, Finance, Legal/Tax-like, and Relationship records require redaction and conservative defaults.
- Graph export must exclude hidden nodes/edges and redact sensitive node titles and edge explanations unless explicitly allowed.

## Safe Phase 8 Migration

- `graphNodes` and `graphEdges` are new persisted arrays.
- Existing v1.60.0 backups can migrate by adding empty arrays.
- Derived nodes/edges are generated at runtime from current state and should not duplicate raw source data.
- User-created nodes/edges persist in `graphNodes` and `graphEdges`.
- Schema should increment to `2` because persisted graph arrays are a meaningful new data shape.

## Implementation Classification

- Safe to migrate: explicit ids, user-created graph edges, confirmed Timeline links, non-hidden non-sensitive broad domain objects.
- Ambiguous: text-only goal/document links, inferred category matching, stale due dates.
- Sensitive/high-risk: medical, legal, tax, relationship motive, financial causation, exact private amounts, documents marked Sensitive.
- Unsuitable: hidden records, deleted records, unsupported external integration claims, raw credentials, unconfirmed causation.

## High-Risk Areas To Guard

- Do not infer sensitive relationships automatically.
- Do not claim causation unless relationship type is user-confirmed.
- Do not allow edge count alone to dominate Atlas decisions.
- Do not let cyclic blocked items rank as normal actionable work.
- Do not expose hidden/sensitive data through Atlas, exports, graph labels, or summaries.
