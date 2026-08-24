import { useState } from "react";
import type { WeeklyLineDashboardChart, WeeklyReportPage } from "../domain/weeklyReport";
import { BondIssuanceChart, Sparkline, WeeklyLineChart } from "../components/WeeklyCharts";

interface WeeklyReportProps {
  report: WeeklyReportPage;
}

export function WeeklyReport({ report }: WeeklyReportProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  function chartLegend(chart: WeeklyLineDashboardChart) {
    return (
      <ul aria-label={`${chart.title}图例`} className="weekly-chart-legend">
        {chart.series.map((series) => (
          <li className={`weekly-legend-${series.tone}`} key={series.id}>
            <span aria-hidden="true" />
            <b>{series.label}</b>
            {series.weeklyChange && <em>{series.weeklyChange}</em>}
          </li>
        ))}
      </ul>
    );
  }

  function lineChartCard(chart: WeeklyLineDashboardChart, variant = "standard") {
    return (
      <article className={`weekly-dashboard-card weekly-dashboard-card-${variant}`} key={chart.id}>
        <header>
          <div>
            {chart.category && <p className="weekly-chart-category">{chart.category}</p>}
            <h3>{chart.title}</h3>
            <p>{chart.subtitle} · 单位：{chart.unit}</p>
          </div>
          <div className="weekly-chart-current">
            {chart.currentValue && <strong>{chart.currentValue}</strong>}
            {chart.changeText && <span>{chart.changeText}</span>}
          </div>
        </header>
        <WeeklyLineChart chart={chart} />
        {chartLegend(chart)}
        {chart.interpretation && <p className="weekly-chart-reading">{chart.interpretation}</p>}
        <small className="weekly-chart-source">来源：{chart.source}</small>
      </article>
    );
  }

  const sectionById = new Map(report.sections.map((section) => [section.id, section]));

  function disclosure(sectionId: string) {
    const section = sectionById.get(sectionId as WeeklyReportPage["sections"][number]["id"]);
    if (!section) return null;
    const expanded = expandedSection === section.id;
    return (
      <div className="weekly-section-disclosure">
        <button aria-controls={`weekly-section-${section.id}`} aria-expanded={expanded} onClick={() => setExpandedSection(expanded ? null : section.id)} type="button">
          {expanded ? "收起完整解读" : "展开完整解读"}
        </button>
        {expanded && <p id={`weekly-section-${section.id}`}>{section.detail}</p>}
      </div>
    );
  }

  return (
    <section aria-labelledby="weekly-report-heading" className="weekly-report" id="weekly">
      <header className="weekly-report-lead">
        <p className="weekly-kicker">华泰证券宏观团队 · 国内周报 · {report.publishedAt}</p>
        <h1 id="weekly-report-heading"><span>国内周报</span><b>｜{report.title}</b></h1>
        <p className="weekly-overview">{report.overview}</p>
      </header>

      <section aria-labelledby="weekly-key-changes" className="weekly-key-changes">
        <div className="weekly-section-title">
          <p>WEEKLY MARGIN</p>
          <h2 id="weekly-key-changes">本周边际变化</h2>
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
          {report.dashboard.heroCharts.map((chart) => chart.kind === "line" ? lineChartCard(chart, "hero") : (
            <article className="weekly-dashboard-card weekly-dashboard-card-hero" key={chart.id}>
              <header>
                <div><h3>{chart.title}</h3><p>{chart.subtitle}</p></div>
                <div className="weekly-chart-current"><strong>{chart.currentValue}</strong><span>{chart.changeText}</span></div>
              </header>
              <BondIssuanceChart chart={chart} />
              <small className="weekly-chart-source">来源：{chart.source}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="weekly-report-section weekly-activity-section">
        <header className="weekly-framework-heading"><p>01</p><div><h2>高频经济活动跟踪</h2><span>{sectionById.get("activity")?.summary}</span></div></header>
        <div className="weekly-activity-grid">{report.dashboard.activityCharts.map((chart) => lineChartCard(chart, "activity"))}</div>
        {disclosure("activity")}
      </section>

      <section className="weekly-report-section weekly-price-section">
        <header className="weekly-framework-heading"><p>02</p><div><h2>价格指标及通胀变化</h2><span>{sectionById.get("prices")?.summary}</span></div></header>
        <div className="weekly-price-grid">{report.dashboard.priceCharts.map((chart) => lineChartCard(chart, "price"))}</div>
        {disclosure("prices")}
      </section>

      <section className="weekly-report-section weekly-finance-section">
        <header className="weekly-framework-heading"><p>03</p><div><h2>利率、汇率及金融市场环境</h2><span>{sectionById.get("financial")?.summary}</span></div></header>
        {report.dashboard.financeGroups.map((group) => (
          <div aria-label={`${group.title}表格，可横向滚动`} className="weekly-finance-table-wrap" key={group.title} role="region" tabIndex={0}>
            <h3>{group.title}</h3>
            <table className="weekly-finance-table">
              <thead><tr><th>指标</th><th>最新值</th><th>周变化</th><th>年内趋势</th><th>观察</th></tr></thead>
              <tbody>{group.rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th><td>{row.value}</td><td className={`weekly-direction-${row.direction}`}>{row.change}</td>
                  <td><Sparkline ariaLabel={`${row.label}年内趋势`} values={row.trend} /></td><td>{row.observation}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ))}
        {disclosure("financial")}
      </section>

      <section className="weekly-report-section weekly-policy-section">
        <header className="weekly-framework-heading"><p>04</p><div><h2>宏观政策跟踪</h2><span>{sectionById.get("policy")?.summary}</span></div></header>
        <div className="weekly-policy-layout">
          <ol className="weekly-policy-timeline">
            {report.dashboard.policyEvents.map((event) => <li key={`${event.date}-${event.title}`}><time>{event.date}</time><div><h3>{event.title}</h3><p>{event.detail}</p></div></li>)}
          </ol>
          <aside className="weekly-policy-calendar"><h3>本周数据日历</h3><ul>{report.dashboard.policyCalendar.map((item) => <li key={`${item.date}-${item.label}`}><time>{item.date}</time><span>{item.label}</span></li>)}</ul></aside>
        </div>
        {disclosure("policy")}
      </section>
    </section>
  );
}
