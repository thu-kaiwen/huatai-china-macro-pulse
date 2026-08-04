import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../app/App";
import { renderApp } from "../test/renderApp";

describe("market conditions and industry matrix", () => {
  afterEach(cleanup);

  it("renders the approved market values with their weekly and monthly labels", () => {
    renderApp(<App />);

    expect(screen.getByRole("heading", { name: "价格与金融条件" })).toBeInTheDocument();
    expect(screen.getByText("90.12")).toBeInTheDocument();
    expect(screen.getByText("4,163.0")).toBeInTheDocument();
    expect(screen.getByText("周度最新脉搏")).toBeInTheDocument();
    expect(screen.getByText("月度锚点")).toBeInTheDocument();
    expect(screen.getByText("-1.31")).toBeInTheDocument();
    expect(screen.getByText("+1.03")).toBeInTheDocument();
    expect(screen.getByText("-1.54")).toBeInTheDocument();
    expect(screen.getByText("+0.25")).toBeInTheDocument();
    expect(screen.getByText("-2.0")).toBeInTheDocument();
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
