import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { selectObservations, selectReports } from "../domain/selectors";
import type { MacroDataset, ViewMode } from "../domain/types";

interface MonthlyFundamentalsProps {
  dataset: MacroDataset;
  view: ViewMode;
}

const monthlyGroups = [
  {
    title: "增长与活动",
    metricIds: [
      "real-gdp-yoy",
      "nominal-gdp-yoy",
      "industrial-value-added-yoy",
      "retail-sales-yoy",
      "fixed-asset-investment-yoy",
    ],
  },
  { title: "贸易", metricIds: ["exports-yoy", "imports-yoy"] },
  { title: "通胀", metricIds: ["cpi-yoy", "ppi-yoy"] },
  {
    title: "信贷与货币",
    metricIds: [
      "new-rmb-loans",
      "new-rmb-loans-yoy-change",
      "new-social-financing",
      "new-social-financing-yoy-change",
      "m1-yoy",
      "m2-yoy",
    ],
  },
];

export function MonthlyFundamentals({ dataset, view }: MonthlyFundamentalsProps) {
  if (view === "weekly") {
    return null;
  }

  const report = selectReports(dataset, "monthly")[0];
  if (!report) {
    return null;
  }

  const definitions = new Map(dataset.metricDefinitions.map((definition) => [definition.id, definition]));

  return (
    <section aria-labelledby="monthly-fundamentals-heading" className="fundamentals-section">
      <div className="fundamentals-heading">
        <p>月度宏观数据</p>
        <h2 id="monthly-fundamentals-heading">月度基本盘</h2>
      </div>
      {monthlyGroups.map((group) => {
        const observations = selectObservations(dataset, {
          view: "monthly",
          metricIds: group.metricIds,
          reportIds: [report.id],
          verifiedOnly: true,
        });

        return (
          <section aria-labelledby={`monthly-${group.title}`} className="metric-group" key={group.title}>
            <h3 id={`monthly-${group.title}`}>{group.title}</h3>
            {observations.length === 0 ? (
              <EmptyState groupName={group.title} />
            ) : (
              <div className="metric-card-grid">
                {observations.map((observation) => {
                  const definition = definitions.get(observation.metricId);
                  return definition ? (
                    <MetricCard
                      definition={definition}
                      key={observation.id}
                      primary={observation}
                      report={report}
                    />
                  ) : null;
                })}
              </div>
            )}
          </section>
        );
      })}
    </section>
  );
}
