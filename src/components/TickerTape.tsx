import type { ComparisonType, MetricDefinition, MetricObservation, NativeFrequency } from "../domain/types";

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
  { metricId: "rmb-usd-change", label: "人民币对美元", comparisonAware: true },
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

function comparisonLabel(comparisonType: ComparisonType): string {
  const labels: Record<ComparisonType, string> = {
    yoy: "同比",
    mom: "月环比",
    wow: "周环比",
    "previous-week": "较上周",
    "basis-points": "基点变动",
    none: "当期",
  };

  return labels[comparisonType];
}

function frequencyLabel(nativeFrequency: NativeFrequency | undefined, observation: MetricObservation): string {
  const frequency = nativeFrequency === "mixed" || nativeFrequency === undefined
    ? observation.frequency
    : nativeFrequency;
  const labels: Record<Exclude<NativeFrequency, "mixed">, string> = {
    quarterly: "季度",
    monthly: "月度",
    weekly: "周度",
  };

  return labels[frequency];
}

export function TickerTape({ observations, definitions }: TickerTapeProps) {
  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]));
  const items = tickerMetrics.flatMap(({ metricId, label, ...options }) => {
    const observation = latestVerifiedObservation(observations, metricId);
    if (!observation) return [];

    const displayLabel = "comparisonAware" in options
      ? `${label}${comparisonLabel(observation.comparisonType)}`
      : label;

    return [{ label: displayLabel, observation, definition: definitionsById.get(metricId) }];
  });

  return (
    <div className="ticker-tape" aria-label="最新宏观指标" role="region" tabIndex={0}>
      <div className="ticker-items">
        {items.map(({ label, observation, definition }) => (
          <span className="ticker-item" key={observation.id} title={observation.sourceText}>
            <span>{label}</span>
            <strong>{formatValue(observation, definition)}</strong>
            <span className="ticker-item-meta">{frequencyLabel(definition?.nativeFrequency, observation)}</span>
            <span className="ticker-item-meta">{observation.periodEndLabel ?? "截至"} {observation.periodEnd}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
