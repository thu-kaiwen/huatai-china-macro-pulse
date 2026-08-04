import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../app/App";
import { renderApp } from "../test/renderApp";

describe("policy, outlook, and source research context", () => {
  afterEach(cleanup);

  it("keeps policy context and the approved report archive traceable", () => {
    renderApp(<App />);

    expect(screen.getByText("中共中央政治局会议")).toBeInTheDocument();
    const sourceLinks = screen.getAllByRole("link", { name: "查看原文" });
    expect(sourceLinks).toHaveLength(2);
    expect(sourceLinks[0]).toHaveAttribute(
      "href",
      "https://mp.weixin.qq.com/s/i8Js6xpAwblqlMOmsNZFeQ",
    );
    expect(sourceLinks[1]).toHaveAttribute(
      "href",
      "https://mp.weixin.qq.com/s/OXLQFLNXvQoI8GVX9MJ4CA",
    );
    expect(screen.getByText("报告标题：【华泰宏观 | 图解国内周报】出口维持高增但地产成交边际降温")).toBeInTheDocument();
    expect(screen.getAllByText("发布日期 2026-08-02").length).toBeGreaterThan(0);
    expect(screen.getAllByText("统计期").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "查看政策所引周报原文" })).toHaveLength(7);
    expect(screen.getAllByText(/易峘/).length).toBeGreaterThan(0);
    expect(screen.getByText(/不构成对任何人的投资建议/)).toBeInTheDocument();
  });
});
