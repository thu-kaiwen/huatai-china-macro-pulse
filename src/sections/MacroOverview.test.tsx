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

  it("shows only the newest report and same-topic narrative when a second weekly period arrives", () => {
    const futureReport = {
      ...macroDataset.reports[0],
      id: "weekly-2026-08-09",
      title: "新一期国内周报",
      publishedAt: "2026-08-10",
      periodStart: "2026-08-03",
      periodEnd: "2026-08-09",
      summary: "新一期周报摘要。",
    };
    const dataset = {
      ...macroDataset,
      reports: [...macroDataset.reports, futureReport],
      narratives: [
        ...macroDataset.narratives,
        {
          ...macroDataset.narratives.find((narrative) => narrative.id === "weekly-policy")!,
          id: "weekly-policy-2026-08-09",
          reportId: futureReport.id,
          title: "新一期政策信号",
          summary: "只展示新一期同主题叙事。",
        },
      ],
    };

    render(<MacroOverview dataset={dataset} view="weekly" />);

    expect(screen.getByRole("heading", { name: "新一期国内周报" })).toBeInTheDocument();
    expect(screen.getByText("新一期周报摘要。")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "新一期政策信号" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "政策基调总体维持定力" })).not.toBeInTheDocument();
    expect(screen.getAllByTestId("macro-signal")).toHaveLength(1);
    expect(screen.getAllByText("华泰证券研究所获批报告")).toHaveLength(1);
  });
});
