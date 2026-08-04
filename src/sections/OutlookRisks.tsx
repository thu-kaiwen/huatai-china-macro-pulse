import type { Report, RiskItem, ViewMode } from "../domain/types";

interface OutlookRisksProps {
  items: RiskItem[];
  reports: Report[];
  view: ViewMode;
}

interface ResearchListProps {
  emptyText: string;
  heading: string;
  items: RiskItem[];
  reportById: Map<string, Report>;
}

function ResearchList({ emptyText, heading, items, reportById }: ResearchListProps) {
  return (
    <section aria-labelledby={`${heading}-heading`} className="research-list">
      <h3 id={`${heading}-heading`}>{heading}</h3>
      {items.length === 0 ? (
        <p className="research-empty">{emptyText}</p>
      ) : (
        <ul>
          {items.map((item) => {
            const report = reportById.get(item.reportId);
            if (!report) {
              return null;
            }

            return (
              <li className="research-card" key={item.id}>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
                <a href={report.sourceUrl} rel="noreferrer" target="_blank">
                  查看相关报告原文
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function OutlookRisks({ items, reports, view }: OutlookRisksProps) {
  const reportById = new Map(reports.map((report) => [report.id, report]));
  const visibleItems = items.filter((item) => {
    const report = reportById.get(item.reportId);
    return report !== undefined && (view === "combined" || report.frequency === view);
  });

  return (
    <section aria-labelledby="outlook-risks-heading" className="research-section" id="outlook">
      <div className="fundamentals-heading">
        <p>仅呈现报告已披露的观察项和风险边界</p>
        <h2 id="outlook-risks-heading">展望与风险</h2>
      </div>
      <div className="research-list-grid">
        <ResearchList
          emptyText="当前报告频率下暂无已披露的观察项。"
          heading="展望（待观察）"
          items={visibleItems.filter((item) => item.kind === "watch")}
          reportById={reportById}
        />
        <ResearchList
          emptyText="当前报告频率下暂无已披露的风险边界。"
          heading="风险边界"
          items={visibleItems.filter((item) => item.kind === "risk")}
          reportById={reportById}
        />
      </div>
    </section>
  );
}
