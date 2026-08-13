import { useState } from "react";
import type { WeeklyReportPage } from "../domain/weeklyReport";
import { selectHeroCharts } from "../domain/weeklyReport";

interface WeeklyReportProps {
  report: WeeklyReportPage;
}

export function WeeklyReport({ report }: WeeklyReportProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const heroCharts = selectHeroCharts(report);

  return (
    <section aria-labelledby="weekly-report-heading" className="weekly-report" id="weekly">
      <header className="weekly-report-lead">
        <p className="weekly-kicker">华泰证券宏观团队 · 国内周报 · {report.publishedAt}</p>
        <h1 id="weekly-report-heading">{report.title}</h1>
        <p className="weekly-overview">{report.overview}</p>
      </header>

      <section aria-labelledby="weekly-key-changes" className="weekly-key-changes">
        <div className="weekly-section-title">
          <p>本周核心变化</p>
          <h2 id="weekly-key-changes">由“一周概览”直接提炼</h2>
        </div>
        <div className="weekly-metric-grid">
          {report.keyMetrics.map((metric) => (
            <article className="weekly-metric-card" key={metric.id}>
              <p>{metric.label}</p>
              <strong>{metric.valueText}</strong>
              <span>{metric.changeText}</span>
              <em>{metric.interpretation}</em>
            </article>
          ))}
        </div>
        <div className="weekly-hero-grid">
          {heroCharts.map((item) => (
            <figure className="weekly-chart-card weekly-chart-card-hero" key={item.id}>
              <img alt={item.alt} loading="eager" src={item.assetPath} />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="weekly-section-list">
        {report.sections.map((section, index) => {
          const expanded = expandedSection === section.id;
          return (
            <section className="weekly-report-section" key={section.id}>
              <div className="weekly-section-summary">
                <div>
                  <p>0{index + 1}</p>
                  <h3>{section.title}</h3>
                  <span>{section.summary}</span>
                </div>
                <button aria-controls={`weekly-section-${section.id}`} aria-expanded={expanded} onClick={() => setExpandedSection(expanded ? null : section.id)} type="button">
                  {expanded ? "收起解读" : "展开解读"}
                </button>
              </div>
              {expanded && (
                <div className="weekly-section-detail" id={`weekly-section-${section.id}`}>
                  <p>{section.detail}</p>
                  <div className="weekly-chart-grid">
                    {section.charts.map((item) => (
                      <figure className="weekly-chart-card" key={item.id}>
                        <img alt={item.alt} loading="lazy" src={item.assetPath} />
                        <figcaption>
                          <strong>{item.title}</strong>
                          <span>{item.source}</span>
                          <small>底稿：{item.workbookPath} · {item.worksheet}</small>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
