import { useState } from "react";
import { Header } from "../components/Header";
import { SectionHeading } from "../components/SectionHeading";
import { ViewFilter } from "../components/ViewFilter";
import { macroDataset } from "../data/dataset";
import type { ViewMode } from "../domain/types";
import { MacroOverview } from "../sections/MacroOverview";
import { MonthlyFundamentals } from "../sections/MonthlyFundamentals";
import { WeeklyPulse } from "../sections/WeeklyPulse";

export function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [view, setView] = useState<ViewMode>("combined");

  return (
    <>
      <Header activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="terminal-main" id="overview">
        <SectionHeading eyebrow="华泰证券研究所" title="中国宏观脉搏">
          连接月度与周度数据，呈现中国宏观经济的最新脉动。
        </SectionHeading>
        <ViewFilter onChange={setView} value={view} />
        <MacroOverview dataset={macroDataset} view={view} />
        <MonthlyFundamentals dataset={macroDataset} view={view} />
        <WeeklyPulse dataset={macroDataset} view={view} />
      </main>
    </>
  );
}

export default App;
