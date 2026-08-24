# 周报 A 版页面重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将周报改为“概览驱动核心图 + 四个可展开固定框架”的静态华泰证券宏观团队页面；首期采用 2022-07-31 历史报告与 `data-excel` 底稿。

**Architecture:** 周报独立于现有 `macroDataset`，以审核后的静态周报数据清单、导出的 PNG 图表和专用 React 组件组成。浏览器不会读取 Word 或 Excel。月度数据和月度页面不改动。

**Tech Stack:** React 19、TypeScript、Vite、Vitest、Testing Library、Playwright、CSS、PowerShell。

## Global Constraints

- 品牌使用“华泰证券宏观团队”；深海军蓝为主色、青绿色为强调色，红色仅表示上行或风险。
- 首屏依次为报告日期、标题、报告《一周概览》、四项核心数据卡、概览驱动的核心变化图。
- 默认折叠的四个固定框架不加载/不显示图表：高频经济活动跟踪、价格指标及通胀变化、利率汇率及金融市场环境、宏观政策跟踪。
- 展开框架后才显示完整解读及该框架全部静态图表。
- 每张图必须有标题、报告期、来源、Excel 底稿相对路径、工作表/图表定位、替代文本。
- 无法核验或导出的图不做占位数字；显示缺图说明。
- 2022 样本不加入既有 2026 趋势和数据选择器；月度后续以统计局最新发布数据独立更新。

---

### Task 1: 周报静态数据契约

**Files:**
- Create: `src/domain/weeklyReport.ts`
- Create: `src/domain/weeklyReport.test.ts`
- Create: `src/data/weeklyReports.ts`

**Interfaces:**

```ts
export interface WeeklyChart {
  id: string;
  sectionId: "activity" | "prices" | "financial" | "policy";
  title: string;
  assetPath: string;
  source: string;
  periodLabel: string;
  workbookPath: string;
  worksheet: string;
  alt: string;
  isHero: boolean;
}
export interface WeeklyKeyMetric {
  id: string; label: string; valueText: string; changeText: string;
  interpretation: string; sourceText: string;
}
export interface WeeklySection {
  id: WeeklyChart["sectionId"]; title: string; summary: string;
  detail: string; charts: WeeklyChart[];
}
export interface WeeklyReportPage {
  id: string; publishedAt: string; title: string; overview: string;
  keyMetrics: WeeklyKeyMetric[]; heroCharts: string[]; sections: WeeklySection[];
  watchPoints: string; risks: string;
}
export function validateWeeklyReportPage(page: WeeklyReportPage): string[];
export function selectHeroCharts(page: WeeklyReportPage): WeeklyChart[];
```

- [ ] 写失败测试，断言 `validateWeeklyReportPage(weeklyReport0731)` 返回空数组、章节标题按四个固定框架排序、`selectHeroCharts(weeklyReport0731)` 有四张且 `isHero` 均为 `true`。
- [ ] 运行 `npm.cmd run test:run -- src/domain/weeklyReport.test.ts`，预期因模块不存在而失败。
- [ ] 实现类型和校验：拒绝章节 ID 重复或顺序错误、英雄图引用不存在、英雄图未标记、图表资产/来源/报告期/底稿定位/替代文本为空、数据卡来源为空。
- [ ] 在 `weeklyReports.ts` 写入报告标题、日期 `2022-07-31`、一周概览、四项待 Excel 核验数据卡、四个框架摘要/全文、观察点和风险；不得引用既有 2026 数据。
- [ ] 再运行聚焦测试并确认通过。
- [ ] 提交：`git add src/domain/weeklyReport.ts src/domain/weeklyReport.test.ts src/data/weeklyReports.ts`，`git commit -m "feat: define static weekly report data"`。

### Task 2: 图表底稿映射、导出与核验

**Files:**
- Create: `scripts/export-weekly-excel-charts.ps1`
- Create: `src/assets/weekly/2022-07-31/*.png`
- Modify: `src/data/weeklyReports.ts`
- Modify: `src/domain/weeklyReport.test.ts`

- [ ] 写显式映射，逐项记录 `id`、`Workbook`、真实 `Worksheet`、Excel 图表对象/标题、目标 PNG；示例核心图候选：乘用车销售、30 城新房成交、布伦特原油、DR007/R007。文件必须来自 `D:\华泰\02 国内周报\data-excel`。
- [ ] 执行 `powershell -ExecutionPolicy Bypass -File .\scripts\export-weekly-excel-charts.ps1 -DryRun`。每项应输出工作簿、工作表、图标题、目标文件；找不到对象或题名不一致时非零退出。
- [ ] 完成导出：每图输出 `src/assets/weekly/2022-07-31/<chart-id>.png`，逐项检查非零文件大小、标题/图例/坐标轴/来源无裁切或乱码。
- [ ] 把图资产路径与底稿定位回写入静态清单。首屏只保留一周概览直接提及的四张图；所有其他图留在对应折叠章节。
- [ ] 添加缺图元数据测试：将一张 `assetPath` 置空，校验函数必须返回具体错误。
- [ ] 运行 `npm.cmd run test:run -- src/domain/weeklyReport.test.ts` 并提交图和映射。

