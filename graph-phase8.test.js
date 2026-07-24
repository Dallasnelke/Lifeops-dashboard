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
  performance
};
context.window = context;
vm.createContext(context);

[
  "js/graph/graph-types.js",
  "js/graph/graph-normalization.js",
  "js/graph/graph-nodes.js",
  "js/graph/graph-edges.js",
  "js/graph/graph-analysis.js",
  "js/graph/graph-paths.js",
  "js/graph/graph-actions.js",
  "js/graph/graph-import.js",
  "js/graph/graph-engine.js",
  "js/atlas/atlas-types.js",
  "js/atlas/atlas-evidence.js",
  "js/atlas/atlas-candidates.js",
  "js/atlas/atlas-scoring.js",
  "js/atlas/atlas-explanations.js",
  "js/atlas/atlas-history.js",
  "js/atlas/atlas-actions.js",
  "js/atlas/atlas-engine.js"
].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const now = new Date("2026-07-23T12:00:00");
const state = {
  profile: { income: 3200, savingsGoal: 300, currentSavings: 900, emergencyTarget: 3000, proteinGoal: 150, workoutGoal: 4, workoutsDone: 2, sleepGoal: 8, sleepHours: 6, foodBudget: 120 },
  tasks: [{ id: "task1", name: "Finish portfolio case study", area: "Career", done: false }],
  goals: [{ id: "goal1", name: "Build portfolio app", area: "Career", progress: 40, targetDate: "2026-09-01" }],
  planActions: [{ id: "action1", name: "Finish case study", area: "Career", goal: "Build portfolio app", impact: "High", deadline: "2026-07-25", done: false }],
  expenses: [{ id: "rent", name: "Rent", amount: 1200, type: "Bill", dueDate: "2026-07-24" }],
  meals: [{ id: "meal1", protein: 40, calories: 500, cost: 12 }],
  workouts: [],
  educationAssignments: [],
  educationExams: [],
  educationGoals: [],
  careerApplications: [{ id: "app1", company: "Acme", position: "Analyst", status: "Applied", followUpDate: "2026-07-24" }],
  careerInterviews: [{ id: "int1", company: "Acme", date: "2026-07-26" }],
  calendarEvents: [{ id: "event1", title: "Interview prep", date: "2026-07-23" }],
  documents: [{ id: "doc1", title: "Lease", category: "Housing", sensitivity: "Sensitive", includeInAtlas: false }],
  timeline: [{ id: "mile1", title: "Portfolio milestone", date: "2026-07-20", category: "Career", relatedGoal: "Build portfolio app", privacy: "Private" }],
  atlasMemory: [{ id: "mem1", title: "Interview focus", summary: "Career progress matters this week.", type: "goal_context", category: "Career", confidence: 0.8, includeInAtlas: true }],
  atlasHistory: [],
  atlasCandidateState: {},
  graphNodes: [{ id: "custom-node", title: "Resume polish", nodeType: "task", category: "Career", importance: 0.8, includeInAtlas: true }],
  graphEdges: [{ id: "custom-edge", fromNodeId: "custom-node", toNodeId: "graph:goal:goals:goal1", relationshipType: "supports", strength: 0.9, confidence: 0.9, userConfirmed: true, includeInAtlas: true }]
};

const graph = context.LifeOpsGraphEngine.build(state, { now, noCache: true });
assert(graph.nodes.length >= 10, "graph should include source and custom nodes");
assert(graph.edges.length >= 4, "graph should infer and preserve relationships");
assert(graph.analysis.leverage.length > 0, "analysis should compute leverage");
assert(!graph.analysis.nodes.some(node => node.title === "Lease"), "sensitive disallowed document should be hidden from Atlas analysis");

const safeExport = context.LifeOpsGraphEngine.privacySafeExport(state, { now });
assert.strictEqual(safeExport.type, "lifeops-graph-privacy-safe");
assert(!JSON.stringify(safeExport).includes("Lease"), "privacy-safe export must exclude sensitive hidden document title");

const signal = context.LifeOpsGraphEngine.atlasSignal(state, { now, noCache: true });
assert(signal && signal.title, "graph should produce an Atlas signal");
const candidates = context.LifeOpsAtlasCandidates.collectCandidates(state, {}, { now });
assert(candidates.some(candidate => candidate.sourceModule === "graph"), "Atlas should include a graph candidate");
const decision = context.LifeOpsAtlasEngine.generateDecision(state, {}, { now });
assert(Array.isArray(decision.decisionTrace.graphUsed), "decision trace should expose graph-used rows");
const explanationRows = context.LifeOpsAtlasExplanations.rowsFromDecision(decision);
assert(explanationRows.some(row => row[0] === "Graph relationships used"), "explanation should disclose graph influence");

const largeState = { ...state, graphNodes: [], graphEdges: [] };
for (let i = 0; i < 1000; i += 1) {
  largeState.graphNodes.push({ id: `n-${i}`, title: `Node ${i}`, nodeType: "task", category: i % 2 ? "Career" : "Goals", importance: 0.5, includeInAtlas: true });
}
for (let i = 0; i < 5000; i += 1) {
  largeState.graphEdges.push({ id: `e-${i}`, fromNodeId: `n-${i % 1000}`, toNodeId: `n-${(i + 1) % 1000}`, relationshipType: i % 11 === 0 ? "blocks" : "supports", strength: 0.5, confidence: 0.7, includeInAtlas: true });
}
const start = performance.now();
const largeGraph = context.LifeOpsGraphEngine.build(largeState, { now, noCache: true });
const elapsed = performance.now() - start;
assert(largeGraph.analysis.nodes.length <= 1300, "large graph should stay bounded by app sanitize limits when provided externally");
assert(elapsed < 2000, `large graph analysis should remain responsive, took ${elapsed}ms`);

console.log("Graph Phase 8 tests passed");
