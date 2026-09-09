import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("opens the weekly report and reveals a detailed section on demand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /国内周报.*能源供给压力的挤压效应有所上升/ })).toBeVisible();
  await expect(page.getByRole("img", { name: "Brent原油价格" })).toBeVisible();
  await expect(page.getByRole("img", { name: "国内航班数" })).toBeVisible();
  await expect(page.getByRole("img", { name: "焦化企业开工率" })).toBeVisible();
  await page.getByRole("button", { name: "展开完整解读" }).first().click();
  await expect(page.getByText(/国内、国际航班数同比分别增长2.1%和0.3%/)).toBeVisible();
});

test("opens the latest monthly report with all eight visual sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "月报" }).click();
  await expect(page.getByRole("heading", { name: /国内月报.*政策再次进入稳增长观察窗口期/ })).toBeVisible();
  await expect(page.getByText("最新版本：2026年8月31日")).toBeVisible();
  await expect(page.getByRole("img", { name: "制造业 PMI" })).toBeVisible();
  await expect(page.getByRole("button", { name: "展开完整解读" })).toHaveCount(8);
});

test("weekly report has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
