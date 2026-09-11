import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { renderApp } from "../test/renderApp";
import { ResearchTransmissionMap } from "./ResearchTransmissionMap";

describe("ResearchTransmissionMap", () => {
  it("shows four layers and reveals the selected research summary", async () => {
    const onNavigate = vi.fn();
    const { user } = renderApp(<ResearchTransmissionMap layers={researchAtlasData.layers} onNavigate={onNavigate} />);
    expect(screen.getAllByRole("group", { name: /研究层/ })).toHaveLength(4);
    screen.getByRole("button", { name: "AI" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "AI" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/连接资本开支、生产率、就业与通胀/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "查看相关研究" }));
    expect(onNavigate).toHaveBeenCalledWith("global");
  });
});
