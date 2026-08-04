import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the approved product identity", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "中国宏观脉搏" })).toBeInTheDocument();
    expect(screen.getByText("华泰证券研究所")).toBeInTheDocument();
  });

  it("renders the terminal shell with accessible navigation and source status", () => {
    render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "章节导航" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "总览" })).toHaveAttribute("href", "#overview");
    expect(screen.getByRole("link", { name: "月度" })).toHaveAttribute("href", "#monthly");
    expect(screen.getByRole("link", { name: "周度" })).toHaveAttribute("href", "#weekly");
    expect(screen.getByText("数据源：华泰证券研究所获批报告")).toBeInTheDocument();
  });

  it("switches to dark theme and persists the preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换至深色主题" }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("ht-macro-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "切换至浅色主题" })).toBeInTheDocument();
  });
});
