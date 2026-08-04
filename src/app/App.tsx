import { useState } from "react";
import { Header } from "../components/Header";
import { SectionHeading } from "../components/SectionHeading";

export function App() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <>
      <Header activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="terminal-main" id="overview">
        <SectionHeading eyebrow="华泰证券研究所" title="中国宏观脉搏">
          连接月度与周度数据，呈现中国宏观经济的最新脉动。
        </SectionHeading>
      </main>
    </>
  );
}

export default App;
