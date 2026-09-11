# 华泰宏观研究图谱首页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保留现有国内周报和月报的前提下，新增一个以全球覆盖、原创框架和冲击传导为核心的华泰宏观研究首页。

**Architecture:** 继续使用现有 React 19、TypeScript 和 Vite 单页应用，不引入路由或新的组件库。新增独立的研究图谱领域模型和三个展示页面，由 `App` 管理四个一级视图；现有周报、月报组件通过新的“中国宏观脉搏”容器原样复用。

**Tech Stack:** React 19、TypeScript 5.9、Vite 8、Vitest、Testing Library、Playwright、现有 CSS token 系统

**Spec:** `docs/superpowers/specs/2026-09-11-huatai-macro-research-atlas-home-design.md`

## Global Constraints

- 一级导航固定为“首页、全球研究图谱、中国宏观脉搏、专题研究”。
- 首页不得以 Call、预测实验室、观点命中率或交易业绩为中心。
- 首页必须突出全球覆盖、原创研究框架以及全球冲击向中国经济和大类资产的传导。
- 现有国内周报和国内月报的数据、图表、展开逻辑及公众号链接必须保留。
- 研究资料库只读；不得编辑、移动、删除或在页面中暴露其本地路径。
- 页面只使用现有网站内容、公开报告信息及明确允许公开的图表或链接。
- 保持华泰红、深蓝、白色和浅灰视觉体系，不增加装饰性图片。
- 正文默认不小于 16px，常用标签默认不小于 14px；桌面和移动端不得横向溢出。
- 不新增依赖，不修改现有 `.openai/hosting.json`，本阶段不部署线上版本。

---

## File Structure

- Create `src/domain/researchAtlas.ts`: 研究首页的类型、视图标识和查询函数。
- Create `src/domain/researchAtlas.test.ts`: 领域模型和节点查询测试。
- Create `src/data/researchAtlas.ts`: 首版研究传导层、研究重点、研究体系和专题文案。
- Create `src/components/ResearchTransmissionMap.tsx`: 四层传导图和节点详情交互。
- Create `src/components/ResearchTransmissionMap.test.tsx`: 鼠标、键盘和可访问状态测试。
- Create `src/sections/ResearchHome.tsx`: 首页首屏、研究重点、三大体系及中国宏观入口。
- Create `src/sections/GlobalResearchAtlas.tsx`: 全球研究图谱页面。
- Create `src/sections/TopicResearch.tsx`: 六个专题研究入口页面。
- Create `src/sections/ChinaMacroHub.tsx`: 复用现有周报、月报的中国宏观容器。
- Modify `src/components/Header.tsx`: 将章节导航改为四个一级视图导航。
- Modify `src/components/BrandLockup.tsx`: 产品名改为“研究所 · 华泰宏观研究图谱”。
- Modify `src/components/ViewFilter.tsx`: 将中国宏观子视图收敛为周报和月报。
- Modify `src/app/App.tsx`: 管理一级视图和中国周报/月报子视图。
- Modify `src/app/App.test.tsx`: 验证默认首页、四个入口和周报月报回归。
- Modify `src/styles/global.css`: 新增研究首页、图谱、卡片和页面布局样式。
- Modify `src/styles/responsive.css`: 新增平板、手机布局和降低动态效果规则。
- Modify `index.html`: 更新页面标题和描述。
- Modify `e2e/macro-pulse.spec.ts`: 验证首页核心体验、导航、回归和可访问性。

---

### Task 1: 建立研究图谱领域模型和首版内容

**Files:**
- Create: `src/domain/researchAtlas.ts`
- Create: `src/domain/researchAtlas.test.ts`
- Create: `src/data/researchAtlas.ts`

