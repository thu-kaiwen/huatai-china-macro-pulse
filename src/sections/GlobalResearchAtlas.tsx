import { ResearchTransmissionMap } from "../components/ResearchTransmissionMap";
import type { PrimaryView, ResearchAtlasData } from "../domain/researchAtlas";

interface GlobalResearchAtlasProps {
  data: ResearchAtlasData;
  onNavigate?: (view: PrimaryView) => void;
}

export function GlobalResearchAtlas({ data, onNavigate }: GlobalResearchAtlasProps) {
  const globalSystems = data.systems.filter((system) => system.id === "structure" || system.id === "transmission");

  return (
    <section aria-labelledby="global-research-atlas-title" className="global-research-atlas" id="global-research">
      <header>
        <p>GLOBAL RESEARCH ATLAS</p>
        <h1 id="global-research-atlas-title">全球研究图谱</h1>
      </header>
      <ResearchTransmissionMap layers={data.layers} onNavigate={onNavigate} />
      <section aria-label="全球研究体系" className="global-research-systems">
        {globalSystems.map((system) => (
          <article key={system.id}>
            <p>{system.number}</p>
            <h2>{system.title}</h2>
            <strong>{system.summary}</strong>
            <ul aria-label={`${system.title}主题`}>
              {system.topics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </section>
  );
}
