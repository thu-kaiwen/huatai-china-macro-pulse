# Task 4 Report — Research Atlas Navigation and China Macro Hub

## Files

- Created `src/sections/ChinaMacroHub.tsx`.
- Modified `src/components/Header.tsx`, `src/components/BrandLockup.tsx`, `src/components/ViewFilter.tsx`, `src/app/App.tsx`, and `src/app/App.test.tsx`.

## Red / Green Evidence

- RED: `npm run test:run -- src/app/App.test.tsx` failed as expected before production changes: 3 navigation tests failed because App opened the weekly report and exposed only the legacy weekly navigation.
- GREEN: focused regression passed: `npm run test:run -- src/app/App.test.tsx src/sections/WeeklyReport.test.tsx src/components/WeeklyCharts.test.tsx` — 3 files, 10 tests passed.
- Final verification: `npm run lint`, `npm run build`, and `npm run test:run` passed. Full tests: 18 files, 65 tests passed.

## Commit

- `fe50cda feat: center navigation on Huatai research atlas`

## Self-review

- App defaults to `home`, renders exactly one primary surface in `main`, and resets scroll on every primary navigation action.
- Header has the four specified `PrimaryView` entries, required fragment links, `aria-current="page"`, and the exact `onNavigate` view signature.
- China Macro Pulse keeps weekly as its default frequency and preserves the existing weekly/monthly report data and error boundaries.
- Brand text and its accessible homepage label now reference the Huatai Macro Research Atlas.

## Concerns

- None. The intentionally deferred Task 3 `ResearchSurfaces.test.tsx` test-title/count issue was not changed.

## Fix Round 1 — Review Findings

- Added focused regressions in `src/app/App.test.tsx` for the global navigation fragment target and for returning home through the brand link from another primary view.
- RED: `npm run test:run -- src/app/App.test.tsx` — 2 tests failed as expected: `#global-research` had no matching destination, and clicking the brand link did not switch away from the global view.
- Fixed the global section id to `global-research`, preserving the plan-mandated navigation href.
- Connected `BrandLockup` to `Header.onNavigate` so its homepage link activates the `home` primary view while retaining `#research-home`.
- Focused GREEN: `npm run test:run -- src/app/App.test.tsx src/sections/WeeklyReport.test.tsx src/components/WeeklyCharts.test.tsx` — 3 files, 12 tests passed.
- Full verification: `npm run lint` passed; `npm run build` passed; `npm run test:run` — 18 files, 67 tests passed.

## Fix Round 1 Commit

- `fix: restore research atlas navigation targets` (final commit recorded in repository history)
