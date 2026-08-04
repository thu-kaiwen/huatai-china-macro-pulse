import type { MacroDataset } from "./types";

interface IdentifiedRecord {
  id: string;
}

function validateDuplicateIds(
  records: IdentifiedRecord[],
  recordName: string,
  errors: string[],
): void {
  const seenIds = new Set<string>();

  for (const record of records) {
    if (seenIds.has(record.id)) {
      errors.push(`Duplicate ${recordName} ID ${record.id}`);
    }
    seenIds.add(record.id);
  }
}

function validateReportReference(
  recordName: string,
  id: string,
  reportId: string,
  reportIds: Set<string>,
  errors: string[],
): void {
  if (!reportIds.has(reportId)) {
    errors.push(`${recordName} ${id} references unknown report ${reportId}`);
  }
}

export function validateDataset(dataset: MacroDataset): string[] {
  const errors: string[] = [];
  const reportIds = new Set(dataset.reports.map((report) => report.id));
  const metricIds = new Set(dataset.metricDefinitions.map((metric) => metric.id));
  const reportsById = new Map(dataset.reports.map((report) => [report.id, report]));

  validateDuplicateIds(dataset.reports, "report", errors);
  validateDuplicateIds(dataset.metricDefinitions, "metric definition", errors);
  validateDuplicateIds(dataset.observations, "observation", errors);
  validateDuplicateIds(dataset.narratives, "narrative", errors);
  validateDuplicateIds(dataset.policyEvents, "policy event", errors);
  validateDuplicateIds(dataset.risks, "risk", errors);

  for (const observation of dataset.observations) {
    validateReportReference("Observation", observation.id, observation.reportId, reportIds, errors);

    if (!metricIds.has(observation.metricId)) {
      errors.push(`Observation ${observation.id} references unknown metric ${observation.metricId}`);
    }

    for (const [fieldName, value] of [
      ["value", observation.value],
      ["previousValue", observation.previousValue],
      ["change", observation.change],
    ] as const) {
      if (value !== undefined && !Number.isFinite(value)) {
        errors.push(`Observation ${observation.id} has a non-finite ${fieldName}`);
      }
    }

    if (observation.sourceText.trim().length === 0) {
      errors.push(`Observation ${observation.id} has an empty source excerpt`);
    }

    const report = reportsById.get(observation.reportId);
    if (report !== undefined && observation.frequency !== report.frequency) {
      errors.push(
        `Observation ${observation.id} frequency ${observation.frequency} does not match report ${report.frequency}`,
      );
    }
  }

  for (const narrative of dataset.narratives) {
    validateReportReference("Narrative", narrative.id, narrative.reportId, reportIds, errors);
  }
  for (const policyEvent of dataset.policyEvents) {
    validateReportReference("Policy event", policyEvent.id, policyEvent.reportId, reportIds, errors);
  }
  for (const risk of dataset.risks) {
    validateReportReference("Risk", risk.id, risk.reportId, reportIds, errors);
  }

  return errors;
}
