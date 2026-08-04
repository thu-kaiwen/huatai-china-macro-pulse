import type { Report } from "../domain/types";

const authors = ["易峘", "吴宛忆", "王洺硕", "常慧丽"];

export const reports: Report[] = [
  {
    id: "weekly-2026-08-02",
    frequency: "weekly",
    title: "【华泰宏观 | 图解国内周报】出口维持高增但地产成交边际降温",
    publishedAt: "2026-08-02",
    periodStart: "2026-07-27",
    periodEnd: "2026-08-02",
    sourceUrl: "https://mp.weixin.qq.com/s/i8Js6xpAwblqlMOmsNZFeQ",
    authors,
    summary: "跟踪七月末政策部署、国内高频需求、价格与流动性变化。",
  },
  {
    id: "monthly-2026-07",
    frequency: "monthly",
    title: "【华泰宏观 | 图解国内月报】供给冲击再现扰动内需修复",
    publishedAt: "2026-07-31",
    periodStart: "2026-07-01",
    periodEnd: "2026-07-31",
    sourceUrl: "https://mp.weixin.qq.com/s/OXLQFLNXvQoI8GVX9MJ4CA",
    authors,
    summary: "月度宏观数据反映外需韧性与内需修复仍受供给冲击扰动。",
  },
];
