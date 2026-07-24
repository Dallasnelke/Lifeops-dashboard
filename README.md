# LifeOps

LifeOps is a local-first personal operating system for tracking money, health, goals, career, education, calendar items, habits, documents, relationships, and daily priorities from one premium dashboard.

Current version: `v2.10.0`

## Mission

LifeOps helps a user answer one practical question every day:

What is the next highest-impact thing I should do?

The app connects personal data into a Life Score, Atlas recommendations, a visual Life Tree, daily planning, and simple local reports. The current version is a polished prototype intended for portfolio use and local testing before public release.

## Current Features

- Premium black and gold LifeOps interface
- Atlas companion experience with a local deterministic decision engine
- Atlas Decision Engine focused on the highest-impact next action
- Atlas Command 2.0 with a clearer "what deserves attention now" recommendation, why-now signal, local evidence, expected outcome, decision trace, factor contributions, effort, risk, dependency, confidence, and freshness
- Interactive Life Tree with category side panels
- Local-first Life Timeline and Progress Memory system
- Timeline milestones with normalized event fields, filters, search, pinned items, hidden/sensitive controls, and proposed-event confirmation
- "How far I have come" local progress summary
- Local Atlas Memory with user-controlled preferences, corrections, routines, constraints, conflict handling, sensitive/hidden controls, and privacy-safe summary export
- Life Graph with local nodes, relationships, dependency analysis, leverage scoring, path inspection, privacy-safe export, and Atlas-visible relationship explanations
- Atlas Command Center with durable local commands, source context, plan steps, work sessions, command history, alternatives, and before/after summaries
- Atlas correction flow so users can tell Atlas when a recommendation used the wrong assumption
- Category panels with local summaries, open work, recent signals, privacy status, goals, tasks, and activity
- Life Score trend chart with visible weighted score explanation
- Dashboard focused on Life Score, Atlas recommendation, Today's Plan, Quick Add, finances, upcoming items, and daily reflection
- Finance tracking for income, expenses, bills, savings, emergency fund progress, and cash flow
- Nutrition, meals, macros, food budget, wellness, workouts, steps, habits, and daily checks
- Goals, tasks, weekly actions, history, trends, reports, export tools, and backup/restore
- Education, career, calendar, document, timeline, privacy, connections, sharing, and integrations prototype sections
- Atlas onboarding setup with essential setup and optional deeper personalization
- Local startup animation, LifeOps Pulse, and optional browser voice briefing
- Local data persistence with JSON export and import
- Responsive desktop, tablet, and mobile layout

## Project Structure

