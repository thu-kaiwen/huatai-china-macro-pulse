import { ResearchTransmissionMap } from "../components/ResearchTransmissionMap";
import type { PrimaryView, ResearchAtlasData } from "../domain/researchAtlas";

interface GlobalResearchAtlasProps {
  data: ResearchAtlasData;
  onNavigate?: (view: PrimaryView) => void;
}

export function GlobalResearchAtlas({ data, onNavigate }: GlobalResearchAtlasProps) {
  const overseasLayer = data.layers.filter((layer) => layer.stage === "overseas");
  const overseasSystems = data.systems.filter((system) => system.id === "overseas");

  return (
    <section aria-labelledby="global-research-atlas-title" className="global-research-atlas" id="global-research">
      <header>
        <p>OVERSEAS ECONOMIES</p>
        <h1 id="global-research-atlas-title">海外经济变化</h1>
      </header>
      <ResearchTransmissionMap layers={overseasLayer} onNavigate={onNavigate} title="重点经济体" />
      <section aria-label="海外经济研究" className="global-research-systems">
        {overseasSystems.map((system) => (
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
