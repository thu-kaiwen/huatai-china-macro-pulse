import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the approved product identity", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "中国宏观脉搏" })).toBeInTheDocument();
    expect(screen.getByText("华泰证券研究所")).toBeInTheDocument();
  });
});
