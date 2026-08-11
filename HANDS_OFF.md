# Agent Handoff Contract

> Audience: Codex, Claude Code, and comparable coding agents.

## FIRST: Required Reading Order

Before making a product or data change, read this contract, then inspect `package.json`, `src/domain/types.ts`, `src/domain/validateDataset.ts`, and `src/domain/selectors.ts`. Next, read every relevant file in `src/data/`, the existing tests, `.github/workflows/pages.yml`, `vite.config.ts`, and `playwright.config.ts`. After Task 3, also read `WINDOWS_DEVELOPMENT.md` when it exists. Treat checked-in code, tests, and deployment configuration as the current approved implementation unless the task explicitly changes them.

When a new report is supplied as a link or pasted content, the active coding-agent session MUST parse and check it during development. This work MUST NOT be delegated to browser/runtime tooling or a separate website parser. Preserve the evidence used for every record before changing the static dataset.

Native Windows with PowerShell is the primary development workflow; WSL is optional.

## Product Goal and Current State

This React site presents a trustworthy, static macro-research pulse from approved weekly and monthly reports. The shipped site consumes normalized static data. It MUST NOT scrape WeChat, fetch report content, or parse reports at runtime.

The current dataset contains one weekly report ending 2026-08-02 and one monthly report ending 2026-07-31. It is a baseline for accumulating the same metrics across future reports, not a claim that all metrics already have trend-ready history.

## Non-Negotiable Product Boundaries

- Only verified observations may reach charts, ticker items, or metric cards. Do not display partial, inferred, or unverified values as product data.
- Keep report-specific facts in normalized data. Components MUST NOT be edited to hard-code a report, metric value, date, or narrative.
- The active coding-agent session MUST perform report parsing and source checking during development; it MUST NOT use browser/runtime tooling or a separate website parser, and it MUST NOT add a runtime ingestion path.
- Preserve the domain types, dataset validation, and selector rules as the contract between data and UI. Update their tests when intentionally changing that contract.

## Repository Map

| Location | Responsibility |
| --- | --- |
| `src/domain/types.ts` | Domain types for reports, metric definitions, observations, narratives, policy events, risks, and frequency/comparison semantics. |
| `src/domain/validateDataset.ts` | Dataset integrity checks, including IDs, references, finite numeric values, source excerpts, and report-frequency consistency. |
| `src/domain/selectors.ts` | Read-model selection, verified-only filtering, and native/cross-frequency trend eligibility. |
| `src/data/reports.ts` | Report metadata and source provenance. |
| `src/data/metricDefinitions.ts` | Metric identity, unit, native frequency, direction meaning, and methodology. |
| `src/data/observations.ts` | Numeric observations, report link, period end, frequency, comparison, source excerpt, and confidence. |
| `src/data/narratives.ts` | Qualitative narrative records. |
| `src/data/policyEvents.ts` | Qualitative policy and event records. |
| `src/data/risks.ts` | Qualitative risk and watch records. |
| `.github/workflows/pages.yml` | GitHub Pages build and deployment workflow. |
| `vite.config.ts` | Vite base-path and hosting-plugin configuration. |
| `playwright.config.ts` | End-to-end test projects and local test server. |

## Data Trust and Provenance Contract

Each incoming report must be represented once in `src/data/reports.ts`; include its title, publication date, covered period, source URL, and summary. No personal identity values belong in handoff documents. Keep provenance guidance limited to report ID, source URL, publication and statistical periods, and approved source text as applicable. Put metric identity and methodology in `src/data/metricDefinitions.ts`. Put each numeric record in `src/data/observations.ts`, with its report ID, `periodEnd`, frequency, comparison semantics, source text, and confidence. Put qualitative records in the matching narrative/event/risk files: `src/data/narratives.ts`, `src/data/policyEvents.ts`, or `src/data/risks.ts`.

Verified means the agent can directly support the value, period, and comparison from the provided report material. A source excerpt is required for an observation; use `sourceValueText` and period labeling when the report presentation makes those details material. Do not convert an assumption into a verified record merely to fill a chart or card.

## Future Report Ingestion Procedure

1. Obtain the report link or pasted content, then the active coding-agent session MUST parse and check it during development against the source material, not in browser/runtime tooling or a separate website parser.
2. Add the report metadata to `src/data/reports.ts` and identify whether each candidate metric matches an existing metric definition or needs a new, documented definition.
3. Add directly supported numeric records to `src/data/observations.ts`; add only matching qualitative content to the appropriate narrative, policy-event, or risk file.
4. Mark a record `verified` only after validating its value, `periodEnd`, frequency, unit, methodology, and comparison semantics. Leave uncertain material out of product surfaces until verified.
5. Run dataset and selector tests, inspect the affected UI behavior, and run `npm run verify` before completion.

## Trend Eligibility Rules

Weekly or monthly trends require two distinct verified `periodEnd` values for one metric, with compatible frequency and comparison semantics. The native selector additionally requires a single compatible metric/frequency/comparison series; do not combine unlike comparison types.

Cross-frequency trends require two distinct verified weekly periods and one verified monthly period for the same metric, `nativeFrequency: "mixed"`, and compatible unit, methodology, and comparison semantics. Do not treat a mixed collection of values as a trend just because the labels are similar.

## Validation and Definition of Done

Run focused tests whenever data, validation, selector, or display behavior changes. Verify that every observation references an existing report and metric definition; that numeric fields are finite; that source excerpts are non-empty; and that observation frequency matches its report frequency.

`npm run verify` is the completion gate. It runs linting, type checking, unit tests, production build, and end-to-end tests. A task is not done until this command succeeds, except when a documented environmental failure prevents it and the agent has reported the exact evidence.

## Deployment Boundaries

GitHub Pages derives the Vite base path from the repository name through `PAGES_REPOSITORY_NAME` in the Pages workflow. Preserve that repository-name context when changing deployment-related configuration.

Codex Sites retains its opaque linkage through the existing hosting configuration. Do not expose that linkage in documentation, UI, data, or environment examples.

## Known Data Debt

Twenty market observations anchored to `2026-08-02` remain date-audit debt until original chart axes or notes are verified. Four second-hand-housing observations anchored to `2026-07-26` also remain date-audit debt until their original chart axes or notes are verified. Keep these uncertainties visible to maintainers and do not extrapolate them into unsupported period claims.

## Prioritized Next Work

1. Add verified report histories so the same metric's evolution can be shown as weekly and monthly reports accumulate.
2. Resolve the known date-audit debt from original chart axes or notes before relying on those anchors for expanded trend analysis.
3. Extend coverage only when report parsing yields directly supported, normalized, and validated records.

## Stop and Ask Conditions

Stop and ask for direction before proceeding when source material is inaccessible or ambiguous, a value lacks a verifiable period or comparison basis, a proposed metric changes unit or methodology incompatibly, a product request would require runtime scraping or report parsing, or a deployment change would expose Codex Sites linkage. Also ask before bypassing `npm run verify`, changing the data model, or treating partial evidence as verified.
