import { describe, expect, it } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { findResearchNode } from "./researchAtlas";

describe("research atlas", () => {
  it("organizes research around the three approved client-facing pillars", () => {
    expect(researchAtlasData.layers.map((layer) => layer.stage)).toEqual([
      "china", "overseas", "themes",
    ]);
    expect(researchAtlasData.layers.map((layer) => layer.title)).toEqual([
      "中国基本面脉搏", "海外经济变化", "主题研究",
    ]);
    expect(researchAtlasData.layers[0]?.nodes.map((node) => node.label)).toEqual([
      "定期跟踪", "经济活动", "利率汇率", "政策变化",
    ]);
    expect(researchAtlasData.layers[1]?.nodes.map((node) => node.label)).toEqual([
      "美国", "欧洲", "日本", "韩国", "新兴市场",
    ]);
    expect(researchAtlasData.layers[2]?.nodes.map((node) => node.label)).toEqual([
      "央行", "财政", "AI", "贸易", "能源", "地缘", "黄金",
    ]);
  });

  it("finds a node without exposing a local research path", () => {
    const node = findResearchNode(researchAtlasData, "ai");
    expect(node?.label).toBe("AI");
    expect(JSON.stringify(researchAtlasData)).not.toMatch(/[A-Z]:\\\\|Nutstore|data-excel/);
  });

  it("provides three editorial research focuses and seven topics", () => {
    expect(researchAtlasData.focuses).toHaveLength(3);
    expect(researchAtlasData.topics).toHaveLength(7);
  });
});
