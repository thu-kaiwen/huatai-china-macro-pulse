# Agent Handoff Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a sanitized, agent-oriented handoff package for native Windows development and reduce the README to the user actions needed to continue development and view results.

**Architecture:** `HANDS_OFF.md` is the normative agent contract, `SESSION_SAMMARY.md` preserves sanitized decision history, and `WINDOWS_DEVELOPMENT.md` is the executable PowerShell environment runbook. `README.md` remains the human entry point and links to the agent package instead of duplicating architecture or operational detail.

**Tech Stack:** Markdown, native Windows PowerShell, Git for Windows, Node.js 24, npm, React 19, TypeScript 5.9, Vite 8, Vitest, Playwright, GitHub Actions, GitHub Pages, Codex Sites.

## Global Constraints

- Preserve the exact requested filenames `HANDS_OFF.md`, `SESSION_SAMMARY.md`, and `WINDOWS_DEVELOPMENT.md`.
- Write the three handoff documents for coding agents with explicit normative instructions.
- Treat native Windows and PowerShell as primary; WSL is optional fallback only.
- Keep report extraction and interpretation in the active agent session. MUST NOT imply a browser scraper or runtime article parser.
- Keep README user-facing: continuing the conversation, providing a report, and viewing results.
- Exclude personal identities, account handles, email addresses, machine home paths, credentials, tokens, device codes, SSH material or fingerprints, and hosting project identifiers.
- Do not hard-code a repository owner. Repository transfer must not require a workflow source change when the repository name is unchanged.
- Derive repository facts from checked-in files. Verify unstable installation and platform claims against primary official documentation.
- Do not change application behavior, datasets, deployment credentials, repository ownership, or hosting configuration.

---

### Task 1: Write the normative agent contract

**Files:**
- Create: `HANDS_OFF.md`
- Inspect: `package.json`
- Inspect: `src/domain/types.ts`
- Inspect: `src/domain/validateDataset.ts`
- Inspect: `src/domain/selectors.ts`
- Inspect: `src/data/*.ts`
- Inspect: `.github/workflows/pages.yml`
- Inspect: `vite.config.ts`
- Inspect: `playwright.config.ts`

**Interfaces:**
- Consumes: approved design and checked-in product, data, test, and deployment configuration.
- Produces: authoritative instructions referenced by later documents and future agents.

- [ ] **Step 1: Reconfirm repository facts**

Run in PowerShell:

```powershell
Get-Content package.json
Get-Content .github/workflows/pages.yml
Get-Content vite.config.ts
Get-Content playwright.config.ts
Get-ChildItem src/data -File | Sort-Object Name
Get-ChildItem src/domain -File | Sort-Object Name
```

Expected: scripts include `dev`, `build`, `e2e`, `test:run`, `typecheck`, `lint`, and `verify`; Pages builds from repository-name context; file names match the planned map.

- [ ] **Step 2: Create the contract**

Create `HANDS_OFF.md` with these headings:

```markdown
# Agent Handoff Contract

> Audience: Codex, Claude Code, and comparable coding agents.

## FIRST: Required Reading Order
## Product Goal and Current State
## Non-Negotiable Product Boundaries
## Repository Map
## Data Trust and Provenance Contract
## Future Report Ingestion Procedure
## Trend Eligibility Rules
## Validation and Definition of Done
## Deployment Boundaries
## Known Data Debt
## Prioritized Next Work
## Stop and Ask Conditions
```

State all of the following:

- report links or pasted content are parsed and checked by the coding agent during development;
- the shipped React site consumes normalized static data and MUST NOT scrape WeChat or parse reports at runtime;
- verified observations alone may reach charts, ticker items, or metric cards;
- report metadata belongs in `src/data/reports.ts`, metric identity/methodology in `src/data/metricDefinitions.ts`, numeric records in `src/data/observations.ts`, and qualitative records in the matching narrative/event/risk files;
- components MUST NOT be edited to hard-code a report;
- weekly/monthly trends need two distinct verified `periodEnd` values with compatible frequency and comparison semantics;
- cross-frequency trends need two weekly periods, one monthly period, `nativeFrequency: "mixed"`, and compatible unit/methodology/comparison semantics;
- `npm run verify` is the completion gate;
- GitHub Pages derives base path from repository name, while Codex Sites retains its opaque linkage without exposing it in documentation;
- 20 market observations anchored to `2026-08-02` and four second-hand-housing observations anchored to `2026-07-26` remain date-audit debt until original chart axes or notes are verified;
- the next major data capability is the same metric's evolution as weekly/monthly reports accumulate.

- [ ] **Step 3: Check required terms**

```powershell
$text = Get-Content HANDS_OFF.md -Raw
@('FIRST','MUST NOT','src/data/reports.ts','src/data/observations.ts','npm run verify','2026-08-02','2026-07-26','runtime') |
  ForEach-Object { if (-not $text.Contains($_)) { throw "Missing HANDS_OFF requirement: $_" } }
```

Expected: exits without an exception.

- [ ] **Step 4: Commit**

```powershell
git add HANDS_OFF.md
git commit -m "docs: add agent handoff contract"
```

