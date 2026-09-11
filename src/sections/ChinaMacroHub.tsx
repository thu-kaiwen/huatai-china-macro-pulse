import { useState } from "react";
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
}

export function ChinaMacroHub({ weeklyReport, monthlyReport }: ChinaMacroHubProps) {
  const [frequency, setFrequency] = useState<Frequency>("weekly");

  return (
    <section className="china-macro-hub" id="china-macro">
      <ViewFilter onChange={setFrequency} value={frequency} />
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
