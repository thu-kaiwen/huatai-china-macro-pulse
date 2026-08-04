import type { Report } from "../domain/types";

interface SourcesArchiveProps {
  reports: Report[];
}

function frequencyLabel(frequency: Report["frequency"]): string {
  return frequency === "weekly" ? "周报" : "月报";
}

export function SourcesArchive({ reports }: SourcesArchiveProps) {
  return (
    <section aria-labelledby="sources-archive-heading" className="research-section sources-archive">
      <div className="fundamentals-heading">
        <p>获批公开推送档案</p>
        <h2 id="sources-archive-heading">来源与方法</h2>
      </div>
      <p className="archive-method">
        数据由当前研究整理任务从指定公开推送中提取并逐项核验；未验证数值不进入图表。
      </p>
      <div aria-label="获批报告原文" className="source-archive-grid">
        {reports.map((report) => (
          <article className="source-archive-card" key={report.id}>
            <div className="research-card-meta">
              <span>{frequencyLabel(report.frequency)}</span>
              <span>发布日期 {report.publishedAt}</span>
            </div>
            <p className="source-archive-title">报告标题：{report.title}</p>
            <dl>
              <div>
                <dt>统计期</dt>
                <dd>{report.periodStart} 至 {report.periodEnd}</dd>
              </div>
              <div>
                <dt>作者</dt>
                <dd>{report.authors.join("、")}</dd>
              </div>
            </dl>
            <p>{report.summary}</p>
            <a href={report.sourceUrl} rel="noreferrer" target="_blank">查看原文</a>
          </article>
        ))}
      </div>
      <div className="archive-disclosure">
        <h3>报告适用与风险提示</h3>
        <p>报告内容仅适用于各自发布日和统计期，后续情况可能发生变化；具体结论及适用范围请以原文为准。</p>
        <p>本页为研究资料整理，不构成对任何人的投资建议。</p>
      </div>
    </section>
  );
}
