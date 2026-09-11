import { useEffect, useState } from "react";
import { BackToTop } from "../components/BackToTop";
import { Header } from "../components/Header";
import { LatestTickerTape } from "../components/TickerTape";
import { monthlyReport0831 } from "../data/monthlyReport";
import { researchAtlasData } from "../data/researchAtlas";
import { weeklyReport0906 } from "../data/weeklyReports";
import type { PrimaryView } from "../domain/researchAtlas";
import type { Frequency } from "../domain/types";
import { ChinaMacroHub } from "../sections/ChinaMacroHub";
import { GlobalResearchAtlas } from "../sections/GlobalResearchAtlas";
import { ResearchHome } from "../sections/ResearchHome";
import { TopicResearch } from "../sections/TopicResearch";

interface AtlasRoute {
  view: PrimaryView;
  frequency: Frequency;
}

function routeFromHash(hash: string): AtlasRoute {
  if (hash === "#global-research") return { view: "global", frequency: "weekly" };
  if (hash === "#topic-research") return { view: "topics", frequency: "weekly" };
  if (hash === "#china-macro-monthly" || hash === "#monthly" || hash.startsWith("#monthly-")) return { view: "china", frequency: "monthly" };
  if (hash === "#china-macro" || hash === "#weekly") return { view: "china", frequency: "weekly" };
  return { view: "home", frequency: "weekly" };
}

function hashFor(view: PrimaryView, frequency: Frequency): string {
  if (view === "global") return "#global-research";
  if (view === "topics") return "#topic-research";
  if (view === "china") return frequency === "monthly" ? "#china-macro-monthly" : "#china-macro";
  return "#research-home";
}

export function App() {
  const [initialRoute] = useState(() => routeFromHash(window.location.hash));
  const [activeView, setActiveView] = useState<PrimaryView>(initialRoute.view);
  const [chinaFrequency, setChinaFrequency] = useState<Frequency>(initialRoute.frequency);

  useEffect(() => {
    const syncFromHash = () => {
      const route = routeFromHash(window.location.hash);
      setActiveView(route.view);
      setChinaFrequency(route.frequency);
    };
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id.startsWith("monthly-")) return;
    document.getElementById(id)?.scrollIntoView?.({ block: "start" });
  }, [activeView, chinaFrequency]);

  function navigate(nextView: PrimaryView, nextFrequency: Frequency = "weekly") {
    const nextHash = hashFor(nextView, nextFrequency);
    setActiveView(nextView);
    setChinaFrequency(nextFrequency);
    if (window.location.hash !== nextHash) window.location.hash = nextHash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setChinaView(frequency: Frequency) {
    setChinaFrequency(frequency);
    const nextHash = hashFor("china", frequency);
    if (window.location.hash !== nextHash) window.location.hash = nextHash;
  }

  function renderView() {
    if (activeView === "global") return <GlobalResearchAtlas data={researchAtlasData} onNavigate={navigate} />;
    if (activeView === "china") return <ChinaMacroHub frequency={chinaFrequency} monthlyReport={monthlyReport0831} onFrequencyChange={setChinaView} weeklyReport={weeklyReport0906} />;
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
