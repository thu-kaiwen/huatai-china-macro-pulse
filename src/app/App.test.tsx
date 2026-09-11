import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { renderApp } from "../test/renderApp";

describe("research atlas app", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.stubGlobal("scrollTo", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("opens on the Huatai macro research atlas", () => {
    renderApp(<App />);

    expect(screen.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "全球研究图谱" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "中国宏观脉搏" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "专题研究" })).toBeInTheDocument();
  });

  it("keeps the current weekly and monthly reports in China Macro Pulse", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("link", { name: "中国宏观脉搏" }));
    expect(screen.getByRole("heading", { name: "国内周报｜能源供给压力的挤压效应有所上升" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "月报" }));
    expect(screen.getByRole("heading", { name: "国内月报｜政策再次进入稳增长观察窗口期" })).toBeInTheDocument();
  });

  it("opens the global and topic research surfaces", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("link", { name: "全球研究图谱" }));
    expect(screen.getByRole("heading", { name: "全球研究图谱" })).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "专题研究" }));
    expect(screen.getByRole("heading", { name: "专题研究" })).toBeInTheDocument();
  });

  it("links global research navigation to the rendered global section", async () => {
    const { user } = renderApp(<App />);
    const globalLink = screen.getByRole("link", { name: "全球研究图谱" });

    await user.click(globalLink);

    expect(globalLink).toHaveAttribute("href", "#global-research");
    expect(document.querySelector("#global-research")).toContainElement(
      screen.getByRole("heading", { name: "全球研究图谱" }),
    );
  });

  it("returns home when the brand link is clicked from another primary view", async () => {
    const { user } = renderApp(<App />);

    await user.click(screen.getByRole("link", { name: "全球研究图谱" }));
    expect(screen.getByRole("heading", { name: "全球研究图谱" })).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "华泰证券宏观研究图谱首页" }));

    expect(screen.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeInTheDocument();
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
