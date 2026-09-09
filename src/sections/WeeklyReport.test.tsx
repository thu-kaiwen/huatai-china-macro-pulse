import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklyReport } from "./WeeklyReport";
import { weeklyReport0906 } from "../data/weeklyReports";

it("presents the approved V4 dashboard with four fixed sections", () => {
  render(<WeeklyReport report={weeklyReport0906} />);

  expect(screen.getByRole("heading", { name: `国内周报｜${weeklyReport0906.title}` })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Brent原油价格" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "国内航班数" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "焦化企业开工率" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "原材料价格指数" })).toBeInTheDocument();
  expect(screen.getAllByRole("columnheader", { name: "年内趋势" })).toHaveLength(2);
  expect(screen.getByText("国家金融监督管理总局就保险法修订草案征求意见")).toBeInTheDocument();
  expect(screen.getAllByText("展开完整解读")).toHaveLength(4);
  expect(screen.queryByText("由“一周概览”直接提炼")).not.toBeInTheDocument();
  expect(screen.getAllByText("Brent原油").length).toBeGreaterThan(0);
  expect(screen.getAllByText("周环比 +7.8%").length).toBeGreaterThan(0);
  expect(screen.queryByText("COMEX黄金")).not.toBeInTheDocument();
  expect(screen.queryByText("氯化钾")).not.toBeInTheDocument();
});
