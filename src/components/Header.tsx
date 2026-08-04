import { metricDefinitions } from "../data/metricDefinitions";
import { observations } from "../data/observations";
import { BrandLockup } from "./BrandLockup";
import { SourceBadge } from "./SourceBadge";
import { ThemeToggle } from "./ThemeToggle";
import { TickerTape } from "./TickerTape";

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navigationItems = [
  { id: "overview", label: "总览" },
  { id: "monthly", label: "月度" },
  { id: "weekly", label: "周度" },
  { id: "markets", label: "市场" },
  { id: "industry", label: "行业" },
  { id: "policy", label: "政策" },
  { id: "outlook", label: "展望" },
  { id: "sources", label: "来源" },
];

export function Header({ activeSection, onNavigate }: HeaderProps) {
  return (
    <header className="terminal-header">
      <div className="command-bar">
        <BrandLockup />
        <nav aria-label="章节导航">
          {navigationItems.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              aria-current={activeSection === item.id ? "page" : undefined}
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
      <TickerTape observations={observations} definitions={metricDefinitions} />
    </header>
  );
}
