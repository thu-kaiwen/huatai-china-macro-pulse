import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { weeklyDashboard0809 } from "../data/weeklyDashboard";
import { BondIssuanceChart, Sparkline, WeeklyLineChart } from "./WeeklyCharts";

describe("weekly dashboard charts", () => {
  afterEach(cleanup);

  it("plots the 2026 flight line only through August and labels its YoY change", () => {
    const chart = weeklyDashboard0809.heroCharts[0];
    if (chart.kind !== "line") throw new Error("Expected a line chart");
    const { container } = render(<WeeklyLineChart chart={chart} />);

    expect(screen.getByRole("img", { name: chart.title })).toBeInTheDocument();
    expect(screen.getByText("周同比 +4.3%")).toBeInTheDocument();
    const currentLine = container.querySelector('[data-series-label="2026"]');
    expect(currentLine).toHaveAttribute("data-last-index", "31");
    expect(Number(currentLine?.getAttribute("data-last-x"))).toBeLessThan(400);
  });

  it("renders the 2024, 2025 and 2026 seasonal activity lines", () => {
    const chart = weeklyDashboard0809.activityCharts[0];
    const { container } = render(<WeeklyLineChart chart={chart} />);

    for (const year of ["2024", "2025", "2026"]) {
      expect(container.querySelector(`[data-series-label="${year}"]`)).toBeInTheDocument();
    }
    expect(screen.getByText("12月")).toBeInTheDocument();
  });

  it("separates the year, month and week bond comparisons", () => {
    const chart = weeklyDashboard0809.heroCharts[3];
    if (chart.kind !== "bonds") throw new Error("Expected a bond chart");
    const { container } = render(<BondIssuanceChart chart={chart} />);

    expect(screen.getByRole("img", { name: chart.title })).toBeInTheDocument();
    expect(screen.getByText("本年（1月1日至8月9日）")).toBeInTheDocument();
    expect(screen.getByText("本月（8月1日至8月9日）")).toBeInTheDocument();
    expect(screen.getByText("本周（8月3日至8月9日）")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-bond-separator]")).toHaveLength(2);
  });

  it("draws an unlabeled sparkline for the finance table", () => {
    const row = weeklyDashboard0809.financeGroups[0].rows[0];
    const { container } = render(<Sparkline ariaLabel={`${row.label}年内趋势`} values={row.trend} />);

    expect(screen.getByRole("img", { name: `${row.label}年内趋势` })).toBeInTheDocument();
    expect(container.querySelectorAll("text")).toHaveLength(0);
  });
});
