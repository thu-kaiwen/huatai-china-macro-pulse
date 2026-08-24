import type { WeeklyBondDashboardChart, WeeklyLineDashboardChart, WeeklySeriesTone } from "../domain/weeklyReport";
import { buildLineSegments } from "../domain/chartGeometry";

const toneColors: Record<WeeklySeriesTone, string> = {
  lightBlue: "#9bb9d4",
  blue: "#174a7e",
  red: "#d9272e",
  orange: "#df7c25",
  purple: "#7666a8",
  gray: "#7d8895",
  teal: "#258b91",
};

const bondColors = { red: "#d9272e", blue: "#174a7e", gray: "#9aa5b1" } as const;

function formatAxisValue(value: number) {
  if (Math.abs(value) >= 100_000) return `${Math.round(value / 10_000)}万`;
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}k`;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function pointsAttribute(points: Array<{ x: number; y: number }>) {
  return points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

export function WeeklyLineChart({ chart }: { chart: WeeklyLineDashboardChart }) {
  const bounds = { left: 45, top: 18, width: 550, height: 184, min: chart.yDomain[0], max: chart.yDomain[1] };
  const horizontalTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    return {
      y: bounds.top + bounds.height * ratio,
      value: bounds.max - (bounds.max - bounds.min) * ratio,
    };
  });
  const currentSeries = chart.series.at(-1);
  const currentSegments = currentSeries ? buildLineSegments(currentSeries.values, chart.totalPoints, bounds) : [];
  const lastPoint = currentSegments.at(-1)?.at(-1);

  return (
    <svg aria-label={chart.title} className="weekly-line-chart" role="img" viewBox="0 0 620 238">
      <title>{chart.title}</title>
      {horizontalTicks.map(({ y, value }) => (
        <g key={y}>
          <line className="weekly-chart-gridline" x1={bounds.left} x2={bounds.left + bounds.width} y1={y} y2={y} />
          <text className="weekly-chart-axis-label" textAnchor="end" x={bounds.left - 8} y={y + 4}>{formatAxisValue(value)}</text>
        </g>
      ))}
      {chart.yDomain[0] < 100 && chart.yDomain[1] > 100 && (
        <line className="weekly-chart-baseline" x1={bounds.left} x2={bounds.left + bounds.width} y1={bounds.top + (bounds.max - 100) / (bounds.max - bounds.min) * bounds.height} y2={bounds.top + (bounds.max - 100) / (bounds.max - bounds.min) * bounds.height} />
      )}
      {chart.series.flatMap((series) => {
        const segments = buildLineSegments(series.values, chart.totalPoints, bounds);
        const lastIndex = series.values.reduce((latest, value, index) => value === null ? latest : index, -1);
        const finalPoint = segments.at(-1)?.at(-1);
        return segments.map((points, index) => (
          <polyline
            data-last-index={lastIndex}
            data-last-x={finalPoint?.x.toFixed(2)}
            data-series-label={series.label}
            fill="none"
            key={`${series.id}-${index}`}
            points={pointsAttribute(points)}
            stroke={toneColors[series.tone]}
            strokeDasharray={series.dashed ? "5 4" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={series.tone === "red" ? 3 : 2}
            vectorEffect="non-scaling-stroke"
          />
        ));
      })}
      {lastPoint && chart.endpointLabel && (
        <g className="weekly-chart-endpoint">
          <circle cx={lastPoint.x} cy={lastPoint.y} fill={toneColors.red} r="3.5" />
          <text x={Math.min(lastPoint.x + 8, 502)} y={Math.max(14, lastPoint.y - 8)}>{chart.endpointLabel}</text>
        </g>
      )}
      {chart.xTicks.map((tick) => {
        const x = bounds.left + bounds.width * tick.index / Math.max(1, chart.totalPoints - 1);
        return <text className="weekly-chart-axis-label" key={`${tick.index}-${tick.label}`} textAnchor="middle" x={x} y="226">{tick.label}</text>;
      })}
    </svg>
  );
}

function total(segments: WeeklyBondDashboardChart["groups"][number]["bars"][number]["segments"]) {
  return segments.reduce((sum, segment) => sum + segment.value, 0);
}

export function BondIssuanceChart({ chart }: { chart: WeeklyBondDashboardChart }) {
  const groupWidth = 200;
  const chartTop = 68;
  const chartHeight = 140;

  return (
    <svg aria-label={chart.title} className="weekly-bond-chart" role="img" viewBox="0 0 620 270">
      <title>{chart.title}</title>
      {chart.groups.map((group, groupIndex) => {
        const groupX = groupIndex * 207;
        return (
          <g key={group.title}>
            <text className="weekly-bond-group-title" textAnchor="middle" x={groupX + groupWidth / 2} y="18">{group.title}</text>
            {group.bars.map((bar, barIndex) => {
              const barWidth = 46;
              const x = groupX + 44 + barIndex * 68;
              let cursor = chartTop + chartHeight;
              return (
                <g key={bar.label}>
                  {bar.segments.map((segment) => {
                    const height = segment.value / group.scaleMax * chartHeight;
                    cursor -= height;
                    return <rect fill={bondColors[segment.tone]} height={height} key={segment.label} rx="1" width={barWidth} x={x} y={cursor} />;
                  })}
                  <text className="weekly-bond-total" textAnchor="middle" x={x + barWidth / 2} y={Math.max(40, chartTop + chartHeight - total(bar.segments) / group.scaleMax * chartHeight - 7)}>{Math.round(total(bar.segments)).toLocaleString("zh-CN")}</text>
                  <text className="weekly-chart-axis-label" textAnchor="middle" x={x + barWidth / 2} y="228">{bar.label}</text>
                </g>
              );
            })}
          </g>
        );
      })}
      {[207, 414].map((x) => <line data-bond-separator key={x} className="weekly-bond-separator" x1={x} x2={x} y1="6" y2="238" />)}
      <g className="weekly-bond-legend">
        {[{ label: "国债", color: bondColors.red }, { label: "地方政府债", color: bondColors.blue }, { label: "政策性银行债", color: bondColors.gray }].map((item, index) => (
          <g key={item.label} transform={`translate(${176 + index * 96} 254)`}>
            <rect fill={item.color} height="8" width="13" />
            <text x="18" y="8">{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Sparkline({ ariaLabel, values }: { ariaLabel: string; values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = buildLineSegments(values, values.length, { left: 2, top: 3, width: 92, height: 25, min, max })[0] ?? [];
  return (
    <svg aria-label={ariaLabel} className="weekly-sparkline" role="img" viewBox="0 0 96 32">
      <title>{ariaLabel}</title>
      <polyline fill="none" points={pointsAttribute(points)} stroke="#174a7e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      {points.at(-1) && <circle cx={points.at(-1)?.x} cy={points.at(-1)?.y} fill="#d9272e" r="2.3" />}
    </svg>
  );
}
