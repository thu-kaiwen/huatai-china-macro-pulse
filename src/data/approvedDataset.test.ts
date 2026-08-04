import { describe, expect, it } from "vitest";
import type { ComparisonType, NativeFrequency } from "../domain/types";
import { selectPolicyEvents } from "../domain/selectors";
import { macroDataset } from "./dataset";

type ApprovedObservation = readonly [
  id: string,
  value: number,
  unit: string,
  periodEnd: string,
  comparisonType: ComparisonType,
  reportId: string,
];

const monthlyReport = "monthly-2026-07";
const weeklyReport = "weekly-2026-08-02";

const approvedObservations: ApprovedObservation[] = [
  ["monthly-real-gdp-yoy", 4.3, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-nominal-gdp-yoy", 5.9, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-industrial-value-added-yoy", 5.3, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-retail-sales-yoy", 1, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-fixed-asset-investment-yoy", -11.2, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-exports-yoy", 27, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-imports-yoy", 36, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-cpi-yoy", 1, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-ppi-yoy", 4.1, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-new-rmb-loans", 1.61, "万亿元", "2026-06-30", "none", monthlyReport],
  ["monthly-new-rmb-loans-yoy-change", -6300, "亿元", "2026-06-30", "yoy", monthlyReport],
  ["monthly-new-social-financing", 3.36, "万亿元", "2026-06-30", "none", monthlyReport],
  ["monthly-new-social-financing-yoy-change", -8606, "亿元", "2026-06-30", "yoy", monthlyReport],
  ["monthly-m1-yoy", 4, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-m2-yoy", 8, "%", "2026-06-30", "yoy", monthlyReport],
  ["monthly-brent-usd", 89, "美元/桶", "2026-07-30", "none", monthlyReport],
  ["monthly-brent-usd-change", 22.1, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-comex-gold-usd", 4163, "美元/盎司", "2026-07-30", "none", monthlyReport],
  ["monthly-comex-gold-usd-change", 3.3, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-copper-price-change", 3.5, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-aluminium-price-change", 5.2, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-thermal-coal-price-change", 5.1, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-rebar-price-change", -3.1, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-cement-price-change", -2.3, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-agricultural-index-change", 3.1, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-pork-price-change", 11.5, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-vegetable-price-change", 6.2, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-fruit-price-change", -5.4, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-one-year-government-yield-change", 3.6, "bp", "2026-07-30", "mom", monthlyReport],
  ["monthly-ten-year-government-yield-change", -1.3, "bp", "2026-07-30", "mom", monthlyReport],
  ["monthly-r007-change", -4.9, "bp", "2026-07-30", "mom", monthlyReport],
  ["monthly-dr007-change", -0.7, "bp", "2026-07-30", "mom", monthlyReport],
  ["monthly-net-rate-bond-issuance", 1.39, "万亿元", "2026-07-30", "none", monthlyReport],
  ["monthly-net-rate-bond-issuance-yoy-change", -1436, "亿元", "2026-07-30", "yoy", monthlyReport],
  ["monthly-rmb-usd-change", 0.43, "%", "2026-07-30", "mom", monthlyReport],
  ["monthly-rmb-basket-change", 0.11, "%", "2026-07-30", "mom", monthlyReport],
  ["weekly-brent-usd", 90.12, "美元/桶", "2026-08-02", "none", weeklyReport],
  ["weekly-brent-usd-change", -6.9, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-comex-gold-usd", 4098.6, "美元/盎司", "2026-08-02", "none", weeklyReport],
  ["weekly-comex-gold-usd-change", 1.1, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-copper-price-change", 0.8, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-rebar-price-change", -2, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-cement-price-change", -0.5, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-agricultural-index-change", 0, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-vegetable-price-change", 0.9, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-fruit-price-change", -4.7, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-pork-price-change", -0.4, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-dr007-change", 5.5, "bp", "2026-08-02", "wow", weeklyReport],
  ["weekly-r007-change", 4.5, "bp", "2026-08-02", "wow", weeklyReport],
  ["weekly-csi-300-change", -1.31, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-one-year-government-yield-change", 1.03, "bp", "2026-08-02", "wow", weeklyReport],
  ["weekly-ten-year-government-yield-change", -1.54, "bp", "2026-08-02", "wow", weeklyReport],
  ["weekly-rate-bond-issuance-yoy-change", -3032, "亿元", "2026-08-02", "yoy", weeklyReport],
  ["weekly-local-government-bond-issuance-yoy-change", -2109, "亿元", "2026-08-02", "yoy", weeklyReport],
  ["weekly-rmb-usd-change", 0.25, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-rmb-basket-change", -0.65, "%", "2026-08-02", "wow", weeklyReport],
  ["weekly-passenger-vehicle-retail-yoy", -22.9, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-passenger-vehicle-retail-wow", 8, "%", "2026-07-26", "wow", weeklyReport],
  ["weekly-movie-box-office-yoy", -7.8, "%", "2026-08-01", "yoy", weeklyReport],
  ["weekly-movie-box-office-wow", 20.1, "%", "2026-08-01", "wow", weeklyReport],
  ["weekly-second-home-area-yoy", 3.9, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-tier-1-second-home-area-yoy", 10.2, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-tier-2-second-home-area-yoy", 1.3, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-tier-3-second-home-area-yoy", -10.4, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-land-transaction-area-yoy", -15.6, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-land-transaction-area-wow", 1.3, "%", "2026-07-26", "wow", weeklyReport],
  ["weekly-land-floor-price-yoy", -41.7, "%", "2026-07-26", "yoy", weeklyReport],
  ["weekly-land-floor-price-wow", 61.9, "%", "2026-07-26", "wow", weeklyReport],
  ["weekly-manufacturing-pmi", 49.2, "指数", "2026-07-31", "none", weeklyReport],
  ["weekly-non-manufacturing-pmi", 49, "指数", "2026-07-31", "none", weeklyReport],
  ["weekly-industrial-profit-yoy", 15.1, "%", "2026-06-30", "yoy", weeklyReport],
  ["weekly-industrial-revenue-yoy", 11.2, "%", "2026-06-30", "yoy", weeklyReport],
  ["weekly-pv-module-price-change", -3, "%", "2026-07-31", "mom", weeklyReport],
  ["weekly-pv-wafer-price-change", -2.5, "%", "2026-07-31", "mom", weeklyReport],
  ["weekly-pv-cell-price-change", -14.5, "%", "2026-07-31", "mom", weeklyReport],
];

const approvedObservationSources: Array<readonly [id: string, sourceText: string]> = [
  ["monthly-real-gdp-yoy", "二季度实际GDP同比增长4.3%。"],
  ["monthly-nominal-gdp-yoy", "二季度名义GDP同比增长5.9%。"],
  ["monthly-industrial-value-added-yoy", "6月规模以上工业增加值同比增长5.3%。"],
  ["monthly-retail-sales-yoy", "6月社会消费品零售总额同比增长1.0%。"],
  ["monthly-fixed-asset-investment-yoy", "6月固定资产投资同比增速回升至-11.2%。"],
  ["monthly-exports-yoy", "出口同比增长27.0%，前值为19.4%。"],
  ["monthly-imports-yoy", "进口同比增长36.0%，前值为27.4%。"],
  ["monthly-cpi-yoy", "6月CPI同比增速走弱至1%。"],
  ["monthly-ppi-yoy", "6月PPI同比增速上行至4.1%。"],
  ["monthly-new-rmb-loans", "6月新增人民币贷款1.61万亿元。"],
  ["monthly-new-rmb-loans-yoy-change", "6月新增人民币贷款同比少增6300亿元。"],
  ["monthly-new-social-financing", "6月新增社会融资规模3.36万亿元。"],
  ["monthly-new-social-financing-yoy-change", "6月新增社会融资规模同比少增8606亿元。"],
  ["monthly-m1-yoy", "6月M1同比增长4.0%，前值为5.5%。"],
  ["monthly-m2-yoy", "6月M2同比增长8.0%，前值为8.6%。"],
  ["monthly-brent-usd", "布伦特原油报89美元/桶。"],
  ["monthly-brent-usd-change", "布伦特原油价格环比上涨22.1%。"],
  ["monthly-comex-gold-usd", "COMEX黄金报4,163美元/盎司。"],
  ["monthly-comex-gold-usd-change", "COMEX黄金价格环比上涨3.3%。"],
  ["monthly-copper-price-change", "月度数据显示铜价环比上涨3.5%。"],
  ["monthly-aluminium-price-change", "月度数据显示铝价环比上涨5.2%。"],
  ["monthly-thermal-coal-price-change", "动力煤价格环比上涨5.1%。"],
  ["monthly-rebar-price-change", "螺纹钢价格环比下降3.1%。"],
  ["monthly-cement-price-change", "水泥价格环比下降2.3%。"],
  ["monthly-agricultural-index-change", "农产品价格指数环比上涨3.1%。"],
  ["monthly-pork-price-change", "猪肉价格环比上涨11.5%。"],
  ["monthly-vegetable-price-change", "蔬菜价格环比上涨6.2%。"],
  ["monthly-fruit-price-change", "水果价格环比下降5.4%。"],
  ["monthly-one-year-government-yield-change", "1年期国债收益率环比上行3.6bp。"],
  ["monthly-ten-year-government-yield-change", "10年期国债收益率环比下行1.3bp。"],
  ["monthly-r007-change", "R007环比下行4.9bp。"],
  ["monthly-dr007-change", "DR007环比下行0.7bp。"],
  ["monthly-net-rate-bond-issuance", "7月利率债净发行1.39万亿元。"],
  ["monthly-net-rate-bond-issuance-yoy-change", "7月利率债净发行同比少增1,436亿元。"],
  ["monthly-rmb-usd-change", "人民币兑美元环比升值0.43%。"],
  ["monthly-rmb-basket-change", "人民币兑一篮子货币环比升值0.11%。"],
  ["weekly-brent-usd", "布伦特原油报90.12美元/桶；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-brent-usd-change", "布伦特原油价格周环比下降6.9%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-comex-gold-usd", "COMEX黄金报4,098.6美元/盎司；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-comex-gold-usd-change", "COMEX黄金价格周环比上涨1.1%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-copper-price-change", "铜价周环比上涨0.8%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-rebar-price-change", "螺纹钢价格周环比下降2.0%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-cement-price-change", "水泥价格周环比下降0.5%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-agricultural-index-change", "农产品价格指数周环比持平；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-vegetable-price-change", "蔬菜价格周环比上涨0.9%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-fruit-price-change", "水果价格周环比下降4.7%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-pork-price-change", "猪肉价格周环比下降0.4%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-dr007-change", "DR007周环比上行5.5bp；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-r007-change", "R007周环比上行4.5bp；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-csi-300-change", "沪深300指数周环比下跌1.31%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-one-year-government-yield-change", "1年期国债收益率周环比上行1.03bp；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-ten-year-government-yield-change", "10年期国债收益率周环比下行1.54bp；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-rate-bond-issuance-yoy-change", "利率债发行较去年同期减少3032亿元；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-local-government-bond-issuance-yoy-change", "地方政府债发行较去年同期减少2109亿元；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-rmb-usd-change", "人民币兑美元周环比升值0.25%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-rmb-basket-change", "人民币兑一篮子货币汇率周环比回撤0.65%；报告周截至2026-08-02，原图交易日待确认。"],
  ["weekly-passenger-vehicle-retail-yoy", "2026年7月20日至26日乘用车零售同比下降22.9%。"],
  ["weekly-passenger-vehicle-retail-wow", "2026年7月20日至26日乘用车零售周环比增长8.0%。"],
  ["weekly-movie-box-office-yoy", "2026年7月26日至8月1日全国电影票房同比下降7.8%。"],
  ["weekly-movie-box-office-wow", "2026年7月26日至8月1日全国电影票房周环比增长20.1%。"],
  ["weekly-second-home-area-yoy", "二手房成交面积同比增长3.9%，前值为5.3%；观测周暂按2026年7月20日至26日，待原图确认。"],
  ["weekly-tier-1-second-home-area-yoy", "一线城市二手房成交面积同比增长10.2%，前值为8.9%；观测周暂按2026年7月20日至26日，待原图确认。"],
  ["weekly-tier-2-second-home-area-yoy", "二线城市二手房成交面积同比增长1.3%，前值为4.9%；观测周暂按2026年7月20日至26日，待原图确认。"],
  ["weekly-tier-3-second-home-area-yoy", "三线城市二手房成交面积同比下降10.4%，前值为-9.2%；观测周暂按2026年7月20日至26日，待原图确认。"],
  ["weekly-land-transaction-area-yoy", "2026年7月20日至26日百城土地周均成交面积同比下降15.6%。"],
  ["weekly-land-transaction-area-wow", "2026年7月20日至26日百城土地周均成交面积周环比增长1.3%。"],
  ["weekly-land-floor-price-yoy", "2026年7月20日至26日百城土地成交楼面均价同比下降41.7%。"],
  ["weekly-land-floor-price-wow", "2026年7月20日至26日百城土地成交楼面均价周环比增长61.9%。"],
  ["weekly-manufacturing-pmi", "7月制造业PMI为49.2，6月为50.3。"],
  ["weekly-non-manufacturing-pmi", "7月非制造业PMI为49.0，6月为50.2。"],
  ["weekly-industrial-profit-yoy", "6月工业企业利润同比增长15.1%，5月为21.1%。"],
  ["weekly-industrial-revenue-yoy", "6月工业企业营业收入同比增长11.2%，5月为6.7%。"],
  ["weekly-pv-module-price-change", "7月平均光伏组件价格环比下降3.0%。"],
  ["weekly-pv-wafer-price-change", "7月平均多晶硅片价格环比下降2.5%。"],
  ["weekly-pv-cell-price-change", "7月平均太阳能电池价格环比下降14.5%。"],
];

const approvedSourceValueTexts = [
  ["monthly-brent-usd", "89"],
  ["monthly-comex-gold-usd", "4,163"],
  ["monthly-net-rate-bond-issuance", "1.39"],
  ["monthly-net-rate-bond-issuance-yoy-change", "-1,436"],
  ["monthly-rmb-usd-change", "0.43"],
  ["monthly-rmb-basket-change", "0.11"],
  ["weekly-brent-usd", "90.12"],
  ["weekly-comex-gold-usd", "4,098.6"],
  ["weekly-rebar-price-change", "-2.0"],
  ["weekly-csi-300-change", "-1.31"],
  ["weekly-one-year-government-yield-change", "1.03"],
  ["weekly-ten-year-government-yield-change", "-1.54"],
  ["weekly-rmb-usd-change", "0.25"],
  ["weekly-rmb-basket-change", "-0.65"],
] as const;

const methodologyGroups: Array<{
  nativeFrequency: NativeFrequency;
  methodology: string;
  metricIds: string[];
}> = [
  {
    nativeFrequency: "quarterly",
    methodology: "季度实际/名义 GDP 同比增速；本期为2026年二季度，不能按月频插值或平均。",
    metricIds: ["real-gdp-yoy", "nominal-gdp-yoy"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "6月当月同比增速；previousValue 仅在原文明确披露时录入。负增长率与“较前值回升/回落”是两个独立语义。",
    metricIds: ["industrial-value-added-yoy", "retail-sales-yoy", "fixed-asset-investment-yoy"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "美元计价进出口当月同比增速；前值为5月同比，当前值为6月同比。",
    metricIds: ["exports-yoy", "imports-yoy"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "6月价格指数同比增速；CPI走弱至1%，PPI上行至4.1%。",
    metricIds: ["cpi-yoy", "ppi-yoy"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "6月新增规模当期值，单位万亿元，不是增速。",
    metricIds: ["new-rmb-loans", "new-social-financing"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "6月新增规模相对去年同期的金额差，负值表示“同比少增”，单位亿元。",
    metricIds: ["new-rmb-loans-yoy-change", "new-social-financing-yoy-change"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "6月货币供应量同比增速；previousValue 为5月同比。",
    metricIds: ["m1-yoy", "m2-yoy"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "报告披露截止日的价格点位，分别以美元/桶、美元/盎司计；不是期间平均值。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["brent-usd", "comex-gold-usd"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "商品价格相对上一比较期的百分比变化；必须由 comparisonType 区分月环比和周环比，不可跨口径连线。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["brent-usd-change", "comex-gold-usd-change", "copper-price-change", "rebar-price-change", "cement-price-change"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "商品价格相对上一比较期的百分比变化；必须由 comparisonType 区分月环比和周环比，不可跨口径连线。",
    metricIds: ["aluminium-price-change", "thermal-coal-price-change"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "农产品指数或分项价格相对上一比较期的百分比变化；必须保留月环比/周环比口径。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["agricultural-index-change", "pork-price-change", "vegetable-price-change", "fruit-price-change"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "对应期限国债收益率相对上一比较期的变动，单位 bp；数值不是收益率水平。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["one-year-government-yield-change", "ten-year-government-yield-change"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "银行间利率相对上一比较期的变动，单位 bp；数值不是利率水平。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["r007-change", "dr007-change"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "7月利率债净发行额，单位万亿元。",
    metricIds: ["net-rate-bond-issuance"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "7月利率债净发行额相对去年同期的金额差，负值表示同比少增，单位亿元。",
    metricIds: ["net-rate-bond-issuance-yoy-change"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "人民币兑美元相对上一比较期的百分比变动；正值按原文表示升值，必须保留 MoM/WoW。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["rmb-usd-change"],
  },
  {
    nativeFrequency: "mixed",
    methodology: "人民币兑一篮子货币相对上一比较期的百分比变动；正值表示升值、负值表示回撤，必须保留 MoM/WoW。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["rmb-basket-change"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "沪深300指数周环比百分比变化。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["csi-300-change"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "报告周内发行额相对去年同期的金额差；负值表示同比少增，单位亿元。周报“上周”值在原图确认前仅按报告周截至2026-08-02锚定，不代表逐项交易日已经核验。",
    metricIds: ["rate-bond-issuance-yoy-change", "local-government-bond-issuance-yoy-change"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "2026-07-20至2026-07-26乘用车销量的同比/环比增速。",
    metricIds: ["passenger-vehicle-retail-yoy", "passenger-vehicle-retail-wow"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "2026-07-26至2026-08-01全国电影票房的同比/环比增速。",
    metricIds: ["movie-box-office-yoy", "movie-box-office-wow"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "二手房成交面积同比增速；previousValue 为原文披露的前一周同比，不是面积水平。具体观测周以原图日期为准。",
    metricIds: ["second-home-area-yoy", "tier-1-second-home-area-yoy", "tier-2-second-home-area-yoy", "tier-3-second-home-area-yoy"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "2026-07-20至2026-07-26百城土地周均成交面积同比/环比增速。",
    metricIds: ["land-transaction-area-yoy", "land-transaction-area-wow"],
  },
  {
    nativeFrequency: "weekly",
    methodology: "2026-07-20至2026-07-26百城土地成交楼面均价同比/环比增速。",
    metricIds: ["land-floor-price-yoy", "land-floor-price-wow"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "7月 PMI 指数水平；previousValue 为6月指数，虽由周报披露但原生频率为月度。",
    metricIds: ["manufacturing-pmi", "non-manufacturing-pmi"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "6月工业企业利润/营业收入同比增速；previousValue 为5月同比，原生频率为月度。",
    metricIds: ["industrial-profit-yoy", "industrial-revenue-yoy"],
  },
  {
    nativeFrequency: "monthly",
    methodology: "光伏组件/多晶硅片/太阳能电池7月均价月环比变化；虽由周报披露但原生频率为月度。",
    metricIds: ["pv-module-price-change", "pv-wafer-price-change", "pv-cell-price-change"],
  },
];

const approvedPolicies = [
  ["policy-2026-07-04-pboc", monthlyReport, undefined, "央行货币政策委员会2026年第二季度例会", "会议提出继续实施适度宽松货币政策，加强对扩大内需、科技创新、中小微企业等领域的支持。"],
  ["policy-2026-07-13-consumption", monthlyReport, undefined, "《扩大消费“十五五”规划》", "国务院印发规划，提出到2030年社会消费品零售总额达到60万亿元左右。"],
  ["policy-2026-07-20-state-council", monthlyReport, undefined, "国务院常务会议", "李强在国常会上强调推动服务业扩能提质和“六张网”规划建设。"],
  ["policy-2026-07-28-tax-innovation", weeklyReport, undefined, "土地使用税调整与工信领域创新任务", "财政部、税务总局调整部分能源资源行业企业城镇土地使用税政策；工信部等七部门开展2026年工业和信息化领域创新任务揭榜挂帅。"],
  ["policy-2026-07-29-tech-finance", weeklyReport, undefined, "科技金融数据开发利用通知", "央行等九部门发布科技金融数据开发利用目录1.0，覆盖8大类、26个数据指标，并强调数据归集共享与安全管理。"],
  ["policy-2026-07-30-politburo", weeklyReport, [weeklyReport, monthlyReport], "中共中央政治局会议", "会议部署下半年经济工作；在加大逆周期调节的同时，强调防范风险、统筹发展和安全、优化供给、推动新产业发展。"],
  ["policy-2026-07-31-financial-governance", weeklyReport, undefined, "《关于健全金融机构治理的实施意见》", "四部门提出9部分22条措施，并明确到2029年基本形成权责边界清晰、风险管理严格、运转规范高效的金融机构治理机制。"],
] as const;

const approvedRisks = [
  ["risk-energy-price-volatility", weeklyReport, "risk", "能源价格波动超预期", "若霍尔木兹海峡再度封锁，全球原油供需不平衡可能进一步加剧能源价格波动。"],
  ["risk-property-repair", weeklyReport, "risk", "地产成交修复不及预期", "周报将“地产成交修复不及预期”列为风险提示。"],
  ["risk-domestic-demand-downside", monthlyReport, "risk", "内需超预期下行", "月报将“内需超预期下行”列为风险提示；周报也披露同一风险边界。"],
  ["watch-july-trade-data", weeklyReport, "watch", "7月贸易数据", "周报将7月贸易数据列为重点关注项。"],
  ["watch-july-inflation-data", weeklyReport, "watch", "7月通胀数据", "周报将7月通胀数据列为重点关注项。"],
  ["watch-fiscal-acceleration", weeklyReport, "watch", "财政发力节奏", "利率债发行同比少增，报告据此判断财政仍待发力。"],
  ["risk-geopolitical-conflict", monthlyReport, "risk", "全球地缘政治冲突烈度超预期", "月报将全球地缘政治冲突烈度超预期列为风险提示。"],
] as const;

describe("audited macro data approval tables", () => {
  it("matches all 75 approved observations exactly once in both directions", () => {
    const definitions = new Map(macroDataset.metricDefinitions.map((definition) => [definition.id, definition]));
    const actual = macroDataset.observations.map((observation) => [
      observation.id,
      observation.value,
      definitions.get(observation.metricId)?.unit,
      observation.periodEnd,
      observation.comparisonType,
      observation.reportId,
    ]);

    expect(approvedObservations).toHaveLength(75);
    expect(new Set(approvedObservations.map(([id]) => id)).size).toBe(75);
    expect(actual).toHaveLength(75);
    expect(new Set(actual.map(([id]) => id)).size).toBe(75);
    expect(actual).toEqual(approvedObservations);

    const actualSources = macroDataset.observations.map(({ id, sourceText }) => [id, sourceText]);
    expect(approvedObservationSources).toHaveLength(75);
    expect(new Set(approvedObservationSources.map(([id]) => id)).size).toBe(75);
    expect(actualSources).toEqual(approvedObservationSources);

    const actualSourceValueTexts = macroDataset.observations
      .filter(({ sourceValueText }) => sourceValueText !== undefined)
      .map(({ id, sourceValueText }) => [id, sourceValueText]);
    expect(actualSourceValueTexts).toEqual(approvedSourceValueTexts);

    const reportWeekIds = approvedObservations
      .filter(([id, , , periodEnd]) => id.startsWith("weekly-") && periodEnd === "2026-08-02")
      .map(([id]) => id);
    expect(macroDataset.observations
      .filter(({ periodEndLabel }) => periodEndLabel !== undefined)
      .map(({ id, periodEndLabel }) => [id, periodEndLabel]))
      .toEqual(reportWeekIds.map((id) => [id, "报告周截至"]));
  });

  it("assigns all 58 definitions exactly once to an audited native frequency and methodology family", () => {
    const approvedDefinitions = methodologyGroups.flatMap(({ nativeFrequency, methodology, metricIds }) =>
      metricIds.map((id) => [id, nativeFrequency, methodology]),
    );
    const actual = macroDataset.metricDefinitions.map(({ id, nativeFrequency, methodology }) => [
      id,
      nativeFrequency,
      methodology,
    ]);

    expect(approvedDefinitions).toHaveLength(58);
    expect(new Set(approvedDefinitions.map(([id]) => id)).size).toBe(58);
    expect(actual).toHaveLength(58);
    expect(new Set(actual.map(([id]) => id)).size).toBe(58);
    expect([...actual].sort(([left], [right]) => String(left).localeCompare(String(right)))).toEqual(
      [...approvedDefinitions].sort(([left], [right]) => String(left).localeCompare(String(right))),
    );
  });

  it("preserves exact policy copy and exposes the dual-source July 30 event in both report views", () => {
    expect(macroDataset.policyEvents.map(({ id, reportId, reportIds, title, summary }) => [
      id,
      reportId,
      reportIds,
      title,
      summary,
    ])).toEqual(approvedPolicies);
    expect(selectPolicyEvents(macroDataset, "monthly").map(({ id }) => id)).toEqual([
      "policy-2026-07-04-pboc",
      "policy-2026-07-13-consumption",
      "policy-2026-07-20-state-council",
      "policy-2026-07-30-politburo",
    ]);
    expect(selectPolicyEvents(macroDataset, "weekly").map(({ id }) => id)).toEqual([
      "policy-2026-07-28-tax-innovation",
      "policy-2026-07-29-tech-finance",
      "policy-2026-07-30-politburo",
      "policy-2026-07-31-financial-governance",
    ]);
  });

  it("matches all seven audited risk and watch items with their exact kind and source", () => {
    expect(macroDataset.risks.map(({ id, reportId, kind, title, summary }) => [
      id,
      reportId,
      kind,
      title,
      summary,
    ])).toEqual(approvedRisks);
  });

  it("preserves exact narratives, corrected metric names, source semantics, and author order", () => {
    expect(macroDataset.narratives).toEqual([
      { id: "monthly-external-demand", reportId: monthlyReport, topic: "external-demand", title: "外需数据走强", summary: "6月美元计价出口同比由5月的19.4%升至27%，进口同比由27.4%升至36%。", signal: "improving" },
      { id: "monthly-domestic-demand", reportId: monthlyReport, topic: "domestic-demand", title: "内需修复仍受扰动", summary: "6月社零和固定资产投资同比增速均较前值回升至1%和-11.2%，但报告仍提示内需修复受供给冲击扰动。", signal: "watch" },
      { id: "monthly-prices", reportId: monthlyReport, topic: "prices", title: "能源回升、国内价格分化", summary: "7月国际油价和金价回升，国内原材料价格分化；6月CPI同比走弱至1%，PPI同比上行至4.1%。", signal: "watch" },
      { id: "monthly-liquidity", reportId: monthlyReport, topic: "liquidity", title: "信贷社融同比少增", summary: "6月新增人民币贷款和新增社融分别同比少增6300亿元和8606亿元，M1、M2同比均较5月放缓。", signal: "watch" },
      { id: "weekly-policy", reportId: weeklyReport, topic: "policy", title: "政策基调总体维持定力", summary: "政治局会议在加大逆周期调节的同时强调防风险、统筹发展与安全；周报判断短期以加快存量政策落地为主，增量政策强调务实管用、潜在体量或相对有限。", signal: "stable" },
    ]);

    const names = new Map(macroDataset.metricDefinitions.map(({ id, name }) => [id, name]));
    expect(Object.fromEntries([
      "net-rate-bond-issuance",
      "net-rate-bond-issuance-yoy-change",
      "rmb-basket-change",
      "land-floor-price-yoy",
      "land-floor-price-wow",
      "pv-wafer-price-change",
      "pv-cell-price-change",
      "agricultural-index-change",
    ].map((id) => [id, names.get(id)]))).toEqual({
      "net-rate-bond-issuance": "利率债净发行",
      "net-rate-bond-issuance-yoy-change": "利率债净发行同比增减",
      "rmb-basket-change": "人民币兑一篮子货币变动",
      "land-floor-price-yoy": "百城土地成交楼面均价同比",
      "land-floor-price-wow": "百城土地成交楼面均价环比",
      "pv-wafer-price-change": "多晶硅片价格变动",
      "pv-cell-price-change": "太阳能电池价格变动",
      "agricultural-index-change": "农产品价格指数变动",
    });

    const sourceById = new Map(macroDataset.observations.map(({ id, sourceText }) => [id, sourceText]));
    expect(Object.fromEntries([
      "monthly-fixed-asset-investment-yoy",
      "monthly-cpi-yoy",
      "monthly-ppi-yoy",
      "monthly-brent-usd",
      "monthly-comex-gold-usd",
      "monthly-net-rate-bond-issuance",
      "monthly-net-rate-bond-issuance-yoy-change",
      "weekly-rmb-basket-change",
    ].map((id) => [id, sourceById.get(id)]))).toEqual({
      "monthly-fixed-asset-investment-yoy": "6月固定资产投资同比增速回升至-11.2%。",
      "monthly-cpi-yoy": "6月CPI同比增速走弱至1%。",
      "monthly-ppi-yoy": "6月PPI同比增速上行至4.1%。",
      "monthly-brent-usd": "布伦特原油报89美元/桶。",
      "monthly-comex-gold-usd": "COMEX黄金报4,163美元/盎司。",
      "monthly-net-rate-bond-issuance": "7月利率债净发行1.39万亿元。",
      "monthly-net-rate-bond-issuance-yoy-change": "7月利率债净发行同比少增1,436亿元。",
      "weekly-rmb-basket-change": "人民币兑一篮子货币汇率周环比回撤0.65%；报告周截至2026-08-02，原图交易日待确认。",
    });

    const weeklyMarketIds = approvedObservations
      .filter(([id, , , periodEnd]) => id.startsWith("weekly-") && periodEnd === "2026-08-02")
      .map(([id]) => id);
    expect(weeklyMarketIds).toHaveLength(20);
    expect(weeklyMarketIds.every((id) => sourceById.get(id)?.includes("报告周截至2026-08-02"))).toBe(true);

    expect(macroDataset.reports.find(({ id }) => id === weeklyReport)?.authors).toEqual(["易峘", "吴宛忆", "王洺硕", "常慧丽"]);
    expect(macroDataset.reports.find(({ id }) => id === monthlyReport)?.authors).toEqual(["易峘", "王洺硕", "吴宛忆", "常慧丽"]);
  });
});
