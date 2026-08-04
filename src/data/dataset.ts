import type { MacroDataset } from "../domain/types";
import { metricDefinitions } from "./metricDefinitions";
import { narratives } from "./narratives";
import { observations } from "./observations";
import { policyEvents } from "./policyEvents";
import { reports } from "./reports";
import { risks } from "./risks";

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value) as T;
}

export const macroDataset: MacroDataset = deepFreeze({
  reports,
  metricDefinitions,
  observations,
  narratives,
  policyEvents,
  risks,
});
