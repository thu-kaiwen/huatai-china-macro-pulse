import { useState } from "react";
import type { ResearchLayer } from "../domain/researchAtlas";

export function ResearchTransmissionMap({ layers }: { layers: ResearchLayer[] }) {
  const firstNode = layers[0]?.nodes[0];
  const [selectedId, setSelectedId] = useState(firstNode?.id ?? "");
  const selected = layers.flatMap((layer) => layer.nodes).find((node) => node.id === selectedId) ?? firstNode;

  return (
    <section aria-labelledby="research-map-title" className="research-transmission-map">
      <header><p>HUATAI RESEARCH LENS</p><h2 id="research-map-title">全球变化如何传导至中国与资产</h2></header>
      <div className="research-layer-grid">
        {layers.map((layer, index) => (
          <div aria-label={`${layer.title}研究层`} className="research-layer" key={layer.stage} role="group">
            <p>{layer.eyebrow}</p><h3>{layer.title}</h3>
            <div>{layer.nodes.map((node) => (
              <button aria-pressed={selected?.id === node.id} key={node.id} onClick={() => setSelectedId(node.id)} type="button">{node.label}</button>
            ))}</div>
            {index < layers.length - 1 && <span aria-hidden="true" className="research-layer-arrow">→</span>}
          </div>
        ))}
      </div>
      {selected && <aside aria-live="polite" className="research-node-detail"><strong>{selected.label}</strong><p>{selected.summary}</p></aside>}
    </section>
  );
}
