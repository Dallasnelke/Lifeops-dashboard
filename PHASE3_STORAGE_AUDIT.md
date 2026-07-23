# LifeOps Phase 3 State and Storage Audit

Version: `v1.36.0`

Date: 2026-07-23

## Scope

Phase 3 centralized state, storage, import/export validation, schema detection, and migration handling. It did not redesign the dashboard, implement Atlas Brain, add a backend, or change user-facing navigation.

## Storage Keys Found

- `lifeops-dashboard-v1`: Primary persisted LifeOps state. Preserved for backward compatibility.
- `lifeops-dashboard-v1-rollback`: Local rollback copy created before migration, import, reset, or full state replacement.
- `lifeops-dashboard-v1-corrupt`: Local preservation copy for unreadable or invalid saved raw data.

No other application storage keys were found in code.

## Direct Storage Access

All direct `localStorage` reads, writes, and removes now live in `js/storage.js`.

Remaining `localStorage` mentions outside `js/storage.js` are user-facing explanatory copy only.

## Previous Persistence Map

- App startup called `loadState()` inside `js/app.js`.
- `loadState()` read `lifeops-dashboard-v1` directly.
- `save()` wrote `JSON.stringify(state)` directly.
- Several onboarding and integration paths wrote directly without using `save()`.
- Import parsed JSON directly in the file input handler.
- Export stringified `state` directly.
- Reset removed `lifeops-dashboard-v1` directly.

## Current Persistence Map

- `js/storage.js`
  - owns canonical storage keys
  - safely parses JSON
  - loads saved state
  - saves current state
  - exports JSON
  - validates imported data
  - detects schema versions
  - runs migration pipeline
  - creates rollback backups
  - preserves corrupted raw data
  - handles unavailable storage and quota failures
- `js/state.js`
  - owns the state store interface
  - provides `getState()`, `getStateSnapshot()`, `replaceState()`, `updateState()`, `updateStatePath()`, `subscribe()`, `unsubscribe()`, and `notifySubscribers()`
- `js/app.js`
  - still contains the active app behavior bundle
  - initializes through `LifeOpsStorage.loadState()`
  - creates a state store through `LifeOpsState.createStore()`
  - persists through `persistState()` and `LifeOpsStorage.saveState()`
  - validates imports through `LifeOpsStorage.validateImportData()`

## Migration Map

Current schema version: `1`

- Legacy/no schema version -> schema version `1`
  - Adds `schemaVersion: 1`.
  - Merges saved data over safe defaults.
  - Preserves unknown fields where practical.
  - Sanitizes known numeric, list, date, settings, onboarding, voice, appearance, module, dashboard, education, career, calendar, document, relationship, and sharing fields.
  - Creates a rollback copy before saving migrated data.

No higher-version migrations are currently needed.

## Import Validation Behavior

The storage adapter distinguishes:

- valid current backup
- valid older backup requiring migration
- partially valid backup that can be normalized
- invalid or unrelated JSON
- corrupted JSON

Import flow:

1. Parse JSON safely.
2. Validate shape.
3. Run migration if needed.
4. Normalize and sanitize.
5. Preserve existing confirmation flow.
6. Create rollback backup.
7. Replace in-memory state only after validation succeeds.
8. Save migrated state.

## State Categories

Persisted user data:

- profile
- checks
- tasks
- expenses
- workouts
- meals
- saved meals
- recipes
- barcode captures
- goals
- plan actions
- history
- timeline
- connections and sharing prototypes
- education
- career
- calendar
- documents
- companion
- voice
- appearance
- personalization
- privacy
- integrations
- modules
- dashboard settings
- onboarding

Temporary UI-only state remains in `js/app.js`:

- chat session messages
- available browser voices
- startup flags
- audio context and oscillators
- modal focus reference
- replay timer/index
- barcode scanner stream/timer

## Known Legacy Boundary

`js/app.js` still uses a legacy mutable `state` object internally so all existing modules continue working. The centralized state store wraps that same object for now. Phase 4 or the next extraction phase should move logic gradually into module files and replace direct mutations with `updateState()` / `updateStatePath()` in small tested steps.

## Test Coverage Added

Synthetic test file:

- `tests/storage-phase3.test.js`

Covered:

- brand-new user with no saved state
- legacy backup without schema version
- partial nested objects
- malformed JSON
- unrelated JSON
- invalid list field
- export and re-import round trip
- localStorage quota failure
- state subscriber notification

No personal data is included in the fixtures.
