import type { PolicyEvent } from "../domain/types";

const reportId = "weekly-2026-08-02";

export const policyEvents: PolicyEvent[] = [
  { id: "policy-2026-07-04-pboc", reportId, date: "2026-07-04", title: "人民银行政策会议", summary: "周报记录人民银行召开政策相关会议。", tags: ["monetary-policy", "pboc"] },
  { id: "policy-2026-07-13-consumption", reportId, date: "2026-07-13", title: "促消费计划", summary: "周报记录出台促进消费相关计划。", tags: ["consumption", "demand"] },
  { id: "policy-2026-07-20-state-council", reportId, date: "2026-07-20", title: "国务院会议", summary: "周报记录国务院召开相关工作会议。", tags: ["state-council", "policy"] },
  { id: "policy-2026-07-28-tax-innovation", reportId, date: "2026-07-28", title: "税收与产业创新事项", summary: "周报记录税收与产业创新领域的政策事项。", tags: ["tax", "industrial-innovation"] },
  { id: "policy-2026-07-29-tech-finance", reportId, date: "2026-07-29", title: "科技金融数据通知", summary: "周报记录科技金融数据报送相关通知。", tags: ["technology-finance", "data"] },
  { id: "policy-2026-07-30-politburo", reportId, date: "2026-07-30", title: "政治局会议", summary: "周报记录政治局召开会议并部署相关工作。", tags: ["politburo", "macro-policy"] },
  { id: "policy-2026-07-31-financial-governance", reportId, date: "2026-07-31", title: "金融机构治理意见", summary: "周报记录关于金融机构治理的意见。", tags: ["financial-institutions", "governance"] },
];
