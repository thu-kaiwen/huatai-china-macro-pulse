import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const visibleLocalPathPattern = /Nutstore|data-excel\/|[A-Z]:\\/i;

test("recognizes a Windows local path with one separator regardless of drive-letter case", () => {
  expect("C:\\research\\atlas").toMatch(visibleLocalPathPattern);
  expect("c:\\research\\atlas").toMatch(visibleLocalPathPattern);
});

test("opens the Huatai research atlas and explores a transmission node", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeVisible();
  await page.getByRole("button", { name: "AI" }).click();
  await expect(page.getByText(/连接资本开支、生产率、就业与通胀/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(visibleLocalPathPattern);
});

test("keeps weekly and monthly reports under China Macro Pulse", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "中国宏观脉搏" }).click();
  await expect(page.getByRole("heading", { name: /国内周报.*能源供给压力/ })).toBeVisible();
  await page.getByRole("button", { name: "月报" }).click();
  await expect(page.getByRole("heading", { name: /国内月报.*政策再次进入稳增长观察窗口期/ })).toBeVisible();
  const monthlyReport = page.locator(".monthly-report");
  await expect(monthlyReport.getByRole("link", { name: /查看.*完整趋势/ })).toHaveCount(8);
  await expect(monthlyReport.getByRole("link", { name: /点评原文|华泰证券宏观研究/ })).toHaveCount(8);
});

test("navigates every primary view with an active fragment state", async ({ page }) => {
  await page.goto("/");
  for (const [label, heading, hash] of [
    ["首页", "华泰宏观研究图谱", "#research-home"],
    ["全球研究图谱", "全球研究图谱", "#global-research"],
    ["中国宏观脉搏", /国内周报.*能源供给压力/, "#china-macro"],
    ["专题研究", "专题研究", "#topic-research"],
  ] as const) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(page.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
  }
});

test("supports keyboard transmission selection and keeps mobile connectors inside their grid gap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "AI" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "AI" })).toHaveAttribute("aria-pressed", "true");
  const connectorFits = await page.locator(".research-layer-arrow").first().evaluate((arrow) => {
    const nextLayer = arrow.parentElement?.nextElementSibling;
    const arrowBox = arrow.getBoundingClientRect();
    const nextBox = nextLayer?.getBoundingClientRect();
    return Boolean(nextBox && arrowBox.bottom <= nextBox.top);
  });
  expect(connectorFits).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("research homepage has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("research homepage in dark theme has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "dark"));
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
