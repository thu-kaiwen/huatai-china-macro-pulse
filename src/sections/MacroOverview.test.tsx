import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { macroDataset } from "../data/dataset";
import { MacroOverview } from "./MacroOverview";

describe("MacroOverview", () => {
  afterEach(cleanup);

  it("shows the weekly report's publication date, reporting period, and original source", () => {
    const dataset = {
      ...macroDataset,
      reports: macroDataset.reports.map((report) =>
        report.id === "weekly-2026-08-02" ? { ...report, publishedAt: "2026-08-03" } : report,
      ),
    };

    render(<MacroOverview dataset={dataset} view="weekly" />);

    expect(screen.getByRole("heading", { name: /出口维持高增/ })).toBeInTheDocument();
    expect(screen.getByText("发布日期 2026-08-03")).toBeInTheDocument();
    expect(screen.getByText("统计期 2026-07-27 至 2026-08-02")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /出口维持高增/ })).toHaveAttribute(
      "href",
      "https://mp.weixin.qq.com/s/i8Js6xpAwblqlMOmsNZFeQ",
    );
    expect(screen.getAllByTestId("macro-signal")).toHaveLength(1);
  });

  it("renders the selected report's dataset summary", () => {
    render(<MacroOverview dataset={macroDataset} view="weekly" />);

    expect(screen.getByText("跟踪七月末政策部署、国内高频需求、价格与流动性变化。")).toBeInTheDocument();
  });
});
