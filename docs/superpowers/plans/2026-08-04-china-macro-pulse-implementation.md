# China Macro Pulse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, public, static “华泰证券研究所 · 中国宏观脉搏” single-page research terminal from the two approved weekly and monthly WeChat reports, with source-traceable data and a schema ready for future weekly/monthly trend comparison.

**Architecture:** Use a React + TypeScript static application with a data-first domain layer. Report metadata, metric definitions, observations, narratives, events, and risks live in focused data modules; selectors validate and derive view models; presentational sections render those view models without embedding source numbers. Pure SVG chart primitives cover current comparisons and future multi-frequency trends without a heavyweight chart dependency.

**Tech Stack:** Node.js 22.19+, npm 11.7+, React 19, TypeScript 5, Vite, Vitest, Testing Library, Playwright, CSS custom properties, SVG.

## Global Constraints

- Use Node.js 22.19 or newer and npm 11.7 or newer.
- The deployed artifact must be static and require no server, database, login, CMS, scraper, or AI API.
- The initial dataset may use only the two approved WeChat reports dated 2026-08-02 and 2026-07-31.
- Every plotted number must have `confidence: "verified"`, a report reference, a period, a unit, and a short source excerpt.
- Never fabricate, interpolate, or infer a historical value that is absent from the source material.
- Preserve native weekly and monthly frequencies; combine them only when metric ID, unit, and methodology match.
- Show a native-frequency trend after two valid observations; show cross-frequency comparison after two weekly observations plus one compatible monthly observation.
- Header copy is “华泰证券研究所 · 中国宏观脉搏” and includes the approved Huatai mark and bilingual brand lockup.
- Default theme is light; dark theme is required and must persist in `localStorage` under `ht-macro-theme`.
- Market movement uses red for up and green for down; improvement/deterioration must also use text and icons.
- Content width is 1240px maximum; layouts must work at 1440px, 1024px, 768px, and 390px.
- All nonessential motion must be disabled under `prefers-reduced-motion: reduce`.
- Source links and the non-investment-advice disclaimer must remain visible in the final page.

---

## File Structure

```text
.
├── index.html                         # Vite entry document and metadata
├── package.json                       # scripts and dependencies
├── package-lock.json                  # reproducible dependency graph
├── tsconfig.json                      # TypeScript project references
├── tsconfig.app.json                  # browser compiler options
├── tsconfig.node.json                 # tooling compiler options
├── vite.config.ts                     # React and Vitest configuration
├── eslint.config.js                   # TypeScript and React Hooks lint rules
├── playwright.config.ts               # desktop/mobile end-to-end projects
├── public/
│   └── huatai-logo.png                # approved Huatai logo stored locally
├── src/
│   ├── main.tsx                       # React bootstrap
│   ├── app/
│   │   ├── App.tsx                    # section composition and active view state
│   │   └── App.test.tsx               # top-level smoke and accessibility behavior
│   ├── data/
│   │   ├── reports.ts                 # approved report metadata and authors
│   │   ├── metricDefinitions.ts       # canonical metric dictionary
│   │   ├── observations.ts            # verified weekly/monthly observations
│   │   ├── narratives.ts              # five macro state narratives
│   │   ├── policyEvents.ts            # dated policy timeline items
│   │   ├── risks.ts                   # observation points and risk statements
│   │   ├── dataset.ts                 # assembled immutable MacroDataset
│   │   └── dataset.test.ts             # source-value and referential-integrity tests
│   ├── domain/
│   │   ├── types.ts                   # shared domain types
│   │   ├── validateDataset.ts         # runtime integrity validation
│   │   ├── selectors.ts               # report, metric, trend, and section selectors
│   │   └── selectors.test.ts           # selector and trend-threshold tests
│   ├── components/
│   │   ├── BrandLockup.tsx            # Huatai logo and bilingual identity
│   │   ├── Header.tsx                 # fixed brand/navigation row
│   │   ├── ThemeToggle.tsx            # persisted light/dark control
│   │   ├── TickerTape.tsx             # horizontal key-metric strip
│   │   ├── ViewFilter.tsx             # combined/weekly/monthly segmented control
│   │   ├── SectionHeading.tsx          # numbered section heading pattern
│   │   ├── MetricCard.tsx              # current/previous value card with source detail
│   │   ├── SourceBadge.tsx             # source frequency and date badge
│   │   ├── SignalPill.tsx              # text+icon macro state signal
│   │   ├── DeltaBars.tsx               # pure SVG current-vs-previous comparison
│   │   ├── TrendChart.tsx              # pure SVG native/cross-frequency chart
│   │   └── EmptyState.tsx              # missing/unavailable module fallback
│   ├── sections/
│   │   ├── MacroOverview.tsx           # headline and five narrative signals
│   │   ├── MonthlyFundamentals.tsx     # GDP/activity/trade/inflation/credit cards
│   │   ├── WeeklyPulse.tsx             # consumption/property/high-frequency cards
│   │   ├── PriceFinancial.tsx          # commodity/rates/FX/equity groups
│   │   ├── IndustryMatrix.tsx          # supply-demand/pressure matrix
│   │   ├── PolicyTimeline.tsx          # dated event list
│   │   ├── OutlookRisks.tsx            # watch points and source-bounded risks
│   │   ├── TrendExplorer.tsx           # future-ready frequency comparison module
│   │   └── SourcesArchive.tsx          # reports, authors, method, disclaimer
│   ├── styles/
│   │   ├── tokens.css                  # light/dark design tokens
│   │   ├── global.css                  # reset, typography, layout primitives
│   │   └── responsive.css              # breakpoints and reduced-motion rules
│   └── test/
│       ├── setup.ts                    # jest-dom setup and browser mocks
│       └── renderApp.tsx               # shared render helper
├── e2e/
│   └── macro-pulse.spec.ts             # desktop/mobile/theme/navigation flows
└── README.md                            # run, build, data-update, and source rules
```

