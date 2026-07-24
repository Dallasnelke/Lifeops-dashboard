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
  "js/timeline/timeline-normalization.js",
  "js/timeline/timeline-events.js",
  "js/timeline/timeline-actions.js",
  "js/timeline/timeline-insights.js",
  "js/timeline/timeline-engine.js",
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

const Norm = context.LifeOpsTimelineNormalization;
const Actions = context.LifeOpsTimelineActions;
const Events = context.LifeOpsTimelineEvents;
const Insights = context.LifeOpsTimelineInsights;
const Engine = context.LifeOpsTimelineEngine;

const invalid = Norm.normalizeEvent({
  id: "x",
  date: "not-a-date",
  title: "   ",
  significance: "extreme",
  tags: ["alpha", 12, "", "beta"],
  relatedLifeScore: Infinity,
  hidden: "true",
  sensitive: true
}, { fallbackDate: "2026-07-23" });
assert.equal(invalid.date, "2026-07-23", "invalid date should normalize to fallback");
assert.equal(invalid.title, "Untitled milestone", "blank title should use safe default");
assert.equal(invalid.significance, "medium", "invalid significance should use safe default");
assert.equal(invalid.relatedLifeScore, null, "Infinity should not persist as a score");
assert.equal(invalid.hidden, true, "string hidden flag should normalize");
assert.equal(invalid.includeInAtlas, false, "hidden/sensitive events are excluded from Atlas by default");
assert.deepEqual(invalid.tags, ["alpha", "12", "beta"], "malformed tags should become clean tags");

const duplicated = Norm.normalizeEvents([{ id: "same", title: "A" }, { id: "same", title: "B" }]);
assert.equal(new Set(duplicated.map(item => item.id)).size, 2, "duplicate imported ids should be replaced");

let events = [];
events = Actions.createEvent(events, { id: "manual", title: "Interview completed", date: "2026-07-10", category: "Career", significance: "high", tags: "career, interview" });
assert.equal(events.length, 1, "create should add event");
events = Actions.updateEvent(events, "manual", { title: "Interview follow-up completed" });
assert.equal(events[0].title, "Interview follow-up completed", "edit should update event");
events = Actions.togglePin(events, "manual");
assert.equal(events[0].pinned, true, "pin should toggle on");
events = Actions.hideEvent(events, "manual");
assert.equal(events[0].hidden, true, "hide should mark hidden");
events = Actions.restoreEvent(events, "manual");
assert.equal(events[0].hidden, false, "restore should unhide");
assert.equal(Actions.filterEvents(events, { query: "follow-up" }).length, 1, "search should find title text");
assert.equal(Actions.sortEvents(events, "significance")[0].id, "manual", "sort should keep valid list");
events = Actions.deleteEvent(events, "manual");
assert.equal(events.length, 0, "delete should remove event");

const state = {
  profile: { income: 3000, currentSavings: 5000, emergencyTarget: 3000, proteinGoal: 100, workoutGoal: 4, workoutsDone: 4 },
  timeline: [{ id: "legacy", title: "Legacy note", date: "bad", category: "Personal", note: "Old note", relatedGoal: "Old goal", privacy: "Private" }],
  timelineProposals: [],
  goals: [{ id: "goal1", name: "Finish portfolio", area: "Career", progress: 100, targetDate: "2026-07-20" }],
  educationGoals: [{ id: "edu1", title: "Finish course", progress: 100, targetDate: "2026-07-18" }],
  careerAchievements: [{ id: "ach1", title: "Promotion", date: "2026-07-15", privacy: "Private" }],
  careerApplications: [{ id: "app1", company: "Acme", position: "Analyst", applicationDate: "2026-07-13", status: "Submitted", privacy: "Private" }],
  documents: [{ id: "doc1", title: "Medical record", date: "2026-07-12", sensitivity: "Sensitive", privacy: "Private" }],
  history: [
    { date: "2026-07-01", lifeScore: 55 },
    { date: "2026-07-10", lifeScore: 61 },
    { date: "2026-07-20", lifeScore: 72 }
  ],
  atlasHistory: [{ id: "atlas1", actionId: "a1", title: "Complete weekly review", status: "completed", category: "Goals", completedAt: "2026-07-21T12:00:00.000Z" }],
  onboarding: { completed: true, completedAt: "2026-07-09" },
  expenses: [{ id: "rent", name: "Rent", amount: 1200, type: "Bill", dueDate: "2026-07-24" }],
  meals: [],
  workouts: [],
  planActions: [],
  educationAssignments: [],
  educationExams: [],
  careerInterviews: [],
  calendarEvents: [],
  sharedGoals: [],
  sharedLists: [],
  sharedChallenges: [],
  atlasCandidateState: {}
};

const automatic = Events.safeAutomaticEvents(state, { now: new Date("2026-07-23T12:00:00") });
assert(automatic.some(item => item.id === "timeline-auto-goal-goal1"), "completed goal should create safe automatic event");
assert(automatic.some(item => item.id === "timeline-auto-emergency-fund-target"), "emergency target reached should create broad finance event");
assert(!automatic.some(item => /Medical/.test(item.title)), "sensitive documents should not auto-publish");

const proposed = Events.proposedEvents(state);
assert.equal(proposed.length, 1, "sensitive document should become a proposal");
const confirmed = Actions.confirmProposal([], proposed, proposed[0].id);
assert.equal(confirmed.events.length, 1, "confirm proposal should create event");
assert.equal(confirmed.proposals[0].status, "confirmed", "confirmed proposal should record status");
const rejected = Actions.rejectProposal(proposed, proposed[0].id);
assert.equal(rejected[0].status, "rejected", "reject proposal should record status");

const view = Engine.viewModel(state, { sort: "newest", range: "90" }, { now: new Date("2026-07-23T12:00:00") });
assert(view.events.length >= 6, "view model should combine manual and safe automatic events");
assert(view.proposals.length === 1, "view model should expose open proposals");
assert(view.summary.rows.some(row => /observation only/i.test(row[1]) || /not enough/i.test(row[1])), "insights must avoid causation claims");
assert(!/caused/i.test(Insights.howFarSummary(view.events, state)), "progress summary should not claim causation");

const hiddenSensitiveState = {
  ...state,
  timeline: [
    { id: "hidden", title: "Hidden milestone", date: "2026-07-22", category: "Personal", hidden: true, sensitive: false },
    { id: "sensitive", title: "Sensitive milestone", date: "2026-07-22", category: "Health", sensitive: true }
  ],
  documents: []
};
const signal = Engine.atlasSignal(hiddenSensitiveState, { now: new Date("2026-07-23T12:00:00") });
assert(signal === null || !/Hidden|Sensitive/.test(signal.evidence || ""), "Atlas signal should exclude hidden and sensitive details");

const candidates = context.LifeOpsAtlasCandidates.collectCandidates(state, {}, { now: new Date("2026-07-23T12:00:00") });
assert(candidates.some(item => item.sourceModule === "timeline"), "Atlas should receive a low-priority timeline candidate");
const decision = context.LifeOpsAtlasEngine.generateDecision(state, {}, { now: new Date("2026-07-23T12:00:00") });
assert.notEqual(decision.topAction.sourceModule, "timeline", "timeline candidate should not beat urgent payment candidate");

console.log("timeline phase 6 tests passed");
