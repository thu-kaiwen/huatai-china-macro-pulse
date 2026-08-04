import type { RiskItem } from "../domain/types";

export const risks: RiskItem[] = [
  {
    id: "risk-energy-price-volatility",
    reportId: "weekly-2026-08-02",
    kind: "risk",
    title: "能源价格波动超预期",
    summary: "若霍尔木兹海峡再度封锁，全球原油供需不平衡可能进一步加剧能源价格波动。",
  },
  {
    id: "risk-property-repair",
    reportId: "weekly-2026-08-02",
    kind: "risk",
    title: "地产成交修复不及预期",
    summary: "周报将“地产成交修复不及预期”列为风险提示。",
  },
  {
    id: "risk-domestic-demand-downside",
    reportId: "monthly-2026-07",
    kind: "risk",
    title: "内需超预期下行",
    summary: "月报将“内需超预期下行”列为风险提示；周报也披露同一风险边界。",
  },
  {
    id: "watch-july-trade-data",
    reportId: "weekly-2026-08-02",
    kind: "watch",
    title: "7月贸易数据",
    summary: "周报将7月贸易数据列为重点关注项。",
  },
  {
    id: "watch-july-inflation-data",
    reportId: "weekly-2026-08-02",
    kind: "watch",
    title: "7月通胀数据",
    summary: "周报将7月通胀数据列为重点关注项。",
  },
  {
    id: "watch-fiscal-acceleration",
    reportId: "weekly-2026-08-02",
    kind: "watch",
    title: "财政发力节奏",
    summary: "利率债发行同比少增，报告据此判断财政仍待发力。",
  },
  {
    id: "risk-geopolitical-conflict",
    reportId: "monthly-2026-07",
    kind: "risk",
    title: "全球地缘政治冲突烈度超预期",
    summary: "月报将全球地缘政治冲突烈度超预期列为风险提示。",
  },
];