---

### Task 1: Establish the Tested Static React Foundation

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: default component `App(): JSX.Element`.
- Produces: npm scripts `dev`, `build`, `test`, `test:run`, `typecheck`, and `lint`.

- [ ] **Step 1: Initialize package metadata and install the minimum runtime/test toolchain**

Run:

```bash
npm init -y
npm install react@19 react-dom@19
npm install -D vite@latest @vitejs/plugin-react@latest typescript@5 vitest@latest jsdom@latest @types/react @types/react-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event eslint@latest @eslint/js typescript-eslint eslint-plugin-react-hooks
npm pkg set type=module
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="tsc -b && vite build"
npm pkg set scripts.test="vitest"
npm pkg set scripts.test:run="vitest run"
npm pkg set scripts.typecheck="tsc -b --pretty false"
npm pkg set scripts.lint="eslint ."
```

Expected: `package-lock.json` is created and all commands exit 0.

- [ ] **Step 2: Write the failing top-level render test**

Create `src/app/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the approved product identity", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "中国宏观脉搏" })).toBeInTheDocument();
    expect(screen.getByText("华泰证券研究所")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Add Vitest setup and run the test to verify it fails**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `vite.config.ts` with React and a jsdom test environment:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
```

Run: `npm run test:run -- src/app/App.test.tsx`  
Expected: FAIL because `src/app/App.tsx` does not exist.

- [ ] **Step 4: Implement the minimal application shell and compiler files**

Create `src/app/App.tsx`:

```tsx
export function App() {
  return (
    <main>
      <p>华泰证券研究所</p>
      <h1>中国宏观脉搏</h1>
    </main>
  );
}
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
);
```

Create `index.html` with `lang="zh-CN"`, title `中国宏观脉搏 | 华泰证券研究所`, meta description, `#root`, and `/src/main.tsx`. Configure TypeScript for strict React JSX, project references, and test matcher types `vitest/globals` and `@testing-library/jest-dom`.

- [ ] **Step 5: Verify foundation**

Run:

```bash
npm run test:run -- src/app/App.test.tsx
npm run typecheck
npm run build
```

Expected: one passing test; typecheck and production build exit 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json index.html tsconfig*.json vite.config.ts eslint.config.js src/main.tsx src/app/App.tsx src/app/App.test.tsx src/test/setup.ts
git commit -m "chore: establish tested macro pulse app"
```

---

### Task 2: Define and Validate the Macro Data Domain

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/validateDataset.ts`
- Create: `src/domain/selectors.ts`
- Create: `src/domain/selectors.test.ts`

**Interfaces:**
- Produces: `MacroDataset`, `Report`, `MetricDefinition`, `MetricObservation`, `Narrative`, `PolicyEvent`, and `RiskItem`.
- Produces: `validateDataset(dataset: MacroDataset): string[]`.
- Produces: `selectObservations(dataset: MacroDataset, filter: ObservationFilter): MetricObservation[]`.
- Produces: `selectLatestObservation(dataset: MacroDataset, metricId: string, view: ViewMode): MetricObservation | undefined`.
- Produces: `canShowNativeTrend(observations: MetricObservation[], frequency: Frequency): boolean`.
- Produces: `canShowCrossFrequencyTrend(observations: MetricObservation[]): boolean`.

- [ ] **Step 1: Write selector and validation tests first**

Create a compact fixture in `src/domain/selectors.test.ts` with one monthly report, two weekly reports, one matching metric, and one dangling observation. Assert:

