import { useState } from "react";
import { selectObservations, selectReports } from "../domain/selectors";
import type { MacroDataset, MetricObservation, ViewMode } from "../domain/types";

interface IndustryMatrixProps {
  dataset: MacroDataset;
  view: ViewMode;
}

interface IndustryItem {
  name: string;
  classification: string;
  sourceExplanation: string;
}

function sourceText(observation: MetricObservation | undefined): string {
  return observation?.sourceText ?? "当前筛选范围内没有获批的量化观测。";
}

function MatrixCell({ item }: { item: IndustryItem }) {
  const [isSourceVisible, setSourceVisible] = useState(false);

  return (
    <article className="industry-matrix-cell">
      <h3>{item.name}</h3>
      <p>{item.classification}</p>
      <button
        aria-expanded={isSourceVisible}
        aria-label={`查看${item.name}来源说明`}
        onClick={() => setSourceVisible((visible) => !visible)}
        type="button"
      >
        {isSourceVisible ? "收起来源说明" : "查看来源说明"}
      </button>
      {isSourceVisible ? <p className="industry-source-explanation">来源说明：{item.sourceExplanation}</p> : null}
    </article>
  );
}

export function IndustryMatrix({ dataset, view }: IndustryMatrixProps) {
  if (view === "monthly") {
    return null;
  }

  const weeklyReport = selectReports(dataset, "weekly")[0];
  const weeklyObservations = selectObservations(dataset, { view: "weekly", verifiedOnly: true });
  const observationByMetric = new Map(
    weeklyObservations.map((observation) => [observation.metricId, observation]),
  );
  const items: IndustryItem[] = [
    {
      name: "半导体",
      classification: "高位 · 观察项",
      sourceExplanation: `本期获批周报未提供半导体的可量化周度观测；本项仅列为观察项。来源报告：《${weeklyReport?.title ?? "未命名周报"}》。`,
    },
    {
      name: "光伏设备",
      classification: "低景气 · 价格承压",
      sourceExplanation: sourceText(observationByMetric.get("pv-module-price-change")),
    },
    {
      name: "水泥",
      classification: "低景气 · 价格承压",
      sourceExplanation: sourceText(observationByMetric.get("cement-price-change")),
    },
    {
      name: "有色金属",
      classification: "混合 · 高价观察",
      sourceExplanation: `${sourceText(observationByMetric.get("copper-price-change"))} 高价观察仅指报告所述供给冲击下的价格观察，不代表未披露的现货点位。`,
    },
  ];

  return (
    <section aria-labelledby="industry-matrix-heading" className="industry-matrix-section" id="industry">
      <div className="fundamentals-heading">
        <p>仅限获批报告的定性行业观察</p>
        <h2 id="industry-matrix-heading">行业景气矩阵</h2>
      </div>
      <p className="industry-matrix-note">
        横纵轴为报告定性归类；它们不构成跨行业、跨频率的量化评分。
      </p>
      <table className="industry-matrix-table">
        <caption>行业景气矩阵</caption>
        <thead>
          <tr>
            <th scope="col">
              <span>边际变化</span> \ <span>景气强度</span>
            </th>
            <th scope="col">景气压力</th>
            <th scope="col">景气修复</th>
            <th scope="col">景气高位</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">走强</th>
            <td />
            <td />
            <td><MatrixCell item={items[0]} /></td>
          </tr>
          <tr>
            <th scope="row">观察</th>
            <td />
            <td />
            <td><MatrixCell item={items[3]} /></td>
          </tr>
          <tr>
            <th scope="row">承压</th>
            <td>
              <MatrixCell item={items[2]} />
              <MatrixCell item={items[1]} />
            </td>
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    </section>
  );
}
