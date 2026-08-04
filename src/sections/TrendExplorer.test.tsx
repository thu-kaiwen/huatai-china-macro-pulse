import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { macroDataset } from "../data/dataset";
import type { MacroDataset, Report } from "../domain/types";
import { TrendExplorer } from "./TrendExplorer";

const additionalWeeklyReport: Report = {
  id: "weekly-2026-08-09",
  frequency: "weekly",
  title: "中国宏观脉搏周报（2026-08-09）",
  publishedAt: "2026-08-10",
  periodStart: "2026-08-03",
  periodEnd: "2026-08-09",
  sourceUrl: "https://example.com/weekly-2026-08-09",
  authors: ["Research Team"],
  summary: "用于验证未来周报趋势的测试数据。",
};

const expandedDataset: MacroDataset = {
  ...macroDataset,
  reports: [...macroDataset.reports, additionalWeeklyReport],
  observations: [
    ...macroDataset.observations,
    {
      ...macroDataset.observations.find((observation) => observation.id === "weekly-brent-usd")!,
      id: "weekly-brent-usd-2026-08-09",
      reportId: additionalWeeklyReport.id,
      periodEnd: additionalWeeklyReport.periodEnd,
      value: 91.3,
      sourceText: "布伦特原油报91.3美元/桶。",
    },
  ],
};

describe("TrendExplorer", () => {
  afterEach(cleanup);

  it("hides trends until the approved reports supply enough observations", () => {
    const { rerender } = render(<TrendExplorer dataset={macroDataset} view="combined" />);

    expect(screen.queryByRole("heading", { name: "跨尺度趋势" })).not.toBeInTheDocument();

    rerender(<TrendExplorer dataset={expandedDataset} view="combined" />);

    expect(screen.getByRole("heading", { name: "跨尺度趋势" })).toBeInTheDocument();
    expect(screen.getByLabelText("布伦特原油周频与月频趋势图")).toBeInTheDocument();
  });

  it("renders a native trend only after the selected frequency has two observations", () => {
    const { rerender } = render(<TrendExplorer dataset={macroDataset} view="weekly" />);

    expect(screen.queryByRole("heading", { name: "周频趋势" })).not.toBeInTheDocument();

    rerender(<TrendExplorer dataset={expandedDataset} view="weekly" />);

    expect(screen.getByRole("heading", { name: "周频趋势" })).toBeInTheDocument();
    expect(screen.getByLabelText("布伦特原油周频趋势图")).toBeInTheDocument();
  });

  it("does not combine observations when the canonical definition is not cross-frequency", () => {
    const weeklyOnlyBrentDataset: MacroDataset = {
      ...expandedDataset,
      metricDefinitions: expandedDataset.metricDefinitions.map((definition) =>
        definition.id === "brent-usd" ? { ...definition, nativeFrequency: "weekly" as const } : definition,
      ),
    };

    render(<TrendExplorer dataset={weeklyOnlyBrentDataset} view="combined" />);

    expect(screen.queryByRole("heading", { name: "跨尺度趋势" })).not.toBeInTheDocument();
  });
});
