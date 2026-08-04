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

  it("renders an accessible industry matrix whose source explanations can be opened", async () => {
    const { user } = renderApp(<App />);

    expect(screen.getByRole("heading", { name: "行业景气矩阵" })).toBeInTheDocument();
    expect(screen.getByText("半导体")).toBeInTheDocument();
    expect(screen.getByText("光伏设备")).toBeInTheDocument();
    expect(screen.getByText("水泥")).toBeInTheDocument();
    expect(screen.getByText("有色金属")).toBeInTheDocument();
    expect(screen.getByText("景气强度")).toBeInTheDocument();
    expect(screen.getByText("边际变化")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看半导体来源说明" }));

    expect(screen.getByText(/来源说明：周报摘要提及产业创新与科技金融部署/)).toBeInTheDocument();
  });
});
