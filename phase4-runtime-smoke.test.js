const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function checkSyntax(file) {
  execFileSync(process.execPath, ["-c", path.join(root, file)], { stdio: "pipe" });
}

[
  "js/state.js",
  "js/storage.js",
  "js/navigation.js",
  "js/ui.js",
  "js/app.js",
  "js/modules/settings.js",
  "js/modules/education.js",
  "js/modules/career.js",
  "js/modules/calendar.js",
  "js/modules/documents.js",
  "js/modules/life-tree.js",
  "js/timeline/timeline-renderer.js",
  "js/modules/timeline.js",
  "js/memory/memory-normalization.js",
  "js/memory/memory-conflicts.js",
  "js/memory/memory-actions.js",
  "js/memory/memory-engine.js",
  "js/memory/memory-renderer.js",
  "js/modules/memory.js",
  "js/graph/graph-types.js",
  "js/graph/graph-normalization.js",
  "js/graph/graph-nodes.js",
  "js/graph/graph-edges.js",
  "js/graph/graph-analysis.js",
  "js/graph/graph-paths.js",
  "js/graph/graph-actions.js",
  "js/graph/graph-import.js",
  "js/graph/graph-engine.js",
  "js/graph/graph-renderer.js",
  "js/modules/graph.js",
  "js/command/command-types.js",
  "js/command/command-context.js",
  "js/command/command-plan.js",
  "js/command/command-session.js",
  "js/command/command-history.js",
  "js/command/command-engine.js",
  "js/command/command-actions.js",
  "js/command/command-renderer.js",
  "js/modules/command-center.js"
].forEach(file => {
  checkSyntax(file);
  pass(`${file} parses`);
});

const app = read("js/app.js");
assert(app.includes('const appVersion = "2.10.0";'), "app version must be v2.10.0");
assert(app.includes("function bootstrapLifeOps()"), "app must expose explicit bootstrapLifeOps()");
assert(app.includes("initializeLifeOpsInfrastructure();"), "bootstrap must initialize shared infrastructure");
assert(app.includes("registerLifeOpsEventListeners();"), "bootstrap must register guarded app listeners");
assert(app.includes("window.LifeOpsNavigation.navigateTo"), "app activateTab wrapper must delegate to LifeOpsNavigation");
assert(app.includes("window.LifeOpsUI.openEditModal"), "app edit modal wrapper must delegate to LifeOpsUI");
assert(!app.includes('document.querySelectorAll(".nav button, .bottom-nav button")'), "primary navigation listener must not remain in app.js");
pass("app bootstrap and delegation checks passed");

const navigation = read("js/navigation.js");
assert(navigation.includes("window.LifeOpsNavigation"), "navigation API must be exported");
assert(navigation.includes("function initialize"), "navigation must have initialize()");
assert(navigation.includes("function navigateTo"), "navigation must have navigateTo()");
assert(navigation.includes("aria-current"), "navigation must preserve aria-current active state");
pass("navigation API checks passed");

const ui = read("js/ui.js");
assert(ui.includes("window.LifeOpsUI"), "UI API must be exported");
assert(ui.includes("function trapModalFocus"), "UI must own modal focus trap");
assert(ui.includes("function openEditModal"), "UI must own edit modal opening");
assert(ui.includes("function renderSummaryCards"), "UI must own reusable summary card rendering");
pass("shared UI API checks passed");

["lifeops-dashboard.html", "index.html"].forEach(file => {
  const html = read(file);
  const order = [
    "js/state.js",
    "js/storage.js",
    "js/navigation.js",
    "js/ui.js",
    "js/modules/settings.js",
    "js/modules/documents.js",
    "js/modules/calendar.js",
    "js/modules/relationships.js",
    "js/modules/education.js",
    "js/modules/career.js",
    "js/modules/goals.js",
    "js/modules/health.js",
    "js/modules/finance.js",
    "js/modules/dashboard.js",
    "js/modules/life-tree.js",
    "js/timeline/timeline-renderer.js",
    "js/modules/timeline.js",
    "js/memory/memory-normalization.js",
    "js/memory/memory-conflicts.js",
    "js/memory/memory-actions.js",
    "js/memory/memory-engine.js",
    "js/memory/memory-renderer.js",
    "js/modules/memory.js",
    "js/graph/graph-types.js",
    "js/graph/graph-normalization.js",
    "js/graph/graph-nodes.js",
    "js/graph/graph-edges.js",
    "js/graph/graph-analysis.js",
    "js/graph/graph-paths.js",
    "js/graph/graph-actions.js",
    "js/graph/graph-import.js",
    "js/graph/graph-engine.js",
    "js/graph/graph-renderer.js",
    "js/modules/graph.js",
    "js/command/command-types.js",
    "js/command/command-context.js",
    "js/command/command-plan.js",
    "js/command/command-session.js",
    "js/command/command-history.js",
    "js/command/command-engine.js",
    "js/command/command-actions.js",
    "js/command/command-renderer.js",
    "js/modules/command-center.js",
    "js/app.js"
  ].map(script => html.indexOf(script));
  assert(order.every(index => index >= 0), `${file} must include all Phase 4 scripts`);
  assert(order.every((index, i) => i === 0 || index > order[i - 1]), `${file} script order must load app.js last`);
  pass(`${file} script order checks passed`);
});

const files = [];
function walk(dir) {
  for (const item of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const relative = path.join(dir, item.name);
    if (item.isDirectory()) walk(relative);
    else if (item.name.endsWith(".js")) files.push(relative.replace(/\\/g, "/"));
  }
}
walk("js");
const directStoragePattern = /(?:window\.)?localStorage\.(?:getItem|setItem|removeItem|clear|key)\s*\(/;
const directStorage = files.filter(file => file !== "js/storage.js" && directStoragePattern.test(read(file)));
assert(directStorage.length === 0, `only js/storage.js may directly access localStorage; found ${directStorage.join(", ")}`);
pass("localStorage boundary preserved");

[
  "js/modules/settings.js",
  "js/modules/education.js",
  "js/modules/career.js",
  "js/modules/calendar.js",
  "js/modules/documents.js",
  "js/modules/life-tree.js",
  "js/modules/timeline.js",
  "js/modules/memory.js",
  "js/modules/graph.js",
  "js/modules/command-center.js"
].forEach(file => {
  const source = read(file);
  assert(source.includes("let initialized = false"), `${file} must guard duplicate initialization`);
  assert(source.includes("if (initialized) return"), `${file} must skip duplicate initialize() calls`);
  pass(`${file} initialization guard present`);
});

console.log("Phase 4 smoke checks complete.");



