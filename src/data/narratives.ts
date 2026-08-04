import type { Narrative } from "../domain/types";

export const narratives: Narrative[] = [
  {
    id: "monthly-external-demand",
    reportId: "monthly-2026-07",
    topic: "external-demand",
    title: "外需数据走强",
    summary: "6月美元计价出口同比由5月的19.4%升至27%，进口同比由27.4%升至36%。",
    signal: "improving",
  },
  {
    id: "monthly-domestic-demand",
    reportId: "monthly-2026-07",
    topic: "domestic-demand",
    title: "内需修复仍受扰动",
    summary: "6月社零和固定资产投资同比增速均较前值回升至1%和-11.2%，但报告仍提示内需修复受供给冲击扰动。",
    signal: "watch",
  },
  {
    id: "monthly-prices",
    reportId: "monthly-2026-07",
    topic: "prices",
    title: "能源回升、国内价格分化",
    summary: "7月国际油价和金价回升，国内原材料价格分化；6月CPI同比走弱至1%，PPI同比上行至4.1%。",
    signal: "watch",
  },
  {
    id: "monthly-liquidity",
    reportId: "monthly-2026-07",
    topic: "liquidity",
    title: "信贷社融同比少增",
    summary: "6月新增人民币贷款和新增社融分别同比少增6300亿元和8606亿元，M1、M2同比均较5月放缓。",
    signal: "watch",
  },
  {
    id: "weekly-policy",
    reportId: "weekly-2026-08-02",
    topic: "policy",
    title: "政策基调总体维持定力",
    summary: "政治局会议在加大逆周期调节的同时强调防风险、统筹发展与安全；周报判断短期以加快存量政策落地为主，增量政策强调务实管用、潜在体量或相对有限。",
    signal: "stable",
  },
];
