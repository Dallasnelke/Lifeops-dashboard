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
  "js/memory/memory-normalization.js",
  "js/memory/memory-conflicts.js",
  "js/memory/memory-actions.js",
  "js/memory/memory-engine.js",
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

const MemoryNorm = context.LifeOpsMemoryNormalization;
const MemoryActions = context.LifeOpsMemoryActions;
const MemoryConflicts = context.LifeOpsMemoryConflicts;
const MemoryEngine = context.LifeOpsMemoryEngine;
const TimelineNorm = context.LifeOpsTimelineNormalization;
const TimelineEngine = context.LifeOpsTimelineEngine;

const now = new Date("2026-07-23T12:00:00");

const malformed = MemoryNorm.normalizeMemory({
  id: "m1",
  title: "   ",
  value: "Prefer short recommendations",
  confidence: Infinity,
  type: "wrong",
  category: "Bad",
  tags: ["atlas", "", 77],
  status: "unknown",
  expiresAt: "bad-date"
});
assert.equal(malformed.title, "Untitled memory", "blank memory title should normalize");
assert.equal(malformed.confidence, 0.6, "invalid confidence should use safe default");
assert.equal(malformed.type, "preference", "invalid memory type should use safe default");
assert.deepEqual(malformed.tags, ["atlas", "77"], "memory tags should be cleaned");
assert.equal(malformed.expiresAt, "", "invalid expiration should be removed");

const memories = [{
  id: "older",
  title: "Workout time",
  value: "morning",
  type: "preference",
  category: "Fitness",
  confidence: 0.7,
  includeInAtlas: true,
  userConfirmed: true,
  updatedAt: "2026-07-01T12:00:00.000Z"
}, {
  id: "correction",
  title: "Workout time",
  value: "evening",
  type: "correction",
  category: "Fitness",
  confidence: 1,
  includeInAtlas: true,
  userConfirmed: true,
  updatedAt: "2026-07-20T12:00:00.000Z"
}];
const conflict = MemoryConflicts.resolve(memories, { now });
assert.equal(conflict.conflicts.length, 1, "conflict should be detected");
assert.equal(conflict.conflicts[0].winnerId, "correction", "explicit correction should win");
assert.equal(conflict.active.length, 1, "superseded memory should be excluded from active set");
assert.equal(conflict.memories.find(item => item.id === "older").metadata.supersededByMemoryId, "correction", "superseded memory should retain traceability");

const privacyState = {
  atlasMemory: [
    { id: "visible", title: "Prefer concise Atlas", value: "brief", category: "Atlas", type: "communication_preference", includeInAtlas: true },
    { id: "hidden", title: "Hidden", value: "hidden", category: "Atlas", hidden: true, includeInAtlas: true },
    { id: "expired", title: "Expired", value: "old", category: "Atlas", expiresAt: "2026-01-01", includeInAtlas: true },
    { id: "sensitiveBlocked", title: "Sensitive blocked", value: "private", category: "Health", sensitive: true, includeInAtlas: false },
    { id: "sensitiveAllowed", title: "Sensitive allowed", value: "private detail", category: "Health", sensitive: true, includeInAtlas: true }
  ]
};
const activeAtlas = MemoryEngine.activeForAtlas(privacyState, { now });
assert(activeAtlas.some(item => item.id === "visible"), "visible allowed memory should feed Atlas");
assert(activeAtlas.some(item => item.id === "sensitiveAllowed"), "sensitive memory can feed Atlas only when explicitly allowed");
assert(!activeAtlas.some(item => item.id === "hidden"), "hidden memory should not feed Atlas");
assert(!activeAtlas.some(item => item.id === "expired"), "expired memory should not feed Atlas");
assert(!activeAtlas.some(item => item.id === "sensitiveBlocked"), "blocked sensitive memory should not feed Atlas");

const adjusted = MemoryEngine.applyToCandidates([
  { id: "health-sleep", title: "Sleep check", category: "Health", impact: 5, confidence: 0.5, supportingEvidence: [] },
  { id: "finance-rent", title: "Confirm rent", category: "Finance", impact: 9.7, confidence: 0.9, supportingEvidence: [] }
], privacyState, { now });
const health = adjusted.candidates.find(item => item.id === "health-sleep");
const finance = adjusted.candidates.find(item => item.id === "finance-rent");
assert(health.impact > 5, "allowed memory should create a small category boost");
assert(finance.impact >= 9.7, "memory should not reduce urgent objective facts");
assert(adjusted.memoryUsed.some(item => item.id === "sensitiveAllowed"), "explicitly allowed sensitive memory should be listed as used");

const safeExport = MemoryEngine.privacySafeExport({
  ...privacyState,
  timeline: [
    { id: "safe", title: "Safe milestone", date: "2026-07-20", category: "Goals", includeInExport: true },
    { id: "secret", title: "Secret milestone", date: "2026-07-20", category: "Health", sensitive: true, includeInExport: true },
    { id: "hiddenEvent", title: "Hidden milestone", date: "2026-07-20", category: "Personal", hidden: true }
  ],
  timelineProposals: []
}, { now, includeAutomatic: false });
assert(safeExport.timeline.some(item => item.title === "Safe milestone"), "safe export should include visible nonsensitive timeline items");
assert(!JSON.stringify(safeExport).includes("Secret milestone"), "safe export should exclude sensitive timeline details");
assert(!JSON.stringify(safeExport).includes("Hidden milestone"), "safe export should exclude hidden timeline details");
assert(!JSON.stringify(safeExport).includes("private detail"), "safe export should exclude sensitive memory values");

const sensitiveTimeline = TimelineNorm.normalizeEvent({
  id: "sensitiveTimeline",
  title: "Sensitive but allowed",
  date: "2026-07-22",
  category: "Personal",
  sensitive: true,
  includeInAtlas: true
});
const blockedTimeline = TimelineNorm.normalizeEvent({
  id: "blockedTimeline",
  title: "Sensitive blocked",
  date: "2026-07-22",
  category: "Personal",
  sensitive: true
});
assert.equal(sensitiveTimeline.includeInAtlas, true, "sensitive timeline event should allow Atlas only with explicit opt in");
assert.equal(blockedTimeline.includeInAtlas, false, "sensitive timeline event should default out of Atlas");
const timelineSignal = TimelineEngine.atlasSignal({ timeline: [sensitiveTimeline], timelineProposals: [] }, { now, includeAutomatic: false });
assert(timelineSignal === null || !/private detail/i.test(timelineSignal.evidence || ""), "Timeline Atlas signal should not expose sensitive details");

console.log("Memory Phase 7 tests passed");
