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

    expect(screen.getByRole("heading", { name: "国内周报｜能源供给压力的挤压效应有所上升" })).toBeInTheDocument();
    expect(screen.getByText("华泰证券宏观团队 · 国内周报 · 2026-09-06")).toBeInTheDocument();
    expect(screen.getAllByText("Brent")[0]?.parentElement).toHaveTextContent("96.3美元/桶");
    expect(screen.getByRole("link", { name: "周度" })).toHaveAttribute("href", "#weekly");
    expect(screen.queryByRole("link", { name: "行业" })).not.toBeInTheDocument();
  });

  it("shows the selected activity charts immediately and expands the written interpretation", async () => {
    const { user } = renderApp(<App />);

    expect(screen.getByRole("img", { name: "焦化企业开工率" })).toBeInTheDocument();
    expect(screen.queryByText(/国内、国际航班数同比分别增长2.1%和0.3%/)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "展开完整解读" })[0]);
    expect(screen.getByText(/国内、国际航班数同比分别增长2.1%和0.3%/)).toBeInTheDocument();
  });

  it("keeps the monthly dashboard available from the weekly page", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "月报" }));
    expect(screen.getByRole("heading", { name: "国内月报｜政策再次进入稳增长观察窗口期" })).toBeInTheDocument();
    expect(screen.getByText("最新版本：2026年8月31日")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "制造业 PMI" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "展开完整解读" })).toHaveLength(8);
    expect(screen.getByRole("button", { name: "月报" })).toHaveAttribute("aria-pressed", "true");
  });

  it("adds a clickable mini trend to every monthly summary", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "月报" }));

    expect(screen.getAllByRole("img", { name: /趋势$/ })).toHaveLength(8);
    expect(screen.getByRole("link", { name: "查看PMI完整趋势" })).toHaveAttribute("href", "#monthly-pmi");
    expect(screen.getByRole("link", { name: "查看进出口数据完整趋势" })).toHaveAttribute("href", "#monthly-trade");
  });

  it("links monthly commentary to Huatai Macro Research", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("button", { name: "月报" }));

    const inflationArticle = screen.getByRole("link", { name: "阅读通胀点评原文" });
    expect(inflationArticle).toHaveAttribute("href", "https://mp.weixin.qq.com/s/KjbwZeFhfQjXboUAGpYF_w");
    expect(inflationArticle).toHaveAttribute("target", "_blank");
    expect(screen.getAllByRole("link", { name: "进入华泰证券宏观研究" })).toHaveLength(7);
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