```text
.
â”œâ”€â”€ index.html
â”œâ”€â”€ lifeops-dashboard.html
â”œâ”€â”€ lifeops-preview-server.js
â”œâ”€â”€ README.md
â”œâ”€â”€ UPLOAD_NOTES.md
â”œâ”€â”€ CHANGELOG.md
â”œâ”€â”€ .gitignore
â”œâ”€â”€ assets/
â”‚   â””â”€â”€ brand/
â”œâ”€â”€ css/
â”‚   â”œâ”€â”€ variables.css
â”‚   â”œâ”€â”€ base.css
â”‚   â”œâ”€â”€ layout.css
â”‚   â”œâ”€â”€ components.css
â”‚   â”œâ”€â”€ modules.css
â”‚   â””â”€â”€ responsive.css
â””â”€â”€ js/
    â”œâ”€â”€ app.js
    â”œâ”€â”€ state.js
    â”œâ”€â”€ storage.js
    â”œâ”€â”€ navigation.js
    â”œâ”€â”€ ui.js
    â”œâ”€â”€ atlas/
    â”‚   â”œâ”€â”€ atlas-types.js
    â”‚   â”œâ”€â”€ atlas-evidence.js
    â”‚   â”œâ”€â”€ atlas-candidates.js
    â”‚   â”œâ”€â”€ atlas-scoring.js
    â”‚   â”œâ”€â”€ atlas-explanations.js
    â”‚   â”œâ”€â”€ atlas-history.js
    â”‚   â”œâ”€â”€ atlas-actions.js
    â”‚   â”œâ”€â”€ atlas-engine.js
    â”‚   â””â”€â”€ atlas-recommendations.js
    â”œâ”€â”€ command/
    â”‚   â”œâ”€â”€ command-types.js
    â”‚   â”œâ”€â”€ command-context.js
    â”‚   â”œâ”€â”€ command-plan.js
    â”‚   â”œâ”€â”€ command-session.js
    â”‚   â”œâ”€â”€ command-history.js
    â”‚   â”œâ”€â”€ command-engine.js
    â”‚   â”œâ”€â”€ command-actions.js
    â”‚   â””â”€â”€ command-renderer.js
    â””â”€â”€ modules/
        â”œâ”€â”€ dashboard.js
        â”œâ”€â”€ finance.js
        â”œâ”€â”€ health.js
        â”œâ”€â”€ education.js
        â”œâ”€â”€ career.js
        â”œâ”€â”€ goals.js
        â”œâ”€â”€ calendar.js
        â”œâ”€â”€ documents.js
        â”œâ”€â”€ relationships.js
        â”œâ”€â”€ life-tree.js
        â”œâ”€â”€ command-center.js
        â””â”€â”€ settings.js
```

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`
- Local SVG and PNG brand assets
- Optional local Node.js preview server
- Local CSS and JavaScript files loaded directly by the browser

No external APIs, paid services, remote libraries, analytics, bank connections, health integrations, or account systems are active in this version.

## How To Run Locally

Open `index.html` or `lifeops-dashboard.html` directly in a browser, or run:

```bash
node lifeops-preview-server.js
```

Then open:

```text
http://127.0.0.1:4198/lifeops-dashboard.html
```

## Data Storage

LifeOps stores current app data locally in the browser using `localStorage`. Data stays on the current device unless the user exports a JSON backup.

Do not store passwords, banking credentials, Social Security numbers, medical credentials, health portal passwords, API keys, or access tokens in LifeOps.

## Life Timeline, Progress Memory, And Atlas Memory

The Phase 6 Timeline is local-first memory, not a social feed or full activity log.

Timeline events are normalized with fields for date, title, description, category, source module, event type, significance, direction, status, related goal or decision, related Life Score, tags, evidence summary, user confirmation, automatic status, sensitive flag, pinned flag, hidden flag, and metadata.

The Timeline supports add, edit, delete, hide, restore, pin, filters, search, suggested milestones, pinned milestones, progress observations, and a copyable "How far I have come" summary.

Automatic events are intentionally sparse. LifeOps may create safe broad events such as completed goals, onboarding completed, emergency fund target reached, selected career or education milestones, completed Atlas actions, and Life Score threshold crossings. Sensitive or uncertain events become proposals instead of being published automatically.

Timeline observations are labeled as patterns or observations. They do not diagnose behavior and do not claim that one event caused another.

Hidden events do not appear in default views and are excluded from Atlas and progress summaries. Sensitive events are excluded from Atlas by default and show limited details in summaries unless the user explicitly allows a specific item.

Phase 7 adds a local Atlas Memory layer. Memories can store user-controlled preferences, corrections, stable facts, routines, temporary context, constraints, communication preferences, milestone summaries, and user instructions. Atlas Memory stays local, supports hidden and sensitive flags, resolves simple conflicts, and exposes which memories influenced a recommendation.

Sensitive memories do not feed Atlas unless explicitly allowed. Hidden, disabled, expired, deleted, and superseded memories are excluded from Atlas. The privacy-safe summary export excludes sensitive, hidden, disabled, superseded, and export-blocked details.

## Life Graph And Dependency Intelligence

Phase 8 adds a local-first Life Graph. The graph is not a social graph and not a remote AI service. It is a deterministic relationship layer that helps Atlas understand how local goals, tasks, deadlines, milestones, documents, memory, and life areas connect.

The Life Graph includes:

- Normalized graph nodes for goals, tasks, plan actions, deadlines, education items, career items, calendar events, documents, milestones, Atlas Memory, and core life areas.
- Normalized relationship edges such as supports, advances, depends on, blocks, prepares for, protects, evidence for, scheduled by, and part of.
- Manual relationship creation, edit, confirm, hide, delete, and privacy controls.
- Deterministic dependency analysis for blockers, cycles, orphan items, stale relationships, upstream/downstream paths, and leverage scoring.
- A local visual graph view under More -> Life Graph.
- Atlas integration that can add graph candidates and disclose which graph relationships influenced a recommendation.
- Privacy-safe graph export that excludes hidden and sensitive relationships by default.

Graph fields are optional in imports. Older backups migrate safely by adding empty `graphNodes` and `graphEdges` arrays.

## Atlas Command Center

Phase 9 adds a local Atlas Command Center. It does not use remote AI. It converts the current deterministic Atlas recommendation into a durable local command object with:

- why now
- expected outcome
- expected benefit
- evidence summary
- graph, memory, timeline, and Life Score context
- dependencies, blockers, unlocks, and alternatives
- plan steps
- optional local work session
- command history
- before/after result summary

Command context is labeled as recorded fact, user confirmed, inference, stale, missing, or privacy excluded. This is intended to make Atlas feel useful while keeping recommendations auditable.

Phase 9 updates storage to schema version `3` while preserving the existing `lifeops-dashboard-v1` localStorage key. Older backups migrate safely by adding optional `commandCenter` and `commandHistory` fields.
## Backup And Restore

- Use the in-app export tools to download a JSON backup.
- Use import/restore to load a backup into the same browser or another browser.
- Imported JSON should be reviewed before replacing existing data.
- Old backups remain compatible because newer settings are optional and safe defaults are supplied when fields are missing.
- Current storage key remains `lifeops-dashboard-v1`.
- Optional Phase 5 fields `atlasHistory` and `atlasCandidateState` are included in new exports and safely default for old backups.
- Optional Phase 6 field `timelineProposals` is included in new exports and safely defaults for old backups.
- Optional Phase 7 field `atlasMemory` is included in new exports and safely defaults for old backups.
- Phase 8 upgrades storage schema to `2` and adds optional `graphNodes` and `graphEdges` arrays. Old schema `1` and no-schema backups migrate automatically without changing the storage key.
- `js/state.js` now provides the centralized state interface.
- `js/storage.js` now owns storage keys, safe parsing, loading, saving, schema detection, migration, import validation, export generation, rollback backups, reset, and storage failure handling.
- `js/navigation.js` owns primary navigation, secondary tabs, active states, and page-header coordination.
- `js/ui.js` owns shared formatting, reusable list/card rendering, and modal/focus helpers.
- `js/modules/` contains the first behavior-preserving module controllers for settings, education, career, calendar, documents, and Life Tree controls.
- `js/atlas/` contains the Phase 5 local Atlas Decision Engine, candidate adapters, scoring, explanations, action logging, and local Atlas history helpers.
- `js/timeline/` contains the Phase 6 local Timeline normalization, event generation, CRUD helpers, filtering, progress-memory insights, and Atlas-safe timeline signal.
- `js/memory/` contains the Phase 7 local Atlas Memory normalization, actions, conflict resolution, memory engine, and renderer helpers.
- `js/graph/` contains the Phase 8 local Life Graph types, normalization, source-node generation, inferred edges, analysis, actions, imports, engine facade, and renderer helpers.
- `js/modules/graph.js` contains the guarded Life Graph module controller.
- `js/app.js` remains the application coordinator and still contains Atlas UI rendering, Life Score, Life Tree rendering, startup/voice, and domain rendering logic until later extractions.

## Atlas Decision Engine

Atlas is local and deterministic in this version. It does not call a remote AI service.

The Phase 5 engine:

- Collects normalized action candidates from finance, health, goals, career, education, calendar, documents, relationships, and setup completeness.
- Scores candidates using transparent weights for impact, urgency, risk, confidence, freshness, effort, and dependency readiness.
- Excludes completed, dismissed, and actively snoozed recommendations.
- Produces a top action, alternatives, ignored candidates, insufficient-data flags, setup recommendation, decision trace, and summary.
- Logs only local action metadata in `atlasHistory`.
- Stores snoozed, dismissed, and completed recommendation preferences in `atlasCandidateState`.
- Reads concise Timeline signals, Atlas Memory, and Life Graph relationships only when user-controlled privacy settings allow it.
- Shows memory and graph relationship usage in Atlas explanation rows when either local layer affected recommendation ranking.

Life Score is one signal Atlas can consider, but Atlas does not simply choose the lowest score area. Dated obligations, risk, impact, confidence, freshness, effort, and blockers also affect ranking.

## Privacy And Security

LifeOps is local-first in this version.

- No account system is active.
- No cloud database is active.
- No real family sharing is active.
- No real banking integration is active.
- No real health integration is active.
- No real OAuth integration is active.
- No data is transmitted externally by the app.
- Timeline events, Timeline proposals, Progress Memory, Atlas Memory, and Life Graph relationships are stored locally in browser data and exported only when the user exports a JSON backup.
- Privacy-safe summary export excludes sensitive, hidden, disabled, superseded, export-blocked, and Atlas-blocked graph details.

Future public versions will need authentication, a secure backend, encryption planning, permission controls, OAuth review, privacy policy, terms, and platform-specific security work.

## Integrations Roadmap

Planned integrations are placeholders only. They are not connected yet.

- Calendar and tasks: Google Calendar, Apple Calendar, Microsoft Outlook, Google Tasks, Apple Reminders, Todoist
- Health and fitness: Apple Health, Health Connect, Fitbit, Garmin, Strava
- Productivity: Notion, Google Drive, OneDrive, GitHub, Slack, Discord
- Money: Plaid-compatible institutions, PayPal, Venmo, brokerage import, CSV import

Real integrations require secure authentication, user consent, OAuth where applicable, storage protections, disconnect controls, and careful data handling.

## Known Limitations

- The app is now split across local CSS and JavaScript modules, but `js/app.js` still contains a large amount of UI orchestration.
- Atlas is rule-based locally, not a real AI backend.
- No real accounts, cloud sync, or multi-device backup.
- Sharing and integrations are local prototypes only.
- Browser startup sound and speech can be blocked until a user interacts with the page.
- Financial, medical, tax, and legal sections organize information only and do not provide professional advice.
- Timeline dates depend on available local timestamps; older records without completion dates may use target dates or current local state.
- Life Graph relationships are deterministic and inspectable, but inferred links are suggestions and should be reviewed by the user before being treated as confirmed dependencies.

## Development Roadmap

1. Build Phase 9 Atlas Brain UI on top of the local Life Graph, keeping every recommendation explainable and privacy-scoped.
2. Improve Atlas Memory review tools with stronger bulk cleanup and conflict explanations.
3. Expand Timeline, Atlas Memory, and Life Graph use in dashboard explanations while keeping hidden/sensitive exclusions strict.
4. Move dashboard, Life Tree, and remaining Atlas UI rendering further out of `js/app.js`.
5. Expand Life Tree category panels into full module command centers.
6. Add secure backend architecture for accounts, cloud backups, and private sync.
7. Add real AI only after permissions, privacy, and data boundaries are clear.
8. Add OAuth integrations gradually, starting with lower-risk calendar and task data.
9. Prepare a production deployment and mobile app strategy.
## Testing Checklist

- Open the app from `index.html`
- Open the app from `lifeops-dashboard.html`
- Start the preview server and load the app
- Run `node tests/storage-phase3.test.js`
- Run `node tests/atlas-phase5.test.js`
- Run `node tests/timeline-phase6.test.js`
- Run `node tests/memory-phase7.test.js`
- Run `node tests/graph-phase8.test.js`
- Run `node tests/command-phase9.test.js`
- Run `node tests/phase4-runtime-smoke.test.js` when available, or follow the Phase 4 browser smoke checklist in `PHASE4_EXTRACTION_AUDIT.md`
- Test Atlas Command buttons: Do this now, Build Plan, Start Session, Pause, Resume, Stop, Mark Complete, Snooze, Dismiss, Alternatives, Recalculate, and Ask Atlas
- Test Timeline: add, edit, pin, hide, restore, delete, search, filters, proposals, copy summary, and hidden/sensitive behavior
- Test Atlas Memory: add, edit, hide, disable, delete, filters, conflict handling, Correct Atlas, and privacy-safe export
- Test Life Graph: visual graph, filters, manual relationship add/edit/confirm/hide/delete, selected-node explanation, Atlas graph influence, and privacy-safe export
- Navigate every primary section
- Test dashboard, Atlas, Life Tree, right-side cards, and bottom navigation
- Test Life Score explanation
- Test each Life Tree category panel
- Test add, edit, complete, and delete flows
- Test export, import, reset, and old backup compatibility
- Test empty data, invalid numbers, large numbers, missing JSON fields, and corrupted JSON
- Test startup animation, LifeOps Pulse, voice off, voice on, morning briefing, pause, resume, and stop
- Test desktop, tablet, and mobile widths
- Refresh and confirm local data persists
- Confirm no console errors, undefined values, or NaN values

## Version History

- `v2.10.0`: Completed Phase 9 Atlas Command Center and graph-driven planning workspace. Added `PHASE9_COMMAND_CENTER_AUDIT.md`, `js/command/` modules, `js/modules/command-center.js`, durable `commandCenter` and `commandHistory` state, command context from Atlas, Life Graph, Atlas Memory, Timeline, Life Score, tasks, and plan actions, local plan steps, local work sessions, command history, before/after summaries, privacy-safe command export helpers, and `tests/command-phase9.test.js`. Storage schema is now `3`; old backups migrate safely from legacy/v1/v2 while keeping the same `lifeops-dashboard-v1` key.
- `v2.0.0`: Completed Phase 8 local Life Graph and dependency intelligence. Added `PHASE8_LIFE_GRAPH_AUDIT.md`, `js/graph/` modules, `js/modules/graph.js`, graph source nodes, relationship edges, dependency analysis, path inspection, Atlas graph candidates, privacy-safe graph export, and `tests/graph-phase8.test.js`. Storage schema moved to `2`; old backups remain compatible.
- `v1.60.0`: Completed Phase 7 Timeline modularization and local Atlas Memory privacy layer. Added `PHASE7_MEMORY_PRIVACY_AUDIT.md`, `js/memory/` modules, `js/modules/memory.js`, `js/timeline/timeline-renderer.js`, stronger Timeline privacy controls, Atlas correction memory flow, memory conflict resolution, Atlas memory influence explanations, privacy-safe summary export, and `tests/memory-phase7.test.js`. Schema version remains `1`; old backups remain compatible and missing `atlasMemory` safely defaults to an empty local memory list.
- `v1.50.0`: Completed Phase 6 local-first Life Timeline and Progress Memory. Added `PHASE6_TIMELINE_AUDIT.md`, `js/timeline/` modules, `js/modules/timeline.js`, normalized Timeline events, optional `timelineProposals`, safe automatic events, proposal confirmation, Timeline filters/search/pinning/hide/restore/edit/delete, progress-memory observations, "How far I have come" summary, Timeline Atlas signal adapter, and synthetic Timeline tests. Schema version remains `1`; old Timeline records and old backups remain compatible.
- `v1.40.0`: Completed Phase 5 local Atlas Decision Engine. Added `PHASE5_ATLAS_AUDIT.md`, normalized candidates, local candidate adapters, deterministic scoring, evidence helpers, explanations, local Atlas action history, candidate preference state, Atlas action controls, and synthetic Atlas tests. Schema version remains `1`; new Atlas fields are optional and old backups remain compatible.
- `v1.37.0`: Completed Phase 4 navigation, UI infrastructure, and controller extraction. Added `PHASE4_EXTRACTION_AUDIT.md`, moved navigation ownership into `js/navigation.js`, moved shared UI helpers into `js/ui.js`, added guarded module controllers for settings, education, career, calendar, documents, and Life Tree, wrapped app startup in `bootstrapLifeOps()`, preserved schema version `1`, and kept Atlas Brain/dashboard redesign out of scope.
- `v1.36.0`: Completed Phase 3 state and storage foundation. Added centralized `LifeOpsState` and `LifeOpsStorage` APIs, schema versioning, legacy-to-v1 migration, rollback/corrupt-data preservation, storage-owned import/export validation, reset handling, synthetic storage tests, and a Phase 3 audit document.
- `v1.35.0`: Completed Phase 1 audit and Phase 2 modular foundation. Extracted inline CSS into ordered local CSS files, moved the active JavaScript bundle into `js/app.js`, added future module boundary files, preserved `lifeops-dashboard-v1` storage compatibility, and added a changelog.
- `v1.34.1`: Polished Atlas onboarding completion with shorter launch copy, cleaner progress acknowledgements, tighter first-mission language, and responsive final summary chips to prevent cramped wrapping.
- `v1.34.0`: Upgraded Atlas Command into a stronger attention engine with a larger next-action hierarchy, clearer why-now/evidence/outcome signals, and a decision trace that explains what Atlas chose, what it ignored, effort, dependency, risk, confidence, and data freshness.
- `v1.33.1`: Simplified the Atlas welcome and onboarding completion screens, removed the visible Life Score from the completion screen, and made the final launch moment feel calmer and more premium.
- `v1.33.0`: Reframed the top dashboard as the Atlas Command Engine, emphasizing one highest-impact action with why-now reasoning, evidence, chosen-over comparison, dependencies, expected benefit, estimated effort, risk, confidence, and freshness.
- `v1.32.4`: Fixed Life Score explanation row overlap in the narrow side panel.
- `v1.32.3`: Made Atlas Thinking more visible, added expected benefit/time/risk into the reasoning panel, expanded Life Score into a weighted visible explanation, and upgraded Life Tree side panels with local summaries, open work, recent signals, privacy status, goals, tasks, and activity.
- `v1.32.2`: Refined Atlas-first dashboard layout, centered premium Atlas orb, interactive Life Tree behavior, Life Score chart emphasis, black and gold visual polish, and current GitHub upload package.
- `v1.31.x`: Premium dashboard polish, LifeOps branding, Atlas movement, and GitHub packaging iterations.
- `v1.30.x`: Life Tree dashboard concept, Atlas center experience, startup and UI direction.
- `v1.20.x` to `v1.29.x`: Themes, onboarding, voice/startup system, companion UI, connections, integrations, privacy, education, career, calendar, and documents prototype work.
- `v1.0.x`: Core local LifeOps dashboard, finance, habits, workouts, goals, backup/restore, and README foundation.

## Future Monetization Possibilities

- Free local dashboard
- Pro subscription for Atlas memory, advanced reports, forecasting, document understanding, secure sync, and integrations
- Premium family or household plan
- Education, coaching, or employer-focused versions

Ads are not recommended for the core product because privacy and trust are major parts of the LifeOps value.

## Contribution And Development Notes

- Keep data local unless a secure backend is intentionally added.
- Preserve localStorage compatibility.
- Do not commit private JSON backups or personal exports.
- Keep calculations transparent and explainable.
- Avoid speculative investing, trading, gambling, or manipulative reward mechanics.
- Keep the design calm, premium, accessible, and practical.

