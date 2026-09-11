import { describe, expect, it } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { findResearchNode } from "./researchAtlas";

describe("research atlas", () => {
  it("covers all four transmission stages", () => {
    expect(researchAtlasData.layers.map((layer) => layer.stage)).toEqual([
      "context", "driver", "channel", "outcome",
    ]);
  });

  it("finds a node without exposing a local research path", () => {
    const node = findResearchNode(researchAtlasData, "ai");
    expect(node?.label).toBe("AI");
    expect(JSON.stringify(researchAtlasData)).not.toMatch(/[A-Z]:\\\\|Nutstore|data-excel/);
  });

  it("provides three editorial research focuses and six topics", () => {
    expect(researchAtlasData.focuses).toHaveLength(3);
    expect(researchAtlasData.topics).toHaveLength(6);
  });
});
