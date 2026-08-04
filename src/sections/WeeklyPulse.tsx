import { EmptyState } from "../components/EmptyState";
import { MetricCard } from "../components/MetricCard";
import { selectObservations, selectReports } from "../domain/selectors";
import type { MacroDataset, ViewMode } from "../domain/types";

interface WeeklyPulseProps {
  dataset: MacroDataset;
  view: ViewMode;
}

const weeklyGroups = [
  {
    title: "消费",
    metricIds: [
      "passenger-vehicle-retail-yoy",
      "passenger-vehicle-retail-wow",
      "movie-box-office-yoy",
      "movie-box-office-wow",
    ],
  },
  {
    title: "地产与土地",
    metricIds: [
      "second-home-area-yoy",
      "tier-1-second-home-area-yoy",
      "tier-2-second-home-area-yoy",
      "tier-3-second-home-area-yoy",
      "land-transaction-area-yoy",
      "land-transaction-area-wow",
      "land-floor-price-yoy",
      "land-floor-price-wow",
    ],
  },
  {
    title: "PMI与利润",
    metricIds: [
      "manufacturing-pmi",
      "non-manufacturing-pmi",
      "industrial-profit-yoy",
      "industrial-revenue-yoy",
    ],
  },
];

export function WeeklyPulse({ dataset, view }: WeeklyPulseProps) {
  if (view === "monthly") {
    return null;
  }

  const report = selectReports(dataset, "weekly")[0];
  if (!report) {
    return null;
  }

  const definitions = new Map(dataset.metricDefinitions.map((definition) => [definition.id, definition]));

  return (
    <section aria-labelledby="weekly-pulse-heading" className="fundamentals-section">
      <div className="fundamentals-heading">
        <p>周度高频数据</p>
        <h2 id="weekly-pulse-heading">周度高频脉搏</h2>
      </div>
      {weeklyGroups.map((group) => {
        const observations = selectObservations(dataset, {
          view: "weekly",
          metricIds: group.metricIds,
          reportIds: [report.id],
          verifiedOnly: true,
        });

        return (
          <section aria-labelledby={`weekly-${group.title}`} className="metric-group" key={group.title}>
            <h3 id={`weekly-${group.title}`}>{group.title}</h3>
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
