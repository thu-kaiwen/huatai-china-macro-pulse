export type Frequency = "weekly" | "monthly";
export type ViewMode = "combined" | Frequency;
export type Confidence = "verified" | "partial";
export type ComparisonType = "yoy" | "mom" | "wow" | "previous-week" | "basis-points" | "none";
export type Signal = "improving" | "stable" | "watch" | "deteriorating";

export interface ObservationFilter {
  view: ViewMode;
  metricIds?: string[];
  reportIds?: string[];
  verifiedOnly?: boolean;
}

export interface Report {
  id: string;
  frequency: Frequency;
  title: string;
  publishedAt: string;
  periodStart: string;
  periodEnd: string;
  sourceUrl: string;
  authors: string[];
  summary: string;
}

export interface MetricDefinition {
  id: string;
  name: string;
  category: "activity" | "property" | "prices" | "financial" | "money" | "industry";
  unit: string;
  nativeFrequency: Frequency | "mixed";
  directionMeaning: "improvement" | "deterioration" | "neutral";
  methodology: string;
}

export interface MetricObservation {
  id: string;
  metricId: string;
  reportId: string;
  periodEnd: string;
  frequency: Frequency;
  value: number;
  previousValue?: number;
  comparisonType: ComparisonType;
  change?: number;
  sourceText: string;
  confidence: Confidence;
}

export interface Narrative {
  id: string;
  reportId: string;
  topic: "external-demand" | "domestic-demand" | "prices" | "liquidity" | "policy";
  title: string;
  summary: string;
  signal: Signal;
}

export interface PolicyEvent {
  id: string;
  reportId: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface RiskItem {
  id: string;
  reportId: string;
  kind: "watch" | "risk";
  title: string;
  summary: string;
}

export interface MacroDataset {
  reports: Report[];
  metricDefinitions: MetricDefinition[];
  observations: MetricObservation[];
  narratives: Narrative[];
  policyEvents: PolicyEvent[];
  risks: RiskItem[];
}
