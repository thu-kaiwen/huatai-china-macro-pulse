import type { MetricDefinition, MetricObservation } from "../domain/types";

interface TickerTapeProps {
  observations: MetricObservation[];
  definitions: MetricDefinition[];
}

const tickerMetrics = [
  { metricId: "real-gdp-yoy", label: "GDP" },
  { metricId: "exports-yoy", label: "出口" },
  { metricId: "cpi-yoy", label: "CPI" },
  { metricId: "ppi-yoy", label: "PPI" },
  { metricId: "new-social-financing", label: "社融" },
  { metricId: "brent-usd", label: "Brent" },
  { metricId: "rmb-usd-change", label: "人民币/美元" },
  { metricId: "second-home-area-yoy", label: "二手房" },
] as const;

function latestVerifiedObservation(observations: MetricObservation[], metricId: string) {
  return observations
    .filter((observation) => observation.metricId === metricId && observation.confidence === "verified")
    .sort((left, right) => right.periodEnd.localeCompare(left.periodEnd))[0];
}

function formatValue(observation: MetricObservation, definition?: MetricDefinition) {
  const value = observation.value.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  return `${observation.value > 0 && observation.comparisonType !== "none" ? "+" : ""}${value}${definition?.unit ?? ""}`;
}

export function TickerTape({ observations, definitions }: TickerTapeProps) {
  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]));
  const items = tickerMetrics.flatMap(({ metricId, label }) => {
    const observation = latestVerifiedObservation(observations, metricId);
    if (!observation) return [];

    return [{ label, observation, definition: definitionsById.get(metricId) }];
  });

  return (
    <div className="ticker-tape" aria-label="最新宏观指标">
      <div className="ticker-items">
        {items.map(({ label, observation, definition }) => (
          <span className="ticker-item" key={observation.id} title={observation.sourceText}>
            <span>{label}</span>
            <strong>{formatValue(observation, definition)}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
