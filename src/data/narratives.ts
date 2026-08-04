import type { Narrative } from "../domain/types";

export const narratives: Narrative[] = [
  {
    id: "monthly-external-demand",
    reportId: "monthly-2026-07",
    topic: "external-demand",
    title: "外需保持韧性",
    summary: "出口和进口同比增速均较前值回升，外需仍对增长形成支撑。",
    signal: "improving",
  },
  {
    id: "monthly-domestic-demand",
    reportId: "monthly-2026-07",
    topic: "domestic-demand",
    title: "内需修复受扰动",
    summary: "零售低增、固定资产投资走弱，内需修复仍需观察。",
    signal: "watch",
  },
  {
    id: "monthly-prices",
    reportId: "monthly-2026-07",
    topic: "prices",
    title: "供给冲击推升部分价格",
    summary: "能源和部分上游商品价格走高，CPI与PPI同比均有所上升。",
    signal: "watch",
  },
  {
    id: "monthly-liquidity",
    reportId: "monthly-2026-07",
    topic: "liquidity",
    title: "货币融资同比偏弱",
    summary: "新增贷款与社融同比少增，M1、M2增速均较前值回落。",
    signal: "watch",
  },
  {
    id: "weekly-policy",
    reportId: "weekly-2026-08-02",
    topic: "policy",
    title: "稳增长政策继续部署",
    summary: "七月政策会议和配套文件覆盖消费、产业创新、科技金融与金融机构治理。",
    signal: "improving",
  },
];
