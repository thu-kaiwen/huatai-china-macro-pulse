import { useState } from "react";
import { BackToTop } from "../components/BackToTop";
import { Header } from "../components/Header";
import { LatestTickerTape } from "../components/TickerTape";
import { monthlyReport0831 } from "../data/monthlyReport";
import { researchAtlasData } from "../data/researchAtlas";
import { weeklyReport0906 } from "../data/weeklyReports";
import type { PrimaryView } from "../domain/researchAtlas";
import { ChinaMacroHub } from "../sections/ChinaMacroHub";
import { GlobalResearchAtlas } from "../sections/GlobalResearchAtlas";
import { ResearchHome } from "../sections/ResearchHome";
import { TopicResearch } from "../sections/TopicResearch";

export function App() {
  const [activeView, setActiveView] = useState<PrimaryView>("home");

  function navigate(nextView: PrimaryView) {
    setActiveView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderView() {
    if (activeView === "global") return <GlobalResearchAtlas data={researchAtlasData} />;
    if (activeView === "china") return <ChinaMacroHub monthlyReport={monthlyReport0831} weeklyReport={weeklyReport0906} />;
    if (activeView === "topics") return <TopicResearch data={researchAtlasData} />;
    return <ResearchHome data={researchAtlasData} monthlyReport={monthlyReport0831} onNavigate={navigate} weeklyReport={weeklyReport0906} />;
  }

  return (
    <>
      <Header activeView={activeView} onNavigate={navigate} TickerComponent={LatestTickerTape} />
      <main className="terminal-main">{renderView()}</main>
      <BackToTop />
    </>
  );
}

export default App;
