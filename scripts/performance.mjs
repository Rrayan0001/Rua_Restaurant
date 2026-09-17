import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { homedir } from "node:os";

const executable = `${homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`;
const browser = await chromium.launch({ executablePath: existsSync(executable) ? executable : undefined });
const runs = [];
try {
  for (let index = 0; index < 3; index++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750 });
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(process.env.PERF_URL || "http://127.0.0.1:3000");
    await page.waitForTimeout(3500);
    runs.push(await page.evaluate(() => ({
      lcpMs: Math.round(window.__metrics.lcp),
      cls: Number(window.__metrics.cls.toFixed(4)),
      transferredKB: Math.round(performance.getEntriesByType("resource").reduce((total, item) => total + item.transferSize, 0) / 1024),
      pageHeight: document.documentElement.scrollHeight,
      bodyCopyPx: getComputedStyle(document.querySelector(".body-copy")).fontSize,
    })));
    await context.close();
  }
  const median = key => [...runs].sort((a, b) => a[key] - b[key])[1][key];
  console.log(JSON.stringify({ profile: "390×844, DPR 3, cold browser cache, 1.6 Mbps, 150 ms latency, 4× CPU slowdown", runs, median: { lcpMs: median("lcpMs"), cls: median("cls"), transferredKB: median("transferredKB") } }, null, 2));
} finally {
  await browser.close();
}
