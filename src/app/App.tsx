import { useEffect, useState } from "react";
import { BackToTop } from "../components/BackToTop";
import { Header } from "../components/Header";
import { SectionErrorBoundary } from "../components/SectionErrorBoundary";
import { LatestTickerTape } from "../components/TickerTape";
import { ViewFilter } from "../components/ViewFilter";
import { monthlyReport0831 } from "../data/monthlyReport";
import { weeklyReport0906 } from "../data/weeklyReports";
import type { ViewMode } from "../domain/types";
import { MonthlyReport } from "../sections/MonthlyReport";
import { WeeklyReport } from "../sections/WeeklyReport";

const weeklySectionIds = ["weekly"];
const standardSectionIds = ["overview", "monthly"];

function sectionIdsForView(view: ViewMode): string[] {
  return view === "weekly" ? weeklySectionIds : standardSectionIds;
}

export function App() {
  const [activeSection, setActiveSection] = useState("weekly");
  const [view, setView] = useState<ViewMode>("weekly");
  const visibleSectionIds = sectionIdsForView(view);

  function changeView(nextView: ViewMode) {
    setView(nextView);
    setActiveSection(nextView === "weekly" ? "weekly" : "overview");
  }

  useEffect(() => {
    const sections = visibleSectionIds.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => Math.abs(left.boundingClientRect.top - 130) - Math.abs(right.boundingClientRect.top - 130))[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-130px 0px -62% 0px", threshold: [0, 0.1, 0.3, 0.6] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [visibleSectionIds]);

  return (
    <>
      <Header activeSection={activeSection} onNavigate={setActiveSection} TickerComponent={LatestTickerTape} visibleSectionIds={visibleSectionIds} />
      <main className="terminal-main">
        <ViewFilter onChange={changeView} value={view} />
        {view === "weekly" ? (
          <SectionErrorBoundary sectionId="weekly" sectionName="周报">
            <WeeklyReport report={weeklyReport0906} />
          </SectionErrorBoundary>
        ) : (
          <>
            <SectionErrorBoundary sectionId="monthly" sectionName="国内月报">
              <MonthlyReport report={monthlyReport0831} />
            </SectionErrorBoundary>
          </>
        )}
      </main>
      <BackToTop />
    </>
  );
}

export default App;
