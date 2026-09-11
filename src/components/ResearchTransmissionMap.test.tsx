import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { renderApp } from "../test/renderApp";
import { ResearchTransmissionMap } from "./ResearchTransmissionMap";

describe("ResearchTransmissionMap", () => {
  it("shows three research pillars and opens the selected content entrance", async () => {
    const onNavigate = vi.fn();
    const { user } = renderApp(<ResearchTransmissionMap layers={researchAtlasData.layers} onNavigate={onNavigate} />);
    expect(screen.getByRole("heading", { name: "三大研究主线" })).toBeInTheDocument();
    expect(screen.queryByText("全球变化如何传导至中国与资产")).not.toBeInTheDocument();
    expect(screen.getAllByRole("group", { name: /研究板块/ })).toHaveLength(3);

    screen.getByRole("button", { name: "韩国" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "韩国" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/出口、制造业周期、汇率与政策变化/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "查看海外经济变化" }));
    expect(onNavigate).toHaveBeenCalledWith("global");

    await user.click(screen.getByRole("button", { name: "定期跟踪" }));
    await user.click(screen.getByRole("button", { name: "进入国内周报" }));
    expect(onNavigate).toHaveBeenCalledWith("china", "weekly");
    await user.click(screen.getByRole("button", { name: "进入国内月报" }));
    expect(onNavigate).toHaveBeenCalledWith("china", "monthly");
  });
});
