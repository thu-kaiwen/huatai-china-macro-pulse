import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

const failureCases = [
  { component: "tickerTape", fallback: "关键指标带数据暂不可用", sibling: "来源与方法" },
  { component: "macroOverview", fallback: "宏观总览数据暂不可用", sibling: "月度基本盘" },
  { component: "monthlyFundamentals", fallback: "月度基本盘数据暂不可用", sibling: "周度高频脉搏" },
  { component: "weeklyPulse", fallback: "周度高频脉搏数据暂不可用", sibling: "月度基本盘" },
  { component: "priceFinancial", fallback: "价格与金融条件数据暂不可用", sibling: "行业景气矩阵" },
  { component: "trendExplorer", fallback: "趋势浏览器数据暂不可用", sibling: "价格与金融条件" },
  { component: "industryMatrix", fallback: "行业景气矩阵数据暂不可用", sibling: "政策时间线" },
  { component: "policyTimeline", fallback: "政策与事件数据暂不可用", sibling: "展望与风险" },
  { component: "outlookRisks", fallback: "后续观察与风险数据暂不可用", sibling: "来源与方法" },
  { component: "sourcesArchive", fallback: "来源、方法与归档数据暂不可用", sibling: "政策时间线" },
] as const;

function ThrowingSection(): never {
  throw new Error("injected section failure");
}

describe("App section error isolation", () => {
  afterEach(cleanup);

  for (const { component, fallback, sibling } of failureCases) {
    it(`keeps the shell, sibling modules, and navigation anchors when ${component} throws`, () => {
      render(<App components={{ [component]: ThrowingSection }} />, {
        onCaughtError: () => undefined,
      });

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "中国宏观脉搏", level: 1 })).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "报告视图" })).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(fallback);
      expect(screen.getByRole("heading", { name: sibling })).toBeInTheDocument();
      expect(screen.queryByText("injected section failure")).not.toBeInTheDocument();

      const links = screen.getByRole("navigation", { name: "章节导航" })
        .querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
      expect(links).toHaveLength(8);
      for (const link of links) {
        expect(document.querySelector(link.hash)).not.toBeNull();
      }
    });
  }
});
