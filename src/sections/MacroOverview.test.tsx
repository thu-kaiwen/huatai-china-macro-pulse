import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { macroDataset } from "../data/dataset";
import { MacroOverview } from "./MacroOverview";

describe("MacroOverview", () => {
  it("derives its weekly report and narrative from the macro dataset", () => {
    render(<MacroOverview dataset={macroDataset} view="weekly" />);

    expect(screen.getByRole("heading", { name: /出口维持高增/ })).toBeInTheDocument();
    expect(screen.getByText("截至 2026-08-02")).toBeInTheDocument();
    expect(screen.getAllByTestId("macro-signal")).toHaveLength(1);
  });
});
