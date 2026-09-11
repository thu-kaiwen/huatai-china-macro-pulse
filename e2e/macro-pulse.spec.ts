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
