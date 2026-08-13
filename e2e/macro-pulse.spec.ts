import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("opens the weekly report and reveals a detailed section on demand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "天气因素对消费与开工的扰动减弱" })).toBeVisible();
  await expect(page.getByRole("img", { name: /国内航班数同比上行4.3%/ })).toBeVisible();
  await page.getByRole("button", { name: "展开解读" }).first().click();
  await expect(page.getByText("全国重点电厂日均发电量同比下行5.9%")).toBeVisible();
});

test("weekly report has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
