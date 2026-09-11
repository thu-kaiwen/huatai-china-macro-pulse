import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { monthlyReport0831 } from "../data/monthlyReport";
import { researchAtlasData } from "../data/researchAtlas";
import { weeklyReport0906 } from "../data/weeklyReports";
import { renderApp } from "../test/renderApp";
import { GlobalResearchAtlas } from "./GlobalResearchAtlas";
import { ResearchHome } from "./ResearchHome";
import { TopicResearch } from "./TopicResearch";

describe("research surfaces", () => {
  it("presents research distinctiveness before report navigation", async () => {
    const onNavigate = vi.fn();
    const { user } = renderApp(
      <ResearchHome
        data={researchAtlasData}
        monthlyReport={monthlyReport0831}
        onNavigate={onNavigate}
        weeklyReport={weeklyReport0906}
      />,
    );

    expect(screen.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "本周研究重点" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "原创研究精选" })).toBeInTheDocument();
    expect(screen.getAllByRole("article", { name: /原创研究专题/ })).toHaveLength(6);
    expect(screen.getAllByRole("article", { name: /研究重点/ })).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "进入中国宏观脉搏" }));
    expect(onNavigate).toHaveBeenCalledWith("china");
  });

  it("shows two global systems and six thematic questions", () => {
    renderApp(
      <>
        <GlobalResearchAtlas data={researchAtlasData} />
        <TopicResearch data={researchAtlasData} />
      </>,
    );

    expect(screen.getByRole("heading", { name: "全球研究图谱" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "专题研究" })).toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "全球研究体系" })).getAllByRole("article")).toHaveLength(2);
    expect(within(screen.getByRole("region", { name: "专题研究" })).getAllByRole("article", { name: /专题/ })).toHaveLength(6);
  });
});
