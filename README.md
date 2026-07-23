# LifeOps

LifeOps is a local-first personal operating system for tracking money, health, goals, career, education, calendar items, habits, documents, relationships, and daily priorities from one premium dashboard.

Current version: `v1.40.0`

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
├── index.html
├── lifeops-dashboard.html
├── lifeops-preview-server.js
├── README.md
├── UPLOAD_NOTES.md
├── CHANGELOG.md
├── .gitignore
├── assets/
│   └── brand/
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── modules.css
│   └── responsive.css
└── js/
    ├── app.js
    ├── state.js
    ├── storage.js
    ├── navigation.js
    ├── ui.js
    ├── atlas/
    │   ├── atlas-types.js
    │   ├── atlas-evidence.js
    │   ├── atlas-candidates.js
    │   ├── atlas-scoring.js
    │   ├── atlas-explanations.js
    │   ├── atlas-history.js
    │   ├── atlas-actions.js
    │   ├── atlas-engine.js
    │   └── atlas-recommendations.js
    └── modules/
        ├── dashboard.js
        ├── finance.js
        ├── health.js
        ├── education.js
        ├── career.js
        ├── goals.js
        ├── calendar.js
        ├── documents.js
        ├── relationships.js
        ├── life-tree.js
        └── settings.js
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

## Backup And Restore

- Use the in-app export tools to download a JSON backup.
- Use import/restore to load a backup into the same browser or another browser.
- Imported JSON should be reviewed before replacing existing data.
- Old backups remain compatible because newer settings are optional and safe defaults are supplied when fields are missing.
- Current storage key remains `lifeops-dashboard-v1`.
- Optional Phase 5 fields `atlasHistory` and `atlasCandidateState` are included in new exports and safely default for old backups.
- `js/state.js` now provides the centralized state interface.
- `js/storage.js` now owns storage keys, safe parsing, loading, saving, schema detection, migration, import validation, export generation, rollback backups, reset, and storage failure handling.
- `js/navigation.js` owns primary navigation, secondary tabs, active states, and page-header coordination.
- `js/ui.js` owns shared formatting, reusable list/card rendering, and modal/focus helpers.
- `js/modules/` contains the first behavior-preserving module controllers for settings, education, career, calendar, documents, and Life Tree controls.
- `js/atlas/` contains the Phase 5 local Atlas Decision Engine, candidate adapters, scoring, explanations, action logging, and local Atlas history helpers.
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

Future public versions will need authentication, a secure backend, encryption planning, permission controls, OAuth review, privacy policy, terms, and platform-specific security work.

## Integrations Roadmap

Planned integrations are placeholders only. They are not connected yet.

- Calendar and tasks: Google Calendar, Apple Calendar, Microsoft Outlook, Google Tasks, Apple Reminders, Todoist
- Health and fitness: Apple Health, Health Connect, Fitbit, Garmin, Strava
- Productivity: Notion, Google Drive, OneDrive, GitHub, Slack, Discord
- Money: Plaid-compatible institutions, PayPal, Venmo, brokerage import, CSV import

Real integrations require secure authentication, user consent, OAuth where applicable, storage protections, disconnect controls, and careful data handling.

## Known Limitations

- Single-file app architecture is convenient but will become harder to maintain as features grow.
- Atlas is rule-based locally, not a real AI backend.
- No real accounts, cloud sync, or multi-device backup.
- Sharing and integrations are local prototypes only.
- Browser startup sound and speech can be blocked until a user interacts with the page.
- Financial, medical, tax, and legal sections organize information only and do not provide professional advice.

## Development Roadmap

1. Strengthen Atlas memory, history comparison, and Life Score explanations.
2. Expand Life Tree category panels into full module command centers.
3. Move dashboard and Life Tree rendering into module files gradually.
4. Expand Atlas history comparison and memory summaries while keeping privacy controls clear.
5. Add secure backend architecture for accounts, cloud backups, and private sync.
6. Add real AI only after permissions, privacy, and data boundaries are clear.
7. Add OAuth integrations gradually, starting with lower-risk calendar and task data.
8. Prepare a production deployment and mobile app strategy.

## Testing Checklist

- Open the app from `index.html`
- Open the app from `lifeops-dashboard.html`
- Start the preview server and load the app
- Run `node tests/storage-phase3.test.js`
- Run `node tests/atlas-phase5.test.js`
- Run `node tests/phase4-runtime-smoke.test.js` when available, or follow the Phase 4 browser smoke checklist in `PHASE4_EXTRACTION_AUDIT.md`
- Test Atlas Command buttons: Do this now, Mark Complete, Snooze, Dismiss, Alternatives, Recalculate, and Ask Atlas
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
