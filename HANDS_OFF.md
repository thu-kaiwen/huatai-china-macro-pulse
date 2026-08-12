# Agent Handoff Contract

> Audience: Codex, Claude Code, and comparable coding agents.

## FIRST: Required Reading Order

Before making a product or data change, read in this order:

1. `HANDS_OFF.md`;
2. `SESSION_SAMMARY.md`;
3. `WINDOWS_DEVELOPMENT.md` when operating on Windows;
4. `README.md` for the promised user workflow;
5. relevant files under `docs/superpowers/specs/` and `docs/superpowers/plans/` when historical implementation detail is needed.

After completing that reading order, inspect the current code, tests, data, and deployment configuration before editing. Treat checked-in code, tests, data, and deployment configuration as the current approved implementation unless the task explicitly changes them.

When a new report is supplied as a link or pasted content, the active coding-agent development session MUST retrieve, parse, and check it against the approved source. Approved coding-agent tools, including browser or extraction tools, MAY retrieve and analyze a user-supplied approved source during that session. Preserve the evidence used for every record and write only reviewed normalized static data. The shipped React/browser application and its runtime MUST NOT retrieve, scrape, ingest, or parse reports.

Native Windows with PowerShell is the primary development workflow; WSL is optional.

## Product Goal and Current State

This React site presents a trustworthy, static macro-research pulse from approved weekly and monthly reports. The shipped site consumes normalized static data. It MUST NOT scrape WeChat, fetch report content, or parse reports at runtime.

The current dataset contains one weekly report ending 2026-08-02 and one monthly report ending 2026-07-31. It is a baseline for accumulating the same metrics across future reports, not a claim that all metrics already have trend-ready history.

## Non-Negotiable Product Boundaries

- Only verified observations may reach charts, ticker items, or metric cards. Do not display partial, inferred, or unverified values as product data.
- Keep report-specific facts in normalized data. Components MUST NOT be edited to hard-code a report, metric value, date, or narrative.
- The active coding-agent development session MUST perform report retrieval, parsing, and source checking. It MAY use approved coding-agent browser or extraction tools for a user-supplied approved source, but it MUST preserve evidence and write only reviewed normalized static data. The shipped React/browser application and its runtime MUST NOT retrieve, scrape, ingest, or parse reports, and no runtime ingestion path may be added.
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
| `vite.config.ts` | Vite root-base and hosting-plugin configuration. Its current `resolvePagesBase("")` call deliberately produces `/`. |
| `build/pages-base.ts` | Legacy repository-subpath resolver retained with tests; it is not currently fed the Pages repository name by Vite. |
| `playwright.config.ts` | End-to-end test projects and local test server. |

## Data Trust and Provenance Contract

Each incoming report must be represented once in `src/data/reports.ts`; include its title, publication date, covered period, source URL, and summary. No personal identity values belong in handoff documents. Keep provenance guidance limited to report ID, source URL, publication and statistical periods, and approved source text as applicable. Put metric identity and methodology in `src/data/metricDefinitions.ts`. Put each numeric record in `src/data/observations.ts`, with its report ID, `periodEnd`, frequency, comparison semantics, source text, and confidence. Put qualitative records in the matching narrative/event/risk files: `src/data/narratives.ts`, `src/data/policyEvents.ts`, or `src/data/risks.ts`.

For every new numeric observation, `verified` requires direct source support for the numeric value, comparison, frequency, unit, methodology, and period. A source excerpt is required for an observation; use `sourceValueText` and period labeling when the report presentation makes those details material. Do not convert an assumption into a verified record merely to fill a chart or card.

The current dataset has a documented legacy exception. The numeric values and comparisons of 20 market observations and four second-hand-housing observations are source-verified for the current point-in-time display, but their stored `periodEnd` anchors (`2026-08-02` and `2026-07-26`, respectively) are provisional pending an audit of the original chart axes or notes. These 24 records MUST NOT support new trend claims. Before future history makes any affected metric series trend-eligible, audit and correct its anchors or revise record eligibility and confidence consistently with the schema.

Qualitative admission is separate from numeric verification. Narratives, policy events, and risks require direct source support, a report link, and accurate contextual labeling. They are not numeric verified observations and MUST NOT be rewritten as quantified facts.

## Future Report Ingestion Procedure