### Task 2: Write the sanitized session history

**Files:**
- Create: `SESSION_SAMMARY.md`
- Inspect: `docs/superpowers/specs/2026-08-04-china-macro-pulse-design.md`
- Inspect: `docs/superpowers/specs/2026-08-05-github-pages-deployment-design.md`
- Inspect: `docs/superpowers/plans/2026-08-04-china-macro-pulse-implementation.md`
- Inspect: `docs/superpowers/plans/2026-08-05-github-pages-deployment.md`

**Interfaces:**
- Consumes: prior approved specifications, plans, and current repository state.
- Produces: sanitized historical context referenced by `HANDS_OFF.md`.

- [ ] **Step 1: Extract decision history**

Build a chronological phase list covering: requirement correction to session-time parsing; approved weekly/monthly inputs; Huatai branding permission for an internal employee context; initial scope and future cross-scale evolution; normalized static-data trust model; Sites then Pages deployment; transfer-safe CI; final review fixes and date debt.

Expected: each topic has a short decision and impact statement; no transcript is copied.

- [ ] **Step 2: Create the summary**

Create `SESSION_SAMMARY.md` with:

```markdown
# Sanitized Session Summary

> Audience: coding agents. This is decision history, not a user guide or verbatim transcript.

## End State
## Phase 1: Requirement Correction
## Phase 2: Data and Branding Approval
## Phase 3: Product and Data Architecture
## Phase 4: Validation and Deployment
## Phase 5: Transfer-Safe CI Hardening
## Known Debt
## Next Development Direction
## Deliberately Omitted Information
```

Explain that identities, credentials, machine paths, authentication events, and opaque hosting IDs were removed, but do not list their values.

- [ ] **Step 3: Run a redaction scan**

```powershell
$forbidden = @('/home/','C:\Users\','BEGIN OPENSSH PRIVATE KEY','BEGIN RSA PRIVATE KEY','ssh-ed25519 ','ghp_','github_pat_','appgprj_')
$text = Get-Content SESSION_SAMMARY.md -Raw
$hits = $forbidden | Where-Object { $text.Contains($_) }
if ($hits) { throw "Sensitive patterns found: $($hits -join ', ')" }
```

Expected: exits without an exception.

- [ ] **Step 4: Commit**

```powershell
git add SESSION_SAMMARY.md
git commit -m "docs: add sanitized session summary"
```

### Task 3: Write the native Windows and PowerShell runbook

**Files:**
- Create: `WINDOWS_DEVELOPMENT.md`
- Inspect: `package-lock.json`
- Inspect: `package.json`
- Inspect: `playwright.config.ts`
- Inspect: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: lockfile requirements, scripts, official vendor documentation, and `HANDS_OFF.md`.
- Produces: a PowerShell-first runbook that needs no Bash translation.

- [ ] **Step 1: Verify unstable guidance with primary sources**

Check current official OpenAI Codex documentation, Anthropic Claude Code documentation, Node.js release information, Playwright installation documentation, Git/GitHub SSH documentation, and Microsoft PowerShell documentation. Recommend Node.js 24 with the exact compatible patch floor derived from `package-lock.json`. Do not recommend an unsupported Windows path.

- [ ] **Step 2: Create the runbook**

Create `WINDOWS_DEVELOPMENT.md` with:

```markdown
# Native Windows Development Runbook for Agents

> Audience: coding agents operating on Windows with PowerShell.

## FIRST: Operating Assumptions
## Required Software and Version Checks
## Codex Setup
## Claude Code Setup
## Git and SSH Safety Checks
## Clone and Install
## Local Development and Preview
## Test and Build Matrix
## PowerShell Environment Variables
## Playwright Setup and Recovery
## Native Windows Troubleshooting
## Deployment-Safe Checks
## Readiness Checklist
## Optional WSL Fallback
```

Include executable PowerShell for version checks, `npm ci`, `npx playwright install chromium`, every package script, localhost preview, and this Pages build pattern:

```powershell
$env:PAGES_REPOSITORY_NAME = (Split-Path -Leaf (Get-Location))
npm run build
Remove-Item Env:PAGES_REPOSITORY_NAME
```

Prefer PowerShell 7; use `npm ci` on a clean checkout; scope any execution-policy workaround to `Process` or `CurrentUser`; prohibit printing secrets and hosting IDs; cover line endings, long paths, ports, firewall symptoms, and Playwright recovery; state the E2E server is `127.0.0.1:4173` with desktop/mobile Chromium projects; use repository UI for Pages; keep WSL optional.

- [ ] **Step 3: Verify documented npm scripts**

```powershell
$package = Get-Content package.json -Raw | ConvertFrom-Json
$required = @('dev','build','e2e','test:run','typecheck','lint','verify')
$missing = $required | Where-Object { -not $package.scripts.PSObject.Properties.Name.Contains($_) }
if ($missing) { throw "Missing package scripts: $($missing -join ', ')" }
```

Expected: exits without an exception.

- [ ] **Step 4: Commit**

```powershell
git add WINDOWS_DEVELOPMENT.md
git commit -m "docs: add native Windows agent runbook"
```

