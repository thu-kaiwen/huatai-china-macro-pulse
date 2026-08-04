import { SignalPill } from "../components/SignalPill";
import type { Narrative, Report, ViewMode } from "../domain/types";

interface MacroOverviewProps {
  reports: Report[];
  narratives: Narrative[];
  view: ViewMode;
}

function matchesView(frequency: Report["frequency"], view: ViewMode) {
  return view === "combined" || frequency === view;
}

function frequencyLabel(frequency: Report["frequency"]) {
  return frequency === "weekly" ? "周报" : "月报";
}

export function MacroOverview({ reports, narratives, view }: MacroOverviewProps) {
  const visibleReports = [...reports]
    .filter((report) => matchesView(report.frequency, view))
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  const visibleReportIds = new Set(visibleReports.map((report) => report.id));
  const visibleNarratives = narratives.filter((narrative) => visibleReportIds.has(narrative.reportId));

  return (
    <section aria-labelledby="macro-overview-heading" className="macro-overview">
      <div className="macro-overview-heading">
        <p>获批报告总览</p>
        <h2 id="macro-overview-heading">{visibleReports[0]?.title ?? "暂无获批报告"}</h2>
      </div>

      <div aria-label="报告来源" className="macro-report-list">
        {visibleReports.map((report) => (
          <article className="macro-report" key={report.id}>
            <div>
              <span className="macro-source-badge">华泰证券研究所获批报告</span>
              <span className="macro-report-frequency">{frequencyLabel(report.frequency)}</span>
              <span className="macro-report-date">截至 {report.periodEnd}</span>
            </div>
            <a href={report.sourceUrl} rel="noreferrer" target="_blank">
              {report.title}
            </a>
          </article>
        ))}
      </div>

      <div aria-label="宏观信号" className="macro-signal-grid">
        {visibleNarratives.map((narrative) => (
          <article className="macro-signal-card" key={narrative.id}>
            <SignalPill signal={narrative.signal} />
            <h3>{narrative.title}</h3>
            <p>{narrative.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