1. Obtain the report link or pasted content. During the active coding-agent development session, approved coding-agent tools, including browser or extraction tools, MAY retrieve and analyze that user-supplied approved source. Preserve the retrieval and analysis evidence; the shipped React/browser application and its runtime MUST NOT retrieve, scrape, ingest, or parse the report.
2. Add the report metadata to `src/data/reports.ts` and identify whether each candidate metric matches an existing metric definition or needs a new, documented definition.
3. Add only reviewed, directly supported numeric records to `src/data/observations.ts`; add only reviewed qualitative content with direct source support, report linkage, and accurate contextual labels to the appropriate narrative, policy-event, or risk file.
4. Mark a new numeric record `verified` only after validating its value, `periodEnd`, frequency, unit, methodology, and comparison semantics. Do not rewrite qualitative content as quantified facts. Leave uncertain material out of product surfaces until verified.
5. Run dataset and selector tests, inspect the affected UI behavior, and run `npm run verify` before completion.

## Trend Eligibility Rules

Weekly or monthly trends require two distinct verified `periodEnd` values for one metric, with compatible frequency and comparison semantics. The native selector additionally requires a single compatible metric/frequency/comparison series; do not combine unlike comparison types.

Cross-frequency trends require two distinct verified weekly periods and one verified monthly period for the same metric, `nativeFrequency: "mixed"`, and compatible unit, methodology, and comparison semantics. Do not treat a mixed collection of values as a trend just because the labels are similar.

## Validation and Definition of Done

Run focused tests whenever data, validation, selector, or display behavior changes. Verify that every observation references an existing report and metric definition; that numeric fields are finite; that source excerpts are non-empty; and that observation frequency matches its report frequency.

`npm run verify` is the completion gate. It runs linting, type checking, unit tests, production build, and end-to-end tests. A task is not done until this command succeeds, except when a documented environmental failure prevents it and the agent has reported the exact evidence.

## Deployment Boundaries

The current Vite build deliberately uses the root base `/` through `resolvePagesBase("")`. This matches the currently configured GitHub Pages custom-domain deployment, whose generated asset URLs are rooted at `/assets/...`. The Pages workflow still exports `PAGES_REPOSITORY_NAME`, but `vite.config.ts` does not currently consume it; do not describe that variable as controlling the active build.

The repository-name resolver and its tests remain in `build/pages-base.ts` and `build/pages-base.test.ts` as legacy support for a repository-subpath deployment. A future transfer, custom-domain removal, or move back to the default `/<repository-name>/` Pages URL requires a coordinated change to the Pages setting, Vite base configuration, local preview instructions, and deployment tests. Do not change only one of those layers.

As last checked on 2026-08-12, the Pages workflow for the then-current `main` completed successfully and the public project Pages endpoint redirected to the configured custom domain. Treat this as time-sensitive operational evidence: inspect the repository's current remote, Actions run, Deployments entry, Pages settings, and published asset URLs before any later deployment claim. Keep account-specific paths and the custom-domain hostname out of agent-facing handoff documents.

Codex Sites retains its opaque linkage through the existing hosting configuration. Do not expose that linkage in documentation, UI, data, or environment examples.

## Known Data Debt

The numeric values and comparisons of 20 market observations and four second-hand-housing observations are source-verified for the current point-in-time display. Their stored `periodEnd` anchors—`2026-08-02` for the market observations and `2026-07-26` for the second-hand-housing observations—remain provisional until the original chart axes or notes are audited. These 24 records MUST NOT support new trend claims. Before future history makes an affected series trend-eligible, audit and correct the anchors or revise record eligibility and confidence consistently with the schema.

## Prioritized Next Work

1. Add verified report histories so the same metric's evolution can be shown as weekly and monthly reports accumulate.
2. Resolve the known date-audit debt from original chart axes or notes before relying on those anchors for expanded trend analysis.
3. Extend coverage only when report parsing yields directly supported, normalized, and validated records.

## Stop and Ask Conditions

Stop and ask for direction before proceeding when source material is inaccessible or ambiguous, a value lacks a verifiable period or comparison basis, a proposed metric changes unit or methodology incompatibly, a product request would require runtime scraping or report parsing, or a deployment change would expose Codex Sites linkage. Also ask before bypassing `npm run verify`, changing the data model, treating partial evidence as verified, removing or changing the Pages custom domain, or switching between root and repository-subpath deployment without an approved migration plan.