```ts
expect(validateDataset(validDataset)).toEqual([]);
expect(validateDataset(danglingDataset)).toContain(
  "Observation obs-missing references unknown metric missing",
);
expect(canShowNativeTrend(twoWeeklyObservations, "weekly")).toBe(true);
expect(canShowNativeTrend(oneMonthlyObservation, "monthly")).toBe(false);
expect(canShowCrossFrequencyTrend(mixedObservations)).toBe(true);
expect(selectLatestObservation(validDataset, "brent", "combined")?.value).toBe(90.12);
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/domain/selectors.test.ts`  
Expected: FAIL because domain modules do not exist.

- [ ] **Step 3: Implement exact domain types**

Create `src/domain/types.ts` with these discriminated values and fields:

```ts
export type Frequency = "weekly" | "monthly";
export type ViewMode = "combined" | Frequency;
export type Confidence = "verified" | "partial";
export type ComparisonType = "yoy" | "mom" | "wow" | "previous-week" | "basis-points" | "none";
export type Signal = "improving" | "stable" | "watch" | "deteriorating";

export interface ObservationFilter {
  view: ViewMode;
  metricIds?: string[];
  reportIds?: string[];
  verifiedOnly?: boolean;
}

export interface Report {
  id: string;
  frequency: Frequency;
  title: string;
  publishedAt: string;
  periodStart: string;
  periodEnd: string;
  sourceUrl: string;
  authors: string[];
  summary: string;
}

export interface MetricDefinition {
  id: string;
  name: string;
  category: "activity" | "property" | "prices" | "financial" | "money" | "industry";
  unit: string;
  nativeFrequency: Frequency | "mixed";
  directionMeaning: "improvement" | "deterioration" | "neutral";
  methodology: string;
}

export interface MetricObservation {
  id: string;
  metricId: string;
  reportId: string;
  periodEnd: string;
  frequency: Frequency;
  value: number;
  previousValue?: number;
  comparisonType: ComparisonType;
  change?: number;
  sourceText: string;
  confidence: Confidence;
}

export interface Narrative {
  id: string;
  reportId: string;
  topic: "external-demand" | "domestic-demand" | "prices" | "liquidity" | "policy";
  title: string;
  summary: string;
  signal: Signal;
}

export interface PolicyEvent {
  id: string;
  reportId: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface RiskItem {
  id: string;
  reportId: string;
  kind: "watch" | "risk";
  title: string;
  summary: string;
}

export interface MacroDataset {
  reports: Report[];
  metricDefinitions: MetricDefinition[];
  observations: MetricObservation[];
  narratives: Narrative[];
  policyEvents: PolicyEvent[];
  risks: RiskItem[];
}
```

- [ ] **Step 4: Implement validation and selectors**

`validateDataset` must report duplicate IDs, unknown report/metric references, non-finite values, empty source excerpts, and frequency mismatches between observations and reports. `selectObservations` must exclude `partial` records when `verifiedOnly` is true and sort by `periodEnd`. `canShowNativeTrend` must require two verified observations at the requested frequency. `canShowCrossFrequencyTrend` must require two weekly plus one monthly verified observations for one metric ID.

- [ ] **Step 5: Verify domain behavior**

Run:

```bash
npm run test:run -- src/domain/selectors.test.ts
npm run typecheck
```