### Task 4: Rewrite README for the user

**Files:**
- Modify: `README.md`
- Reference: `HANDS_OFF.md`
- Reference: `SESSION_SAMMARY.md`
- Reference: `WINDOWS_DEVELOPMENT.md`

**Interfaces:**
- Consumes: the completed agent documents and approved human-facing scope.
- Produces: the landing page for handing work to an agent and viewing results.

- [ ] **Step 1: Replace developer detail with user actions**

Use these headings:

```markdown
# 中国宏观脉搏
## 让 Codex 或 Claude Code 继续开发
## 添加一份新的周报或月报
## 本地查看效果（Windows PowerShell）
## 查看 GitHub Pages 效果
## Agent 交接文档
```

Include these copy-ready prompts:

```text
请先完整阅读 HANDS_OFF.md、SESSION_SAMMARY.md 和 WINDOWS_DEVELOPMENT.md，检查当前仓库状态并遵守其中的数据可信度、验证和部署约束。完成检查后，概述当前状态，再处理我的下一项需求。
```

```text
请先完整阅读 HANDS_OFF.md、SESSION_SAMMARY.md 和 WINDOWS_DEVELOPMENT.md。下面是新的【周报/月报】原文链接或内容：<粘贴链接或正文>。请在当前开发会话中完成读取、解析、口径与日期核验，再更新静态数据文件；不要在网站中增加运行时抓取或解析功能。完成后运行 npm run verify，并告诉我如何查看本地效果和部署结果。
```

Ask for report type, source link or complete pasted content, publication date when known, and internal review restrictions. Explain session-time parsing followed by reviewed static-data updates.

- [ ] **Step 2: Add minimal viewing instructions**

README local commands are only:

```powershell
npm ci
npm run dev
```

Tell users to open Vite's printed `Local` address. For Pages, direct them to repository **Deployments** or **Actions → Deploy to GitHub Pages**, without an owner-specific URL.

- [ ] **Step 3: Verify README scope**

```powershell
$text = Get-Content README.md -Raw
@('HANDS_OFF.md','SESSION_SAMMARY.md','WINDOWS_DEVELOPMENT.md','npm ci','npm run dev','Deployments') |
  ForEach-Object { if (-not $text.Contains($_)) { throw "Missing README item: $_" } }
@('src/data/observations.ts','nativeFrequency','PAGES_REPOSITORY_NAME','playwright.config.ts') |
  ForEach-Object { if ($text.Contains($_)) { throw "Agent detail leaked into README: $_" } }
```

Expected: exits without an exception.

- [ ] **Step 4: Commit**

```powershell
git add README.md
git commit -m "docs: simplify user continuation guide"
```

### Task 5: Cross-document verification

**Files:**
- Verify: `HANDS_OFF.md`
- Verify: `SESSION_SAMMARY.md`
- Verify: `WINDOWS_DEVELOPMENT.md`
- Verify: `README.md`

**Interfaces:**
- Consumes: all four documents and the unchanged application.
- Produces: evidence that the package is coherent, sanitized, and regression-free.

- [ ] **Step 1: Check diff hygiene**

```powershell
git diff --check HEAD~4..HEAD
git status --short --branch
```

Expected: no whitespace errors or unexpected application/configuration changes.

- [ ] **Step 2: Scan all handoff content for sensitive patterns**

```powershell
$docs = @('HANDS_OFF.md','SESSION_SAMMARY.md','WINDOWS_DEVELOPMENT.md','README.md')
$text = ($docs | ForEach-Object { Get-Content $_ -Raw }) -join "`n"
$forbidden = @('/home/','C:\Users\','BEGIN OPENSSH PRIVATE KEY','BEGIN RSA PRIVATE KEY','ssh-ed25519 ','ghp_','github_pat_','appgprj_')
$hits = $forbidden | Where-Object { $text.Contains($_) }
if ($hits) { throw "Sensitive patterns found: $($hits -join ', ')" }
```

Expected: exits without an exception. Manually review names and URLs because pattern scanning alone cannot prove anonymization.

- [ ] **Step 3: Check links and shared invariants**

```powershell
@('HANDS_OFF.md','SESSION_SAMMARY.md','WINDOWS_DEVELOPMENT.md') |
  ForEach-Object { if (-not (Test-Path $_)) { throw "Missing document: $_" } }
$contract = Get-Content HANDS_OFF.md -Raw
$readme = Get-Content README.md -Raw
if (-not $contract.Contains('MUST NOT')) { throw 'Contract lacks a prohibited-action rule' }
if (-not $readme.Contains('当前开发会话')) { throw 'README does not explain session-time parsing' }
```

Expected: exits without an exception; every root-document link resolves.

- [ ] **Step 4: Run the full verification suite**

```powershell
npm run verify
```

Expected: ESLint, TypeScript, Vitest, production build, desktop/mobile Playwright, and axe checks pass.

- [ ] **Step 5: Record final status**

```powershell
git status --short --branch
git log -5 --oneline
```

Expected: clean working tree and focused documentation commits after the plan commit. Do not redeploy because the task changes documentation only and the user did not request publication.
