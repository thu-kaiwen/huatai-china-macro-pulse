import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderApp } from "../test/renderApp";

describe("weekly report app", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("opens directly on the current weekly report", () => {
    renderApp(<App />);

    expect(screen.getByRole("heading", { name: "国内周报｜天气因素对消费与开工的扰动减弱" })).toBeInTheDocument();
    expect(screen.getByText("华泰证券宏观团队 · 国内周报 · 2026-08-09")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "周度" })).toHaveAttribute("href", "#weekly");
    expect(screen.queryByRole("link", { name: "行业" })).not.toBeInTheDocument();
  });

  it("shows the selected activity charts immediately and expands the written interpretation", async () => {
    const { user } = renderApp(<App />);

    expect(screen.getByRole("img", { name: "焦化企业开工率" })).toBeInTheDocument();
    expect(screen.queryByText(/出行方面，国内航班数同比回升4.3%/)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "展开完整解读" })[0]);
    expect(screen.getByText(/出行方面，国内航班数同比回升4.3%/)).toBeInTheDocument();
  });

  it("keeps the monthly dashboard available from the weekly page", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "月报" }));
    expect(screen.getByRole("heading", { name: "中国宏观脉搏" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "月报" })).toHaveAttribute("aria-pressed", "true");
  });

  it("switches to dark theme and persists the preference", async () => {
    const { user } = renderApp(<App />);
    await user.click(screen.getByRole("button", { name: "切换至深色主题" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("ht-macro-theme")).toBe("dark");
  });

  it("shows an accessible back-to-top control after scrolling", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const { user } = renderApp(<App />);

    Object.defineProperty(window, "scrollY", { configurable: true, value: 720 });
    fireEvent.scroll(window);
    await user.click(screen.getByRole("button", { name: "回到顶部" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
