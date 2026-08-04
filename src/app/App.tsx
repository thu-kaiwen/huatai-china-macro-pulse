import { useEffect, useState } from "react";
import { Header } from "../components/Header";
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

const allSectionIds = ["overview", "monthly", "weekly", "markets", "industry", "policy", "outlook", "sources"];

function sectionIdsForView(view: ViewMode): string[] {
  return allSectionIds.filter((id) => {
    if (view === "monthly") {
      return id !== "weekly" && id !== "industry";
    }

    return view !== "weekly" || id !== "monthly";
  });
}

export function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [view, setView] = useState<ViewMode>("combined");
  const visibleSectionIds = sectionIdsForView(view);

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
      <Header activeSection={activeSection} onNavigate={setActiveSection} visibleSectionIds={visibleSectionIds} />
      <main className="terminal-main">
        <section aria-labelledby="terminal-title" className="terminal-intro" id="overview">
          <SectionHeading as="h1" eyebrow="华泰证券研究所" id="terminal-title" title="中国宏观脉搏">
            连接月度与周度数据，呈现中国宏观经济的最新脉动。
          </SectionHeading>
          <ViewFilter onChange={changeView} value={view} />
          <SectionErrorBoundary sectionName="宏观总览">
            <MacroOverview dataset={macroDataset} view={view} />
          </SectionErrorBoundary>
        </section>
        <SectionErrorBoundary sectionName="月度基本盘">
          <MonthlyFundamentals dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="周度高频脉搏">
          <WeeklyPulse dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="价格与金融条件">
          <PriceFinancial dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="趋势浏览器">
          <TrendExplorer dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="行业景气矩阵">
          <IndustryMatrix dataset={macroDataset} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="政策与事件">
          <PolicyTimeline events={macroDataset.policyEvents} reports={macroDataset.reports} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="后续观察与风险">
          <OutlookRisks items={macroDataset.risks} reports={macroDataset.reports} view={view} />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="来源、方法与归档">
          <SourcesArchive reports={macroDataset.reports} />
        </SectionErrorBoundary>
      </main>
    </>
  );
}

export default App;
