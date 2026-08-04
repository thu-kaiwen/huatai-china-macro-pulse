import { describe, expect, it } from "vitest";
import type { MacroDataset, MetricObservation } from "./types";
import { validateDataset } from "./validateDataset";
import {
  canShowCrossFrequencyTrend,
  canShowNativeTrend,
  selectLatestObservation,
  selectObservations,
} from "./selectors";

const weeklyBrentOlder: MetricObservation = {
  id: "obs-weekly-older",
  metricId: "brent",
  reportId: "weekly-1",
  periodEnd: "2026-07-19",
  frequency: "weekly",
  value: 88.4,
  comparisonType: "previous-week",
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
  comparisonType: "mom",
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
  narratives: [],
  policyEvents: [],
  risks: [],
};

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

  it("requires two weekly and one monthly verified observation for the same metric", () => {
    expect(canShowCrossFrequencyTrend([weeklyBrentOlder, weeklyBrentLatest, monthlyBrent])).toBe(true);
    expect(canShowCrossFrequencyTrend([weeklyBrentOlder, weeklyBrentLatest, { ...monthlyBrent, metricId: "other" }])).toBe(false);
  });

  it("selects the latest observation visible in the chosen view", () => {
    expect(selectLatestObservation(validDataset, "brent", "combined")?.value).toBe(90.12);
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
