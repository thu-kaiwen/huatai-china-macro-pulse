import { metricDefinitions } from "../data/metricDefinitions";
import { observations } from "../data/observations";
import { BrandLockup } from "./BrandLockup";
import { SourceBadge } from "./SourceBadge";
import { SectionErrorBoundary } from "./SectionErrorBoundary";
import { ThemeToggle } from "./ThemeToggle";
import { TickerTape } from "./TickerTape";

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  visibleSectionIds: readonly string[];
}

const navigationItems = [
  { id: "overview", label: "总览" },
  { id: "monthly", label: "月度" },
  { id: "weekly", label: "周度" },
  { id: "markets", label: "价格·金融" },
  { id: "industry", label: "行业" },
  { id: "policy", label: "政策" },
  { id: "outlook", label: "展望" },
  { id: "sources", label: "来源" },
];

export function Header({ activeSection, onNavigate, visibleSectionIds }: HeaderProps) {
  return (
    <header className="terminal-header">
      <div className="command-bar">
        <BrandLockup />
        <nav aria-label="章节导航">
          {navigationItems.filter((item) => visibleSectionIds.includes(item.id)).map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={() => onNavigate(item.id)}
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
      <SectionErrorBoundary sectionName="关键指标带">
        <TickerTape observations={observations} definitions={metricDefinitions} />
      </SectionErrorBoundary>
    </header>
  );
}
