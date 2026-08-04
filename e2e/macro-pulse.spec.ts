import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("navigates sections and persists dark theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "中国宏观脉搏", level: 1 })).toBeVisible();

  const priceNavigation = page.getByRole("link", { name: "价格·金融" });
  await priceNavigation.click();
  await expect(page.getByRole("heading", { name: "价格与金融条件" })).toBeInViewport();
  await expect(priceNavigation).toHaveAttribute("aria-current", "location");

  await page.getByRole("button", { name: "切换至深色主题" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("keeps primary controls usable without horizontal page overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "章节导航" })).toBeVisible();
  await expect(page.getByRole("group", { name: "报告视图" })).toBeVisible();
  await expect(page.getByRole("region", { name: "最新宏观指标" })).toBeVisible();
  await expect(page.getByRole("link", { name: "查看原文" }).first()).toBeVisible();

  const hasHorizontalPageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalPageOverflow).toBe(false);
});

test("updates the active navigation item when scrolling without a navigation click", async ({ page }) => {
  await page.goto("/");

  await page.locator("#markets").evaluate((element) => element.scrollIntoView());
  await expect(page.getByRole("link", { name: "价格·金融" })).toHaveAttribute("aria-current", "location");
  await expect(page.locator('nav[aria-label="章节导航"] [aria-current="location"]')).toHaveCount(1);
});

test("removes navigation links whose sections are unavailable in the selected view", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "月报" }).click();
  await expect(page.getByRole("link", { name: "周度" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "行业" })).toHaveCount(0);
  expect(
    await page.locator('nav[aria-label="章节导航"] a').evaluateAll((links) =>
      links.every((link) => document.querySelector(link.getAttribute("href") ?? "missing") !== null),
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "周报" }).click();
  await expect(page.getByRole("link", { name: "月度" })).toHaveCount(0);
  expect(
    await page.locator('nav[aria-label="章节导航"] a').evaluateAll((links) =>
      links.every((link) => document.querySelector(link.getAttribute("href") ?? "missing") !== null),
    ),
  ).toBe(true);
});

test("collapses multi-column market groups to two columns at 1024px", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");

  const columnCount = await page.locator(".market-group-grid").first().evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  );
  expect(columnCount).toBe(2);
});

test("returns to the top after an actual page scroll", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const backToTop = page.getByRole("button", { name: "回到顶部" });
  await expect(backToTop).toBeVisible();
  await backToTop.click();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  await expect(page.getByRole("heading", { name: "中国宏观脉搏", level: 1 })).toBeInViewport();
});

test("uses desktop marquee motion and mobile manual ticker scrolling", async ({ page }) => {
  await page.goto("/");
  const viewportWidth = page.viewportSize()!.width;
  const ticker = page.getByRole("region", { name: "最新宏观指标" });
  const track = ticker.locator(".ticker-track");
  const duplicate = ticker.locator('.ticker-items[aria-hidden="true"]');

  if (viewportWidth > 640) {
    await expect(track).toHaveCSS("animation-name", "ticker-marquee");
    await expect(ticker).toHaveCSS("overflow-x", "hidden");
    await expect(duplicate).toHaveCSS("display", "flex");

    await ticker.hover();
    await expect(track).toHaveCSS("animation-play-state", "paused");
    await ticker.focus();
    await expect(track).toHaveCSS("animation-play-state", "paused");
  } else {
    await expect(track).toHaveCSS("animation-name", "none");
    await expect(ticker).toHaveCSS("overflow-x", "auto");
    await expect(duplicate).toHaveCSS("display", "none");
    const scrollLeft = await ticker.evaluate((element) => {
      element.scrollLeft = 100;
      return element.scrollLeft;
    });
    expect(scrollLeft).toBeGreaterThan(0);
  }
});

test.describe("reduced motion", () => {
  test("disables ticker marquee duplication and keeps manual scrolling", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const ticker = page.getByRole("region", { name: "最新宏观指标" });

    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
    await expect(ticker.locator(".ticker-track")).toHaveCSS("animation-name", "none");
    await expect(ticker).toHaveCSS("overflow-x", "auto");
    await expect(ticker.locator('.ticker-items[aria-hidden="true"]')).toHaveCSS("display", "none");
  });
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} theme has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto("/");
    if (theme === "dark") {
      await page.getByRole("button", { name: "切换至深色主题" }).click();
    }

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
