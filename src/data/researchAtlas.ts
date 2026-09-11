import type { ResearchAtlasData } from "../domain/researchAtlas";

export const researchAtlasData: ResearchAtlasData = {
  layers: [
    { stage: "china", eyebrow: "01 CHINA FUNDAMENTALS", title: "中国基本面脉搏", nodes: [
      { id: "regular-tracking", label: "定期跟踪", summary: "承接国内周报和国内月报，保留完整图表、数据与解读。" },
      { id: "activity", label: "经济活动", summary: "从生产、投资、消费、地产与高频指标观察经济运行。" },
      { id: "rates-fx", label: "利率汇率", summary: "跟踪利率曲线、流动性、人民币汇率和金融市场环境。" },
      { id: "policy-change", label: "政策变化", summary: "持续梳理宏观政策进展、重要会议与政策落地节奏。" },
    ] },
    { stage: "overseas", eyebrow: "02 OVERSEAS ECONOMIES", title: "海外经济变化", nodes: [
      { id: "us", label: "美国", summary: "从增长、劳动力、财政和金融条件观察美国经济结构。" },
      { id: "europe", label: "欧洲", summary: "比较增长、财政约束与货币政策的区域差异。" },
      { id: "japan", label: "日本", summary: "跟踪工资、通胀与货币政策正常化的互动。" },
      { id: "korea", label: "韩国", summary: "观察出口、制造业周期、汇率与政策变化。" },
      { id: "emerging", label: "新兴市场", summary: "观察美元、资本流动和外部需求的影响。" },
    ] },
    { stage: "themes", eyebrow: "03 THEMATIC RESEARCH", title: "主题研究", nodes: [
      { id: "central-banks", label: "央行", summary: "比较主要央行政策路径和市场定价。" },
      { id: "fiscal", label: "财政", summary: "分析财政扩张、融资需求与利率之间的联系。" },
      { id: "ai", label: "AI", summary: "连接资本开支、生产率、就业与通胀，而非孤立观察科技投资。" },
      { id: "trade", label: "贸易", summary: "研究政策变化如何重塑贸易流向和产业链。" },
      { id: "energy", label: "能源", summary: "跟踪能源供需、价格曲线及其宏观影响。" },
      { id: "geopolitics", label: "地缘", summary: "评估地缘事件通过能源、贸易和风险偏好产生的影响。" },
      { id: "gold", label: "黄金", summary: "结合实际利率、美元、央行购金与避险需求研究黄金。" },
    ] },
  ],
  focuses: [
    { id: "focus-china", category: "中国基本面脉搏", question: "如何从高频活动、金融条件与政策变化把握国内基本面？", finding: "将经济活动、利率汇率和政策变化放在同一观察框架中，并由周报、月报持续更新。", updatedAt: "2026年9月6日", evidencePath: ["经济活动", "利率汇率", "政策变化", "定期跟踪"], systemId: "china", targetView: "china" },
    { id: "focus-overseas", category: "海外经济变化", question: "主要经济体的增长、通胀与政策周期出现了哪些分化？", finding: "覆盖美国、欧洲、日本、韩国和新兴市场，比较不同经济体的运行特征。", updatedAt: "持续更新", evidencePath: ["美国", "欧洲", "日本与韩国", "新兴市场"], systemId: "overseas", targetView: "global" },
    { id: "focus-themes", category: "主题研究", question: "哪些主题正在重塑全球宏观环境和资产定价？", finding: "围绕央行、财政、AI、贸易、能源、地缘和黄金形成持续研究入口。", updatedAt: "持续更新", evidencePath: ["政策", "科技", "贸易与能源", "地缘与黄金"], systemId: "themes", targetView: "topics" },
  ],
  systems: [
    { id: "china", number: "01", title: "中国基本面脉搏", summary: "跟踪经济活动、利率汇率和政策变化，并由国内周报、月报定期更新。", topics: ["经济活动", "利率汇率", "政策变化", "定期跟踪"] },
    { id: "overseas", number: "02", title: "海外经济变化", summary: "持续覆盖主要发达经济体与新兴市场的增长、通胀和政策变化。", topics: ["美国", "欧洲", "日本", "韩国", "新兴市场"] },
    { id: "themes", number: "03", title: "主题研究", summary: "围绕影响宏观环境与资产定价的长期主题组织原创研究。", topics: ["央行", "财政", "AI", "贸易", "能源", "地缘", "黄金"] },
  ],
  topics: [
    { id: "central-banks", title: "央行", question: "主要央行政策周期如何影响增长、流动性和市场定价？", systemId: "themes" },
    { id: "fiscal", title: "财政", question: "财政扩张、融资需求和债务约束将如何演变？", systemId: "themes" },
    { id: "ai-global", title: "AI", question: "AI投资如何影响资本开支、生产率、就业和通胀？", systemId: "themes" },
    { id: "trade", title: "贸易", question: "贸易政策如何改变全球需求、贸易流向和产业链配置？", systemId: "themes" },
    { id: "energy", title: "能源", question: "能源供需与价格变化如何影响增长和通胀？", systemId: "themes" },
    { id: "geopolitics", title: "地缘", question: "地缘风险如何影响贸易、能源和市场风险偏好？", systemId: "themes" },
    { id: "gold", title: "黄金", question: "实际利率、美元、央行购金和避险需求如何共同影响黄金？", systemId: "themes" },
  ],
};
