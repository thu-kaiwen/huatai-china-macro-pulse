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
  });

  it("renders a semantic industry matrix table with labeled axes and pressure-row industries", () => {
    renderApp(<App />);

    expect(screen.getByRole("table", { name: "行业景气矩阵" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "景气压力" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "景气修复" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "景气高位" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "承压" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /承压.*水泥.*光伏设备/ })).toBeInTheDocument();
  });

  it("explains that semiconductor is an observation item without a quantitative weekly observation", async () => {
    const { user } = renderApp(<App />);

    expect(screen.getByRole("heading", { name: "行业景气矩阵" })).toBeInTheDocument();
    expect(screen.getByText("半导体")).toBeInTheDocument();
    expect(screen.getByText("光伏设备")).toBeInTheDocument();
    expect(screen.getByText("水泥")).toBeInTheDocument();
    expect(screen.getByText("有色金属")).toBeInTheDocument();
    expect(screen.getByText("景气强度")).toBeInTheDocument();
    expect(screen.getByText("边际变化")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看半导体来源说明" }));

    expect(screen.getByText(/本期获批周报未提供半导体的可量化周度观测/)).toBeInTheDocument();
  });
});
