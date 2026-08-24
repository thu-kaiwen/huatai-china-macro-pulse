import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklyReport } from "./WeeklyReport";
import { weeklyReport0809 } from "../data/weeklyReports";

it("presents the approved V4 dashboard with four fixed sections", () => {
  render(<WeeklyReport report={weeklyReport0809} />);

  expect(screen.getByRole("heading", { name: `国内周报｜${weeklyReport0809.title}` })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "国内航班数" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "焦化企业开工率" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "原材料价格指数" })).toBeInTheDocument();
  expect(screen.getAllByRole("columnheader", { name: "年内趋势" })).toHaveLength(2);
  expect(screen.getByText("北京进一步优化房地产政策")).toBeInTheDocument();
  expect(screen.getAllByText("展开完整解读")).toHaveLength(4);
  expect(screen.queryByText("由“一周概览”直接提炼")).not.toBeInTheDocument();
  expect(screen.getByText("Brent原油")).toBeInTheDocument();
  expect(screen.getByText("周环比 -7.3%")).toBeInTheDocument();
  expect(screen.queryByText("COMEX黄金")).not.toBeInTheDocument();
  expect(screen.queryByText("氯化钾")).not.toBeInTheDocument();
});
