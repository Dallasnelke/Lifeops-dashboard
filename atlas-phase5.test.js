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
  JSON
};
context.window = context;
vm.createContext(context);

[
  "js/atlas/atlas-types.js",
  "js/atlas/atlas-evidence.js",
  "js/atlas/atlas-candidates.js",
  "js/atlas/atlas-scoring.js",
  "js/atlas/atlas-explanations.js",
  "js/atlas/atlas-history.js",
  "js/atlas/atlas-actions.js",
  "js/atlas/atlas-engine.js",
  "js/atlas/atlas-recommendations.js"
].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const fixtureState = {
  profile: {
    income: 3000,
    savingsGoal: 400,
    currentSavings: 500,
    emergencyTarget: 3000,
    proteinGoal: 150,
    workoutGoal: 4,
    workoutsDone: 1,
    sleepGoal: 8,
    sleepHours: 6,
    foodBudget: 100
  },
  expenses: [
    { id: "rent", name: "Rent", amount: 1200, type: "Bill", dueDate: "2026-07-24" },
    { id: "groceries", name: "Groceries", amount: 200, type: "Variable", dueDate: "" }
  ],
  meals: [{ id: "meal", protein: 30, calories: 600, cost: 12 }],
  workouts: [],
  planActions: [{ id: "action", name: "Finish weekly review", area: "Goals", impact: "High", deadline: "2026-07-25", done: false }],
  educationAssignments: [{ id: "assignment", title: "Economics paper", course: "Macro", dueDate: "2026-07-24", priority: "High", status: "Not started" }],
  educationExams: [],
  careerInterviews: [{ id: "interview", company: "Acme", date: "2026-07-26" }],
  careerApplications: [],
  calendarEvents: [{ id: "event", title: "Dentist", date: "2026-07-24" }],
  documents: [{ id: "doc", title: "Lease", sensitivity: "Sensitive", privacy: "Shared" }],
  sharedGoals: [],
  sharedLists: [],
  sharedChallenges: [],
  goals: [],
  onboarding: { completed: true },
  atlasHistory: [],
  atlasCandidateState: {}
};

const now = new Date("2026-07-23T12:00:00");
const candidates = context.LifeOpsAtlasCandidates.collectCandidates(fixtureState, {}, { now });
assert(candidates.length >= 7, "candidate adapters should produce several local candidates");
assert(candidates.every(candidate => candidate.id && candidate.title && candidate.category), "candidates should be normalized");

const paymentCandidate = candidates.find(candidate => candidate.id === "finance-payment-rent");
assert(paymentCandidate, "finance adapter should create upcoming payment candidate");
assert.strictEqual(paymentCandidate.deadlineProximity, 1);

const ranked = context.LifeOpsAtlasScoring.rankCandidates(candidates, { now });
assert(ranked.ranked.length > 0, "scoring should rank actionable candidates");
assert(ranked.ranked[0].score >= ranked.ranked[ranked.ranked.length - 1].score, "ranking should be descending");

const decision = context.LifeOpsAtlasEngine.generateDecision(fixtureState, {}, { now });
assert(decision.topAction, "decision should include top action");
assert(Array.isArray(decision.alternatives), "decision should include alternatives");
assert(decision.decisionTrace.weights.impact > 0, "decision trace should expose weights");
assert(decision.explanation.whyNow.includes("Atlas chose it"), "explanation should describe why Atlas chose the action");

const rows = context.LifeOpsAtlasExplanations.rowsFromDecision(decision);
assert(rows.some(row => row[0] === "Expected benefit"), "explanation rows should include expected benefit");
assert(rows.some(row => row[0] === "Risk if ignored"), "explanation rows should include risk");

const actionResult = context.LifeOpsAtlasActions.perform(fixtureState, decision.topAction, "snooze", { days: 1 });
assert(actionResult.ok, "action should save");
assert.strictEqual(fixtureState.atlasHistory.length, 1, "action history should append one entry");
assert(fixtureState.atlasCandidateState[decision.topAction.id].snoozedUntil, "candidate state should save snooze");

const afterSnooze = context.LifeOpsAtlasEngine.generateDecision(fixtureState, {}, { now });
assert.notStrictEqual(afterSnooze.topAction?.id, decision.topAction.id, "snoozed top action should be excluded");

console.log("Atlas Phase 5 tests passed");
