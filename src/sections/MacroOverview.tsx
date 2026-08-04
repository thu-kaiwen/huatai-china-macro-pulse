import { SignalPill } from "../components/SignalPill";
import { selectNarratives, selectReports } from "../domain/selectors";
import type { MacroDataset, ViewMode } from "../domain/types";

interface MacroOverviewProps {
  dataset: MacroDataset;
  view: ViewMode;
}

function frequencyLabel(frequency: "weekly" | "monthly") {
  return frequency === "weekly" ? "周报" : "月报";
}

export function MacroOverview({ dataset, view }: MacroOverviewProps) {
  const visibleReports = selectReports(dataset, view);
  const visibleNarratives = selectNarratives(dataset, view);

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
              <span className="macro-report-published">发布日期 {report.publishedAt}</span>
              <span className="macro-report-period">
                统计期 {report.periodStart} 至 {report.periodEnd}
              </span>
              <span className="macro-report-date">截至 {report.periodEnd}</span>
            </div>
            <a href={report.sourceUrl} rel="noreferrer" target="_blank">
              {report.title}
            </a>
            <p className="macro-report-summary">{report.summary}</p>
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
