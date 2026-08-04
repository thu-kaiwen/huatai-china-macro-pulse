import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { metricDefinitions } from "../data/metricDefinitions";
import { observations } from "../data/observations";
import { TickerTape } from "./TickerTape";

describe("TickerTape", () => {
  it("labels the latest RMB/USD observation as a weekly change rather than a spot rate", () => {
    render(<TickerTape observations={observations} definitions={metricDefinitions} />);

    expect(screen.getByText("人民币对美元周变动").parentElement).toHaveTextContent("人民币对美元周变动+0.25%");
  });
});
