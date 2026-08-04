import { describe, expect, it } from "vitest";
import type { MacroDataset, MetricDefinition, MetricObservation, Narrative } from "./types";
import { validateDataset } from "./validateDataset";
import {
  canShowCrossFrequencyTrend,
  canShowNativeTrend,
  selectCanonicalTrendObservations,
  selectLatestObservation,
  selectNarratives,
  selectObservations,
  selectReports,
} from "./selectors";
import * as selectors from "./selectors";

const weeklyBrentOlder: MetricObservation = {
  id: "obs-weekly-older",
  metricId: "brent",
  reportId: "weekly-1",
  periodEnd: "2026-07-19",
  frequency: "weekly",
  value: 88.4,
  comparisonType: "none",
  sourceText: "Brent averaged 88.4 dollars per barrel.",
  confidence: "verified",
};

const weeklyBrentLatest: MetricObservation = {
  ...weeklyBrentOlder,
  id: "obs-weekly-latest",
  reportId: "weekly-2",
  periodEnd: "2026-07-26",
  value: 90.12,
  sourceText: "Brent averaged 90.12 dollars per barrel.",
};

const monthlyBrent: MetricObservation = {
  ...weeklyBrentOlder,
  id: "obs-monthly",
  reportId: "monthly-1",
  periodEnd: "2026-06-30",
  frequency: "monthly",
  value: 89.2,
  comparisonType: "none",
  sourceText: "Brent averaged 89.2 dollars per barrel in June.",
};

const reports = [
  {
    id: "monthly-1",
    frequency: "monthly" as const,
    title: "June macro pulse",
    publishedAt: "2026-07-01",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    sourceUrl: "https://example.com/monthly-1",
    authors: ["Research Team"],
    summary: "Monthly summary.",
  },
  {
    id: "weekly-1",
    frequency: "weekly" as const,
    title: "Week 29 macro pulse",
    publishedAt: "2026-07-20",
    periodStart: "2026-07-13",
    periodEnd: "2026-07-19",
    sourceUrl: "https://example.com/weekly-1",
    authors: ["Research Team"],
    summary: "Weekly summary.",
  },
  {
    id: "weekly-2",
    frequency: "weekly" as const,
    title: "Week 30 macro pulse",
    publishedAt: "2026-07-27",
    periodStart: "2026-07-20",
    periodEnd: "2026-07-26",
    sourceUrl: "https://example.com/weekly-2",
    authors: ["Research Team"],
    summary: "Weekly summary.",
  },
];

const narratives: Narrative[] = [
  {
    id: "monthly-demand",
    reportId: "monthly-1",
    topic: "domestic-demand",
    title: "Monthly demand",
    summary: "Monthly demand summary.",
    signal: "watch",
  },
  {
    id: "weekly-policy",
    reportId: "weekly-2",
    topic: "policy",
    title: "Weekly policy",
    summary: "Weekly policy summary.",
    signal: "improving",
  },
];

const validDataset: MacroDataset = {
  reports,
  metricDefinitions: [
    {
      id: "brent",
      name: "Brent crude oil",
      category: "prices",
      unit: "USD/barrel",
      nativeFrequency: "mixed",
      directionMeaning: "neutral",
      methodology: "Period average from the cited report.",
    },
  ],
  observations: [weeklyBrentLatest, monthlyBrent, weeklyBrentOlder],
  narratives,
  policyEvents: [],
  risks: [],
};

const brentDefinition: MetricDefinition = validDataset.metricDefinitions[0];

const danglingDataset: MacroDataset = {
  ...validDataset,
  observations: [
    ...validDataset.observations,
    {
      ...weeklyBrentLatest,
      id: "obs-missing",
      metricId: "missing",
    },
  ],
};

