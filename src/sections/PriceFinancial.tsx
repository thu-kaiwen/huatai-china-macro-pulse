import { selectObservations } from "../domain/selectors";
import type { ComparisonType, MacroDataset, MetricDefinition, MetricObservation, ViewMode } from "../domain/types";

interface PriceFinancialProps {
  dataset: MacroDataset;
  view: ViewMode;
}

interface MarketGroup {
  title: string;
  metricIds: string[];
}

const marketGroups: MarketGroup[] = [
  {
    title: "大宗商品",
    metricIds: [
      "brent-usd",
      "brent-usd-change",
      "comex-gold-usd",
      "comex-gold-usd-change",
      "copper-price-change",
      "aluminium-price-change",
      "thermal-coal-price-change",
      "rebar-price-change",
      "cement-price-change",
    ],
  },
  {
    title: "农产品与食品",
    metricIds: [
      "agricultural-index-change",
      "pork-price-change",
      "vegetable-price-change",
      "fruit-price-change",
    ],
  },
  {
    title: "流动性与利率",
    metricIds: [
      "r007-change",
      "dr007-change",
      "one-year-government-yield-change",
      "ten-year-government-yield-change",
    ],
  },
  {
    title: "债券发行",
    metricIds: [
      "net-rate-bond-issuance",
      "net-rate-bond-issuance-yoy-change",
      "rate-bond-issuance-yoy-change",
      "local-government-bond-issuance-yoy-change",
    ],
  },
  { title: "汇率", metricIds: ["rmb-usd-change", "rmb-basket-change"] },
  { title: "权益", metricIds: ["csi-300-change"] },
];

const comparisonLabels: Record<ComparisonType, string> = {
  yoy: "同比变动",
  mom: "环比变动",
  wow: "周环比变动",
  "previous-week": "较上周变动",
  "basis-points": "基点变动",
  none: "当期点位",
};

// These observations retain the decimal precision disclosed in their approved source text.
const sourcePrecisionByObservationId: Readonly<Record<string, number>> = {
  "weekly-csi-300-change": 2,
  "weekly-one-year-government-yield-change": 2,
  "weekly-rebar-price-change": 1,
  "weekly-ten-year-government-yield-change": 2,
  "weekly-rmb-usd-change": 2,
  "weekly-rmb-basket-change": 2,
  "monthly-rmb-usd-change": 2,
  "monthly-rmb-basket-change": 2,
};

function formatValue(observation: MetricObservation, definition: MetricDefinition): string {
  let valueText: string;

  if (definition.unit === "%" || definition.unit === "bp") {
    const sourcePrecision = sourcePrecisionByObservationId[observation.id];
    if (sourcePrecision !== undefined) {
      valueText = observation.value.toFixed(sourcePrecision);
    } else {
      valueText = observation.value.toString();
    }
  } else {
    valueText = observation.value.toLocaleString("en-US", {
      minimumFractionDigits: observation.value % 1 === 0 ? 1 : 0,
      maximumFractionDigits: 2,
    });
  }

  return observation.comparisonType !== "none" && observation.value > 0 ? `+${valueText}` : valueText;
}

function MarketReading({
  definition,
  observation,
}: {
  definition: MetricDefinition;
  observation: MetricObservation;
}) {
  return (
    <article className="market-reading">
      <div>
        <h4>{definition.name}</h4>
        <span>{comparisonLabels[observation.comparisonType]}</span>
      </div>
      <p className="market-reading-value">
        <strong>{formatValue(observation, definition)}</strong>
        <span>{definition.unit}</span>
      </p>
      <p>截至 {observation.periodEnd}</p>
      <details>
        <summary>查看来源摘录</summary>
        <p>{observation.sourceText}</p>
      </details>
    </article>
  );
}

function MarketPeriod({
  dataset,
  frequency,
  title,
}: {
  dataset: MacroDataset;
  frequency: "weekly" | "monthly";
  title: string;
}) {
  const definitions = new Map(dataset.metricDefinitions.map((definition) => [definition.id, definition]));

  return (
    <section aria-label={title} className="market-period">
      <div className="market-period-heading">
        <h3>{title}</h3>
        <p>
          {frequency === "weekly"
            ? "仅展示周度报告中的最新点位或周环比/基点变动。"
            : "仅展示月度报告中的月度锚点或环比/同比变动。"}
        </p>
      </div>
      <div className="market-group-grid">
        {marketGroups.map((group) => {
          const observations = selectObservations(dataset, {
            view: frequency,
            metricIds: group.metricIds,
            verifiedOnly: true,
          });

          if (observations.length === 0) {
            return null;
          }

          return (
            <section aria-label={`${title}：${group.title}`} className="market-group" key={group.title}>
              <h4 id={`${frequency}-${group.title}`}>{group.title}</h4>
              <div className="market-reading-grid">
                {observations.map((observation) => {
                  const definition = definitions.get(observation.metricId);
                  return definition ? (
                    <MarketReading definition={definition} key={observation.id} observation={observation} />
                  ) : null;
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export function PriceFinancial({ dataset, view }: PriceFinancialProps) {
  return (
    <section aria-labelledby="price-financial-heading" className="price-financial-section" id="markets">
      <div className="fundamentals-heading">
        <p>价格、利率、汇率与权益</p>
        <h2 id="price-financial-heading">价格与金融条件</h2>
      </div>
      <p className="market-method-note">
        点位、价格变动、收益率基点变动与同比发行额分别呈现；本页不把不同单位合并为同一坐标轴。
      </p>
      {view !== "monthly" ? <MarketPeriod dataset={dataset} frequency="weekly" title="周度最新脉搏" /> : null}
      {view !== "weekly" ? <MarketPeriod dataset={dataset} frequency="monthly" title="月度锚点" /> : null}
    </section>
  );
}
