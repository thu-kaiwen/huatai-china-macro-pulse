import { ResearchTransmissionMap } from "../components/ResearchTransmissionMap";
import type { MonthlyReportPage } from "../data/monthlyReport";
import type { PrimaryView, ResearchAtlasData } from "../domain/researchAtlas";
import type { Frequency } from "../domain/types";
import type { WeeklyReportPage } from "../domain/weeklyReport";

interface ResearchHomeProps {
  data: ResearchAtlasData;
  weeklyReport: WeeklyReportPage;
  monthlyReport: MonthlyReportPage;
  onNavigate: (view: PrimaryView, frequency?: Frequency) => void;
}

export function ResearchHome({ data, weeklyReport, monthlyReport, onNavigate }: ResearchHomeProps) {
  return (
    <section className="research-home" id="research-home">
      <header className="research-home-lead">
        <div>
          <p>华泰证券宏观团队</p>
          <h1>华泰宏观研究图谱</h1>
        </div>
        <strong>以全球视野、原创框架和跨市场传导研究，理解全球变化及其对中国经济和资产价格的影响。</strong>
      </header>
      <ResearchTransmissionMap layers={data.layers} onNavigate={onNavigate} />
      <section aria-labelledby="research-focus-title" className="research-focus-section">
        <header>
          <p>EDITOR&apos;S PICKS</p>
          <h2 id="research-focus-title">本周研究重点</h2>
        </header>
        <div className="research-focus-grid">
          {data.focuses.map((focus) => (
            <article aria-label={`${focus.category}研究重点`} key={focus.id}>
              <p>{focus.category}</p>
              <h3>{focus.question}</h3>
              <strong>{focus.finding}</strong>
              <time>{focus.updatedAt}</time>
              <ol aria-label={`${focus.category}证据链`} className="research-evidence-path">
                {focus.evidencePath.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <button onClick={() => onNavigate(focus.targetView)} type="button">查看相关研究</button>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="research-original-title" className="research-original-section">
        <header>
          <p>ORIGINAL RESEARCH</p>
          <h2 id="research-original-title">原创研究精选</h2>
        </header>
        <div className="research-topic-grid">
          {data.topics.map((topic) => (
            <article aria-label={`原创研究专题：${topic.title}`} key={topic.id}>
              <p>{data.systems.find((system) => system.id === topic.systemId)?.title}</p>
              <h3>{topic.title}</h3>
              <strong>{topic.question}</strong>
              <button onClick={() => onNavigate("topics")} type="button">查看专题研究</button>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="research-system-title" className="research-system-section">
        <header>
          <p>RESEARCH SYSTEMS</p>
          <h2 id="research-system-title">三大研究体系</h2>
        </header>
        <div className="research-system-grid">
          {data.systems.map((system) => (
            <article key={system.id}>
              <p>{system.number}</p>
              <h3>{system.title}</h3>
              <strong>{system.summary}</strong>
              <ul>{system.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="china-entry-title" className="china-entry-section">
        <header>
          <p>CHINA MACRO PULSE</p>
          <h2 id="china-entry-title">中国宏观脉搏</h2>
        </header>
        <div>
          <article>
            <span>国内周报 · {weeklyReport.publishedAt}</span>
            <h3>{weeklyReport.title}</h3>
            <p>{weeklyReport.overview}</p>
          </article>
          <article>
            <span>国内月报 · 页面更新 {monthlyReport.updatedAt}</span>
            <h3>{monthlyReport.title}</h3>
            <p>{monthlyReport.overview}</p>
            <button onClick={() => onNavigate("china", "monthly")} type="button">查看最新月报</button>
          </article>
        </div>
        <button onClick={() => onNavigate("china")} type="button">进入中国宏观脉搏</button>
      </section>
    </section>
  );
}
