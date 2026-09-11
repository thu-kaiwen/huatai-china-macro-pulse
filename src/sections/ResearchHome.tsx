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
        <strong>以全球视野和原创框架，持续跟踪中国基本面、海外经济与重要宏观主题。</strong>
      </header>
      <ResearchTransmissionMap layers={data.layers} onNavigate={onNavigate} title="" />
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
              <button onClick={() => onNavigate(focus.targetView)} type="button">
                {focus.targetView === "china" ? "进入中国基本面脉搏" : focus.targetView === "global" ? "查看海外经济变化" : "查看主题研究"}
              </button>
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
              <button onClick={() => onNavigate("topics")} type="button">查看主题研究</button>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="china-entry-title" className="china-entry-section">
        <header>
          <p>CHINA MACRO PULSE</p>
          <h2 id="china-entry-title">中国基本面脉搏</h2>
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
        <button onClick={() => onNavigate("china")} type="button">进入中国基本面脉搏</button>
      </section>
    </section>
  );
}
