# Agent Handoff Documentation Design

## Goal

Prepare this repository for continued development by Codex, Claude Code, or a comparable coding agent on native Windows with PowerShell. The handoff must preserve the project's decisions, constraints, validation rules, and known debt without exposing personal or authentication-related information.

Human-facing documentation will be deliberately small. A user should only need to know how to ask an agent to continue the work, how to provide a new weekly or monthly report, and how to view the resulting site.

## Deliverables

The change will create or revise four repository-root documents:

- `HANDS_OFF.md`: the normative operating contract and primary entry point for coding agents;
- `SESSION_SAMMARY.md`: a sanitized record of the requirements, corrections, decisions, completed work, and remaining direction from the originating session;
- `WINDOWS_DEVELOPMENT.md`: an executable native Windows and PowerShell environment guide for coding agents;
- `README.md`: a concise user guide for starting the next agent conversation, submitting new reports, and viewing local or deployed results.

The requested filenames, including `HANDS_OFF.md` and the spelling `SESSION_SAMMARY.md`, will be preserved exactly.

## Audience and Writing Contract

The three handoff documents are written for agents, not as tutorials for end users. They will use explicit normative language such as `MUST`, `MUST NOT`, `FIRST`, and `DONE WHEN`, along with exact commands, file locations, verification criteria, and escalation conditions.

`HANDS_OFF.md` will define the required reading order:

1. `HANDS_OFF.md`;
2. `SESSION_SAMMARY.md`;
3. `WINDOWS_DEVELOPMENT.md` when running on Windows;
4. `README.md` for the promised user workflow;
5. relevant specifications and plans under `docs/superpowers/` when historical implementation detail is needed.

The documents will avoid conversational filler, generic onboarding advice, and duplicated background. Each fact will have one primary home, with links used for supporting detail.

## `HANDS_OFF.md` Content

`HANDS_OFF.md` will be the authoritative agent contract. It will contain:

- the current product goal and implementation status;
- the boundary between session-time report analysis and the generated static website;
- the rule that the browser application does not scrape or parse WeChat articles;
- the repository architecture and the locations of report metadata, metric definitions, observations, narratives, policy events, risks, tests, and deployment configuration;
- data provenance rules, including the distinction between verified values and unverified contextual statements;
- chart and headline eligibility rules, including minimum-history behavior for weekly and monthly trends;
- a report-ingestion procedure for future weekly and monthly articles;
- mandatory validation and test commands;
- GitHub Pages and Codex Sites deployment boundaries;
- transfer-safe CI constraints, including the prohibition on authored account-specific owner names;
- known date-anchoring debt and the condition for correcting it;
- near-term development priorities, especially cross-report weekly and monthly metric evolution;
- completion criteria and conditions that require the agent to stop and ask the user.

The document will distinguish immutable product constraints from current implementation details so future agents can refactor safely without silently changing the product.

## `SESSION_SAMMARY.md` Content and Redaction

`SESSION_SAMMARY.md` will record the useful history of the originating task in chronological phases rather than reproduce the chat transcript. It will include:

- the initial interpretation and the user's correction that report analysis occurs in the active agent session, not in a runtime website parser;
- the approved source type and first weekly/monthly report inputs;
- the permission to retain Huatai branding for an internal employee-facing context;
- the approved initial scope and the longer-term need to compare the same indicators across weekly and monthly scales;
- the static-data architecture and trust model;
- the deployment sequence and repository-transfer requirement;
- the CI hardening and review outcomes;
- the current verified state, known data debt, and suggested next development wave.

The summary will not include personal names, account handles, email addresses, local home-directory paths, authentication or device codes, SSH key material or fingerprints, private tokens, or deployment project identifiers. It will not claim that a public platform can conceal owner/repository metadata; it will state only that repository-authored CI and documentation must remain account-independent.

Public report sources may remain discoverable through existing repository data or documentation, but the session summary will describe them generically unless a direct link is necessary for an agent action.

## `WINDOWS_DEVELOPMENT.md` Content

The Windows guide will treat native Windows and PowerShell as the primary path. WSL will appear only as an optional fallback or compatibility note.

It will specify:

- supported Windows assumptions and a PowerShell-first shell contract;
- installation and verification of Git for Windows, a repository-compatible Node.js release, npm, and browser-test dependencies;
- current official installation and authentication guidance for Codex and Claude Code, with external facts verified against primary vendor documentation;
- SSH and Git checks that do not print or store secrets;
- repository clone and dependency installation commands;
- PowerShell syntax for environment variables and paths;
- local development, unit validation, full verification, production build, and preview commands;
- Playwright browser installation and common native-Windows failure recovery;
- execution-policy, path-length, line-ending, port, and firewall considerations where relevant;
- GitHub Pages and transfer-safe deployment checks without hard-coded account names;
- a machine-checkable readiness checklist and expected outputs.

The guide will not instruct an agent to weaken machine-wide security settings unnecessarily. Any permission or execution-policy change will be scoped to the current user or process and explained as conditional.

## `README.md` Content

The README will be rewritten as a short user-facing entry point. It will include:

- a ready-to-paste prompt telling a new Codex or Claude Code session which handoff documents to read first;
- a ready-to-paste prompt for adding a new weekly or monthly report;
- the minimum information the user should provide with a report link or pasted content;
- an explicit reminder that the agent performs parsing during the development session and then updates the static site data;
- native PowerShell commands to install dependencies and open a local preview;
- directions for locating the current GitHub Pages result through the repository's Deployments or Actions interface, avoiding an owner-specific URL;
- links to the three agent documents for users who need to hand the repository to a new agent.

Detailed architecture, CI internals, data schemas, troubleshooting, and historical decisions will move out of the README into the agent documents.

## Source Verification

Current installation or platform-support statements for Codex, Claude Code, Node.js, GitHub Actions, or GitHub Pages may change. Before implementation, those statements will be checked against official OpenAI, Anthropic, Node.js, Microsoft, GitHub, or Playwright documentation as applicable. Primary sources will be preferred, and the Windows guide will include links only where they materially help future agents recover or update the environment.

Repository-local facts will be derived from the checked-in configuration and lockfile rather than assumed from generic ecosystem defaults.

## Validation

The documentation change is complete when:

- all four documents exist at the repository root with the specified names and audiences;
- commands and file paths match the current repository;
- the README contains only user-relevant continuation and viewing guidance plus a minimal product description;
- the agent documents describe the session-time parsing boundary consistently;
- native Windows PowerShell is the primary environment path;
- no personal account, local home path, credential, key material, device code, or hosting project identifier appears in the new handoff content;
- no authored CI instruction depends on the current repository owner;
- internal links resolve and the documented npm commands exist;
- Markdown formatting passes the repository's available checks or a focused documentation inspection;
- the existing application verification suite still passes after documentation-only changes.

## Out of Scope

This handoff task will not change application behavior, ingest another report, alter existing datasets, redesign the website, transfer repository ownership, modify deployment credentials, or add a runtime article parser. It will not install a GitHub plugin because local repository access is sufficient for producing the handoff documentation.
