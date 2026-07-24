const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const context = {
  window: {},
  console,
  Date,
  Math,
  Number,
  String,
  Array,
  Object,
  Boolean,
  RegExp,
  Set,
  Map,
  JSON,
  crypto: {
    randomUUID: (() => {
      let index = 0;
      return () => `test-id-${index += 1}`;
    })()
  }
};
context.window = context;
vm.createContext(context);

[
  "js/command/command-types.js",
  "js/command/command-context.js",
  "js/command/command-plan.js",
  "js/command/command-session.js",
  "js/command/command-history.js",
  "js/command/command-engine.js",
  "js/command/command-actions.js",
  "js/command/command-renderer.js"
].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

context.LifeOpsGraphEngine = {
  build: () => ({ nodes: [], edges: [] }),
  atlasSignal: () => ({ reason: "Finance supports Foundation.", confidence: "High" })
};
context.LifeOpsMemoryEngine = {
  activeForAtlas: () => [{ title: "User preference", summary: "Prefers short plans.", confidence: "High", privacy: "Personal" }]
};
context.LifeOpsTimelineEngine = {
  atlasSignal: () => ({ summary: "Recent milestone supports career momentum.", confidence: "Medium" }),
  viewModel: () => ({ items: [{ title: "Portfolio milestone", date: "2026-07-20", privacy: "Private" }] })
};
context.LifeOpsAtlasActions = {
  perform: (state, candidate, action) => {
    state.atlasHistory.push({ id: `atlas-${action}`, candidateId: candidate.id, action });
    return { ok: true };
  }
};

const state = {
  tasks: [{ id: "task1", name: "Send follow up", area: "Career", done: false }],
  planActions: [{ id: "action1", name: "Confirm rent payment", area: "Finance", impact: "High", done: false }],
  goals: [],
  educationAssignments: [],
  educationExams: [],
  careerApplications: [],
  careerInterviews: [],
  timeline: [],
  atlasMemory: [],
  atlasHistory: [],
  commandCenter: {},
  commandHistory: []
};

const atlasContext = {
  confidence: "High",
  freshness: "Based on data updated today.",
  lifeScore: {
    weakestArea: "Finance",
    weakestScore: 42,
    strongestArea: "Career",
    strongestScore: 78
  }
};

const priority = {
  title: "Prepare upcoming payment",
  category: "Finance",
  action: "Confirm rent payment plan",
  why: "Rent is due soon and should be visible before spending.",
  found: "Rent is due tomorrow.",
  evidence: ["Payment: Rent", "Due date: 2026-07-25"],
  impacts: ["Finance", "Foundation"],
  confidence: "High",
  freshness: "Based on data updated today.",
  time: "8 minutes",
  urgency: 9,
  candidateId: "candidate1",
  sourceModule: "finance",
  sourceEntityId: "action1",
  tab: "money",
  rawCandidate: { id: "candidate1", title: "Prepare upcoming payment", category: "Finance", sourceModule: "finance", sourceEntityId: "action1" }
};

const command = context.LifeOpsCommandEngine.generate(state, {
  atlasContext,
  priorities: [priority, { ...priority, candidateId: "candidate2", title: "Close protein gap", category: "Nutrition", urgency: 5 }],
  decision: { decisionTrace: { graphUsed: { summary: "Graph shows Finance unlocks Foundation." }, memoryUsed: { summary: "Memory prefers short plans." } } }
});

assert.strictEqual(command.category, "Finance");
assert.strictEqual(command.riskIfIgnored, "High");
assert(command.graphContext.some(item => item.source === "Life Graph"), "graph context should be present");
assert(command.memoryContext.some(item => item.source === "Atlas Memory"), "memory context should be present");
assert(command.timelineContext.some(item => item.source === "Life Timeline"), "timeline context should be present");
assert(command.scoreContext.some(item => item.label === "Weakest area"), "score context should be present");
assert(command.plan.length >= 3, "default plan should be generated");
assert(command.alternatives.length === 1, "alternative should be preserved");

context.LifeOpsCommandEngine.ensure(state, { atlasContext, priorities: [priority] });
const active = state.commandCenter.activeCommand;
assert(active, "active command should be stored");
context.LifeOpsCommandActions.buildPlan(state, active.id);
context.LifeOpsCommandActions.start(state, active.id, 8);
assert.strictEqual(state.commandCenter.activeCommand.status, "active");
context.LifeOpsCommandActions.pause(state);
assert.strictEqual(state.commandCenter.activeCommand.status, "paused");
context.LifeOpsCommandActions.resume(state);
assert.strictEqual(state.commandCenter.activeCommand.status, "active");
const firstStep = state.commandCenter.activeCommand.plan[0].id;
context.LifeOpsCommandActions.stepStatus(state, firstStep, "done");
assert.strictEqual(state.commandCenter.activeCommand.plan[0].status, "done");
context.LifeOpsCommandActions.complete(state);
assert.strictEqual(state.commandCenter.activeCommand, null);
assert(state.commandCenter.lastCompletedCommand, "completed command should be retained");
assert(state.commandHistory.some(item => item.action === "completed"), "completion should be recorded");
assert(state.atlasHistory.some(item => item.action === "complete"), "Atlas candidate state action should be forwarded");

const safe = context.LifeOpsCommandEngine.privacySafeExport(state);
assert(safe.commandCenter, "privacy-safe export should include command center");
assert(Array.isArray(safe.commandHistory), "privacy-safe export should include command history");

console.log("Command Phase 9 tests passed");
