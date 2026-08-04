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
  column: number;
  row: number;
  sourceExplanation: string;
}

function sourceText(observation: MetricObservation | undefined): string {
  return observation?.sourceText ?? "当前筛选范围内没有获批的量化观测。";
}

function MatrixCell({ item }: { item: IndustryItem }) {
  const [isSourceVisible, setSourceVisible] = useState(false);

  return (
    <article
      className="industry-matrix-cell"
      role="gridcell"
      style={{ gridColumn: item.column, gridRow: item.row }}
    >
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
      classification: "高景气 · 边际走强（政策支持观察）",
      column: 3,
      row: 1,
      sourceExplanation: `周报摘要提及产业创新与科技金融部署；该位置为定性政策观察，并非行业量化景气读数。${weeklyReport?.summary ?? ""}`,
    },
    {
      name: "光伏设备",
      classification: "低景气 · 价格承压",
      column: 1,
      row: 3,
      sourceExplanation: sourceText(observationByMetric.get("pv-module-price-change")),
    },
    {
      name: "水泥",
      classification: "低景气 · 价格承压",
      column: 1,
      row: 2,
      sourceExplanation: sourceText(observationByMetric.get("cement-price-change")),
    },
    {
      name: "有色金属",
      classification: "混合 · 高价观察",
      column: 3,
      row: 2,
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
      <div
        aria-label="行业景气矩阵：横轴景气强度，纵轴边际变化"
        className="industry-matrix-grid"
        role="grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridTemplateRows: "repeat(3, minmax(7rem, auto))", gap: "0.75rem" }}
      >
        <span className="industry-axis industry-axis-x">
          <strong>景气强度</strong>：压力 → 修复 → 高位
        </span>
        <span className="industry-axis industry-axis-y">
          <strong>边际变化</strong>：走强 → 观察 → 承压
        </span>
        {items.map((item) => (
          <MatrixCell item={item} key={item.name} />
        ))}
      </div>
    </section>
  );
}