Expected: all domain tests pass and TypeScript exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/domain
git commit -m "feat: define macro report data domain"
```

---

### Task 3: Encode and Lock the Two Approved Reports

**Files:**
- Create: `src/data/reports.ts`
- Create: `src/data/metricDefinitions.ts`
- Create: `src/data/observations.ts`
- Create: `src/data/narratives.ts`
- Create: `src/data/policyEvents.ts`
- Create: `src/data/risks.ts`
- Create: `src/data/dataset.ts`
- Create: `src/data/dataset.test.ts`

**Interfaces:**
- Produces: immutable `macroDataset: MacroDataset`.
- Consumes: all types and `validateDataset` from Task 2.

**Verified value inventory:**

| Frequency | Metric | Value | Comparison |
| --- | --- | ---: | --- |
| Monthly | Real GDP | 4.3% | Q2 YoY |
| Monthly | Nominal GDP | 5.9% | Q2 YoY |
| Monthly | Industrial value added | 5.3% | June YoY |
| Monthly | Retail sales | 1.0% | June YoY |
| Monthly | Fixed asset investment | -11.2% | June YoY |
| Monthly | Exports | 27.0% | previous 19.4% |
| Monthly | Imports | 36.0% | previous 27.4% |
| Monthly | CPI | 1.0% | June YoY |
| Monthly | PPI | 4.1% | June YoY |
| Monthly | New RMB loans | 1.61 万亿元 | YoY -6300 亿元 |
| Monthly | New social financing | 3.36 万亿元 | YoY -8606 亿元 |
| Monthly | M1 | 4.0% | previous 5.5% |
| Monthly | M2 | 8.0% | previous 8.6% |
| Monthly | Brent | 89.0 美元/桶 | MoM +22.1% |
| Monthly | COMEX gold | 4163.0 美元/盎司 | MoM +3.3% |
| Monthly | Copper / aluminium / thermal coal | +3.5% / +5.2% / +5.1% | MoM |
| Monthly | Rebar / cement | -3.1% / -2.3% | MoM |
| Monthly | Agricultural index / pork / vegetables / fruit | +3.1% / +11.5% / +6.2% / -5.4% | MoM |
| Monthly | 1Y / 10Y government yield | +3.6bp / -1.3bp | MoM |
| Monthly | R007 / DR007 | -4.9bp / -0.7bp | MoM |
| Monthly | Net rate-bond issuance | 1.39 万亿元 | YoY -1436 亿元 |
| Monthly | RMB/USD / basket | +0.43% / +0.11% | MoM appreciation |
| Weekly | Brent | 90.12 美元/桶 | WoW -6.9% |
| Weekly | COMEX gold | 4098.6 美元/盎司 | WoW +1.1% |
| Weekly | Copper / rebar / cement | +0.8% / -2.0% / -0.5% | WoW |
| Weekly | Agricultural index / vegetables / fruit / pork | 0.0% / +0.9% / -4.7% / -0.4% | WoW |
| Weekly | DR007 / R007 | +5.5bp / +4.5bp | WoW |
| Weekly | CSI 300 | -1.31% | WoW |
| Weekly | 1Y / 10Y government yield | +1.03bp / -1.54bp | WoW |
| Weekly | Rate-bond issuance | -3032 亿元 | YoY difference |
| Weekly | Local government bond issuance | -2109 亿元 | YoY difference |
| Weekly | RMB/USD / basket | +0.25% / -0.65% | WoW |
| Weekly | Passenger vehicle retail | -22.9% YoY | +8.0% WoW |
| Weekly | Movie box office | -7.8% YoY | +20.1% WoW |
| Weekly | Second-hand home area | +3.9% YoY | previous +5.3% |
| Weekly | Tier 1 / 2 / 3 second-hand home area | +10.2% / +1.3% / -10.4% YoY | previous +8.9% / +4.9% / -9.2% |
| Weekly | Land transaction area | -15.6% YoY | +1.3% WoW |
| Weekly | Land floor price | -41.7% YoY | +61.9% WoW |
| Weekly | Manufacturing / non-manufacturing PMI | 49.2 / 49.0 | previous 50.3 / 50.2 |
| Weekly | Industrial profit / revenue | 15.1% / 11.2% | previous 21.1% / 6.7% |
| Weekly | PV modules / wafers / cells | -3.0% / -2.5% / -14.5% | July average MoM |

- [ ] **Step 1: Write dataset integrity and source-lock tests**

In `src/data/dataset.test.ts`, assert:

```ts
expect(validateDataset(macroDataset)).toEqual([]);
expect(macroDataset.reports).toHaveLength(2);
expect(findValue("exports-yoy", "monthly")).toBe(27);
expect(findValue("brent-usd", "weekly")).toBe(90.12);
expect(findValue("manufacturing-pmi", "weekly")).toBe(49.2);
expect(findObservation("second-home-area-yoy", "weekly")?.previousValue).toBe(5.3);
expect(macroDataset.observations.every((item) => item.sourceText.length >= 12)).toBe(true);
```

- [ ] **Step 2: Run the dataset test to verify it fails**

Run: `npm run test:run -- src/data/dataset.test.ts`  
Expected: FAIL because the dataset modules do not exist.

- [ ] **Step 3: Add report metadata and canonical definitions**

Use report IDs `weekly-2026-08-02` and `monthly-2026-07`. Use ISO dates. Authors for both reports are 易峘、吴宛忆、王洺硕、常慧丽, preserving credential text only in the archive display data. Assign stable kebab-case metric IDs such as `brent-usd`, `exports-yoy`, `manufacturing-pmi`, and `second-home-area-yoy`.

- [ ] **Step 4: Encode observations and source excerpts**

Create one observation per distinct value and comparison type. When a sentence contains both YoY and WoW values, create two observation IDs sharing the same metric ID and period but different `comparisonType`, or store the display-primary comparison as the observation and the secondary comparison in a separately named metric definition. Never overload `change` with a different comparison basis than `comparisonType`.

- [ ] **Step 5: Encode five narratives, policy events, and risks**

Narratives must cover external demand, domestic demand, prices, liquidity, and policy. Policy events must include 2026-07-04 PBoC policy meeting, 2026-07-13 consumption plan, 2026-07-20 State Council meeting, 2026-07-28 tax/industry innovation items, 2026-07-29 technology-finance data notice, 2026-07-30 Politburo meeting, and 2026-07-31 financial institution governance opinion. Risks must preserve the source boundary around energy-price volatility, property repair, and domestic-demand downside.

- [ ] **Step 6: Verify every encoded value**

Run:

```bash
npm run test:run -- src/data/dataset.test.ts src/domain/selectors.test.ts
npm run typecheck
```

Expected: all tests pass; validation returns no errors.

- [ ] **Step 7: Commit**

```bash
git add src/data
git commit -m "feat: encode approved macro reports"
```

---

### Task 4: Build the Huatai Brand Shell, Theme, Navigation, and Ticker

**Files:**
- Create: `public/huatai-logo.png`
- Create: `src/components/BrandLockup.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/TickerTape.tsx`
- Create: `src/components/SourceBadge.tsx`
- Create: `src/components/SectionHeading.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- `Header({ activeSection, onNavigate }): JSX.Element`.
- `TickerTape({ observations, definitions }): JSX.Element`.
- `ThemeToggle(): JSX.Element`, persisting `"light" | "dark"` to `ht-macro-theme`.

