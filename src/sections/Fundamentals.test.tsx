import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../app/App";
import { renderApp } from "../test/renderApp";

describe("macro fundamentals", () => {
  afterEach(cleanup);

  it("renders verified monthly and weekly observations with their exact approved values", () => {
    renderApp(<App />);

    expect(screen.getByRole("heading", { name: "月度基本盘" })).toBeInTheDocument();
    expect(screen.getByText("27.0%")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "周度高频脉搏" })).toBeInTheDocument();
    expect(screen.getByText("49.2")).toBeInTheDocument();
  });

  it("uses the report-frequency filter to show only monthly fundamentals", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "月报" }));

    expect(screen.getByRole("heading", { name: "月度基本盘" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "周度高频脉搏" })).not.toBeInTheDocument();
  });

  it("reveals the metric methodology, source excerpt, report, and original link", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "查看出口披露" }));

    expect(screen.getByText("口径：同比" )).toBeInTheDocument();
    expect(screen.getByText("来源摘录：出口同比增长27.0%，前值为19.4%。")).toBeInTheDocument();
    expect(screen.getByText("【华泰宏观 | 图解国内月报】供给冲击再现扰动内需修复")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看原始报告" })).toHaveAttribute(
      "href",
      "https://mp.weixin.qq.com/s/OXLQFLNXvQoI8GVX9MJ4CA",
    );
  });
});
