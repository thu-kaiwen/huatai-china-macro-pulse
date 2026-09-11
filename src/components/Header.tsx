import { macroDataset } from "../data/dataset";
import { BrandLockup } from "./BrandLockup";
import { SourceBadge } from "./SourceBadge";
import { SectionErrorBoundary } from "./SectionErrorBoundary";
import { ThemeToggle } from "./ThemeToggle";
import { TickerTape } from "./TickerTape";
import type { PrimaryView } from "../domain/researchAtlas";

interface HeaderProps {
  activeView: PrimaryView;
  onNavigate: (view: PrimaryView) => void;
  TickerComponent?: typeof TickerTape;
}

const navigationItems: Array<{ id: PrimaryView; label: string }> = [
  { id: "home", label: "首页" },
  { id: "china", label: "中国基本面脉搏" },
  { id: "global", label: "海外经济变化" },
  { id: "topics", label: "主题研究" },
];

const navigationHrefs: Record<PrimaryView, string> = {
  home: "#research-home",
  global: "#global-research",
  china: "#china-macro",
  topics: "#topic-research",
};

export function Header({
  activeView,
  onNavigate,
  TickerComponent = TickerTape,
}: HeaderProps) {
  return (
    <header className="terminal-header">
      <div className="command-bar">
        <BrandLockup onNavigate={() => onNavigate("home")} />
        <nav aria-label="章节导航">
          {navigationItems.map((item) => (
            <a
              href={navigationHrefs[item.id]}
              key={item.id}
              aria-current={activeView === item.id ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-utilities">
          <SourceBadge />
          <ThemeToggle />
        </div>
      </div>
      <SectionErrorBoundary sectionId="ticker" sectionName="关键指标带">
        <TickerComponent dataset={macroDataset} />
      </SectionErrorBoundary>
    </header>
  );
}
