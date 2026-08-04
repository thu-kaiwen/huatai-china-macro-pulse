import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { macroDataset } from "../data/dataset";
import type { MacroDataset, MetricObservation, Report } from "../domain/types";
import { TickerTape } from "./TickerTape";

function renderTicker(dataset: MacroDataset) {
  return render(<TickerTape dataset={dataset} />);
}

function getTickerItem(label: string) {
  const primaryItems = screen.getByRole("region", { name: "最新宏观指标" })
    .querySelector<HTMLElement>(".ticker-items:not([aria-hidden])")!;
  return within(primaryItems).getByText(label).parentElement;
}

describe("TickerTape", () => {
  afterEach(cleanup);

  it("labels RMB/USD from the selected observation's comparison type and frequency", () => {
    renderTicker(macroDataset);

    expect(getTickerItem("人民币对美元周环比")).toHaveTextContent("人民币对美元周环比+0.25%");
  });

  it("changes the RMB/USD label to monthly when the latest verified observation is monthly", () => {
    const monthlyRmb = macroDataset.observations.find((observation) => observation.id === "monthly-rmb-usd-change")!;
    const laterPartial = {
      ...monthlyRmb,
      id: "partial-rmb-usd-change",
      periodEnd: "2026-08-31",
      value: 8.88,
      confidence: "partial" as const,
    };

    renderTicker({
      ...macroDataset,
      observations: [monthlyRmb, laterPartial],
    });

    expect(getTickerItem("人民币对美元月环比")).toHaveTextContent("人民币对美元月环比+0.43%");
  });

  it("shows each selected observation's real frequency and period semantics", () => {
    renderTicker(macroDataset);

    expect(getTickerItem("GDP")).toHaveTextContent("季度截至 2026-06-30");
    expect(getTickerItem("出口")).toHaveTextContent("月度截至 2026-06-30");
    expect(getTickerItem("二手房")).toHaveTextContent("周度截至 2026-07-26");
    expect(getTickerItem("Brent")).toHaveTextContent("周度报告周截至 2026-08-02");
  });

  it("uses the newest report when the same statistical period is revised", () => {
    const currentReport = macroDataset.reports.find((report) => report.id === "weekly-2026-08-02")!;
    const revisedReport: Report = {
      ...currentReport,
      id: "weekly-2026-08-02-revision",
      title: "同统计期修订周报",
      publishedAt: "2026-08-03",
    };
    const currentRmb = macroDataset.observations.find(
      (observation) => observation.id === "weekly-rmb-usd-change",
    )!;
    const revisedRmb: MetricObservation = {
      ...currentRmb,
      id: "weekly-rmb-usd-change-revision",
      reportId: revisedReport.id,
      value: 0.31,
      sourceValueText: "0.31",
      sourceText: "修订周报披露人民币兑美元周环比升值0.31%。",
    };
    const dataset: MacroDataset = {
      ...macroDataset,
      reports: [...macroDataset.reports, revisedReport],
      observations: [...macroDataset.observations, revisedRmb],
    };

    renderTicker(dataset);

    expect(getTickerItem("人民币对美元周环比")).toHaveTextContent("+0.31%");
  });

  it("does not let a newer report's partial observation replace the latest verified value", () => {
    const currentReport = macroDataset.reports.find((report) => report.id === "weekly-2026-08-02")!;
    const partialReport: Report = {
      ...currentReport,
      id: "weekly-2026-08-10-partial",
      title: "部分核验的新周报",
      publishedAt: "2026-08-10",
    };
    const currentRmb = macroDataset.observations.find(
      (observation) => observation.id === "weekly-rmb-usd-change",
    )!;
    const partialRmb: MetricObservation = {
      ...currentRmb,
      id: "weekly-rmb-usd-change-partial",
      reportId: partialReport.id,
      periodEnd: "2026-08-09",
      value: 8.88,
      confidence: "partial",
      sourceText: "尚未核验的新周报数据。",
    };
    const dataset: MacroDataset = {
      ...macroDataset,
      reports: [...macroDataset.reports, partialReport],
      observations: [...macroDataset.observations, partialRmb],
    };

    renderTicker(dataset);

    expect(getTickerItem("人民币对美元周环比")).toHaveTextContent("+0.25%");
  });

  it("lets a newer report's verified disclosure win even when its statistical period is older", () => {
    const currentReport = macroDataset.reports.find((report) => report.id === "weekly-2026-08-02")!;
    const laterReport: Report = {
      ...currentReport,
      id: "weekly-2026-08-10",
      title: "补充披露的新周报",
      publishedAt: "2026-08-10",
    };
    const currentRmb = macroDataset.observations.find(
      (observation) => observation.id === "weekly-rmb-usd-change",
    )!;
    const olderPeriodDisclosure: MetricObservation = {
      ...currentRmb,
      id: "weekly-rmb-usd-change-disclosure",
      reportId: laterReport.id,
      periodEnd: "2026-07-01",
      periodEndLabel: "截至",
      value: 0.5,
      sourceValueText: "0.50",
      sourceText: "新周报补充披露较旧统计期的人民币数据。",
    };
    const dataset: MacroDataset = {
      ...macroDataset,
      reports: [...macroDataset.reports, laterReport],
      observations: [...macroDataset.observations, olderPeriodDisclosure],
    };

    renderTicker(dataset);

    expect(getTickerItem("人民币对美元周环比")).toHaveTextContent(
      "+0.50%周度截至 2026-07-01",
    );
  });

  it("provides one accessible ticker copy and one aria-hidden marquee copy", () => {
    const { container } = renderTicker(macroDataset);
    const copies = container.querySelectorAll(".ticker-track > .ticker-items");

    expect(copies).toHaveLength(2);
    expect(copies[0]).not.toHaveAttribute("aria-hidden");
    expect(copies[1]).toHaveAttribute("aria-hidden", "true");
  });
});