- [ ] **Step 1: Add failing shell and theme tests**

Extend `App.test.tsx` to assert the banner, navigation labels, source badge, and theme persistence:

```tsx
expect(screen.getByRole("banner")).toBeInTheDocument();
expect(screen.getByRole("navigation", { name: "章节导航" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "切换至深色主题" })).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: "切换至深色主题" }));
expect(document.documentElement).toHaveAttribute("data-theme", "dark");
expect(localStorage.getItem("ht-macro-theme")).toBe("dark");
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run -- src/app/App.test.tsx`  
Expected: FAIL because banner/navigation/theme controls do not exist.

- [ ] **Step 3: Add approved brand asset and design tokens**

Download the Huatai logo from the official public asset and store it locally; do not hotlink it at runtime:

```bash
curl -L --fail --silent --show-error \
  "https://www.htsc.com.cn/site-services/static/img/logo.a97d3e9.png" \
  -o public/huatai-logo.png
file public/huatai-logo.png
```

Expected: `file` reports a PNG image. Define light and dark tokens for `--bg`, `--panel`, `--panel-muted`, `--line`, `--ink`, `--ink-muted`, `--ht-red`, `--amber`, `--cyan`, `--up`, and `--down`. Add a 2px red brand line, 56px fixed command bar, and 38px ticker row.

- [ ] **Step 4: Implement accessible brand and navigation components**

Navigation anchors are `overview`, `monthly`, `weekly`, `markets`, `industry`, `policy`, `outlook`, and `sources`. `BrandLockup` displays the local SVG, “华泰证券”, “HUATAI SECURITIES”, and product name. `TickerTape` uses the latest verified observation for GDP, exports, CPI, PPI, social financing, Brent, RMB/USD, and second-hand housing.

- [ ] **Step 5: Implement theme initialization without flash**

Add a small inline script in `index.html` that reads `ht-macro-theme` before React mounts and sets `document.documentElement.dataset.theme`. `ThemeToggle` updates both DOM and storage, with distinct accessible labels for each destination theme.

- [ ] **Step 6: Verify shell**

Run:

```bash
npm run test:run -- src/app/App.test.tsx
npm run typecheck
npm run build
```

Expected: shell tests pass; no missing asset or type errors.

- [ ] **Step 7: Commit**

```bash
git add public index.html src/components src/styles src/main.tsx src/app
git commit -m "feat: add Huatai macro terminal shell"
```

---

### Task 5: Implement Overview Signals and View Filtering

