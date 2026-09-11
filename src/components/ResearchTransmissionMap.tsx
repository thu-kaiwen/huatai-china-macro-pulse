import { useState } from "react";
import type { PrimaryView, ResearchLayer } from "../domain/researchAtlas";
import type { Frequency } from "../domain/types";

interface ResearchTransmissionMapProps {
  layers: ResearchLayer[];
  onNavigate?: (view: PrimaryView, frequency?: Frequency) => void;
  title?: string;
}

export function ResearchTransmissionMap({ layers, onNavigate, title = "三大研究主线" }: ResearchTransmissionMapProps) {
  const firstNode = layers[0]?.nodes[0];
  const [selectedId, setSelectedId] = useState(firstNode?.id ?? "");
  const selected = layers.flatMap((layer) => layer.nodes).find((node) => node.id === selectedId) ?? firstNode;
  const selectedLayer = layers.find((layer) => layer.nodes.some((node) => node.id === selected?.id));

  const destination = selectedLayer?.stage === "china" ? "china" : selectedLayer?.stage === "themes" ? "topics" : "global";
  const actionLabel = selectedLayer?.stage === "china"
    ? "进入中国基本面脉搏"
    : selectedLayer?.stage === "themes"
      ? "查看主题研究"
      : "查看海外经济变化";

  return (
    <section aria-labelledby="research-map-title" className="research-transmission-map">
      <header><p>HUATAI MACRO RESEARCH</p><h2 id="research-map-title">{title}</h2></header>
      <div className="research-layer-grid">
        {layers.map((layer) => (
          <div aria-label={`${layer.title}研究板块`} className="research-layer" key={layer.stage} role="group">
            <p>{layer.eyebrow}</p><h3>{layer.title}</h3>
            <div>{layer.nodes.map((node) => (
              <button aria-pressed={selected?.id === node.id} key={node.id} onClick={() => setSelectedId(node.id)} type="button">{node.label}</button>
            ))}</div>
          </div>
        ))}
      </div>
      {selected && (
        <aside aria-live="polite" className="research-node-detail">
          <strong>{selected.label}</strong>
          <p>{selected.summary}</p>
          {onNavigate && selected.id === "regular-tracking" ? (
            <div className="research-node-actions">
              <button onClick={() => onNavigate("china", "weekly")} type="button">进入国内周报</button>
              <button onClick={() => onNavigate("china", "monthly")} type="button">进入国内月报</button>
            </div>
          ) : onNavigate ? (
            <button onClick={() => onNavigate(destination)} type="button">{actionLabel}</button>
          ) : null}
        </aside>
      )}
    </section>
  );
}
