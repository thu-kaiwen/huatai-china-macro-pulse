import { cleanup, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { macroDataset } from "../data/dataset";
import { renderApp } from "../test/renderApp";
import { PriceFinancial } from "./PriceFinancial";

afterEach(cleanup);

it("keeps only the newest observation per metric when a future report arrives", () => {
  const futureReport = { ...macroDataset.reports[0], id: "weekly-2026-08-09", publishedAt: "2026-08-10", periodEnd: "2026-08-09" };
  const olderBrent = macroDataset.observations.find((observation) => observation.id === "weekly-brent-usd")!;
  const dataset = {
    ...macroDataset,
    reports: [...macroDataset.reports, futureReport],
    observations: [...macroDataset.observations, { ...olderBrent, id: "weekly-brent-usd-2026-08-09", reportId: futureReport.id, periodEnd: "2026-08-09", value: 91.23, sourceValueText: "91.23" }],
  };

  renderApp(<PriceFinancial dataset={dataset} view="combined" />);
  expect(screen.getByText("91.23")).toBeInTheDocument();
  expect(screen.queryByText("90.12")).not.toBeInTheDocument();
});