**Interfaces:**
- Produces: `PrimaryView = "home" | "global" | "china" | "topics"`
- Produces: `ResearchStage = "context" | "driver" | "channel" | "outcome"`
- Produces: `ResearchNode`, `ResearchLayer`, `ResearchFocus`, `ResearchSystem`, `ResearchTopic`, `ResearchAtlasData`
- Produces: `findResearchNode(data: ResearchAtlasData, nodeId: string): ResearchNode | undefined`
- Produces: `researchAtlasData: ResearchAtlasData`

- [ ] **Step 1: 写出失败的领域模型测试**

```ts
import { describe, expect, it } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { findResearchNode } from "./researchAtlas";

describe("research atlas", () => {
  it("covers all four transmission stages", () => {
    expect(researchAtlasData.layers.map((layer) => layer.stage)).toEqual([
      "context", "driver", "channel", "outcome",
    ]);
  });

  it("finds a node without exposing a local research path", () => {
    const node = findResearchNode(researchAtlasData, "ai");
    expect(node?.label).toBe("AI");
    expect(JSON.stringify(researchAtlasData)).not.toMatch(/[A-Z]:\\\\|Nutstore|data-excel/);
  });

  it("provides three editorial research focuses and six topics", () => {
    expect(researchAtlasData.focuses).toHaveLength(3);
    expect(researchAtlasData.topics).toHaveLength(6);
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm run test:run -- src/domain/researchAtlas.test.ts`

Expected: FAIL because `researchAtlas` modules do not exist.

- [ ] **Step 3: 实现类型和查询函数**

```ts
export type PrimaryView = "home" | "global" | "china" | "topics";
export type ResearchStage = "context" | "driver" | "channel" | "outcome";

export interface ResearchNode {
  id: string;
  label: string;
  summary: string;
}

export interface ResearchLayer {
  stage: ResearchStage;
  eyebrow: string;
  title: string;
  nodes: ResearchNode[];
}

export interface ResearchFocus {
  id: string;
  category: string;
  question: string;
  finding: string;
  updatedAt: string;
  evidencePath: string[];
  systemId: "structure" | "transmission" | "china";
  targetView: PrimaryView;
}

export interface ResearchSystem {
  id: "structure" | "transmission" | "china";
  number: string;
  title: string;
  summary: string;
  topics: string[];
}

export interface ResearchTopic {
  id: string;
  title: string;
  question: string;
  systemId: ResearchSystem["id"];
}

export interface ResearchAtlasData {
  layers: ResearchLayer[];
  focuses: ResearchFocus[];
  systems: ResearchSystem[];
  topics: ResearchTopic[];
}

export function findResearchNode(data: ResearchAtlasData, nodeId: string) {
  return data.layers.flatMap((layer) => layer.nodes).find((node) => node.id === nodeId);
}
```

- [ ] **Step 4: 写入首版公开安全文案**

`src/data/researchAtlas.ts` 必须完整包含以下内容：

```ts
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
```

- [ ] **Step 5: 运行测试并确认通过**

Run: `npm run test:run -- src/domain/researchAtlas.test.ts`

Expected: PASS with 3 tests.

- [ ] **Step 6: 提交领域模型和数据**

```bash
git add src/domain/researchAtlas.ts src/domain/researchAtlas.test.ts src/data/researchAtlas.ts
git commit -m "feat: add macro research atlas data model"
```

---

### Task 2: 构建可交互的研究传导图

**Files:**
- Create: `src/components/ResearchTransmissionMap.tsx`
- Create: `src/components/ResearchTransmissionMap.test.tsx`

**Interfaces:**
- Consumes: `ResearchLayer[]` from `src/domain/researchAtlas.ts`
- Produces: `ResearchTransmissionMap({ layers }: { layers: ResearchLayer[] }): JSX.Element`
- Behavior: default selection is `layers[0].nodes[0]`; clicking a node updates the detail panel and `aria-pressed` state.

- [ ] **Step 1: 写出失败的组件测试**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { renderApp } from "../test/renderApp";
import { ResearchTransmissionMap } from "./ResearchTransmissionMap";

