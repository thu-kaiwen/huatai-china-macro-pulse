import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { BackToTop } from "../components/BackToTop";
import { SectionErrorBoundary } from "../components/SectionErrorBoundary";
import { SectionHeading } from "../components/SectionHeading";
import { ViewFilter } from "../components/ViewFilter";
import { macroDataset } from "../data/dataset";
import type { ViewMode } from "../domain/types";
import { MacroOverview } from "../sections/MacroOverview";
import { IndustryMatrix } from "../sections/IndustryMatrix";
import { MonthlyFundamentals } from "../sections/MonthlyFundamentals";
import { PriceFinancial } from "../sections/PriceFinancial";
import { OutlookRisks } from "../sections/OutlookRisks";
import { PolicyTimeline } from "../sections/PolicyTimeline";
import { SourcesArchive } from "../sections/SourcesArchive";
import { WeeklyPulse } from "../sections/WeeklyPulse";
import { TrendExplorer } from "../sections/TrendExplorer";
import { TickerTape } from "../components/TickerTape";

export interface AppComponents {
  tickerTape: typeof TickerTape;
  macroOverview: typeof MacroOverview;
  monthlyFundamentals: typeof MonthlyFundamentals;
  weeklyPulse: typeof WeeklyPulse;
  priceFinancial: typeof PriceFinancial;
  trendExplorer: typeof TrendExplorer;
  industryMatrix: typeof IndustryMatrix;
  policyTimeline: typeof PolicyTimeline;
  outlookRisks: typeof OutlookRisks;
  sourcesArchive: typeof SourcesArchive;
}

interface AppProps {
  components?: Partial<AppComponents>;
}

const defaultComponents: AppComponents = {
  tickerTape: TickerTape,
  macroOverview: MacroOverview,
  monthlyFundamentals: MonthlyFundamentals,
  weeklyPulse: WeeklyPulse,
  priceFinancial: PriceFinancial,
  trendExplorer: TrendExplorer,
  industryMatrix: IndustryMatrix,
  policyTimeline: PolicyTimeline,
  outlookRisks: OutlookRisks,
  sourcesArchive: SourcesArchive,
};

const allSectionIds = ["overview", "monthly", "weekly", "markets", "industry", "policy", "outlook", "sources"];

function sectionIdsForView(view: ViewMode): string[] {
  return allSectionIds.filter((id) => {
    if (view === "monthly") {
      return id !== "weekly" && id !== "industry";
    }

    return view !== "weekly" || id !== "monthly";
  });
}

export function App({ components: componentOverrides }: AppProps = {}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [view, setView] = useState<ViewMode>("combined");
  const visibleSectionIds = sectionIdsForView(view);
  const components = { ...defaultComponents, ...componentOverrides };
  const TickerComponent = components.tickerTape;
  const MacroOverviewComponent = components.macroOverview;
  const MonthlyFundamentalsComponent = components.monthlyFundamentals;
  const WeeklyPulseComponent = components.weeklyPulse;
  const PriceFinancialComponent = components.priceFinancial;
  const TrendExplorerComponent = components.trendExplorer;
  const IndustryMatrixComponent = components.industryMatrix;
  const PolicyTimelineComponent = components.policyTimeline;
  const OutlookRisksComponent = components.outlookRisks;
  const SourcesArchiveComponent = components.sourcesArchive;

  function changeView(nextView: ViewMode) {
    setView(nextView);
    setActiveSection((current) => (sectionIdsForView(nextView).includes(current) ? current : "overview"));
  }

  useEffect(() => {
    const sections = sectionIdsForView(view).flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observedEntries = new Map<Element, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => observedEntries.set(entry.target, entry));
        const nearestVisibleSection = sections
          .flatMap((section) => {
            const entry = observedEntries.get(section);
            return entry?.isIntersecting ? [entry] : [];
          })
          .sort(
            (left, right) =>
              Math.abs(left.boundingClientRect.top - 130) - Math.abs(right.boundingClientRect.top - 130),
          )[0];

        if (nearestVisibleSection) {
          setActiveSection(nearestVisibleSection.target.id);
        }
      },
      { rootMargin: "-130px 0px -62% 0px", threshold: [0, 0.1, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [view]);

  return (
    <>
      <Header
        activeSection={activeSection}
        onNavigate={setActiveSection}
        TickerComponent={TickerComponent}
        visibleSectionIds={visibleSectionIds}
      />
      <main className="terminal-main">
        <section aria-labelledby="terminal-title" className="terminal-intro" id="overview">
          <SectionHeading as="h1" eyebrow="华泰证券研究所" id="terminal-title" title="中国宏观脉搏">
            连接月度与周度数据，呈现中国宏观经济的最新脉动。
          </SectionHeading>
          <ViewFilter onChange={changeView} value={view} />
          <SectionErrorBoundary sectionName="宏观总览">
            <MacroOverviewComponent dataset={macroDataset} view={view} />
          </SectionErrorBoundary>
        </section>
        <SectionErrorBoundary sectionId="monthly" sectionName="月度基本盘">
          <MonthlyFundamentalsComponent dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="weekly" sectionName="周度高频脉搏">
          <WeeklyPulseComponent dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="markets" sectionName="价格与金融条件">
          <PriceFinancialComponent dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="trends" sectionName="趋势浏览器">
          <TrendExplorerComponent dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="industry" sectionName="行业景气矩阵">
          <IndustryMatrixComponent dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="policy" sectionName="政策与事件">
          <PolicyTimelineComponent events={macroDataset.policyEvents} reports={macroDataset.reports} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="outlook" sectionName="后续观察与风险">
          <OutlookRisksComponent items={macroDataset.risks} reports={macroDataset.reports} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionId="sources" sectionName="来源、方法与归档">
          <SourcesArchiveComponent reports={macroDataset.reports} />
        </SectionErrorBoundary>
      </main>
      <BackToTop />
    </>
  );
}

export default App;
