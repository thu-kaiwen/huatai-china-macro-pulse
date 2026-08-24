# 国内周报 V4 正式实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将用户确认的 V4 周报设计写入 React 正式网页，并修正航班、高频季节线和价格分类/环比标注。

**Architecture:** Excel 底稿只在开发会话中读取和核验，审核后的静态序列写入 `weeklyReports.ts`；React 运行时只消费静态数据。新增通用 SVG 折线、利率债堆积柱和迷你趋势组件，`WeeklyReport` 负责组合 V4 布局与折叠解读，不在组件中硬编码报告事实。

**Tech Stack:** React 19、TypeScript、SVG、Vitest、Testing Library、Playwright、Vite。

## Global Constraints

- 月度页面和月度数据逻辑必须保留。
- 周报运行时不得读取 Word 或 Excel。
- 航班图使用 2024–2026 年周度绝对量，2026 年只画至 8 月，端点红字为“周同比 +4.3%”。
- 焦化、高炉、建筑钢材图均显示 2024、2025、2026 三条季节线，横轴固定到 12 月，2026 年 8 月后留空。
- 原材料图不含黄金；工业品图不含氯化钾；价格图明确标注 `2025/1/1=100`，每条价格序列显示本周环比。
- 完成门槛为 `npm run verify` 与 `git diff --check`。

---

### Task 1: 固定周期图表几何与回归测试

**Files:**
- Create: `src/domain/chartGeometry.ts`
- Create: `src/domain/chartGeometry.test.ts`

**Interfaces:**
- Produces: `buildLineSegments(values, totalPoints, width, height, domain)`，按固定全年点位返回可绘制线段；`null` 数据形成断点。

- [ ] **Step 1: Write the failing test**

测试 32 个航班周值在 52 周坐标系中的最后横坐标小于全年宽度的 65%，并测试 8 月后的 `null` 不产生线段。

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/domain/chartGeometry.test.ts`
Expected: FAIL because `buildLineSegments` does not exist.

- [ ] **Step 3: Write minimal implementation**

实现固定分母 `totalPoints - 1` 的 SVG 坐标转换，并在 `null` 处切分 polyline。

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/domain/chartGeometry.test.ts`
Expected: PASS.

### Task 2: V4 静态数据契约

**Files:**
- Modify: `src/domain/weeklyReport.ts`
- Modify: `src/data/weeklyReports.ts`
- Modify: `src/domain/weeklyReport.test.ts`

**Interfaces:**
- Produces: `dashboard`，包含四张核心图、高频季节图、三张定基价格图、金融表迷你趋势和政策时间轴。
- Consumes: Excel 审核值；航班 221,761 班、同比 +4.3%；价格周环比分别来自报告和底稿。

- [ ] **Step 1: Write failing validation tests**

断言航班序列为 52 周坐标、2026 年 33 周后全为 `null`；焦化/高炉/钢材包含 2024–2026；原材料不含黄金、工业品不含氯化钾；全部价格序列有 `weeklyChange`。

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test:run -- src/domain/weeklyReport.test.ts`
Expected: FAIL because `dashboard` is absent.

- [ ] **Step 3: Add typed reviewed static data**

扩展域类型和验证器，将核验后的数组、单位、期间、来源及周环比写入 `weeklyReports.ts`。

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm run test:run -- src/domain/weeklyReport.test.ts`
Expected: PASS.

### Task 3: 通用 SVG 图表组件

**Files:**
- Create: `src/components/WeeklyLineChart.tsx`
- Create: `src/components/BondIssuanceChart.tsx`
- Create: `src/components/Sparkline.tsx`
- Create: `src/components/WeeklyCharts.test.tsx`

**Interfaces:**
- Consumes: Task 2 的静态图表数据和 Task 1 的几何函数。
- Produces: 可访问的 `role="img"` SVG，折线图、三期利率债堆积柱和无数字迷你趋势。

- [ ] **Step 1: Write failing component tests**

断言航班端点注释为 `周同比 +4.3%`，焦化图图例含 2024/2025/2026，利率债含本年/本月/本周及虚线分隔，迷你图不渲染数值文本。

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test:run -- src/components/WeeklyCharts.test.tsx`
Expected: FAIL because components are missing.

- [ ] **Step 3: Implement minimal SVG components**

按数据域和固定周期坐标绘制网格、折线、端点、图例所需语义，以及利率债各分区的独立尺度和总额标签。

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm run test:run -- src/components/WeeklyCharts.test.tsx`
Expected: PASS.

### Task 4: WeeklyReport V4 布局与交互

**Files:**
- Modify: `src/sections/WeeklyReport.tsx`
- Modify: `src/sections/WeeklyReport.test.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/responsive.css`
- Modify: `src/styles/tokens.css`

**Interfaces:**
- Consumes: Task 2 dashboard and Task 3 chart components.
- Produces: 醒目“国内周报”标题、单一核心变化大框、四个固定板块、可展开解读、价格定基大图、金融表趋势列与政策时间轴。

- [ ] **Step 1: Write failing page tests**

断言核心变化是一个容器内四图；高频默认展示四张主图且详细文字点击后展开；价格图显示定基说明和逐项周环比；月度切换入口仍可用。

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test:run -- src/sections/WeeklyReport.test.tsx src/app/App.test.tsx`
Expected: FAIL against the old image-card page.

- [ ] **Step 3: Implement the approved V4 page**

替换旧周报图片区为 SVG 数据图和 V4 结构；仅展开详细解读，不在运行时解析任何底稿。

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm run test:run -- src/sections/WeeklyReport.test.tsx src/app/App.test.tsx`
Expected: PASS.

### Task 5: 浏览器与完整验证

**Files:**
- Modify if needed: `e2e/*.spec.ts`

- [ ] **Step 1: Run focused unit suite**

Run: `npm run test:run -- src/domain/chartGeometry.test.ts src/domain/weeklyReport.test.ts src/components/WeeklyCharts.test.tsx src/sections/WeeklyReport.test.tsx src/app/App.test.tsx`
Expected: PASS.

- [ ] **Step 2: Run full gate**

Run: `npm run verify`
Expected: lint, typecheck, unit tests, build and e2e all PASS.

- [ ] **Step 3: Render desktop/mobile screenshots**

使用 Playwright 访问正式本地页面，检查航班 2026 线停在 8 月、三张高频图横轴到 12 月、价格图分类/周环比、金融迷你图和月度入口。

- [ ] **Step 4: Check patch hygiene**

Run: `git diff --check`
Expected: no whitespace errors.