**Files:**
- Create: `src/components/ViewFilter.tsx`
- Create: `src/components/SignalPill.tsx`
- Create: `src/sections/MacroOverview.tsx`
- Create: `src/test/renderApp.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- `ViewFilter({ value, onChange }): JSX.Element` where value is `ViewMode`.
- `MacroOverview({ reports, narratives, view }): JSX.Element`.
- App owns `view: ViewMode` and passes it to all frequency-aware sections.

- [ ] **Step 1: Write failing filter and narrative tests**

Assert the default `综合` filter, the headline, five signals, and weekly filtering:

```tsx
expect(screen.getByRole("heading", { name: /出口维持高增/ })).toBeInTheDocument();
expect(screen.getAllByTestId("macro-signal")).toHaveLength(5);
await user.click(screen.getByRole("button", { name: "周报" }));
expect(screen.getByRole("button", { name: "周报" })).toHaveAttribute("aria-pressed", "true");
expect(screen.getAllByText("截至 2026-08-02").length).toBeGreaterThan(0);
```

- [ ] **Step 2: Run the focused test to verify failure**

Run: `npm run test:run -- src/app/App.test.tsx`  
Expected: FAIL because filter and overview components do not exist.

- [ ] **Step 3: Implement filter, signals, and overview**

Use three actual buttons in a labeled group; no select menu on desktop. `SignalPill` renders a Chinese signal label plus icon: 改善、平稳、观察、承压. The overview shows approved report dates, source badges, and links.

- [ ] **Step 4: Verify overview behavior**

Run: `npm run test:run -- src/app/App.test.tsx`  
Expected: overview and filter tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/ViewFilter.tsx src/components/SignalPill.tsx src/sections/MacroOverview.tsx src/test/renderApp.tsx src/app
git commit -m "feat: add macro overview and frequency filter"
```

---

### Task 6: Render Monthly Fundamentals and Weekly Pulse