describe("ResearchTransmissionMap", () => {
  it("shows four layers and reveals the selected research summary", async () => {
    const { user } = renderApp(<ResearchTransmissionMap layers={researchAtlasData.layers} />);
    expect(screen.getAllByRole("group", { name: /研究层/ })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "AI" }));
    expect(screen.getByRole("button", { name: "AI" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/连接资本开支、生产率、就业与通胀/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm run test:run -- src/components/ResearchTransmissionMap.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: 实现最小交互组件**

```tsx
import { useState } from "react";
import type { ResearchLayer } from "../domain/researchAtlas";

export function ResearchTransmissionMap({ layers }: { layers: ResearchLayer[] }) {
  const firstNode = layers[0]?.nodes[0];
  const [selectedId, setSelectedId] = useState(firstNode?.id ?? "");
  const selected = layers.flatMap((layer) => layer.nodes).find((node) => node.id === selectedId) ?? firstNode;

  return (
    <section aria-labelledby="research-map-title" className="research-transmission-map">
      <header><p>HUATAI RESEARCH LENS</p><h2 id="research-map-title">全球变化如何传导至中国与资产</h2></header>
      <div className="research-layer-grid">
        {layers.map((layer, index) => (
          <div aria-label={`${layer.title}研究层`} className="research-layer" key={layer.stage} role="group">
            <p>{layer.eyebrow}</p><h3>{layer.title}</h3>
            <div>{layer.nodes.map((node) => (
              <button aria-pressed={selected?.id === node.id} key={node.id} onClick={() => setSelectedId(node.id)} type="button">{node.label}</button>
            ))}</div>
            {index < layers.length - 1 && <span aria-hidden="true" className="research-layer-arrow">→</span>}
          </div>
        ))}
      </div>
      {selected && <aside aria-live="polite" className="research-node-detail"><strong>{selected.label}</strong><p>{selected.summary}</p></aside>}
    </section>
  );
}
```

- [ ] **Step 4: 运行组件测试并确认通过**

Run: `npm run test:run -- src/components/ResearchTransmissionMap.test.tsx`

Expected: PASS.

- [ ] **Step 5: 提交传导图组件**

```bash
git add src/components/ResearchTransmissionMap.tsx src/components/ResearchTransmissionMap.test.tsx
git commit -m "feat: add interactive research transmission map"
```

---

### Task 3: 构建研究首页、全球图谱和专题研究页面

**Files:**
- Create: `src/sections/ResearchHome.tsx`
- Create: `src/sections/GlobalResearchAtlas.tsx`
- Create: `src/sections/TopicResearch.tsx`
- Create: `src/sections/ResearchSurfaces.test.tsx`

**Interfaces:**
- Consumes: `ResearchAtlasData`, `WeeklyReportPage`, `MonthlyReportPage`, `PrimaryView`
- Produces: `ResearchHome({ data, weeklyReport, monthlyReport, onNavigate })`
- Produces: `GlobalResearchAtlas({ data })`
- Produces: `TopicResearch({ data })`
- `onNavigate` exact signature: `(view: PrimaryView) => void`

- [ ] **Step 1: 写出失败的页面测试**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { researchAtlasData } from "../data/researchAtlas";
import { monthlyReport0831 } from "../data/monthlyReport";
import { weeklyReport0906 } from "../data/weeklyReports";
import { renderApp } from "../test/renderApp";
import { GlobalResearchAtlas } from "./GlobalResearchAtlas";
import { ResearchHome } from "./ResearchHome";
import { TopicResearch } from "./TopicResearch";

describe("research surfaces", () => {
  it("presents research distinctiveness before report navigation", async () => {
    const onNavigate = vi.fn();
    const { user } = renderApp(<ResearchHome data={researchAtlasData} monthlyReport={monthlyReport0831} onNavigate={onNavigate} weeklyReport={weeklyReport0906} />);
    expect(screen.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "本周研究重点" })).toBeInTheDocument();
    expect(screen.getAllByRole("article", { name: /研究重点/ })).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "进入中国宏观脉搏" }));
    expect(onNavigate).toHaveBeenCalledWith("china");
  });

  it("shows three global systems and six thematic questions", () => {
    renderApp(<><GlobalResearchAtlas data={researchAtlasData} /><TopicResearch data={researchAtlasData} /></>);
    expect(screen.getByRole("heading", { name: "全球研究图谱" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "专题研究" })).toBeInTheDocument();
    expect(screen.getAllByRole("article", { name: /专题/ })).toHaveLength(6);
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm run test:run -- src/sections/ResearchSurfaces.test.tsx`

Expected: FAIL because the three sections do not exist.

- [ ] **Step 3: 实现首页结构**

`ResearchHome.tsx` 按以下顺序渲染，并使用语义化 `section`、`article`、`button`：

```tsx
import type { MonthlyReportPage } from "../data/monthlyReport";
import type { WeeklyReportPage } from "../domain/weeklyReport";
import type { PrimaryView, ResearchAtlasData } from "../domain/researchAtlas";
import { ResearchTransmissionMap } from "../components/ResearchTransmissionMap";

interface ResearchHomeProps {
  data: ResearchAtlasData;
  weeklyReport: WeeklyReportPage;
  monthlyReport: MonthlyReportPage;
  onNavigate: (view: PrimaryView) => void;
}

export function ResearchHome({ data, weeklyReport, monthlyReport, onNavigate }: ResearchHomeProps) {
  return (
    <section className="research-home" id="research-home">
      <header className="research-home-lead">
        <div><p>华泰证券宏观团队</p><h1>华泰宏观研究图谱</h1></div>
        <strong>以全球视野、原创框架和跨市场传导研究，理解全球变化及其对中国经济和资产价格的影响。</strong>
      </header>
      <ResearchTransmissionMap layers={data.layers} />
      <section aria-labelledby="research-focus-title" className="research-focus-section">
        <header><p>EDITOR'S PICKS</p><h2 id="research-focus-title">本周研究重点</h2></header>
        <div className="research-focus-grid">
          {data.focuses.map((focus) => (
            <article aria-label={`${focus.category}研究重点`} key={focus.id}>
              <p>{focus.category}</p><h3>{focus.question}</h3><strong>{focus.finding}</strong><time>{focus.updatedAt}</time>
              <ol aria-label={`${focus.category}证据链`} className="research-evidence-path">{focus.evidencePath.map((step) => <li key={step}>{step}</li>)}</ol>
              <button onClick={() => onNavigate(focus.targetView)} type="button">查看相关研究</button>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="research-system-title" className="research-system-section">
        <header><p>RESEARCH SYSTEMS</p><h2 id="research-system-title">三大研究体系</h2></header>
        <div className="research-system-grid">
          {data.systems.map((system) => (
            <article key={system.id}><p>{system.number}</p><h3>{system.title}</h3><strong>{system.summary}</strong><ul>{system.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></article>
          ))}
        </div>
      </section>
      <section aria-labelledby="china-entry-title" className="china-entry-section">
        <header><p>CHINA MACRO PULSE</p><h2 id="china-entry-title">中国宏观脉搏</h2></header>
        <div>
          <article><span>国内周报 · {weeklyReport.publishedAt}</span><h3>{weeklyReport.title}</h3><p>{weeklyReport.overview}</p></article>
          <article><span>国内月报 · 页面更新 {monthlyReport.updatedAt}</span><h3>{monthlyReport.title}</h3><p>{monthlyReport.overview}</p></article>
        </div>
        <button onClick={() => onNavigate("china")} type="button">进入中国宏观脉搏</button>
      </section>
    </section>
  );
}
```

研究重点使用 `data.focuses`，卡片的 `aria-label` 为 `${focus.category}研究重点`。三大体系使用 `data.systems`。中国入口读取 `weeklyReport.title`、`weeklyReport.publishedAt`、`monthlyReport.title` 和 `monthlyReport.updatedAt`，不复制日期字符串。所有站内入口调用 `onNavigate`，没有真实链接的数据不渲染外链。

首版用 `evidencePath` 绘制真实的研究证据链图，避免在未经确认时填入全球数据。后续获得批准的底稿图表可以替换同一视觉区域，不改变卡片结构。

- [ ] **Step 4: 实现全球研究图谱和专题研究页面**

`GlobalResearchAtlas.tsx` 复用 `ResearchTransmissionMap`，随后只展示 `structure` 和 `transmission` 两个研究体系及其主题标签；`TopicResearch.tsx` 将 `data.topics` 渲染为六个研究问题卡片。页面不得出现“即将上线”“敬请期待”或失效按钮。

- [ ] **Step 5: 运行页面测试并确认通过**

Run: `npm run test:run -- src/sections/ResearchSurfaces.test.tsx`

Expected: PASS with 2 tests.

- [ ] **Step 6: 提交三个研究页面**

```bash
git add src/sections/ResearchHome.tsx src/sections/GlobalResearchAtlas.tsx src/sections/TopicResearch.tsx src/sections/ResearchSurfaces.test.tsx
git commit -m "feat: add research atlas content surfaces"
```

---

### Task 4: 重构一级导航并接回国内周报月报

**Files:**
- Create: `src/sections/ChinaMacroHub.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/BrandLockup.tsx`
- Modify: `src/components/ViewFilter.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: `PrimaryView`, `WeeklyReportPage`, `MonthlyReportPage`
- Produces: `Header({ activeView, onNavigate, TickerComponent })`
- `Header.onNavigate` exact signature: `(view: PrimaryView) => void`
- Produces: `ChinaMacroHub({ weeklyReport, monthlyReport })`
- App default view: `home`

- [ ] **Step 1: 用新的首页和导航行为改写应用测试**

保留主题切换和回到顶部测试；将默认周报测试替换为以下三项：

```tsx
it("opens on the Huatai macro research atlas", () => {
  renderApp(<App />);
  expect(screen.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "首页" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "全球研究图谱" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "中国宏观脉搏" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "专题研究" })).toBeInTheDocument();
});

it("keeps the current weekly and monthly reports in China Macro Pulse", async () => {
  const { user } = renderApp(<App />);
  await user.click(screen.getByRole("link", { name: "中国宏观脉搏" }));
  expect(screen.getByRole("heading", { name: "国内周报｜能源供给压力的挤压效应有所上升" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "月报" }));
  expect(screen.getByRole("heading", { name: "国内月报｜政策再次进入稳增长观察窗口期" })).toBeInTheDocument();
});

it("opens the global and topic research surfaces", async () => {
  const { user } = renderApp(<App />);
  await user.click(screen.getByRole("link", { name: "全球研究图谱" }));
  expect(screen.getByRole("heading", { name: "全球研究图谱" })).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "专题研究" }));
  expect(screen.getByRole("heading", { name: "专题研究" })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行应用测试并确认失败**

Run: `npm run test:run -- src/app/App.test.tsx`

Expected: FAIL because App still opens on the weekly report.

- [ ] **Step 3: 建立中国宏观容器**

将 `ViewFilter` 的 `value` 和 `onChange` 类型改为现有 `Frequency`，选项完整定义为 `{ value: "weekly", label: "周报" }` 和 `{ value: "monthly", label: "月报" }`。`ChinaMacroHub` 内部保存 `Frequency` 状态，默认值为 `weekly`。它渲染 `ViewFilter`，并根据选择渲染 `WeeklyReport` 或 `MonthlyReport`；不修改这两个报告组件的 props 和内容。

- [ ] **Step 4: 将 Header 改成四个一级入口**

```ts
const navigationItems: Array<{ id: PrimaryView; label: string }> = [
  { id: "home", label: "首页" },
  { id: "global", label: "全球研究图谱" },
  { id: "china", label: "中国宏观脉搏" },
  { id: "topics", label: "专题研究" },
];
```

导航链接的 `href` 分别为 `#research-home`、`#global-research`、`#china-macro`、`#topic-research`。点击时调用 `onNavigate(item.id)`，并以 `aria-current="page"` 标记当前视图。

- [ ] **Step 5: 重写 App 的视图编排**

```tsx
const [activeView, setActiveView] = useState<PrimaryView>("home");

function renderView() {
  if (activeView === "global") return <GlobalResearchAtlas data={researchAtlasData} />;
  if (activeView === "china") return <ChinaMacroHub monthlyReport={monthlyReport0831} weeklyReport={weeklyReport0906} />;
  if (activeView === "topics") return <TopicResearch data={researchAtlasData} />;
  return <ResearchHome data={researchAtlasData} monthlyReport={monthlyReport0831} onNavigate={setActiveView} weeklyReport={weeklyReport0906} />;
}
```

保留 `LatestTickerTape`、`SectionErrorBoundary`、`ThemeToggle` 和 `BackToTop`。导航切换后调用 `window.scrollTo({ top: 0, behavior: "smooth" })`，并让 `main` 内只渲染当前一级视图。

- [ ] **Step 6: 更新品牌名称并运行测试**

将 `BrandLockup` 的产品名改为“研究所 · 华泰宏观研究图谱”，无障碍标签改为“华泰证券宏观研究图谱首页”。

Run: `npm run test:run -- src/app/App.test.tsx src/sections/WeeklyReport.test.tsx src/components/WeeklyCharts.test.tsx`

Expected: PASS; existing weekly chart and disclosure tests remain green.

- [ ] **Step 7: 提交导航和中国宏观容器**

```bash
git add src/sections/ChinaMacroHub.tsx src/components/Header.tsx src/components/BrandLockup.tsx src/components/ViewFilter.tsx src/app/App.tsx src/app/App.test.tsx
git commit -m "feat: center navigation on Huatai research atlas"
```

---

### Task 5: 完成视觉系统、响应式和网页元信息

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/responsive.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: class names from `ResearchTransmissionMap`, `ResearchHome`, `GlobalResearchAtlas`, `TopicResearch`, `ChinaMacroHub`
- Produces: four-column desktop transmission map, stacked mobile path, research editorial card grid, visible focus states.

- [ ] **Step 1: 在 `global.css` 中加入研究首页样式**

使用现有 CSS tokens。桌面首屏规则必须包含：

```css
.research-home-lead { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(22rem, 1.2fr); gap: 2rem; align-items: end; }
.research-home-lead h1 { margin: 0; color: var(--ink); font-size: clamp(2.4rem, 6vw, 5.2rem); letter-spacing: -0.055em; }
.research-home-lead strong { color: var(--ink-muted); font-size: 1.05rem; line-height: 1.8; }
.research-transmission-map { margin-top: 2rem; padding: clamp(1.25rem, 3vw, 2rem); border-top: 4px solid var(--ht-red); background: #13263a; color: #f8fbfb; }
.research-layer-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.research-layer button { min-height: 2.5rem; border: 1px solid rgb(255 255 255 / 20%); background: transparent; color: inherit; }
.research-layer button[aria-pressed="true"] { border-color: var(--ht-red); background: var(--ht-red); color: #fff; }
.research-focus-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.research-evidence-path { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0; list-style: none; }
.research-evidence-path li + li::before { margin-right: 0.5rem; color: var(--ht-red); content: "→"; }
.research-system-grid, .research-topic-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
```

补充完整的间距、边框、按钮 hover/focus、节点详情、中国入口和专题卡片样式。使用细线与箭头表达传导，不制作装饰插画。

- [ ] **Step 2: 在 `responsive.css` 中加入移动端规则**

```css
@media (max-width: 900px) {
  .research-home-lead { grid-template-columns: minmax(0, 1fr); }
  .research-layer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .research-focus-grid, .research-system-grid { grid-template-columns: minmax(0, 1fr); }
}

@media (max-width: 640px) {
  .research-layer-grid { grid-template-columns: minmax(0, 1fr); }
  .research-layer-arrow { transform: rotate(90deg); }
  .research-topic-grid { grid-template-columns: minmax(0, 1fr); }
}
```

在现有 `prefers-reduced-motion` 区域关闭新增节点高亮动画。移动端所有按钮保持至少 44px 可点击高度。

- [ ] **Step 3: 更新网页标题和描述**

```html
<meta name="description" content="华泰证券宏观团队全球研究图谱、中国宏观周报月报及原创专题研究。" />
<title>华泰宏观研究图谱 | 华泰证券研究所</title>
```

- [ ] **Step 4: 运行类型检查和组件测试**

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

Run: `npm run test:run`

Expected: all Vitest suites PASS.

- [ ] **Step 5: 提交视觉和元信息更新**

```bash
git add src/styles/global.css src/styles/responsive.css index.html
git commit -m "style: shape Huatai macro research atlas experience"
```

---

### Task 6: 完成端到端回归与本地预览交付

**Files:**
- Modify: `e2e/macro-pulse.spec.ts`

**Interfaces:**
- Validates: research homepage, transmission interaction, four-view navigation, weekly/monthly regression, accessibility.

- [ ] **Step 1: 配置本项目的 Sites 执行环境**

Run: `node C:/Users/wywu4/.codex/plugins/cache/openai-curated-remote/sites/0.1.56/scripts/configure-execution-profile.mjs`

Expected: a portable execution profile is detected or the existing compatible profile is retained.

- [ ] **Step 2: 用首页流程替换旧的默认周报端到端测试**

```ts
test("opens the Huatai research atlas and explores a transmission node", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "华泰宏观研究图谱" })).toBeVisible();
  await page.getByRole("button", { name: "AI" }).click();
  await expect(page.getByText(/连接资本开支、生产率、就业与通胀/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Nutstore|data-excel\/|[A-Z]:\\\\/);
});

test("keeps weekly and monthly reports under China Macro Pulse", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "中国宏观脉搏" }).click();
  await expect(page.getByRole("heading", { name: /国内周报.*能源供给压力/ })).toBeVisible();
  await page.getByRole("button", { name: "月报" }).click();
  await expect(page.getByRole("heading", { name: /国内月报.*政策再次进入稳增长观察窗口期/ })).toBeVisible();
});

test("research homepage has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

- [ ] **Step 3: 构建站点**

Run: `npm run build`

Expected: TypeScript and Vite complete successfully and write the static site to `dist`.

- [ ] **Step 4: 运行端到端测试**

Run: `npm run e2e`

Expected: all Playwright tests PASS.

- [ ] **Step 5: 检查禁止公开的内容**

Run: `rg -n "预测实验室|命中率|[A-Z]:\\\\|Nutstore|data-excel/" src/domain/researchAtlas.ts src/data/researchAtlas.ts src/components/ResearchTransmissionMap.tsx src/sections/ResearchHome.tsx src/sections/GlobalResearchAtlas.tsx src/sections/TopicResearch.tsx`

Expected: no matches in the new research homepage source files; the Playwright assertion separately verifies that no local path is visible in the page body.

- [ ] **Step 6: 启动同一个本地预览并交给用户查看**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite reports one local URL. Keep this preview running and open that exact URL once for the user after the homepage is recognizable and working.

- [ ] **Step 7: 提交端到端回归**

```bash
git add e2e/macro-pulse.spec.ts
git commit -m "test: cover research atlas homepage journey"
```

- [ ] **Step 8: 暂停在线上发布之前**

向用户提供本地可视化版本，并明确说明本阶段没有更新 `htmacro.click`。只有用户审阅页面并明确要求发布后，才进入站点发布流程。
