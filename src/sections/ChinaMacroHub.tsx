import { ViewFilter } from "../components/ViewFilter";
import { SectionErrorBoundary } from "../components/SectionErrorBoundary";
import type { MonthlyReportPage } from "../data/monthlyReport";
import type { Frequency } from "../domain/types";
import type { WeeklyReportPage } from "../domain/weeklyReport";
import { MonthlyReport } from "./MonthlyReport";
import { WeeklyReport } from "./WeeklyReport";

interface ChinaMacroHubProps {
  weeklyReport: WeeklyReportPage;
  monthlyReport: MonthlyReportPage;
  frequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
}

export function ChinaMacroHub({ weeklyReport, monthlyReport, frequency, onFrequencyChange }: ChinaMacroHubProps) {
  return (
    <section className="china-macro-hub" id="china-macro">
      <ViewFilter onChange={onFrequencyChange} value={frequency} />
      {frequency === "weekly" ? (
        <SectionErrorBoundary sectionId="weekly" sectionName="周报">
          <WeeklyReport report={weeklyReport} />
        </SectionErrorBoundary>
      ) : (
        <SectionErrorBoundary sectionId="monthly" sectionName="国内月报">
          <MonthlyReport report={monthlyReport} />
        </SectionErrorBoundary>
      )}
    </section>
  );
}
