import { describe, expect, it } from "vitest";
import { weeklyReport0809 } from "../data/weeklyReports";
import { selectHeroCharts, validateWeeklyReportPage } from "./weeklyReport";

describe("2026-08-09 weekly report page", () => {
  it("is valid with its four fixed sections", () => {
    expect(validateWeeklyReportPage(weeklyReport0809)).toEqual([]);
    expect(weeklyReport0809.publishedAt).toBe("2026-08-09");
    expect(weeklyReport0809.sections.map((section) => section.title)).toEqual([
      "高频经济活动跟踪",
      "价格指标及通胀变化",
      "利率、汇率及金融市场环境",
      "宏观政策跟踪",
    ]);
  });

  it("selects four explicitly marked hero charts", () => {
    const charts = selectHeroCharts(weeklyReport0809);

    expect(charts).toHaveLength(4);
    expect(charts.every((chart) => chart.isHero)).toBe(true);
    expect(charts.map((chart) => chart.id)).toEqual([
      "domestic-flights",
      "construction-steel-transactions",
      "tier-one-new-home-sales",
      "government-bond-issuance",
    ]);
  });

  it("rejects a page whose hero references and chart flags do not form the same four-chart set", () => {
    const extraHero = structuredClone(weeklyReport0809);
    extraHero.sections[0].charts[1].isHero = true;
    expect(validateWeeklyReportPage(extraHero)).toContain("Exactly four charts must be marked isHero");

    const missingHeroReference = structuredClone(weeklyReport0809);
    missingHeroReference.heroCharts.pop();
    expect(validateWeeklyReportPage(missingHeroReference)).toContain("Exactly four hero chart references are required");
    expect(validateWeeklyReportPage(missingHeroReference)).toContain("Hero chart IDs and isHero chart IDs must match");
  });

  it("rejects a chart with an empty static asset path", () => {
    const page = structuredClone(weeklyReport0809);
    page.sections[0].charts[0].assetPath = "";

    expect(validateWeeklyReportPage(page)).toContain(
      `Chart ${page.sections[0].charts[0].id} has an empty asset path`,
    );
  });

  it("stores the approved V4 flight series on a fixed 52-week axis", () => {
    const dashboard = weeklyReport0809.dashboard;
    expect(dashboard).toBeDefined();
    if (!dashboard) throw new Error("Expected V4 dashboard data");

    const flight = dashboard.heroCharts.find((item) => item.id === "domestic-flights");
    expect(flight?.kind).toBe("line");
    if (!flight || flight.kind !== "line") throw new Error("Expected flight line chart");

    const currentYear = flight.series.find((series) => series.label === "2026");
    expect(flight.totalPoints).toBe(52);
    expect(currentYear?.values).toHaveLength(52);
    expect(currentYear?.values[31]).toBe(221_761);
    expect(currentYear?.values.slice(32)).toEqual(Array(20).fill(null));
    expect(flight.endpointLabel).toBe("周同比 +4.3%");
  });

  it("keeps the activity charts seasonal through December with 2024 to 2026 series", () => {
    const dashboard = weeklyReport0809.dashboard;
    expect(dashboard).toBeDefined();
    if (!dashboard) throw new Error("Expected V4 dashboard data");

    for (const chartId of ["coking-rate", "blast-furnace-rate", "construction-steel"]) {
      const chart = dashboard.activityCharts.find((item) => item.id === chartId);
      expect(chart?.totalPoints).toBe(52);
      expect(chart?.xTicks.at(-1)?.label).toBe("12月");
      expect(chart?.series.map((series) => series.label)).toEqual(["2024", "2025", "2026"]);
      expect(chart?.series.at(-1)?.values.slice(32).every((value) => value === null)).toBe(true);
    }
  });

  it("uses the approved normalized price groups and records every weekly change", () => {
    const dashboard = weeklyReport0809.dashboard;
    expect(dashboard).toBeDefined();
    if (!dashboard) throw new Error("Expected V4 dashboard data");

    const rawMaterials = dashboard.priceCharts.find((chart) => chart.id === "raw-materials");
    const industrial = dashboard.priceCharts.find((chart) => chart.id === "industrial-products");

    expect(rawMaterials?.subtitle).toContain("2025/1/1=100");
    expect(rawMaterials?.series.map((series) => series.label)).not.toContain("COMEX黄金");
    expect(industrial?.series.map((series) => series.label)).not.toContain("氯化钾");
    expect(dashboard.priceCharts.flatMap((chart) => chart.series).every((series) => Boolean(series.weeklyChange))).toBe(true);
  });
});
