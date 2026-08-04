import type { PolicyEvent } from "../domain/types";

const monthlyReport = "monthly-2026-07";
const weeklyReport = "weekly-2026-08-02";

export const policyEvents: PolicyEvent[] = [
  {
    id: "policy-2026-07-04-pboc",
    reportId: monthlyReport,
    date: "2026-07-04",
    title: "央行货币政策委员会2026年第二季度例会",
    summary: "会议提出继续实施适度宽松货币政策，加强对扩大内需、科技创新、中小微企业等领域的支持。",
    tags: ["monetary-policy", "pboc"],
  },
  {
    id: "policy-2026-07-13-consumption",
    reportId: monthlyReport,
    date: "2026-07-13",
    title: "《扩大消费“十五五”规划》",
    summary: "国务院印发规划，提出到2030年社会消费品零售总额达到60万亿元左右。",
    tags: ["consumption", "demand"],
  },
  {
    id: "policy-2026-07-20-state-council",
    reportId: monthlyReport,
    date: "2026-07-20",
    title: "国务院常务会议",
    summary: "李强在国常会上强调推动服务业扩能提质和“六张网”规划建设。",
    tags: ["state-council", "policy"],
  },
  {
    id: "policy-2026-07-28-tax-innovation",
    reportId: weeklyReport,
    date: "2026-07-28",
    title: "土地使用税调整与工信领域创新任务",
    summary: "财政部、税务总局调整部分能源资源行业企业城镇土地使用税政策；工信部等七部门开展2026年工业和信息化领域创新任务揭榜挂帅。",
    tags: ["tax", "industrial-innovation"],
  },
  {
    id: "policy-2026-07-29-tech-finance",
    reportId: weeklyReport,
    date: "2026-07-29",
    title: "科技金融数据开发利用通知",
    summary: "央行等九部门发布科技金融数据开发利用目录1.0，覆盖8大类、26个数据指标，并强调数据归集共享与安全管理。",
    tags: ["technology-finance", "data"],
  },
  {
    id: "policy-2026-07-30-politburo",
    reportId: weeklyReport,
    reportIds: [weeklyReport, monthlyReport],
    date: "2026-07-30",
    title: "中共中央政治局会议",
    summary: "会议部署下半年经济工作；在加大逆周期调节的同时，强调防范风险、统筹发展和安全、优化供给、推动新产业发展。",
    tags: ["politburo", "macro-policy"],
  },
  {
    id: "policy-2026-07-31-financial-governance",
    reportId: weeklyReport,
    date: "2026-07-31",
    title: "《关于健全金融机构治理的实施意见》",
    summary: "四部门提出9部分22条措施，并明确到2029年基本形成权责边界清晰、风险管理严格、运转规范高效的金融机构治理机制。",
    tags: ["financial-institutions", "governance"],
  },
];