### Task 3: A 版周报组件与折叠交互

**Files:**
- Create: `src/components/WeeklyChartFigure.tsx`
- Create: `src/components/WeeklyKeyMetric.tsx`
- Create: `src/sections/WeeklyReport.tsx`
- Create: `src/sections/WeeklyReport.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/responsive.css`

- [ ] 写失败测试：标题和概览可见；`getAllByTestId("weekly-hero-chart")` 数量为四；默认找不到细节图（如焦化企业开工率）；点击 `展开高频经济活动跟踪完整解读` 后细节文字和该图可见，按钮 `aria-expanded="true"`。
- [ ] 运行 `npm.cmd run test:run -- src/sections/WeeklyReport.test.tsx`，预期失败。
- [ ] 实现 `WeeklyChartFigure` 为 `<figure>`，含 `<img>`、标题、来源、报告期；图加载失败显示“图表暂不可用，请核对本期静态底稿导出。”。
- [ ] 实现 `WeeklyKeyMetric`，明确展示标签、数值、变化、解释、来源，不能仅用颜色传达含义。
- [ ] 实现 `WeeklyReport`：日期、标题、概览、数据卡、英雄图、四个原生 `<details>`。折叠时不渲染 `detail` 和本章节图，展开才渲染。政策章节展开时显示观察点与风险。
- [ ] 写 `.weekly-report-*` 样式：桌面四列数据卡、两列英雄图；平板两列；640px 以下单列；使用 `#13263a` 与 `#1c8c89`；深色主题、焦点环和展开指示均可读。
- [ ] 运行 `npm.cmd run test:run -- src/sections/WeeklyReport.test.tsx` 和 `npm.cmd run typecheck`，确认通过并提交。

### Task 4: 应用接入和月度隔离

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/BrandLockup.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `e2e/macro-pulse.spec.ts`

- [ ] 写失败集成测试：切到“周报”后新周报标题可见、行业景气矩阵不存在；切到“月报”后月度基本盘可见、新周报标题不存在。
- [ ] 运行 `npm.cmd run test:run -- src/app/App.test.tsx`，预期失败。
- [ ] 在 `App.tsx` 中：`view === "weekly"` 只渲染 `WeeklyReport`，不渲染旧 `WeeklyPulse`、`PriceFinancial`、`TrendExplorer`、`IndustryMatrix`、`PolicyTimeline`、`OutlookRisks`；综合和月度路径保持现状。
- [ ] 周度导航只显示四个固定框架锚点，去除“行业”；`BrandLockup` 显示“华泰证券宏观团队”。
- [ ] 为 Playwright 加测试：周报默认找不到细节图；点击展开后可见；移动端仍可操作。
- [ ] 运行 `npm.cmd run test:run -- src/app/App.test.tsx src/sections/WeeklyReport.test.tsx`、`npm.cmd run e2e -- --grep "weekly report"`，确认通过并提交。

### Task 5: 信任文档、历史隔离与全量验证

**Files:**
- Modify: `HANDS_OFF.md`
- Modify: `README.md`
- Modify: `src/data/dataset.test.ts`
- Modify: `src/domain/selectors.test.ts`

- [ ] 写失败隔离测试：断言 2022 周报不在 `macroDataset` 的 `selectReports(..., "weekly")` 中；其 `publishedAt` 固定为 `2022-07-31`。
- [ ] 文档化更新步骤：获取报告与 `data-excel`、核验概览与图表映射、导出静态图、更新 `weeklyReports.ts`、执行清单测试和 `npm.cmd run verify`。注明月度以统计局最新数据独立更新。
- [ ] 运行 `npm.cmd run lint`、`npm.cmd run typecheck`、`npm.cmd run test:run`、`npm.cmd run build`、`npm.cmd run e2e`、`npm.cmd run verify`、`git diff --check`。
- [ ] 启动本地周报模式并在桌面/移动端截图：确认首屏只有核心变化图、默认四章节无图、展开后图文完整、无横向溢出、深色主题可读。
- [ ] 提交文档和测试。

## Final Acceptance Checklist

- [ ] 周报 A 版显示报告概览、概览驱动的数据卡与英雄图。
- [ ] 四个固定框架默认无图，展开后显示各自全文和全部图表。
- [ ] 行业板块不会出现在周报路径；月度本轮未变更。
- [ ] 所有图均为已导出静态资源，带可审核元数据；浏览器不处理 Word/Excel。
- [ ] 全量验证、浏览器渲染和 `git diff --check` 均通过。
