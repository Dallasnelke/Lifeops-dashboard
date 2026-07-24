let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  console.log("SKIP browser smoke: Playwright is not available in this runtime.");
  process.exit(0);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const logs = [];
  page.on("console", msg => {
    if (["error", "warning"].includes(msg.type())) logs.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", error => logs.push(`pageerror: ${error.message}`));
  await page.goto("http://127.0.0.1:4200/lifeops-dashboard.html", { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.evaluate(() => {
    const overlays = document.querySelectorAll("#startupOverlay, .startup-overlay, #onboardingOverlay, .atlas-startup-screen, .setup-overlay");
    overlays.forEach(el => { el.hidden = true; el.style.display = "none"; });
  });
  await page.waitForTimeout(500);
  const version = await page.locator("#appVersionLabel").textContent().catch(() => "missing");
  await page.evaluate(() => window.LifeOpsNavigation?.navigateTo?.("graph", { primary: "more" }));
  await page.waitForTimeout(500);
  const graphVisible = await page.locator("#graph").evaluate(el => el.classList.contains("active"));
  const graphSvgCount = await page.locator("#graphVisual svg").count();
  const graphNodeCount = await page.locator("#graphVisual .graph-node").count();
  const visibleBadText = await page.evaluate(() => document.body.innerText.includes("undefined") || document.body.innerText.includes("NaN"));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobileGraphHeight = await page.locator("#graphVisual").evaluate(el => Math.round(el.getBoundingClientRect().height));
  await browser.close();
  if (!String(version).includes("2.0.0")) throw new Error(`Expected visible version 2.0.0, got ${version}`);
  if (!graphVisible) throw new Error("Graph tab did not become active");
  if (graphSvgCount < 1) throw new Error("Graph SVG did not render");
  if (graphNodeCount < 3) throw new Error("Graph nodes did not render");
  if (visibleBadText) throw new Error("Visible undefined or NaN found");
  if (mobileGraphHeight < 240) throw new Error("Mobile graph area collapsed");
  if (logs.length) throw new Error(`Console issues: ${logs.join(" | ")}`);
  console.log(JSON.stringify({ version, graphVisible, graphSvgCount, graphNodeCount, mobileGraphHeight, logs }, null, 2));
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});

