import { cleanup, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { monthlyReport0831 } from "../data/monthlyReport";
import { researchAtlasData } from "../data/researchAtlas";
import { weeklyReport0906 } from "../data/weeklyReports";
import { renderApp } from "../test/renderApp";
import { GlobalResearchAtlas } from "./GlobalResearchAtlas";
import { ResearchHome } from "./ResearchHome";
import { TopicResearch } from "./TopicResearch";

describe("research surfaces", () => {
  afterEach(cleanup);

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
    expect(screen.queryByRole("heading", { name: "三大研究主线" })).not.toBeInTheDocument();
    expect(screen.getByText("HUATAI MACRO RESEARCH")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "本周研究重点" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "原创研究精选" })).toBeInTheDocument();
    expect(screen.getAllByRole("article", { name: /原创研究专题/ })).toHaveLength(7);
    expect(screen.getAllByRole("article", { name: /研究重点/ })).toHaveLength(3);
    expect(screen.getByRole("button", { name: "黄金" })).toBeInTheDocument();
    expect(within(screen.getByRole("group", { name: "中国基本面脉搏研究板块" })).getAllByRole("button")[0]).toHaveTextContent("定期跟踪");

    await user.click(within(screen.getByRole("region", { name: "中国基本面脉搏" })).getByRole("button", { name: "进入中国基本面脉搏" }));
    expect(onNavigate).toHaveBeenCalledWith("china");
  });

  it("shows the overseas coverage and seven thematic questions", () => {
    renderApp(
      <>
        <GlobalResearchAtlas data={researchAtlasData} />
        <TopicResearch data={researchAtlasData} />
      </>,
    );

    expect(screen.getByRole("heading", { name: "海外经济变化", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "韩国" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "主题研究", level: 1 })).toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "海外经济研究" })).getAllByRole("article")).toHaveLength(1);
    expect(within(screen.getByRole("region", { name: "主题研究" })).getAllByRole("article", { name: /专题/ })).toHaveLength(7);
  });
});
