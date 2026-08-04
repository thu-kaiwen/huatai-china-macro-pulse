import type { PolicyEvent, Report, ViewMode } from "../domain/types";

interface PolicyTimelineProps {
  events: PolicyEvent[];
  reports: Report[];
  view: ViewMode;
}

function frequencyLabel(frequency: Report["frequency"]): string {
  return frequency === "weekly" ? "周报" : "月报";
}

export function PolicyTimeline({ events, reports, view }: PolicyTimelineProps) {
  const reportById = new Map(reports.map((report) => [report.id, report]));
  const groupedEvents = events
    .filter((event) => {
      const report = reportById.get(event.reportId);
      return report !== undefined && (view === "combined" || report.frequency === view);
    })
    .sort((left, right) => left.date.localeCompare(right.date))
    .reduce<Map<string, PolicyEvent[]>>((groups, event) => {
      const sameDayEvents = groups.get(event.date) ?? [];
      sameDayEvents.push(event);
      groups.set(event.date, sameDayEvents);
      return groups;
    }, new Map());

  return (
    <section aria-labelledby="policy-timeline-heading" className="research-section" id="policy">
      <div className="fundamentals-heading">
        <p>仅限获批报告记录的政策事项</p>
        <h2 id="policy-timeline-heading">政策时间线</h2>
      </div>
      {groupedEvents.size === 0 ? (
        <p className="research-empty">当前报告频率下暂无获批的政策事项。</p>
      ) : (
        <ol className="policy-timeline">
          {[...groupedEvents.entries()].map(([date, sameDayEvents]) => (
            <li className="policy-day" key={date}>
              <time dateTime={date}>{date}</time>
              <div className="policy-day-events">
                {sameDayEvents.map((event) => {
                  const report = reportById.get(event.reportId);
                  if (!report) {
                    return null;
                  }

                  return (
                    <article className="policy-event" key={event.id}>
                      <div className="research-card-meta">
                        <span>{frequencyLabel(report.frequency)}</span>
                        <span>{event.tags.join(" · ")}</span>
                      </div>
                      <h3>{event.title}</h3>
                      <p>{event.summary}</p>
                      <a href={report.sourceUrl} rel="noreferrer" target="_blank">
                        查看政策所引{frequencyLabel(report.frequency)}原文
                      </a>
                    </article>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
