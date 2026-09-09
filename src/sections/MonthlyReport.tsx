import { useState } from "react";
import { WeeklyLineChart } from "../components/WeeklyCharts";
import type { MonthlyReportPage } from "../data/monthlyReport";

export function MonthlyReport({ report }: { report: MonthlyReportPage }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section aria-labelledby="monthly-report-heading" className="monthly-report" id="overview">
      <header className="monthly-report-lead">
        <p className="monthly-kicker">华泰证券宏观团队 · 国内月报</p>
        <h1 id="monthly-report-heading"><span>国内月报</span><b>｜{report.title}</b></h1>
        <p className="monthly-overview">{report.overview}</p>
        <div className="monthly-version-bar">
          <strong>最新版本：{report.publishedAt}</strong>
          <span>页面更新：{report.updatedAt}</span>
          <em>状态：已更新</em>
        </div>
      </header>

      <div className="monthly-summary-grid" aria-label="月度核心数据">
        {report.sections.map((section) => (
          <article key={`summary-${section.id}`}>
            <span>{section.title}</span>
            <strong>{section.latestValue}</strong>
            <small>{section.dataPeriod}</small>
          </article>
        ))}
      </div>

      <div className="monthly-section-list">
        {report.sections.map((section) => {
          const expanded = expandedId === section.id;
          return (
            <section aria-labelledby={`monthly-${section.id}`} className="monthly-data-section" key={section.id}>
              <header className="monthly-section-heading">
                <p>{section.number}</p>
                <div>
                  <span>{section.dataPeriod}</span>
                  <h2 id={`monthly-${section.id}`}>{section.title}</h2>
                  <strong>{section.headline}</strong>
                </div>
                <b>{section.latestValue}</b>
              </header>
              <article className="monthly-chart-card">
                <div className="monthly-chart-header">
                  <div><h3>{section.chart.title}</h3><p>{section.chart.subtitle} · 单位：{section.chart.unit}</p></div>
                  <div><strong>{section.chart.currentValue}</strong><span>{section.chart.changeText}</span></div>
                </div>
                <WeeklyLineChart chart={section.chart} />
                <ul aria-label={`${section.chart.title}图例`} className="weekly-chart-legend">
                  {section.chart.series.map((item) => <li className={`weekly-legend-${item.tone}`} key={item.id}><span aria-hidden="true" /><b>{item.label}</b></li>)}
                </ul>
                <p className="weekly-chart-reading">{section.chart.interpretation}</p>
                <small className="weekly-chart-source">来源：{section.chart.source}</small>
              </article>
              <div className="monthly-disclosure">
                <button aria-controls={`monthly-detail-${section.id}`} aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : section.id)} type="button">
                  {expanded ? "收起完整解读" : "展开完整解读"}
                </button>
                {expanded && <p id={`monthly-detail-${section.id}`}>{section.detail}</p>}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
