import { cleanup, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../app/App";
import { macroDataset } from "../data/dataset";
import { renderApp } from "../test/renderApp";
import { PriceFinancial } from "./PriceFinancial";

describe("market conditions and industry matrix", () => {
  afterEach(cleanup);

  it("renders the approved market values with their weekly and monthly labels", () => {
    renderApp(<App />);

    expect(screen.getByRole("heading", { name: "价格与金融条件" })).toBeInTheDocument();
    expect(screen.getByText("90.12")).toBeInTheDocument();
    expect(screen.getByText("89")).toBeInTheDocument();
    expect(screen.getByText("4,163")).toBeInTheDocument();
    expect(screen.getByText("-1,436")).toBeInTheDocument();
    expect(screen.getByText("周度最新脉搏")).toBeInTheDocument();
    expect(screen.getByText("月度锚点")).toBeInTheDocument();
    expect(screen.getByText("-1.31")).toBeInTheDocument();
    expect(screen.getByText("+1.03")).toBeInTheDocument();
    expect(screen.getByText("-1.54")).toBeInTheDocument();
    expect(screen.getByText("+0.25")).toBeInTheDocument();
    expect(screen.getByText("-2.0")).toBeInTheDocument();
    const marketSection = screen.getByRole("heading", { name: "价格与金融条件" }).closest("section")!;
    expect(within(marketSection).getAllByText("报告周截至 2026-08-02")).toHaveLength(20);
  });

  it("keeps only the newest observation per metric and frequency when a future report arrives", () => {
    const futureReport = {
      ...macroDataset.reports[0],
      id: "weekly-2026-08-09",
      title: "新一期国内周报",
      publishedAt: "2026-08-10",
      periodStart: "2026-08-03",
      periodEnd: "2026-08-09",
    };
    const olderBrent = macroDataset.observations.find((observation) => observation.id === "weekly-brent-usd")!;
    const dataset = {
      ...macroDataset,
      reports: [...macroDataset.reports, futureReport],
      observations: [
        ...macroDataset.observations,
        {
          ...olderBrent,
          id: "weekly-brent-usd-2026-08-09",
          reportId: futureReport.id,
          periodEnd: "2026-08-09",
          value: 91.23,
          sourceValueText: "91.23",
        },
      ],
    };

    renderApp(<PriceFinancial dataset={dataset} view="combined" />);

    expect(screen.getByText("91.23")).toBeInTheDocument();
    expect(screen.queryByText("90.12")).not.toBeInTheDocument();
    expect(screen.getByText("89")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "布伦特原油" })).toHaveLength(2);
  });

  it("renders a semantic industry matrix table with labeled axes and pressure-row industries", () => {
    renderApp(<App />);

    expect(screen.getByRole("table", { name: "行业景气矩阵" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "供需改善" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "高价观察" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "供需承压" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "改善" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "混合" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "承压" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /承压.*水泥.*光伏设备/ })).toBeInTheDocument();
    expect(screen.queryByText("半导体", { selector: "table *" })).not.toBeInTheDocument();
  });

  it("keeps semiconductor outside the matrix when the report cannot support a quadrant", async () => {
    const { user } = renderApp(<App />);

    expect(screen.getByRole("heading", { name: "未坐标化观察项" })).toBeInTheDocument();
    expect(screen.getByText("半导体")).toBeInTheDocument();
    expect(screen.getByText("光伏设备")).toBeInTheDocument();
    expect(screen.getByText("水泥")).toBeInTheDocument();
    expect(screen.getByText("有色金属")).toBeInTheDocument();
    expect(screen.getByText("供需状态")).toBeInTheDocument();
    expect(screen.getByText("边际变化")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看半导体来源说明" }));

    expect(screen.getByText(/本期报告没有足以确定象限的量化观测/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看周报原文" })).toHaveAttribute(
      "href",
      "https://mp.weixin.qq.com/s/i8Js6xpAwblqlMOmsNZFeQ",
    );
  });
});
