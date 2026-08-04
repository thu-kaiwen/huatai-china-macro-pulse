import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { metricDefinitions } from "../data/metricDefinitions";
import { observations } from "../data/observations";
import { TickerTape } from "./TickerTape";

describe("TickerTape", () => {
  afterEach(cleanup);

  it("labels RMB/USD from the selected observation's comparison type and frequency", () => {
    render(<TickerTape observations={observations} definitions={metricDefinitions} />);

    expect(screen.getByText("人民币对美元周环比").parentElement).toHaveTextContent("人民币对美元周环比+0.25%");
  });

  it("changes the RMB/USD label to monthly when the latest verified observation is monthly", () => {
    const monthlyRmb = observations.find((observation) => observation.id === "monthly-rmb-usd-change")!;
    const laterPartial = {
      ...monthlyRmb,
      id: "partial-rmb-usd-change",
      periodEnd: "2026-08-31",
      value: 8.88,
      confidence: "partial" as const,
    };

    render(
      <TickerTape
        observations={[monthlyRmb, laterPartial]}
        definitions={metricDefinitions}
      />,
    );

    expect(screen.getByText("人民币对美元月环比").parentElement).toHaveTextContent("人民币对美元月环比+0.43%");
  });

  it("shows each selected observation's real frequency and period semantics", () => {
    render(<TickerTape observations={observations} definitions={metricDefinitions} />);

    expect(screen.getByText("GDP").parentElement).toHaveTextContent("季度截至 2026-06-30");
    expect(screen.getByText("出口").parentElement).toHaveTextContent("月度截至 2026-06-30");
    expect(screen.getByText("二手房").parentElement).toHaveTextContent("周度截至 2026-07-26");
    expect(screen.getByText("Brent").parentElement).toHaveTextContent("周度报告周截至 2026-08-02");
  });
});
