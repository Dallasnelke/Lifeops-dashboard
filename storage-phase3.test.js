const fs = require("fs");
const path = require("path");
const vm = require("vm");

function createLocalStorage({ failRead = false, failWrite = false } = {}) {
  const data = new Map();
  return {
    getItem(key) {
      if (failRead) throw new Error("read unavailable");
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      if (failWrite) {
        const error = new Error("quota exceeded");
        error.name = "QuotaExceededError";
        throw error;
      }
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    dump() {
      return Object.fromEntries(data.entries());
    }
  };
}

function loadStorage(localStorage = createLocalStorage()) {
  const context = {
    console,
    window: { localStorage },
    structuredClone: global.structuredClone,
    JSON
  };
  context.window.window = context.window;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "state.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8"), context);
  return { api: context.window.LifeOpsStorage, stateApi: context.window.LifeOpsState, localStorage };
}

function adapters() {
  return {
    defaultState: () => ({
      schemaVersion: 3,
      profile: { income: 0 },
      tasks: [],
      expenses: [],
      goals: [],
      history: [],
      graphNodes: [],
      graphEdges: [],
      commandCenter: {},
      commandHistory: [],
      onboarding: { answers: {} },
      appearance: { mode: "dark" },
      voice: { mode: "off" },
      dashboardSettings: {}
    }),
    mergeState: (base, saved) => ({
      ...base,
      ...saved,
      profile: { ...base.profile, ...(saved.profile || {}) },
      tasks: Array.isArray(saved.tasks) ? saved.tasks : base.tasks,
      expenses: Array.isArray(saved.expenses) ? saved.expenses : base.expenses,
      goals: Array.isArray(saved.goals) ? saved.goals : base.goals,
      history: Array.isArray(saved.history) ? saved.history : base.history,
      graphNodes: Array.isArray(saved.graphNodes) ? saved.graphNodes : base.graphNodes,
      graphEdges: Array.isArray(saved.graphEdges) ? saved.graphEdges : base.graphEdges,
      commandCenter: { ...base.commandCenter, ...(saved.commandCenter || {}) },
      commandHistory: Array.isArray(saved.commandHistory) ? saved.commandHistory : base.commandHistory,
      onboarding: { ...base.onboarding, ...(saved.onboarding || {}) }
    }),
    sanitizeState: state => ({
      ...state,
      schemaVersion: 3,
      profile: { ...state.profile, income: Number.isFinite(Number(state.profile?.income)) ? Number(state.profile.income) : 0 },
      tasks: Array.isArray(state.tasks) ? state.tasks : [],
      expenses: Array.isArray(state.expenses) ? state.expenses : [],
      goals: Array.isArray(state.goals) ? state.goals : [],
      history: Array.isArray(state.history) ? state.history : [],
      graphNodes: Array.isArray(state.graphNodes) ? state.graphNodes : [],
      graphEdges: Array.isArray(state.graphEdges) ? state.graphEdges : [],
      commandCenter: state.commandCenter && typeof state.commandCenter === "object" && !Array.isArray(state.commandCenter) ? state.commandCenter : {},
      commandHistory: Array.isArray(state.commandHistory) ? state.commandHistory : []
    })
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}: ${error.message}`);
    process.exitCode = 1;
  }
}

test("brand-new user loads safe defaults", () => {
  const { api } = loadStorage();
  const result = api.loadState(adapters());
  assert(result.status === "empty", "expected empty status");
  assert(result.state.schemaVersion === 3, "expected schema version");
});

test("legacy backup without schema migrates through v1 to v3", () => {
  const { api } = loadStorage();
  const result = api.validateImportData({ profile: { income: "5200" }, tasks: [] }, adapters());
  assert(result.ok, "expected valid backup");
  assert(result.status === "migrated", "expected migrated status");
  assert(result.data.profile.income === 5200, "expected normalized income");
  assert(result.migrations.includes("legacy-to-v1"), "expected legacy migration");
  assert(result.migrations.includes("v1-to-v2-life-graph"), "expected graph migration");
  assert(result.migrations.includes("v2-to-v3-command-center"), "expected command center migration");
  assert(Array.isArray(result.data.graphNodes), "expected graph node defaults");
  assert(Array.isArray(result.data.commandHistory), "expected command history defaults");
});

test("partial nested objects normalize safely", () => {
  const { api } = loadStorage();
  const result = api.validateImportData({ profile: { income: Infinity }, onboarding: {} }, adapters());
  assert(result.ok, "expected valid partial backup");
  assert(result.data.profile.income === 0, "expected invalid number cleanup");
  assert(result.data.onboarding.answers, "expected onboarding defaults");
});

test("malformed JSON is classified", () => {
  const { api } = loadStorage();
  const parsed = api.parseImportText("{bad json");
  assert(!parsed.ok && parsed.status === "corrupted-json", "expected corrupted-json status");
});

test("unrelated JSON is rejected", () => {
  const { api } = loadStorage();
  const result = api.validateImportData({ unrelated: true }, adapters());
  assert(!result.ok && result.status === "unrelated-json", "expected unrelated-json status");
});

test("invalid list field is rejected", () => {
  const { api } = loadStorage();
  const result = api.validateImportData({ profile: {}, tasks: "not a list" }, adapters());
  assert(!result.ok && result.status === "invalid-field", "expected invalid-field status");
});

test("export and re-import round trip", () => {
  const { api } = loadStorage();
  const text = api.exportState({ profile: { income: 12 }, tasks: [], expenses: [], goals: [], history: [] });
  const parsed = api.parseImportText(text);
  const result = api.validateImportData(parsed.data, adapters());
  assert(result.ok, "expected round trip valid");
  assert(result.data.schemaVersion === 3, "expected schema version");
});

test("quota failure returns calm status", () => {
  const { api } = loadStorage(createLocalStorage({ failWrite: true }));
  const originalWarn = console.warn;
  console.warn = () => {};
  let result;
  try {
    result = api.saveState({ profile: {}, tasks: [] }, { userMessage: false });
  } finally {
    console.warn = originalWarn;
  }
  assert(!result.ok && result.status === "quota-exceeded", "expected quota status");
});

test("state subscribers are notified", () => {
  const { stateApi } = loadStorage();
  const store = stateApi.createStore({ ready: false });
  let seen = false;
  const off = stateApi.subscribe(() => { seen = true; });
  store.updateState({ ready: true });
  off();
  assert(seen, "expected subscriber notification");
});


