import type { ReactElement } from "react";
import type { MetricDefinition, MetricObservation } from "../domain/types";

interface TrendChartProps {
  definition: MetricDefinition;
  weekly: MetricObservation[];
  monthly: MetricObservation[];
}

const width = 680;
const height = 220;
const padding = { top: 24, right: 24, bottom: 34, left: 48 };

function sortByPeriod(observations: MetricObservation[]): MetricObservation[] {
  return [...observations].sort((left, right) => left.periodEnd.localeCompare(right.periodEnd));
}

function formatObservation(observation: MetricObservation, unit: string): string {
  return `${observation.periodEnd}：${observation.value}${unit}`;
}

function chartLabel(definition: MetricDefinition, weekly: MetricObservation[], monthly: MetricObservation[]): string {
  if (weekly.length > 0 && monthly.length > 0) {
    return `${definition.name}周频与月频趋势图`;
  }

  return `${definition.name}${weekly.length > 0 ? "周频" : "月频"}趋势图`;
}

function areCompatible(
  definition: MetricDefinition,
  weekly: MetricObservation[],
  monthly: MetricObservation[],
): boolean {
  const observations = [...weekly, ...monthly];

  return (
    definition.unit.trim().length > 0 &&
    definition.methodology.trim().length > 0 &&
    observations.length > 0 &&
    weekly.every((observation) => observation.metricId === definition.id && observation.frequency === "weekly") &&
    monthly.every((observation) => observation.metricId === definition.id && observation.frequency === "monthly") &&
    (definition.nativeFrequency === "mixed" ||
      (weekly.length === 0 && definition.nativeFrequency === "monthly") ||
      (monthly.length === 0 && definition.nativeFrequency === "weekly"))
  );
}

export function TrendChart({ definition, weekly, monthly }: TrendChartProps): ReactElement {
  if (!areCompatible(definition, weekly, monthly)) {
    return <></>;
  }

  const sortedWeekly = sortByPeriod(weekly);
  const sortedMonthly = sortByPeriod(monthly);
  const observations = [...sortedWeekly, ...sortedMonthly];
  const dates = observations.map((observation) => Date.parse(`${observation.periodEnd}T00:00:00Z`));
  const values = observations.map((observation) => observation.value);
  const minimumDate = Math.min(...dates);
  const maximumDate = Math.max(...dates);
  const minimumValue = Math.min(...values);
  const maximumValue = Math.max(...values);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const valueRange = maximumValue - minimumValue || 1;
  const dateRange = maximumDate - minimumDate;
  const x = (observation: MetricObservation) => {
    if (dateRange === 0) {
      return padding.left + plotWidth / 2;
    }

    return padding.left + ((Date.parse(`${observation.periodEnd}T00:00:00Z`) - minimumDate) / dateRange) * plotWidth;
  };
  const y = (observation: MetricObservation) =>
    padding.top + plotHeight - ((observation.value - minimumValue) / valueRange) * plotHeight;
  const pointList = (series: MetricObservation[]) => series.map((observation) => `${x(observation)},${y(observation)}`).join(" ");
  const label = chartLabel(definition, sortedWeekly, sortedMonthly);
  const description = observations.map((observation) => formatObservation(observation, definition.unit)).join("；");

  return (
    <figure>
      <figcaption>{label}</figcaption>
      <svg
        aria-label={label}
        height={height}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
      >
        <title>{`${label}。${description}`}</title>
        <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} />
        <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} />
        {sortedWeekly.length > 1 ? <polyline fill="none" points={pointList(sortedWeekly)} stroke="currentColor" strokeWidth="2" /> : null}
        {sortedMonthly.length > 1 ? (
          <polyline fill="none" points={pointList(sortedMonthly)} stroke="currentColor" strokeDasharray="5 4" strokeWidth="2" />
        ) : null}
        {sortedWeekly.map((observation) => (
          <circle cx={x(observation)} cy={y(observation)} fill="currentColor" key={observation.id} r="4">
            <title>{formatObservation(observation, definition.unit)}</title>
          </circle>
        ))}
        {sortedMonthly.map((observation) => {
          const pointX = x(observation);
          const pointY = y(observation);

          return (
            <polygon
              fill="currentColor"
              key={observation.id}
              points={`${pointX},${pointY - 5} ${pointX + 5},${pointY} ${pointX},${pointY + 5} ${pointX - 5},${pointY}`}
            >
              <title>{formatObservation(observation, definition.unit)}</title>
            </polygon>
          );
        })}
      </svg>
    </figure>
  );
}
