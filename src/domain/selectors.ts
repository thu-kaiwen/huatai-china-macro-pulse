import type {
  Frequency,
  MacroDataset,
  MetricObservation,
  Narrative,
  ObservationFilter,
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
  return observations.filter(
    (observation) => observation.frequency === frequency && observation.confidence === "verified",
  ).length >= 2;
}

export function canShowCrossFrequencyTrend(observations: MetricObservation[]): boolean {
  const observationsByMetric = new Map<string, MetricObservation[]>();

  for (const observation of observations) {
    if (observation.confidence !== "verified") {
      continue;
    }
    observationsByMetric.set(observation.metricId, [
      ...(observationsByMetric.get(observation.metricId) ?? []),
      observation,
    ]);
  }

  return [...observationsByMetric.values()].some((metricObservations) =>
    canShowNativeTrend(metricObservations, "weekly") &&
    metricObservations.some((observation) => observation.frequency === "monthly"),
  );
}
