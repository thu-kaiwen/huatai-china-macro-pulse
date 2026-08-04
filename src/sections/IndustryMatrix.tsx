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
  sourceUrl?: string;
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
      {isSourceVisible && item.sourceUrl ? (
        <a href={item.sourceUrl} rel="noreferrer" target="_blank">
          查看周报原文
        </a>
      ) : null}
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
  const semiconductor: IndustryItem = {
    name: "半导体",
    classification: "未坐标化观察项",
    sourceExplanation: `本期报告没有足以确定象限的量化观测；因此未纳入矩阵坐标。来源报告：《${weeklyReport?.title ?? "未命名周报"}》。`,
    sourceUrl: weeklyReport?.sourceUrl,
  };
  const photovoltaic: IndustryItem = {
    name: "光伏设备",
    classification: "供需承压 · 边际承压",
    sourceExplanation: sourceText(observationByMetric.get("pv-module-price-change")),
  };
  const cement: IndustryItem = {
    name: "水泥",
    classification: "供需承压 · 边际承压",
    sourceExplanation: sourceText(observationByMetric.get("cement-price-change")),
  };
  const nonferrous: IndustryItem = {
    name: "有色金属",
    classification: "高价观察 · 边际混合",
    sourceExplanation: `${sourceText(observationByMetric.get("copper-price-change"))} “高价观察”不代表未披露的现货点位。`,
  };

  return (
    <section aria-labelledby="industry-matrix-heading" className="industry-matrix-section">
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
              <span>边际变化</span> \ <span>供需状态</span>
            </th>
            <th scope="col">供需改善</th>
            <th scope="col">高价观察</th>
            <th scope="col">供需承压</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">改善</th>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <th scope="row">混合</th>
            <td />
            <td><MatrixCell item={nonferrous} /></td>
            <td />
          </tr>
          <tr>
            <th scope="row">承压</th>
            <td />
            <td />
            <td>
              <MatrixCell item={cement} />
              <MatrixCell item={photovoltaic} />
            </td>
          </tr>
        </tbody>
      </table>
      <section aria-labelledby="unmapped-observations-heading" className="industry-unmapped-observations">
        <h3 id="unmapped-observations-heading">未坐标化观察项</h3>
        <MatrixCell item={semiconductor} />
      </section>
    </section>
  );
}