**Files:**
- Create: `src/components/MetricCard.tsx`
- Create: `src/components/DeltaBars.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/sections/MonthlyFundamentals.tsx`
- Create: `src/sections/WeeklyPulse.tsx`
- Create: `src/sections/Fundamentals.test.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- `MetricCard({ definition, primary, secondary, report }): JSX.Element`.
- `DeltaBars({ current, previous, unit, currentLabel, previousLabel }): JSX.Element`.
- `MonthlyFundamentals({ dataset, view }): JSX.Element`.
- `WeeklyPulse({ dataset, view }): JSX.Element`.

- [ ] **Step 1: Write failing data-card tests**

Assert exact approved values and view visibility:

```tsx
expect(screen.getByRole("heading", { name: "月度基本盘" })).toBeInTheDocument();
expect(screen.getByText("27.0%")).toBeInTheDocument();
expect(screen.getByText("49.2")).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: "月报" }));
expect(screen.queryByRole("heading", { name: "周度高频脉搏" })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run -- src/sections/Fundamentals.test.tsx`  
Expected: FAIL because metric sections do not exist.

- [ ] **Step 3: Implement reusable metric display**

`MetricCard` must show definition name, formatted value, unit, comparison basis, period end, and a disclosure button. The disclosure reveals methodology, short source excerpt, report title, and original link. `DeltaBars` normalizes bars against the largest absolute value and prints values directly so color is never the sole carrier.

- [ ] **Step 4: Implement monthly and weekly section groupings**

Monthly groups: growth/activity, trade, inflation, credit/money. Weekly groups: consumption, property/land, PMI/profits. Do not render a section when the selected view excludes its frequency. Use `EmptyState` only when a selected report exists but a configured metric group has no verified observation.

- [ ] **Step 5: Verify metrics and filters**

Run:

```bash
npm run test:run -- src/sections/Fundamentals.test.tsx src/app/App.test.tsx
npm run typecheck
```

Expected: exact data assertions and view filtering pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/MetricCard.tsx src/components/DeltaBars.tsx src/components/EmptyState.tsx src/sections/MonthlyFundamentals.tsx src/sections/WeeklyPulse.tsx src/sections/Fundamentals.test.tsx src/app/App.tsx
git commit -m "feat: render monthly and weekly macro fundamentals"
```

---

### Task 7: Build Price, Rates, FX, and Industry Views

**Files:**
- Create: `src/sections/PriceFinancial.tsx`
- Create: `src/sections/IndustryMatrix.tsx`
- Create: `src/sections/MarketsIndustry.test.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- `PriceFinancial({ dataset, view }): JSX.Element`.
- `IndustryMatrix({ dataset, view }): JSX.Element`.

- [ ] **Step 1: Write failing market and matrix tests**

Assert:

```tsx
expect(screen.getByRole("heading", { name: "价格与金融条件" })).toBeInTheDocument();
expect(screen.getByText("90.12")).toBeInTheDocument();
expect(screen.getByText("4,163.0")).toBeInTheDocument();
expect(screen.getByRole("heading", { name: "行业景气矩阵" })).toBeInTheDocument();
expect(screen.getByText("半导体")).toBeInTheDocument();
expect(screen.getByText("光伏设备")).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test:run -- src/sections/MarketsIndustry.test.tsx`  
Expected: FAIL because sections do not exist.

- [ ] **Step 3: Implement market groups**

Create commodity, food, liquidity/rates, issuance, FX, and equity subgroups. Combined view shows weekly values as the latest pulse and monthly values as a labeled monthly anchor; never place values with different units on one axis.

- [ ] **Step 4: Implement source-bounded industry matrix**

Use a semantic CSS grid with labeled axes rather than an unlabeled decorative quadrant. Place semiconductor in the high/strengthening area, photovoltaic equipment and cement in low-supply/low-demand pressure, and nonferrous metals in mixed/high-price observation, matching the approved source summaries. Each cell opens its source explanation.

- [ ] **Step 5: Verify markets and matrix**

Run:

```bash
npm run test:run -- src/sections/MarketsIndustry.test.tsx
npm run typecheck
```

Expected: values and industry labels pass.

- [ ] **Step 6: Commit**

```bash
git add src/sections/PriceFinancial.tsx src/sections/IndustryMatrix.tsx src/sections/MarketsIndustry.test.tsx src/app/App.tsx
git commit -m "feat: add market conditions and industry matrix"
```

---

### Task 8: Add Policy Timeline, Outlook, Risks, and Source Archive

**Files:**
- Create: `src/sections/PolicyTimeline.tsx`
- Create: `src/sections/OutlookRisks.tsx`
- Create: `src/sections/SourcesArchive.tsx`
- Create: `src/sections/ResearchContext.test.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- `PolicyTimeline({ events, reports, view }): JSX.Element`.
- `OutlookRisks({ items, reports, view }): JSX.Element`.
- `SourcesArchive({ reports }): JSX.Element`.

- [ ] **Step 1: Write failing research-context tests**

Assert the 2026-07-30 event, both source links, authors, and disclaimer text:

```tsx
expect(screen.getByText("中共中央政治局会议")).toBeInTheDocument();
expect(screen.getAllByRole("link", { name: "查看原文" }).length).toBeGreaterThanOrEqual(2);
expect(screen.getByText(/易峘/)).toBeInTheDocument();
expect(screen.getByText(/不构成对任何人的投资建议/)).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test:run -- src/sections/ResearchContext.test.tsx`  
Expected: FAIL because context sections do not exist.

- [ ] **Step 3: Implement timeline and risk sections**

Sort events by ISO date, group same-day events, show frequency badges, and filter by selected view. Split outlook and risk into separate labeled lists. Use source wording boundaries and avoid forecast verbs not present in the reports.

- [ ] **Step 4: Implement sources, methodology, and disclaimer**

Render both report cards with titles, publication dates, authors, frequency, original links, and the method statement: “数据由当前研究整理任务从指定公开推送中提取并逐项核验；未验证数值不进入图表。” Include the report applicability and non-investment-advice language summarized from the source.

- [ ] **Step 5: Verify context sections**

Run: `npm run test:run -- src/sections/ResearchContext.test.tsx`  
Expected: events, links, authors, and disclaimer assertions pass.

- [ ] **Step 6: Commit**

```bash
git add src/sections/PolicyTimeline.tsx src/sections/OutlookRisks.tsx src/sections/SourcesArchive.tsx src/sections/ResearchContext.test.tsx src/app/App.tsx
git commit -m "feat: add policy timeline and research sources"
```

---

### Task 9: Implement Future-Ready Native and Cross-Frequency Trends

**Files:**
- Create: `src/components/TrendChart.tsx`
- Create: `src/sections/TrendExplorer.tsx`
- Create: `src/sections/TrendExplorer.test.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- `TrendChart({ definition, weekly, monthly }): JSX.Element`.
- `TrendExplorer({ dataset, view }): JSX.Element | null`.
- Consumes Task 2 threshold selectors exactly.

- [ ] **Step 1: Write failing threshold and chart tests**

Use the initial dataset and a test-only expanded dataset:

```tsx
const { rerender } = render(<TrendExplorer dataset={macroDataset} view="combined" />);
expect(screen.queryByRole("heading", { name: "跨尺度趋势" })).not.toBeInTheDocument();

rerender(<TrendExplorer dataset={expandedDataset} view="combined" />);
expect(screen.getByRole("heading", { name: "跨尺度趋势" })).toBeInTheDocument();
expect(screen.getByLabelText("布伦特原油周频与月频趋势图")).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test:run -- src/sections/TrendExplorer.test.tsx`  
Expected: FAIL because trend components do not exist.

- [ ] **Step 3: Implement pure SVG trend rendering**

Map verified observations into a shared time x-scale. Render weekly data as solid points/line and monthly anchors as diamond points with a dashed line. Include `<title>` or an accessible description listing each date/value. When units or methodology differ, return no chart and show no misleading axis.

- [ ] **Step 4: Implement visibility thresholds**

Initial approved data has only one weekly and one monthly report, so `TrendExplorer` returns `null`. The expanded fixture with two weekly and one monthly compatible observation renders the section. Native view renders after two points at the selected frequency.

- [ ] **Step 5: Verify future behavior without changing initial UI**

Run:

```bash
npm run test:run -- src/sections/TrendExplorer.test.tsx src/domain/selectors.test.ts
npm run typecheck
```

Expected: initial hidden state and expanded-data visible state pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/TrendChart.tsx src/sections/TrendExplorer.tsx src/sections/TrendExplorer.test.tsx src/app/App.tsx
git commit -m "feat: prepare multi-frequency macro trends"
```

---

### Task 10: Finish Responsive Styling, Accessibility, E2E Coverage, and Documentation

**Files:**
- Create: `src/styles/responsive.css`
- Create: `playwright.config.ts`
- Create: `e2e/macro-pulse.spec.ts`
- Create: `README.md`
- Modify: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `src/app/App.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: npm scripts `e2e` and `verify`.
- Produces: documented data-update workflow that uses the canonical schema rather than component edits.

- [ ] **Step 1: Install and configure Playwright**

Run:

```bash
npm install -D @playwright/test
npx playwright install chromium
npm pkg set scripts.e2e="playwright test"
npm pkg set scripts.verify="npm run lint && npm run typecheck && npm run test:run && npm run build && npm run e2e"
```

Configure a local Vite web server and two projects: desktop Chromium at 1440×1000 and mobile Chromium at 390×844.

- [ ] **Step 2: Write failing end-to-end flows**

Create `e2e/macro-pulse.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("navigates sections and persists dark theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "中国宏观脉搏" })).toBeVisible();
  await page.getByRole("link", { name: "价格·金融" }).click();
  await expect(page.getByRole("heading", { name: "价格与金融条件" })).toBeInViewport();
  await page.getByRole("button", { name: "切换至深色主题" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile layout keeps primary controls usable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "章节导航" })).toBeVisible();
  await expect(page.getByRole("group", { name: "报告视图" })).toBeVisible();
  await expect(page.getByRole("link", { name: "查看原文" }).first()).toBeVisible();
});
```

- [ ] **Step 3: Run E2E to expose layout/accessibility failures**

Run: `npm run e2e`  
Expected: tests fail until final navigation labels, responsive CSS, and theme behavior are complete.

- [ ] **Step 4: Complete responsive and reduced-motion CSS**

At `max-width: 1024px`, collapse 3/4-column grids to 2 columns. At `max-width: 640px`, use one column, reduce container padding to 16px, hide only the English brand subtitle, keep the Huatai mark and Chinese identity, and make navigation/ticker horizontally scrollable. Add visible `:focus-visible` rings. In reduced-motion mode, disable smooth scrolling, ticker animation, card transforms, and theme transitions.

- [ ] **Step 5: Complete active-section observation and keyboard behavior**

Use one `IntersectionObserver` in `App` for section IDs and set `aria-current="location"` on the active navigation link. All disclosures must use native `<details>`/`<summary>` or buttons with `aria-expanded`. Ensure no click-only `<div>` elements.

- [ ] **Step 6: Write operating and data-update documentation**

README must include:

```text
npm install
npm run dev
npm run verify
npm run build
```

Document the approved source URLs, the rule that new reports are parsed outside the website, the files to update (`reports.ts`, `metricDefinitions.ts`, `observations.ts`, narratives/events/risks), the `verified` requirement, and trend visibility thresholds.

- [ ] **Step 7: Run the complete verification suite**

Run:

```bash
npm run verify
git status --short
```

Expected: lint, typecheck, all Vitest tests, production build, and both Playwright projects pass; `git status` only lists intended implementation files before commit.

- [ ] **Step 8: Inspect production output**

Run: `du -sh dist && find dist -maxdepth 2 -type f -printf '%p %k KB\n' | sort`  
Expected: static `dist/` exists, includes `index.html` and hashed assets, and contains no server bundle or secret.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json playwright.config.ts e2e README.md src/styles src/main.tsx src/app/App.tsx
git commit -m "test: verify responsive macro pulse experience"
```

---

## Final Acceptance Checklist

- [ ] `npm run verify` exits 0.
- [ ] The page displays the Huatai mark and “华泰证券研究所 · 中国宏观脉搏”.
- [ ] Light and dark themes both pass visual inspection at 1440px and 390px.
- [ ] Weekly/monthly/combined filters show only compatible sections and data.
- [ ] All plotted values are verified and source-linked.
- [ ] Initial trend explorer remains hidden because history is insufficient.
- [ ] Expanded test fixture proves native and cross-frequency trend thresholds.
- [ ] Source archive contains both approved articles, authors, method, and disclaimer.
- [ ] `dist/` is fully static and contains no credential or API configuration.
