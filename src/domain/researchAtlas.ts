export type PrimaryView = "home" | "global" | "china" | "topics";
export type ResearchStage = "china" | "overseas" | "themes";

export interface ResearchNode {
  id: string;
  label: string;
  summary: string;
}

export interface ResearchLayer {
  stage: ResearchStage;
  eyebrow: string;
  title: string;
  nodes: ResearchNode[];
}

export interface ResearchFocus {
  id: string;
  category: string;
  question: string;
  finding: string;
  updatedAt: string;
  evidencePath: string[];
  systemId: "china" | "overseas" | "themes";
  targetView: PrimaryView;
}

export interface ResearchSystem {
  id: "china" | "overseas" | "themes";
  number: string;
  title: string;
  summary: string;
  topics: string[];
}

export interface ResearchTopic {
  id: string;
  title: string;
  question: string;
  systemId: ResearchSystem["id"];
}

export interface ResearchAtlasData {
  layers: ResearchLayer[];
  focuses: ResearchFocus[];
  systems: ResearchSystem[];
  topics: ResearchTopic[];
}

export function findResearchNode(data: ResearchAtlasData, nodeId: string): ResearchNode | undefined {
  return data.layers.flatMap((layer) => layer.nodes).find((node) => node.id === nodeId);
}
