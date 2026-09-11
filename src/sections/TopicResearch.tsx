import type { ResearchAtlasData } from "../domain/researchAtlas";

interface TopicResearchProps {
  data: ResearchAtlasData;
}

export function TopicResearch({ data }: TopicResearchProps) {
  const systemTitles = new Map(data.systems.map((system) => [system.id, system.title]));

  return (
    <section aria-labelledby="topic-research-title" className="topic-research" id="topic-research">
      <header>
        <p>THEMATIC RESEARCH</p>
        <h1 id="topic-research-title">主题研究</h1>
      </header>
      <div className="research-topic-grid">
        {data.topics.map((topic) => (
          <article aria-label={`专题：${topic.title}`} key={topic.id}>
            <p>{systemTitles.get(topic.systemId)}</p>
            <h2>{topic.title}</h2>
            <strong>{topic.question}</strong>
            <p>{data.systems.find((system) => system.id === topic.systemId)?.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
