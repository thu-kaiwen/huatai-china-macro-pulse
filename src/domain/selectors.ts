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

function compareReportRecency(left: Report, right: Report): number {
  return (
    right.publishedAt.localeCompare(left.publishedAt) ||
    right.periodEnd.localeCompare(left.periodEnd) ||
    right.id.localeCompare(left.id)
  );
}

function compareObservationRecency(
  reportsById: ReadonlyMap<string, Report>,
  left: MetricObservation,
  right: MetricObservation,
): number {
  const leftReport = reportsById.get(left.reportId);
  const rightReport = reportsById.get(right.reportId);
  const reportComparison =
    (rightReport?.publishedAt ?? "").localeCompare(leftReport?.publishedAt ?? "") ||
    (rightReport?.periodEnd ?? "").localeCompare(leftReport?.periodEnd ?? "");

  return reportComparison || right.periodEnd.localeCompare(left.periodEnd) || right.id.localeCompare(left.id);
}

export function selectReports(dataset: MacroDataset, view: ViewMode): Report[] {
  return [...dataset.reports]
    .filter((report) => matchesView(report.frequency, view))
    .sort(compareReportRecency);
}

export function selectLatestReports(dataset: MacroDataset, view: ViewMode): Report[] {
  const frequencies = new Set<Frequency>();

  return selectReports(dataset, view).filter((report) => {
    if (frequencies.has(report.frequency)) {
      return false;
    }

    frequencies.add(report.frequency);
    return true;
  });
}

export function selectNarratives(dataset: MacroDataset, view: ViewMode): Narrative[] {
  const reportIds = new Set(selectReports(dataset, view).map((report) => report.id));

  return dataset.narratives.filter((narrative) => reportIds.has(narrative.reportId));
}

export function selectLatestNarratives(dataset: MacroDataset, view: ViewMode): Narrative[] {
  const reportsById = new Map(dataset.reports.map((report) => [report.id, report]));
  const latestByTopicAndFrequency = new Map<string, Narrative>();

  for (const narrative of dataset.narratives) {
    const report = reportsById.get(narrative.reportId);
    if (!report || !matchesView(report.frequency, view)) {
      continue;
    }

    const key = `${narrative.topic}\u0000${report.frequency}`;
    const current = latestByTopicAndFrequency.get(key);
    const currentReport = current ? reportsById.get(current.reportId) : undefined;

    if (!current || !currentReport || compareReportRecency(report, currentReport) < 0) {
      latestByTopicAndFrequency.set(key, narrative);
    }
  }

  return [...latestByTopicAndFrequency.values()];
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

export function selectLatestObservations(
  dataset: MacroDataset,
  filter: ObservationFilter,
): MetricObservation[] {
  const reportsById = new Map(dataset.reports.map((report) => [report.id, report]));
  const latestByMetricAndFrequency = new Map<string, MetricObservation>();

  for (const observation of selectObservations(dataset, filter)) {
    const key = `${observation.metricId}\u0000${observation.frequency}`;
    const current = latestByMetricAndFrequency.get(key);

    if (!current || compareObservationRecency(reportsById, observation, current) < 0) {
      latestByMetricAndFrequency.set(key, observation);
    }
  }

  return [...latestByMetricAndFrequency.values()];
}

export function selectLatestObservation(
  dataset: MacroDataset,
  metricId: string,
  view: ViewMode,
): MetricObservation | undefined {
  const reportsById = new Map(dataset.reports.map((report) => [report.id, report]));

  return selectLatestObservations(dataset, {
    view,
    metricIds: [metricId],
    verifiedOnly: true,
  }).sort((left, right) => compareObservationRecency(reportsById, left, right))[0];
}

export function selectCanonicalTrendObservations(
  dataset: MacroDataset,
  filter: ObservationFilter,
): MetricObservation[] {
  const reportsById = new Map(dataset.reports.map((report) => [report.id, report]));
  const latestBySeriesPeriod = new Map<string, MetricObservation>();

  for (const observation of selectObservations(dataset, filter)) {
    const key = [
      observation.metricId,
      observation.frequency,
      observation.comparisonType,
      observation.periodEnd,
    ].join("\u0000");
    const current = latestBySeriesPeriod.get(key);

    if (!current || compareObservationRecency(reportsById, observation, current) < 0) {
      latestBySeriesPeriod.set(key, observation);
    }
  }

  return [...latestBySeriesPeriod.values()].sort(
    (left, right) =>
      left.periodEnd.localeCompare(right.periodEnd) ||
      left.metricId.localeCompare(right.metricId) ||
      left.frequency.localeCompare(right.frequency) ||
      left.comparisonType.localeCompare(right.comparisonType) ||
      left.id.localeCompare(right.id),
  );
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