describe("macro data domain", () => {
  it("accepts a complete dataset and identifies dangling metric observations", () => {
    expect(validateDataset(validDataset)).toEqual([]);
    expect(validateDataset(danglingDataset)).toContain(
      "Observation obs-missing references unknown metric missing",
    );
  });

  it("sorts filtered observations and excludes partial records when requested", () => {
    const partialObservation: MetricObservation = {
      ...weeklyBrentOlder,
      id: "obs-partial",
      periodEnd: "2026-07-22",
      confidence: "partial",
    };
    const result = selectObservations(
      { ...validDataset, observations: [weeklyBrentLatest, partialObservation, weeklyBrentOlder] },
      { view: "weekly", metricIds: ["brent"], verifiedOnly: true },
    );

    expect(result.map((observation) => observation.id)).toEqual([
      "obs-weekly-older",
      "obs-weekly-latest",
    ]);
  });

  it("requires two verified observations at the requested native frequency", () => {
    expect(canShowNativeTrend([weeklyBrentOlder, weeklyBrentLatest], "weekly")).toBe(true);
    expect(canShowNativeTrend([monthlyBrent], "monthly")).toBe(false);
  });

  it("counts unique period ends within one metric, frequency, and comparison type for native trends", () => {
    expect(canShowNativeTrend([
      weeklyBrentOlder,
      { ...weeklyBrentLatest, periodEnd: weeklyBrentOlder.periodEnd },
    ], "weekly")).toBe(false);
    expect(canShowNativeTrend([
      weeklyBrentOlder,
      { ...weeklyBrentLatest, metricId: "other" },
    ], "weekly")).toBe(false);
    expect(canShowNativeTrend([
      weeklyBrentOlder,
      { ...weeklyBrentLatest, comparisonType: "wow" },
    ], "weekly")).toBe(false);
    expect(canShowNativeTrend([
      weeklyBrentOlder,
      weeklyBrentLatest,
      { ...weeklyBrentLatest, id: "obs-weekly-third", periodEnd: "2026-08-02", comparisonType: "wow" },
    ], "weekly")).toBe(false);
  });

  it("requires two weekly and one monthly verified observation for the same metric", () => {
    expect(canShowCrossFrequencyTrend([weeklyBrentOlder, weeklyBrentLatest, monthlyBrent], brentDefinition)).toBe(true);
    expect(canShowCrossFrequencyTrend([weeklyBrentOlder, weeklyBrentLatest, { ...monthlyBrent, metricId: "other" }], brentDefinition)).toBe(false);
  });

  it("does not combine cross-frequency observations with different comparison types", () => {
    expect(
      canShowCrossFrequencyTrend([
        { ...weeklyBrentOlder, comparisonType: "wow" },
        { ...weeklyBrentLatest, comparisonType: "wow" },
        { ...monthlyBrent, comparisonType: "mom" },
      ], brentDefinition),
    ).toBe(false);
  });

  it("rejects duplicate weekly dates and incompatible cross-frequency definitions", () => {
    const duplicateDate = { ...weeklyBrentLatest, periodEnd: weeklyBrentOlder.periodEnd };
    expect(canShowCrossFrequencyTrend([weeklyBrentOlder, duplicateDate, monthlyBrent], brentDefinition)).toBe(false);
    expect(canShowCrossFrequencyTrend(
      [weeklyBrentOlder, weeklyBrentLatest, monthlyBrent],
      { ...brentDefinition, nativeFrequency: "weekly" },
    )).toBe(false);
    expect(canShowCrossFrequencyTrend(
      [weeklyBrentOlder, weeklyBrentLatest, monthlyBrent],
      { ...brentDefinition, unit: "" },
    )).toBe(false);
    expect(canShowCrossFrequencyTrend([
      weeklyBrentOlder,
      weeklyBrentLatest,
      monthlyBrent,
      { ...weeklyBrentLatest, id: "obs-weekly-wow", comparisonType: "wow" },
    ], brentDefinition)).toBe(false);
  });

  it("selects the latest observation visible in the chosen view", () => {
    expect(selectLatestObservation(validDataset, "brent", "combined")?.value).toBe(90.12);
  });

  it("selects reports and their narratives for the chosen view", () => {
    expect(selectReports(validDataset, "weekly").map((report) => report.id)).toEqual([
      "weekly-2",
      "weekly-1",
    ]);
    expect(selectNarratives(validDataset, "weekly").map((narrative) => narrative.id)).toEqual([
      "weekly-policy",
    ]);
  });

  it("selects only the newest report and narrative for each frequency and topic", () => {
    const futureWeeklyReport = {
      ...reports[2],
      id: "weekly-3",
      publishedAt: "2026-08-03",
      periodStart: "2026-07-27",
      periodEnd: "2026-08-02",
      title: "Week 31 macro pulse",
    };
    const dataset: MacroDataset = {
      ...validDataset,
      reports: [...reports, futureWeeklyReport],
      narratives: [
        ...narratives,
        {
          ...narratives[1],
          id: "weekly-policy-new",
          reportId: futureWeeklyReport.id,
          title: "Newest weekly policy",
        },
      ],
    };
    const currentSelectors = selectors as typeof selectors & {
      selectLatestReports?: typeof selectReports;
      selectLatestNarratives?: typeof selectNarratives;
    };

    expect(currentSelectors.selectLatestReports?.(dataset, "weekly").map((report) => report.id)).toEqual([
      "weekly-3",
    ]);
    expect(
      currentSelectors.selectLatestNarratives?.(dataset, "weekly").map((narrative) => narrative.id),
    ).toEqual(["weekly-policy-new"]);
  });

  it("selects one newest verified observation per metric and frequency", () => {
    const futureWeeklyReport = {
      ...reports[2],
      id: "weekly-3",
      publishedAt: "2026-08-03",
      periodStart: "2026-07-27",
      periodEnd: "2026-08-02",
      title: "Week 31 macro pulse",
    };
    const newestWeeklyBrent: MetricObservation = {
      ...weeklyBrentLatest,
      id: "obs-weekly-newest",
      reportId: futureWeeklyReport.id,
      periodEnd: "2026-08-02",
      value: 91.23,
    };
    const partialLaterBrent: MetricObservation = {
      ...newestWeeklyBrent,
      id: "obs-weekly-partial",
      periodEnd: "2026-08-03",
      confidence: "partial",
      value: 99,
    };
    const dataset: MacroDataset = {
      ...validDataset,
      reports: [...reports, futureWeeklyReport],
      observations: [
        weeklyBrentOlder,
        weeklyBrentLatest,
        monthlyBrent,
        newestWeeklyBrent,
        partialLaterBrent,
      ],
    };
    const currentSelectors = selectors as typeof selectors & {
      selectLatestObservations?: (
        dataset: MacroDataset,
        filter: Parameters<typeof selectObservations>[1],
      ) => MetricObservation[];
    };

    expect(
      currentSelectors
        .selectLatestObservations?.(dataset, { view: "combined", verifiedOnly: true })
        .map((observation) => observation.id),
    ).toEqual(["obs-monthly", "obs-weekly-newest"]);
  });

  it("canonicalizes same-period trend revisions by report publication recency", () => {
    const revisedReport = {
      ...reports[2],
      id: "weekly-2-revision",
      publishedAt: "2026-07-28",
      title: "Week 30 macro pulse revision",
    };
    const oldRevision: MetricObservation = {
      ...weeklyBrentLatest,
      id: "obs-weekly-old-revision",
      value: 90.01,
      sourceText: "The first release reported 90.01 dollars per barrel.",
    };
    const newRevision: MetricObservation = {
      ...weeklyBrentLatest,
      id: "obs-weekly-new-revision",
      reportId: revisedReport.id,
      value: 90.22,
      sourceText: "The revised release reported 90.22 dollars per barrel.",
    };
    const dataset: MacroDataset = {
      ...validDataset,
      reports: [...reports, revisedReport],
      observations: [weeklyBrentOlder, oldRevision, newRevision],
    };
    expect(
      selectCanonicalTrendObservations(dataset, { view: "weekly", verifiedOnly: true })
        .map((observation) => observation.id),
    ).toEqual(["obs-weekly-older", "obs-weekly-new-revision"]);
  });

  it("reports duplicate IDs, unknown reports, non-finite values, empty excerpts, and frequency mismatches", () => {
    const invalidDataset: MacroDataset = {
      ...validDataset,
      observations: [
        weeklyBrentOlder,
        { ...weeklyBrentOlder, reportId: "unknown-report" },
        {
          ...weeklyBrentLatest,
          id: "obs-invalid",
          frequency: "monthly",
          value: Number.NaN,
          sourceText: "",
        },
      ],
    };

    expect(validateDataset(invalidDataset)).toEqual(
      expect.arrayContaining([
        "Duplicate observation ID obs-weekly-older",
        "Observation obs-weekly-older references unknown report unknown-report",
        "Observation obs-invalid has a non-finite value",
        "Observation obs-invalid has an empty source excerpt",
        "Observation obs-invalid frequency monthly does not match report weekly",
      ]),
    );
  });
});
