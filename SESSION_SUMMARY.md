# Sanitized Session Summary

> Audience: coding agents. This is decision history, not a user guide or verbatim transcript.

## End State

The project is a static, source-traceable macro-research site with normalized checked-in data, tested domain rules, and two supported deployment paths. The current implementation and `HANDS_OFF.md` are the normative source for future work; this summary records why those boundaries were chosen.

## Phase 1: Requirement Correction

**Decision:** Correct report-session time parsing so publication, coverage, observation, and comparison periods are represented separately instead of treating a session or display time as the statistical period.

**Impact:** Data records must retain explicit period and comparison semantics, and unsupported date inferences must not reach product surfaces.

## Phase 2: Data and Branding Approval

**Decision:** Approve one weekly input and one monthly input as the initial dataset, and permit the Huatai brand treatment for an internal employee context.

**Impact:** The first release is intentionally limited to verified material from those approved inputs. The brand lockup is part of the approved presentation, while data remains traceable and subject to the product's research-disclaimer boundaries.

## Phase 3: Product and Data Architecture

**Decision:** Start with a single-page, static research terminal and evolve through accumulated weekly and monthly histories rather than manufacturing a trend from the initial inputs.

**Impact:** Reports, metric definitions, observations, narratives, policy events, and risks are normalized into dedicated static-data modules. Components render the resulting read models and must not hard-code report-specific facts. A native trend needs two compatible verified periods; a cross-frequency trend additionally needs two weekly periods and one compatible monthly period for a mixed-frequency metric.

## Phase 4: Validation and Deployment

**Decision:** Make direct source support the trust model: only verified observations with the required metadata and source excerpt are eligible for charts, ticker items, and metric cards. Use static hosting, retaining the existing Sites configuration before adding GitHub Pages.

**Impact:** Report parsing and checking stay in the active development session, never in the running site. Dataset validation and selectors enforce references, finite values, non-empty source excerpts, report-frequency consistency, and trend eligibility. The default local and Sites build base remains `/`.

## Phase 5: Transfer-Safe CI Hardening

**Decision:** Add GitHub Pages through a repository-name-derived base path and an official artifact deployment workflow, without embedding owner-specific configuration.

**Impact:** A normal ownership transfer does not require a source change when the repository name remains unchanged. CI validates, builds, uploads the static artifact, and deploys it with the required least-privilege permissions. The opaque Sites linkage remains unexposed.

## Known Debt

**Decision:** Preserve date-audit uncertainty from final review rather than presenting ambiguous anchors as certain.

**Impact:** Twenty market observations with an unverified `2026-08-02` anchor and four second-hand-housing observations with an unverified `2026-07-26` anchor require confirmation against original chart axes or notes before expanded trend analysis relies on them. Do not extrapolate from either set.

## Next Development Direction

Add report histories only after the active coding-agent session has parsed and checked supplied source material. Extend an existing metric only when unit, methodology, frequency, period, and comparison semantics remain compatible; otherwise define a distinct metric. Run the focused data and selector tests, inspect affected UI behavior, and complete `npm run verify` before handoff.

## Deliberately Omitted Information

Personal identities, account handles, machine paths, credentials, authentication events, source-specific private details, and opaque hosting IDs were removed. This document intentionally preserves decisions and effects, not operational traces or a transcript.
