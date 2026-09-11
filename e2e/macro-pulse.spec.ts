import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("opens the Huatai research atlas and explores a transmission node", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeVisible();
  await page.getByRole("button", { name: "AI" }).click();
  await expect(page.getByText(/连接资本开支、生产率、就业与通胀/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Nutstore|data-excel\/|[A-Z]:\\\\/);
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
