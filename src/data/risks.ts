import type { RiskItem } from "../domain/types";

export const risks: RiskItem[] = [
  {
    id: "risk-energy-price-volatility",
    reportId: "monthly-2026-07",
    kind: "risk",
    title: "能源价格波动",
    summary: "来源月报将能源价格波动列为供给冲击可能延续的风险边界。",
  },
  {
    id: "risk-property-repair",
    reportId: "weekly-2026-08-02",
    kind: "watch",
    title: "地产修复仍待观察",
    summary: "来源周报仅据二手房和土地高频数据提示地产修复节奏仍需观察。",
  },
  {
    id: "risk-domestic-demand-downside",
    reportId: "monthly-2026-07",
    kind: "risk",
    title: "内需下行风险",
    summary: "来源月报将消费和投资偏弱所对应的内需下行作为风险边界。",
  },
];
