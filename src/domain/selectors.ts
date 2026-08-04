import type {
  Frequency,
  MacroDataset,
  MetricDefinition,
  MetricObservation,
  Narrative,
  ObservationFilter,
  PolicyEvent,
  Report,
  ViewMode,
} from "./types";

function matchesView(frequency: Frequency, view: ViewMode): boolean {
  return view === "combined" || frequency === view;
}

export function selectReports(dataset: MacroDataset, view: ViewMode): Report[] {
  return [...dataset.reports]
    .filter((report) => matchesView(report.frequency, view))
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function selectNarratives(dataset: MacroDataset, view: ViewMode): Narrative[] {
  const reportIds = new Set(selectReports(dataset, view).map((report) => report.id));

  return dataset.narratives.filter((narrative) => reportIds.has(narrative.reportId));
}

export function selectPolicyEvents(dataset: MacroDataset, view: ViewMode): PolicyEvent[] {
  const visibleReportIds = new Set(selectReports(dataset, view).map((report) => report.id));

  return dataset.policyEvents
    .filter((event) => (event.reportIds ?? [event.reportId]).some((reportId) => visibleReportIds.has(reportId)))
    .sort((left, right) => left.date.localeCompare(right.date));
}

export function selectObservations(
  dataset: MacroDataset,
  filter: ObservationFilter,
): MetricObservation[] {
  return dataset.observations
    .filter((observation) => matchesView(observation.frequency, filter.view))
    .filter((observation) => filter.metricIds === undefined || filter.metricIds.includes(observation.metricId))
    .filter((observation) => filter.reportIds === undefined || filter.reportIds.includes(observation.reportId))
    .filter((observation) => !filter.verifiedOnly || observation.confidence === "verified")
    .sort((left, right) => left.periodEnd.localeCompare(right.periodEnd));
}

export function selectLatestObservation(
  dataset: MacroDataset,
  metricId: string,
  view: ViewMode,
): MetricObservation | undefined {
  return selectObservations(dataset, { view, metricIds: [metricId] }).at(-1);
}

export function canShowNativeTrend(
  observations: MetricObservation[],
  frequency: Frequency,
): boolean {
  const uniquePeriodsBySeries = new Map<string, Set<string>>();

  for (const observation of observations) {
    if (observation.frequency !== frequency || observation.confidence !== "verified") {
      continue;
    }

    const seriesKey = `${observation.metricId}\u0000${observation.frequency}\u0000${observation.comparisonType}`;
    const uniquePeriods = uniquePeriodsBySeries.get(seriesKey) ?? new Set<string>();
    uniquePeriods.add(observation.periodEnd);
    uniquePeriodsBySeries.set(seriesKey, uniquePeriods);
  }

  if (uniquePeriodsBySeries.size !== 1) {
    return false;
  }

  return [...uniquePeriodsBySeries.values()][0].size >= 2;
}

export function canShowCrossFrequencyTrend(
  observations: MetricObservation[],
  definition: MetricDefinition,
): boolean {
  if (
    definition.nativeFrequency !== "mixed" ||
    definition.unit.trim().length === 0 ||
    definition.methodology.trim().length === 0
  ) {
    return false;
  }

  const periodsByComparison = new Map<MetricObservation["comparisonType"], {
    weekly: Set<string>;
    monthly: Set<string>;
  }>();

  for (const observation of observations) {
    if (observation.confidence !== "verified" || observation.metricId !== definition.id) {
      continue;
    }

    const periods = periodsByComparison.get(observation.comparisonType) ?? {
      weekly: new Set<string>(),
      monthly: new Set<string>(),
    };
    periods[observation.frequency].add(observation.periodEnd);
    periodsByComparison.set(observation.comparisonType, periods);
  }

  if (periodsByComparison.size !== 1) {
    return false;
  }

  const [{ weekly, monthly }] = periodsByComparison.values();
  return weekly.size >= 2 && monthly.size >= 1;
}
