import type { ResearchAtlasData } from "../domain/researchAtlas";

export const researchAtlasData: ResearchAtlasData = {
  layers: [
    { stage: "context", eyebrow: "01 GLOBAL CONTEXT", title: "全球结构变化", nodes: [
      { id: "us", label: "美国", summary: "从增长、劳动力、财政和金融条件观察美国经济结构。" },
      { id: "europe", label: "欧洲", summary: "比较增长、财政约束与货币政策的区域差异。" },
      { id: "japan", label: "日本", summary: "跟踪工资、通胀与货币政策正常化的互动。" },
      { id: "emerging", label: "新兴市场", summary: "观察美元、资本流动和外部需求的影响。" },
    ] },
    { stage: "driver", eyebrow: "02 MACRO DRIVERS", title: "政策与宏观冲击", nodes: [
      { id: "central-banks", label: "央行", summary: "比较主要央行政策路径和市场定价。" },
      { id: "fiscal", label: "财政", summary: "分析财政扩张、融资需求与利率之间的联系。" },
      { id: "ai", label: "AI", summary: "连接资本开支、生产率、就业与通胀，而非孤立观察科技投资。" },
      { id: "tariffs", label: "关税", summary: "研究政策冲击如何重塑贸易流向和产业链。" },
      { id: "energy", label: "能源", summary: "跟踪能源供需、价格曲线及其宏观影响。" },
      { id: "geopolitics", label: "地缘", summary: "评估地缘事件通过能源、贸易和风险偏好产生的影响。" },
    ] },
    { stage: "channel", eyebrow: "03 TRANSMISSION", title: "经济传导", nodes: [
      { id: "growth", label: "增长", summary: "辨别冲击对需求、供给和潜在增速的不同作用。" },
      { id: "inflation", label: "通胀", summary: "区分商品、工资、汇率和预期的传导渠道。" },
      { id: "trade", label: "贸易", summary: "跟踪国别和行业之间的贸易转移。" },
      { id: "liquidity", label: "流动性", summary: "观察政策、融资和跨境资金的联动。" },
    ] },
    { stage: "outcome", eyebrow: "04 CHINA & ASSETS", title: "中国与资产", nodes: [
      { id: "china-economy", label: "中国经济", summary: "将外部变化映射到中国增长、通胀和政策环境。" },
      { id: "rates", label: "利率", summary: "观察增长、通胀和流动性对利率曲线的影响。" },
      { id: "fx", label: "汇率", summary: "连接政策差异、资金流动与汇率表现。" },
      { id: "equity", label: "权益", summary: "从盈利、估值和风险偏好理解权益市场环境。" },
      { id: "commodities", label: "商品", summary: "分析供需、库存和地缘冲击的共同作用。" },
    ] },
  ],
  focuses: [
    { id: "focus-ai", category: "全球结构研究", question: "AI如何改变美国经济的增长、就业与通胀结构？", finding: "将资本开支、生产率、就业和通胀放入同一研究链条，持续观察结构变化。", updatedAt: "持续更新", evidencePath: ["资本开支", "生产率", "就业", "通胀"], systemId: "structure", targetView: "global" },
    { id: "focus-transmission", category: "全球冲击与传导", question: "如何比较关税、能源和地缘风险对不同经济体的影响？", finding: "从贸易、价格、流动性和政策反应四条路径识别不同国家的暴露差异。", updatedAt: "持续更新", evidencePath: ["政策冲击", "贸易与价格", "政策反应", "国别差异"], systemId: "transmission", targetView: "global" },
    { id: "focus-china", category: "中国宏观脉搏", question: "能源供给压力如何影响国内生产、价格与政策环境？", finding: "连接国内高频活动、价格变化、金融环境和政策进展，保留周度与月度证据。", updatedAt: "2026年9月6日", evidencePath: ["高频活动", "价格", "金融环境", "政策"], systemId: "china", targetView: "china" },
  ],
  systems: [
    { id: "structure", number: "01", title: "全球结构研究", summary: "关注决定中长期增长、通胀和政策约束的结构性变化。", topics: ["AI与全球经济", "美国财政与美债", "欧洲与日本结构变化"] },
    { id: "transmission", number: "02", title: "全球冲击与传导", summary: "解释政策、贸易、能源和地缘冲击如何跨国家、跨市场传导。", topics: ["全球央行政策", "全球贸易与关税", "能源、黄金与地缘"] },
    { id: "china", number: "03", title: "中国宏观脉搏", summary: "通过周报、月报和高频数据持续跟踪中国经济。", topics: ["国内周报", "国内月报", "中国增长与政策"] },
  ],
  topics: [
    { id: "ai-global", title: "AI与全球经济", question: "AI投资如何影响资本开支、生产率、就业和通胀？", systemId: "structure" },
    { id: "us-fiscal", title: "美国财政与美债", question: "财政扩张如何影响融资需求、期限溢价和全球利率？", systemId: "structure" },
    { id: "trade-tariffs", title: "全球贸易与关税", question: "政策冲击如何改变贸易流向和产业链配置？", systemId: "transmission" },
    { id: "energy-geo", title: "能源、黄金与地缘", question: "地缘风险如何通过能源价格和避险需求影响全球经济？", systemId: "transmission" },
    { id: "central-banks", title: "全球央行政策", question: "主要央行政策分化如何改变流动性与资产定价？", systemId: "transmission" },
    { id: "china-growth", title: "中国增长与政策", question: "高频、月度和政策信息如何共同刻画中国增长动能？", systemId: "china" },
  ],
};
