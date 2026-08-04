import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("../sections/PriceFinancial", () => ({
  PriceFinancial: () => {
    throw new Error("injected market section failure");
  },
}));

describe("App section error isolation", () => {
  afterEach(cleanup);

  it("keeps the header and sibling sections usable when one data section throws", async () => {
    render(<App />, { onCaughtError: () => undefined });

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("价格与金融条件数据暂不可用");
    expect(screen.getByRole("heading", { name: "月度基本盘" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "行业景气矩阵" })).toBeInTheDocument();
    expect(screen.queryByText("injected market section failure")).not.toBeInTheDocument();
  });
});
