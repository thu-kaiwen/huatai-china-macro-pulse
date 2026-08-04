import { describe, expect, it } from "vitest";
import { validateDataset } from "../domain/validateDataset";
import { macroDataset } from "./dataset";

function findObservation(metricId: string, frequency: "weekly" | "monthly") {
  return macroDataset.observations.find(
    (item) => item.metricId === metricId && item.frequency === frequency,
  );
}

function findValue(metricId: string, frequency: "weekly" | "monthly") {
  return findObservation(metricId, frequency)?.value;
}

describe("approved macro report dataset", () => {
  it("preserves the verified data and traceable source excerpts", () => {
    expect(validateDataset(macroDataset)).toEqual([]);
    expect(macroDataset.reports).toHaveLength(2);
    expect(Object.isFrozen(macroDataset)).toBe(true);
    expect(Object.isFrozen(macroDataset.reports)).toBe(true);
    expect(Object.isFrozen(macroDataset.reports[0])).toBe(true);
    expect(Object.isFrozen(macroDataset.reports[0].authors)).toBe(true);
    expect(Object.isFrozen(macroDataset.policyEvents[0].tags)).toBe(true);
    expect(macroDataset.reports.find((item) => item.id === "weekly-2026-08-02")).toMatchObject({
      title: "【华泰宏观 | 图解国内周报】出口维持高增但地产成交边际降温",
      publishedAt: "2026-08-02",
      sourceUrl: "https://mp.weixin.qq.com/s/i8Js6xpAwblqlMOmsNZFeQ",
    });
    expect(macroDataset.reports.find((item) => item.id === "monthly-2026-07")).toMatchObject({
      title: "【华泰宏观 | 图解国内月报】供给冲击再现扰动内需修复",
      publishedAt: "2026-07-31",
      sourceUrl: "https://mp.weixin.qq.com/s/OXLQFLNXvQoI8GVX9MJ4CA",
    });
    expect(findValue("exports-yoy", "monthly")).toBe(27);
    expect(findValue("brent-usd", "weekly")).toBe(90.12);
    expect(findValue("manufacturing-pmi", "weekly")).toBe(49.2);
    expect(findObservation("second-home-area-yoy", "weekly")?.previousValue).toBe(5.3);
    expect(macroDataset.observations.every((item) => item.sourceText.length >= 12)).toBe(true);
  });
});
