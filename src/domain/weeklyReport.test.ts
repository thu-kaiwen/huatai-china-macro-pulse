import { describe, expect, it } from "vitest";
import { weeklyReport0731 } from "../data/weeklyReports";
import { selectHeroCharts, validateWeeklyReportPage } from "./weeklyReport";

describe("2022-07-31 weekly report page", () => {
  it("is valid with its four fixed sections", () => {
    expect(validateWeeklyReportPage(weeklyReport0731)).toEqual([]);
    expect(weeklyReport0731.sections.map((section) => section.title)).toEqual([
      "高频经济活动跟踪",
      "价格指标及通胀变化",
      "利率、汇率及金融市场环境",
      "宏观政策跟踪",
    ]);
  });

  it("selects four explicitly marked hero charts", () => {
    const charts = selectHeroCharts(weeklyReport0731);

    expect(charts).toHaveLength(4);
    expect(charts.every((chart) => chart.isHero)).toBe(true);
  });

  it("rejects a page whose hero references and chart flags do not form the same four-chart set", () => {
    const extraHero = structuredClone(weeklyReport0731);
    extraHero.sections[0].charts[1].isHero = true;
    expect(validateWeeklyReportPage(extraHero)).toContain("Exactly four charts must be marked isHero");

    const missingHeroReference = structuredClone(weeklyReport0731);
    missingHeroReference.heroCharts.pop();
    expect(validateWeeklyReportPage(missingHeroReference)).toContain("Exactly four hero chart references are required");
    expect(validateWeeklyReportPage(missingHeroReference)).toContain("Hero chart IDs and isHero chart IDs must match");
  });

  it("rejects a chart with an empty static asset path", () => {
    const page = structuredClone(weeklyReport0731);
    page.sections[0].charts[0].assetPath = "";

    expect(validateWeeklyReportPage(page)).toContain(
      `Chart ${page.sections[0].charts[0].id} has an empty asset path`,
    );
  });
});
