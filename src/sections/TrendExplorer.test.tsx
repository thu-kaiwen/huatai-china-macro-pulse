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

  it("preserves period semantics, source precision, evidence, and report links without hover", () => {
    const sourceCompleteDataset: MacroDataset = {
      ...expandedDataset,
      observations: expandedDataset.observations.map((observation) =>
        observation.id === "weekly-brent-usd-2026-08-09"
          ? {
              ...observation,
              value: -2,
              periodEndLabel: "报告周截至" as const,
              sourceValueText: "-2.0",
              sourceText: "未来周报保留报告周锚点及原文精度-2.0。",
            }
          : observation,
      ),
    };

    render(<TrendExplorer dataset={sourceCompleteDataset} view="weekly" />);

    const table = screen.getByRole("table", { name: "布伦特原油周频趋势数据" });
    expect(table).toHaveTextContent("周频");
    expect(table).toHaveTextContent("报告周截至 2026-08-09");
    expect(table).toHaveTextContent("-2.0 美元/桶");
    expect(table).toHaveTextContent("未来周报保留报告周锚点及原文精度-2.0。");
    expect(
      screen.getByRole("link", { name: additionalWeeklyReport.title }),
    ).toHaveAttribute("href", additionalWeeklyReport.sourceUrl);
  });

  it("plots only the newer report revision for each canonical trend period", () => {
    const revisedReport: Report = {
      ...additionalWeeklyReport,
      id: "weekly-2026-08-09-revision",
      title: "中国宏观脉搏周报（2026-08-09修订版）",
      publishedAt: "2026-08-11",
    };
    const oldRevision = expandedDataset.observations.find(
      (observation) => observation.id === "weekly-brent-usd-2026-08-09",
    )!;
    const newRevision = {
      ...oldRevision,
      id: "weekly-brent-usd-2026-08-09-revision",
      reportId: revisedReport.id,
      value: 92.4,
      sourceText: "修订报告将布伦特原油更新为92.4美元/桶。",
      sourceValueText: "92.4",
    };
    const revisionDataset: MacroDataset = {
      ...expandedDataset,
      reports: [...expandedDataset.reports, revisedReport],
      observations: [...expandedDataset.observations, newRevision],
    };

    const { container } = render(<TrendExplorer dataset={revisionDataset} view="weekly" />);

    expect(container.querySelectorAll("svg circle")).toHaveLength(2);
    expect(screen.getByRole("table", { name: "布伦特原油周频趋势数据" })).toHaveTextContent(
      "修订报告将布伦特原油更新为92.4美元/桶。",
    );
    expect(screen.queryByText(oldRevision.sourceText)).not.toBeInTheDocument();
  });
});
