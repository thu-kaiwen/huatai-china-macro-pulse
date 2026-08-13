import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklyReport } from "./WeeklyReport";
import { weeklyReport0809 } from "../data/weeklyReports";

it("presents the overview, four key charts, and collapsed fixed sections", () => {
  render(<WeeklyReport report={weeklyReport0809} />);

  expect(screen.getByRole("heading", { name: weeklyReport0809.title })).toBeInTheDocument();
  expect(screen.getAllByRole("img")).toHaveLength(4);
  expect(screen.getAllByText("展开解读")).toHaveLength(4);
  expect(screen.queryByText("全国重点电厂日均发电量同比下行5.9%")).not.toBeInTheDocument();
});
