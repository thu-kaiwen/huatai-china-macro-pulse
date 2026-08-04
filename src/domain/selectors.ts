import type {
  Frequency,
  MacroDataset,
  MetricObservation,
  ObservationFilter,
  ViewMode,
} from "./types";

export function selectObservations(
  dataset: MacroDataset,
  filter: ObservationFilter,
): MetricObservation[] {
  return dataset.observations
    .filter((observation) => filter.view === "combined" || observation.frequency === filter.view)
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
