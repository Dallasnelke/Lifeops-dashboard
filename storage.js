/* LifeOps storage adapter.
   Owns localStorage keys, parsing, migration, validation, import/export,
   rollback creation, and calm failure handling. */
(function () {
  const CURRENT_SCHEMA_VERSION = 3;
  const STORAGE_KEYS = Object.freeze({
    primary: "lifeops-dashboard-v1",
    rollback: "lifeops-dashboard-v1-rollback",
    corrupt: "lifeops-dashboard-v1-corrupt"
  });

  const allowedArrays = [
    "tasks", "expenses", "workouts", "meals", "savedMeals", "recipes", "barcodeCaptures",
    "goals", "planActions", "history", "timeline", "timelineProposals", "connections", "connectionGroups",
    "sharedLists", "sharedGoals", "sharedChallenges", "sharedPlans", "educationCourses",
    "educationAssignments", "educationExams", "educationGoals", "educationCosts",
    "careerApplications", "careerInterviews", "careerContacts", "careerGoals",
    "careerSkills", "careerAchievements", "calendarEvents", "documents", "atlasHistory", "atlasMemory", "graphNodes", "graphEdges", "commandHistory"
  ];

  const allowedObjects = [
    "profile", "checks", "companion", "voice", "appearance", "personalization",
    "privacySettings", "integrationPreferences", "modulePreferences",
    "dashboardSettings", "onboarding", "atlasCandidateState", "commandCenter"
  ];

  function storageAvailable() {
    try {
      const testKey = "__lifeops_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn("LifeOps storage is unavailable.", error);
      return false;
    }
  }

  function safeParseJSON(raw) {
    if (typeof raw !== "string" || !raw.trim()) {
      return { ok: false, status: "empty", message: "No JSON content was found." };
    }
    try {
      return { ok: true, data: JSON.parse(raw) };
    } catch (error) {
      return { ok: false, status: "corrupted-json", message: "This file could not be read as valid JSON.", error };
    }
  }

  function readRaw(key = STORAGE_KEYS.primary) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn("LifeOps could not read local storage.", error);
      return null;
    }
  }

  function writeRaw(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return { ok: true };
    } catch (error) {
      const quota = error?.name === "QuotaExceededError" || error?.code === 22;
      console.warn("LifeOps could not write local storage.", error);
      return {
        ok: false,
        status: quota ? "quota-exceeded" : "storage-unavailable",
        message: quota
          ? "LifeOps could not save because browser storage is full."
          : "LifeOps could not save in this browser session.",
        error
      };
    }
  }

  function createRollbackBackup(state, reason = "manual") {
    const payload = {
      createdAt: new Date().toISOString(),
      reason,
      storageKey: STORAGE_KEYS.primary,
      state
    };
    return writeRaw(STORAGE_KEYS.rollback, JSON.stringify(payload));
  }

  function preserveCorruptRaw(raw) {
    if (!raw) return;
    writeRaw(STORAGE_KEYS.corrupt, JSON.stringify({
      createdAt: new Date().toISOString(),
      storageKey: STORAGE_KEYS.primary,
      raw
    }));
  }

  function detectSchemaVersion(data) {
    const version = Number(data?.schemaVersion);
    return Number.isFinite(version) && version > 0 ? Math.floor(version) : 0;
  }

  function migrateLegacyToCurrent(data) {
    return {
      ...data,
      schemaVersion: 1
    };
  }

  function migrateV1ToV2(data) {
    return {
      ...data,
      graphNodes: Array.isArray(data.graphNodes) ? data.graphNodes : [],
      graphEdges: Array.isArray(data.graphEdges) ? data.graphEdges : [],
      schemaVersion: 2
    };
  }

  function migrateV2ToV3(data) {
    return {
      ...data,
      commandCenter: data.commandCenter && typeof data.commandCenter === "object" && !Array.isArray(data.commandCenter)
        ? data.commandCenter
        : {
          activeCommand: null,
          lastCompletedCommand: null,
          currentSession: null,
          availableMinutes: 30,
          energyPreference: "Medium",
          lastGeneratedAt: "",
          lastViewedAt: "",
          plansByCommandId: {}
        },
      commandHistory: Array.isArray(data.commandHistory) ? data.commandHistory : [],
      schemaVersion: 3
    };
  }

  function runMigrations(data) {
    let migrated = { ...data };
    const fromVersion = detectSchemaVersion(migrated);
    const migrations = [];
    if (fromVersion === 0) {
      migrated = migrateLegacyToCurrent(migrated);
      migrations.push("legacy-to-v1");
    }
    if (detectSchemaVersion(migrated) === 1 && CURRENT_SCHEMA_VERSION >= 2) {
      migrated = migrateV1ToV2(migrated);
      migrations.push("v1-to-v2-life-graph");
    }
    if (detectSchemaVersion(migrated) === 2 && CURRENT_SCHEMA_VERSION >= 3) {
      migrated = migrateV2ToV3(migrated);
      migrations.push("v2-to-v3-command-center");
    }
    if (detectSchemaVersion(migrated) > CURRENT_SCHEMA_VERSION) {
      return {
        ok: false,
        status: "future-schema",
        message: "This backup was created by a newer LifeOps version."
      };
    }
    migrated.schemaVersion = CURRENT_SCHEMA_VERSION;
    return { ok: true, data: migrated, fromVersion, toVersion: CURRENT_SCHEMA_VERSION, migrations };
  }

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function validateShape(data) {
    if (!isPlainObject(data)) {
      return { ok: false, status: "invalid", message: "The selected file is not a valid LifeOps backup object." };
    }
    const knownSignals = ["profile", "tasks", "expenses", "goals", "history", "onboarding", "appearance", "voice", "dashboardSettings"];
    if (!knownSignals.some(key => key in data)) {
      return { ok: false, status: "unrelated-json", message: "This JSON file does not look like a LifeOps backup." };
    }
    const invalidArray = allowedArrays.find(key => key in data && !Array.isArray(data[key]));
    if (invalidArray) {
      return { ok: false, status: "invalid-field", message: `The backup field "${invalidArray}" must be a list.` };
    }
    const invalidObject = allowedObjects.find(key => key in data && !isPlainObject(data[key]));
    if (invalidObject) {
      return { ok: false, status: "invalid-field", message: `The backup field "${invalidObject}" must be an object.` };
    }
    return { ok: true };
  }

  function normalizeState(data, adapters) {
    const base = adapters.defaultState();
    const migrated = runMigrations(data);
    if (!migrated.ok) return migrated;
    const merged = adapters.mergeState(base, migrated.data);
    const normalized = adapters.sanitizeState(merged);
    normalized.schemaVersion = CURRENT_SCHEMA_VERSION;
    return {
      ok: true,
      data: normalized,
      status: migrated.migrations.length ? "migrated" : "current",
      fromVersion: migrated.fromVersion,
      toVersion: CURRENT_SCHEMA_VERSION,
      migrations: migrated.migrations
    };
  }

  function validateImportData(data, adapters) {
    const shape = validateShape(data);
    if (!shape.ok) return shape;
    return normalizeState(data, adapters);
  }

  function loadState(adapters) {
    const fallback = () => adapters.sanitizeState(adapters.defaultState());
    if (!storageAvailable()) {
      return { state: fallback(), status: "storage-unavailable", message: "LifeOps is running without browser storage." };
    }
    const raw = readRaw(STORAGE_KEYS.primary);
    if (!raw) return { state: fallback(), status: "empty" };
    const parsed = safeParseJSON(raw);
    if (!parsed.ok) {
      preserveCorruptRaw(raw);
      return { state: fallback(), status: parsed.status, message: "Saved LifeOps data was corrupted. Starter data was loaded without deleting the old copy." };
    }
    const validation = validateImportData(parsed.data, adapters);
    if (!validation.ok) {
      preserveCorruptRaw(raw);
      return { state: fallback(), status: validation.status, message: validation.message };
    }
    if (validation.migrations?.length) {
      createRollbackBackup(parsed.data, "pre-migration");
      saveState(validation.data, { reason: "migration" });
    }
    return { state: validation.data, status: validation.status, migrations: validation.migrations || [] };
  }

  function saveState(state, options = {}) {
    const payload = {
      ...state,
      schemaVersion: CURRENT_SCHEMA_VERSION
    };
    const result = writeRaw(STORAGE_KEYS.primary, JSON.stringify(payload));
    if (!result.ok && options.userMessage !== false) {
      console.warn(result.message);
    }
    return result;
  }

  function exportState(state) {
    return JSON.stringify({
      ...state,
      schemaVersion: CURRENT_SCHEMA_VERSION
    }, null, 2);
  }

  function parseImportText(text) {
    return safeParseJSON(String(text || ""));
  }

  function applyImportedState(nextState, replaceState, save, currentState) {
    const rollback = createRollbackBackup(currentState, "pre-import");
    if (!rollback.ok) console.warn("LifeOps could not create an import rollback backup.", rollback.error);
    replaceState(nextState);
    return save(nextState, { reason: "import" });
  }

  function resetState(currentState) {
    createRollbackBackup(currentState, "pre-reset");
    try {
      window.localStorage.removeItem(STORAGE_KEYS.primary);
      return { ok: true };
    } catch (error) {
      console.warn("LifeOps could not reset local storage.", error);
      return { ok: false, status: "storage-unavailable", message: "LifeOps could not reset storage in this browser session.", error };
    }
  }

  window.LifeOpsStorage = {
    CURRENT_SCHEMA_VERSION,
    STORAGE_KEYS,
    storageAvailable,
    safeParseJSON,
    detectSchemaVersion,
    runMigrations,
    validateImportData,
    loadState,
    saveState,
    exportState,
    parseImportText,
    applyImportedState,
    createRollbackBackup,
    resetState
  };
})();

