export type WeeklySectionId = "activity" | "prices" | "financial" | "policy";

export interface WeeklyChart {
  id: string;
  sectionId: WeeklySectionId;
  title: string;
  assetPath: string;
  source: string;
  periodLabel: string;
  workbookPath: string;
  worksheet: string;
  alt: string;
  isHero: boolean;
}

export interface WeeklyKeyMetric {
  id: string;
  label: string;
  valueText: string;
  changeText: string;
  interpretation: string;
  sourceText: string;
}

export interface WeeklySection {
  id: WeeklySectionId;
  title: string;
  summary: string;
  detail: string;
  charts: WeeklyChart[];
}

export type WeeklySeriesTone = "lightBlue" | "blue" | "red" | "orange" | "purple" | "gray" | "teal";

export interface WeeklyChartSeries {
  id: string;
  label: string;
  values: Array<number | null>;
  tone: WeeklySeriesTone;
  dashed?: boolean;
  weeklyChange?: string;
}

export interface WeeklyChartTick {
  index: number;
  label: string;
}

export interface WeeklyLineDashboardChart {
  kind: "line";
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  totalPoints: number;
  yDomain: readonly [number, number];
  xTicks: WeeklyChartTick[];
  series: WeeklyChartSeries[];
  endpointLabel?: string;
  currentValue?: string;
  changeText?: string;
  source: string;
  interpretation?: string;
  category?: string;
}

export interface WeeklyBondSegment {
  label: string;
  value: number;
  tone: "red" | "blue" | "gray";
}

export interface WeeklyBondBar {
  label: string;
  segments: WeeklyBondSegment[];
}

export interface WeeklyBondGroup {
  title: string;
  scaleMax: number;
  bars: WeeklyBondBar[];
}

export interface WeeklyBondDashboardChart {
  kind: "bonds";
  id: string;
  title: string;
  subtitle: string;
  currentValue: string;
  changeText: string;
  source: string;
  groups: WeeklyBondGroup[];
}

export interface WeeklyFinanceRow {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "positive" | "negative" | "neutral";
  trend: number[];
  observation: string;
}

export interface WeeklyFinanceGroup {
  title: string;
  rows: WeeklyFinanceRow[];
}

export interface WeeklyPolicyItem {
  date: string;
  title: string;
  detail: string;
}

export interface WeeklyDashboard {
  heroCharts: Array<WeeklyLineDashboardChart | WeeklyBondDashboardChart>;
  activityCharts: WeeklyLineDashboardChart[];
  priceCharts: WeeklyLineDashboardChart[];
  financeGroups: WeeklyFinanceGroup[];
  policyEvents: WeeklyPolicyItem[];
  policyCalendar: Array<{ date: string; label: string }>;
}

export interface WeeklyReportPage {
  id: string;
  publishedAt: string;
  title: string;
  overview: string;
  keyMetrics: WeeklyKeyMetric[];
  heroCharts: string[];
  sections: WeeklySection[];
  watchPoints: string[];
  risks: string[];
  dashboard: WeeklyDashboard;
}

const fixedSections: ReadonlyArray<readonly [WeeklySectionId, string]> = [
  ["activity", "高频经济活动跟踪"],
  ["prices", "价格指标及通胀变化"],
  ["financial", "利率、汇率及金融市场环境"],
  ["policy", "宏观政策跟踪"],
];

export function selectHeroCharts(page: WeeklyReportPage): WeeklyChart[] {
  const chartsById = new Map(page.sections.flatMap((section) => section.charts).map((chart) => [chart.id, chart]));
  return page.heroCharts.flatMap((heroId) => {
    const chart = chartsById.get(heroId);
    return chart ? [chart] : [];
  });
}

export function validateWeeklyReportPage(page: WeeklyReportPage): string[] {
  const errors: string[] = [];
  const sectionIds = new Set<string>();
  const charts = page.sections.flatMap((section) => section.charts);
  const chartsById = new Map(charts.map((chart) => [chart.id, chart]));
  const heroChartIds = new Set(charts.filter((chart) => chart.isHero).map((chart) => chart.id));
  const heroReferenceIds = new Set(page.heroCharts);

  if (page.sections.length !== fixedSections.length || page.sections.some((section, index) =>
    section.id !== fixedSections[index]?.[0] || section.title !== fixedSections[index]?.[1]
  )) {
    errors.push("Sections do not follow the fixed sequence");
  }

  for (const section of page.sections) {
    if (sectionIds.has(section.id)) errors.push(`Duplicate section ID ${section.id}`);
    sectionIds.add(section.id);
    for (const chart of section.charts) {
      for (const [label, value] of [
        ["asset path", chart.assetPath], ["source", chart.source], ["period label", chart.periodLabel],
        ["workbook path", chart.workbookPath], ["worksheet", chart.worksheet], ["alt", chart.alt],
      ] as const) {
        if (!value.trim()) errors.push(`Chart ${chart.id} has an empty ${label}`);
      }
      if (chart.sectionId !== section.id) errors.push(`Chart ${chart.id} belongs to the wrong section`);
    }
  }
  for (const heroId of page.heroCharts) {
    const chart = chartsById.get(heroId);
    if (!chart) errors.push(`Hero chart reference ${heroId} is missing`);
    else if (!chart.isHero) errors.push(`Hero chart ${heroId} is not marked isHero`);
  }
  if (page.heroCharts.length !== 4 || heroReferenceIds.size !== 4) {
    errors.push("Exactly four hero chart references are required");
  }
  if (heroChartIds.size !== 4) {
    errors.push("Exactly four charts must be marked isHero");
  }
  if (
    heroChartIds.size !== heroReferenceIds.size ||
    [...heroChartIds].some((chartId) => !heroReferenceIds.has(chartId))
  ) {
    errors.push("Hero chart IDs and isHero chart IDs must match");
  }
  for (const metric of page.keyMetrics) {
    if (!metric.sourceText.trim()) errors.push(`Key metric ${metric.id} has an empty source text`);
  }
  return errors;
}
