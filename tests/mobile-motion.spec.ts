import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const screens = [
  { name: "small-phone", width: 320, height: 568 },
  { name: "android", width: 360, height: 640 },
  { name: "iphone", width: 390, height: 844 },
  { name: "large-phone", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "landscape", width: 844, height: 390 },
];

for (const screen of screens) {
  test(`responsive composition on ${screen.name}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Viewport matrix uses the touch-enabled browser.");
    await page.setViewportSize(screen);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const heading = await page.locator("h1").evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return Array.from(range.getClientRects(), rect => ({ left: rect.left, right: rect.right }));
    });
    expect(heading.every(rect => rect.left >= 0 && rect.right <= screen.width)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    const hero = await page.locator(".hero").boundingBox();
    const booking = await page.getByRole("link", { name: "Find your table" }).boundingBox();
    expect(booking!.y + booking!.height).toBeLessThan(hero!.height);
    if (screen.width <= 760) {
      expect(await page.locator(".body-copy").first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(15);
      const toggle = page.getByRole("button", { name: "Open navigation" });
      const box = await toggle.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(48);
      expect(box!.width).toBeGreaterThanOrEqual(48);
      await toggle.tap();
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
      await page.getByRole("button", { name: "Close navigation" }).tap();
      await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    }
    await page.screenshot({ path: `/tmp/opencode/rua-${screen.name}-hero.png` });
  });
}

test("mobile action bar appears after hero, respects overlays, and preserves scroll", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "Quick restaurant actions", includeHidden: true });
  await expect(dock).not.toBeVisible();
  await page.locator("#story").scrollIntoViewIfNeeded();
  await expect(dock).toBeVisible();
  await expect(dock.getByRole("link", { name: "Find a table" })).toHaveAttribute("href", /rua-yelahanka-bangalore\/book$/);
  const savedY = await page.evaluate(() => window.scrollY);
  await page.getByRole("button", { name: "Open navigation" }).tap();
  await expect(dock).not.toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.getByRole("button", { name: "Close navigation" }).tap();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(savedY, 0);
  await expect(dock).toBeVisible();
  await page.getByRole("button", { name: "View Slow afternoons" }).tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(dock).not.toBeVisible();
  await page.getByRole("button", { name: "Close gallery" }).tap();
  await expect(dock).toBeVisible();
});

async function swipe(page: Page, selector: string) {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  const session = await page.context().newCDPSession(page);
  const startX = box!.x + box!.width * .8;
  const endX = box!.x + box!.width * .2;
  const y = box!.y + Math.min(box!.height * .4, 160);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y }] });
  for (let step = 1; step <= 8; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + (endX - startX) * step / 8, y }] });
    await page.waitForTimeout(25);
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await session.detach();
}

test("gallery supports real touch swipes and explicit controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/#moments");
  await page.locator(".gallery-grid").scrollIntoViewIfNeeded();
  const first = page.getByRole("button", { name: "Show Slow afternoons" });
  const second = page.getByRole("button", { name: "Show One more helping" });
  await expect(first).toHaveAttribute("aria-current", "true");
  await swipe(page, ".gallery-grid");
  await expect(second).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "Previous gallery card" }).tap();
  await expect(first).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "View Slow afternoons" }).tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await swipe(page, ".lightbox-image");
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText("One more helping");
  const closeBox = await page.getByRole("button", { name: "Close gallery" }).boundingBox();
  expect(closeBox!.width).toBeGreaterThanOrEqual(48);
  expect(closeBox!.height).toBeGreaterThanOrEqual(48);
});

test("ambient motion can be paused and stops outside the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect.poll(() => page.locator(".round-stamp svg").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("running");
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await expect.poll(() => page.locator(".ribbon-track").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
  await expect.poll(() => page.locator(".round-stamp svg").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
  await page.getByRole("button", { name: "Play ambient motion" }).click();
  await page.locator("#visit").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".ribbon-track").evaluate(element => getComputedStyle(element).animationPlayState)).toBe("paused");
});

test("reduced motion disables ambient effects and keeps content available", async ({ page }) => {
  await page.goto("/");
  for (const selector of [".round-stamp svg", ".ribbon-track", ".hero-image", ".hero-line > span"]) {
    await expect.poll(() => page.locator(selector).evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  }
  await expect(page.getByRole("button", { name: "Pause ambient motion" })).not.toBeVisible();
  await expect(page.locator(".reveal-waiting")).toHaveCount(0);
});

test("menu and reservation bar pass accessibility checks", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/#story");
  await expect(page.getByRole("navigation", { name: "Quick restaurant actions" })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Open navigation" }).tap();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("rapid filter changes settle on the last selected category", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#flavours");
  await page.getByRole("tab", { name: /^Vegetarian/ }).click();
  await page.getByRole("tab", { name: /^Non-vegetarian/ }).click();
  await expect(page.getByRole("tab", { name: /^Non-vegetarian/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel").getByRole("article")).toHaveCount(1);
});

test("enlarged mobile text does not create horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await page.addStyleTag({ content: ".body-copy, .dish-caption p, .section-heading > p, .visit-details p { font-size: 30px !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.locator("#visit").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "Get directions", exact: true })).toBeVisible();
});
