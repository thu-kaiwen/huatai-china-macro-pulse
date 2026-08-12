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
}

const fixedSections: ReadonlyArray<readonly [WeeklySectionId, string]> = [
  ["activity", "高频经济活动跟踪"],
  ["prices", "价格指标及通胀变化"],
  ["financial", "利率、汇率及金融市场环境"],
  ["policy", "宏观政策跟踪"],
];

export function selectHeroCharts(page: WeeklyReportPage): WeeklyChart[] {
  const heroIds = new Set(page.heroCharts);
  return page.sections.flatMap((section) => section.charts.filter((chart) => heroIds.has(chart.id)));
}

export function validateWeeklyReportPage(page: WeeklyReportPage): string[] {
  const errors: string[] = [];
  const sectionIds = new Set<string>();
  const charts = page.sections.flatMap((section) => section.charts);
  const chartsById = new Map(charts.map((chart) => [chart.id, chart]));

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
  for (const metric of page.keyMetrics) {
    if (!metric.sourceText.trim()) errors.push(`Key metric ${metric.id} has an empty source text`);
  }
  return errors;
}
