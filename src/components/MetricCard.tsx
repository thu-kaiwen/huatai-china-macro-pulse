import { useState } from "react";
import type { ComparisonType, MetricDefinition, MetricObservation, Report } from "../domain/types";
import { DeltaBars } from "./DeltaBars";

interface MetricCardProps {
  definition: MetricDefinition;
  primary: MetricObservation;
  secondary?: MetricObservation;
  report: Report;
}

const comparisonLabels: Record<ComparisonType, string> = {
  yoy: "同比",
  mom: "环比",
  wow: "周环比",
  "previous-week": "较上周",
  "basis-points": "基点变动",
  none: "当期值",
};

function formatValue(value: number, unit: string): string {
  if (unit === "%" || unit === "bp" || unit === "指数") {
    return `${value.toFixed(1)}${unit}`;
  }

  return `${value}${unit}`;
}

export function MetricCard({ definition, primary, secondary, report }: MetricCardProps) {
  const [isDisclosureVisible, setDisclosureVisible] = useState(false);
  const previousValue = primary.previousValue ?? secondary?.value;

  return (
    <article className="metric-card">
      <div className="metric-card-header">
        <h4>{definition.name}</h4>
        <span>{comparisonLabels[primary.comparisonType]}</span>
      </div>
      <p className="metric-value">
        <strong>
          {definition.unit === "指数" ? primary.value.toFixed(1) : formatValue(primary.value, definition.unit)}
        </strong>
        <span>{definition.unit === "指数" ? "指数 · " : ""}截至 {primary.periodEnd}</span>
      </p>
      {previousValue !== undefined ? (
        <DeltaBars
          current={primary.value}
          currentLabel="本期"
          previous={previousValue}
          previousLabel="前值"
          unit={definition.unit}
        />
      ) : null}
      <button
        aria-expanded={isDisclosureVisible}
        aria-label={`查看${definition.name}披露`}
        className="metric-disclosure-toggle"
        onClick={() => setDisclosureVisible((visible) => !visible)}
        type="button"
      >
        {isDisclosureVisible ? "收起披露" : "查看披露"}
      </button>
      {isDisclosureVisible ? (
        <div className="metric-disclosure">
          <p>口径：{comparisonLabels[primary.comparisonType]}</p>
          <p>方法：{definition.methodology}</p>
          <p>来源摘录：{primary.sourceText}</p>
          <p>报告：{report.title}</p>
          <a href={report.sourceUrl} rel="noreferrer" target="_blank">
            查看原始报告
          </a>
        </div>
      ) : null}
    </article>
  );
}
