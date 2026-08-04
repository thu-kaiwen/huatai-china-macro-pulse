import type { ReactElement } from "react";
import { TrendChart } from "../components/TrendChart";
import { canShowCrossFrequencyTrend, canShowNativeTrend, selectObservations } from "../domain/selectors";
import type { MacroDataset, MetricDefinition, MetricObservation, ViewMode } from "../domain/types";

interface TrendExplorerProps {
  dataset: MacroDataset;
  view: ViewMode;
}

interface TrendSeries {
  definition: MetricDefinition;
  weekly: MetricObservation[];
  monthly: MetricObservation[];
}

function selectTrendSeries(dataset: MacroDataset, view: ViewMode): TrendSeries[] {
  const definitions = new Map(dataset.metricDefinitions.map((definition) => [definition.id, definition]));
  const observationsByMetric = new Map<string, MetricObservation[]>();

  for (const observation of selectObservations(dataset, { view, verifiedOnly: true })) {
    observationsByMetric.set(observation.metricId, [
      ...(observationsByMetric.get(observation.metricId) ?? []),
      observation,
    ]);
  }

  return [...observationsByMetric.entries()].flatMap(([metricId, observations]) => {
    const definition = definitions.get(metricId);
    const weekly = observations.filter((observation) => observation.frequency === "weekly");
    const monthly = observations.filter((observation) => observation.frequency === "monthly");

    if (!definition) {
      return [];
    }

    if (
      view === "combined" &&
      definition.nativeFrequency === "mixed" &&
      canShowCrossFrequencyTrend(observations)
    ) {
      return [{ definition, weekly, monthly }];
    }

    if (
      view === "weekly" &&
      (definition.nativeFrequency === "mixed" || definition.nativeFrequency === "weekly") &&
      canShowNativeTrend(weekly, "weekly")
    ) {
      return [{ definition, weekly, monthly: [] }];
    }

    if (
      view === "monthly" &&
      (definition.nativeFrequency === "mixed" || definition.nativeFrequency === "monthly") &&
      canShowNativeTrend(monthly, "monthly")
    ) {
      return [{ definition, weekly: [], monthly }];
    }

    return [];
  });
}

function headingFor(view: ViewMode): string {
  if (view === "weekly") {
    return "周频趋势";
  }

  if (view === "monthly") {
    return "月频趋势";
  }

  return "跨尺度趋势";
}

export function TrendExplorer({ dataset, view }: TrendExplorerProps): ReactElement | null {
  const series = selectTrendSeries(dataset, view);

  if (series.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="trend-explorer-heading" className="price-financial-section">
      <div className="fundamentals-heading">
        <p>同口径时间序列</p>
        <h2 id="trend-explorer-heading">{headingFor(view)}</h2>
      </div>
      <p className="market-method-note">仅在同一指标、单位与口径一致，且满足各频率样本门槛时绘制；不以单点外推趋势。</p>
      {series.map(({ definition, weekly, monthly }) => (
        <TrendChart definition={definition} key={definition.id} monthly={monthly} weekly={weekly} />
      ))}
    </section>
  );
}
