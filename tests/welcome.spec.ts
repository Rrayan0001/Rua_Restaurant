import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("welcome intro plays the doodle, then dismisses and remembers", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?welcome=stay");
  const overlay = page.getByRole("dialog", { name: "Welcome to Rua" });
  await expect(overlay).toBeVisible();
  await expect(overlay.locator(".welcome-doodle path")).toHaveCount(11);
  await expect(overlay.getByText("SETTING YOUR TABLE")).toBeVisible();
  await expect(overlay.getByText("rua", { exact: true })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations,
  ).toEqual([]);
  await page.screenshot({ path: "/tmp/opencode/rua-welcome.png" });
  const skip = overlay.getByRole("button", { name: "Skip intro" });
  const box = await skip.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(48);
  await skip.click();
  await expect(overlay).not.toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("rua-welcome-seen"))).toBe("1");
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("welcome auto-exits and stays dismissed on reload", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Welcome to Rua" })).not.toBeVisible({ timeout: 9000 });
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Welcome to Rua" })).not.toBeVisible();
});

test("reduced motion skips the welcome overlay entirely", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Welcome to Rua" })).not.toBeVisible();
});
