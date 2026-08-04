import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderApp } from "../test/renderApp";

describe("App", () => {
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

  it("renders the approved product identity", () => {
    renderApp(<App />);
    expect(screen.getByRole("heading", { name: "中国宏观脉搏" })).toBeInTheDocument();
    expect(screen.getByText("华泰证券研究所")).toBeInTheDocument();
  });

  it("renders the terminal shell with accessible navigation and source status", () => {
    renderApp(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "章节导航" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "总览" })).toHaveAttribute("href", "#overview");
    expect(screen.getByRole("link", { name: "月度" })).toHaveAttribute("href", "#monthly");
    expect(screen.getByRole("link", { name: "周度" })).toHaveAttribute("href", "#weekly");
    expect(screen.getByText("数据源：华泰证券研究所获批报告")).toBeInTheDocument();
  });

  it("switches to dark theme and persists the preference", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "切换至深色主题" }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("ht-macro-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "切换至浅色主题" })).toBeInTheDocument();
  });

  it("renders the combined overview with the latest report headline and all narrative signals", () => {
    renderApp(<App />);

    expect(screen.getByRole("button", { name: "综合" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: /出口维持高增/ })).toBeInTheDocument();
    expect(screen.getAllByTestId("macro-signal")).toHaveLength(5);
  });

  it("filters the overview to the weekly approved report", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "周报" }));

    expect(screen.getByRole("button", { name: "周报" })).toHaveAttribute("aria-pressed", "true");
    const marketSection = screen.getByRole("heading", { name: "价格与金融条件" }).closest("section")!;
    expect(within(marketSection).getAllByText("报告周截至 2026-08-02")).toHaveLength(20);
    expect(screen.getAllByTestId("macro-signal")).toHaveLength(1);
  });

  it("shows an accessible back-to-top control only after scrolling and scrolls smoothly", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const { user } = renderApp(<App />);

    expect(screen.queryByRole("button", { name: "回到顶部" })).not.toBeInTheDocument();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 720 });
    fireEvent.scroll(window);
    await user.click(screen.getByRole("button", { name: "回到顶部" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("uses an immediate back-to-top scroll when reduced motion is requested", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const { user } = renderApp(<App />);

    Object.defineProperty(window, "scrollY", { configurable: true, value: 720 });
    fireEvent.scroll(window);
    await user.click(screen.getByRole("button", { name: "回到顶部" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
