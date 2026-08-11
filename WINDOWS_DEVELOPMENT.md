# Native Windows Development Runbook for Agents

> Audience: coding agents operating on Windows with PowerShell.

## FIRST: Operating Assumptions

- This is a native Windows workflow. Use PowerShell 7 (`pwsh`) when available; Windows PowerShell 5.1 can run the basic commands, but PowerShell 7 is preferred.
- Read `HANDS_OFF.md` first. It is the current contract; `SESSION_SAMMARY.md` is historical context. Then follow the required-reading order in `HANDS_OFF.md` before changing product or data behavior.
- Work in a local clone, use PowerShell commands below as written, and keep WSL2 optional rather than a prerequisite.
- Do not print, paste, or commit credentials, tokens, private keys, SSH fingerprints, opaque hosting linkage, or other sensitive configuration. Avoid sharing terminal output that could expose public account or repository metadata.

## Required Software and Version Checks

Install the current Node 24 LTS release, at **24.15.0 or later within the Node 24 line**. The checked-in `jsdom` lockfile entry requires `^22.22.2 || ^24.15.0 || >=26.0.0`; Node 24 meets that requirement and is the recommended current LTS line. Confirm the current LTS release from [Node.js releases](https://nodejs.org/en/about/previous-releases) before downloading it.

Install Git for Windows from [git-scm.com](https://git-scm.com/install/windows). Git is required for this repository. Do not substitute an unsupported shell workflow for these PowerShell commands.

```powershell
$PSVersionTable.PSVersion
node --version
npm --version
git --version
```

If `node --version` is below `v24.15.0`, install or select a compatible Node 24 LTS release before `npm ci`. Do not rely on the older Node 22 version that may happen to be installed on a workstation.

If a local execution policy blocks an approved local command, inspect policy scopes first:

```powershell
Get-ExecutionPolicy -List
```

Only when needed, use a session-only workaround:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

`Process` is preferred because it ends with the PowerShell session. If an organization permits a user-level setting, `CurrentUser` is the widest acceptable scope; do not make `LocalMachine` or `Unrestricted` the default. See Microsoft’s [about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies) for scope and policy-precedence details.

## Codex Setup

Install the native Windows Codex app from an elevated or user-approved PowerShell session:

```powershell
winget install --id 9PLM9XGG6VKS -s msstore
```

Open the app and complete sign-in there. Native Windows Codex defaults to PowerShell. Sandbox protections apply when the user selects **Ask for approval**; full-access mode can also be selected. For this repository, agents MUST keep **Ask for approval** and its sandbox boundaries enabled, and MUST NOT select full access merely to bypass a failure. WSL2 is optional. Follow the current [Codex Windows app guide](https://learn.chatgpt.com/docs/windows/windows-app) and [Codex authentication guide](https://learn.chatgpt.com/docs/auth) for current availability and sign-in details.

If the Codex CLI is **already installed**, authenticate and check its state with:

```powershell
codex login
codex login status
```

Do not invent a native Windows CLI installation command in this runbook; use the current official documentation for the installation path available to the agent.

## Claude Code Setup

Claude Code supports native Windows. Install it from PowerShell:

```powershell
winget install Anthropic.ClaudeCode
claude
```

Follow the browser sign-in flow started by `claude`. Consult the current [Claude Code getting-started guide](https://code.claude.com/docs/en/getting-started) if installation or authentication behavior changes.

Git for Windows is optional to Claude Code itself but required and recommended for this repository. When Git for Windows is installed, Claude Code normally has Git Bash available internally; that does **not** make its internal Bash tool PowerShell. Run this repository’s commands from PowerShell. Native Windows Claude Code sandboxing is not supported, so use the normal least-privilege and review precautions for local tools and commands.

## Git and SSH Safety Checks

Use Git remotes and SSH only after inspecting them. `git remote -v` and the SSH test can show public account or repository metadata; do not paste that output into issues, chat, or documentation unless it is needed and approved.

```powershell
git remote -v
ssh -T git@github.com
```

The GitHub SSH test may report successful authentication or an expected no-shell message. Never display, copy, or commit the contents of a private key. If authentication is not configured, follow GitHub’s [SSH connection instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh); verify a host key through the documented process rather than recording an SSH fingerprint in this repository.

## Clone and Install

Clone from the approved repository URL without embedding an owner name in scripts or docs, then enter the clone directory:

```powershell
git clone <repository-url>
Set-Location <clone-directory>
```

On a clean checkout, install exactly from the lockfile:

```powershell
npm ci
```

`npm ci` removes and recreates the dependency tree represented by `package-lock.json`; do not use it in a checkout with local dependency changes you need to preserve. If it fails after a Node upgrade, confirm the active `node --version`, delete only the generated `node_modules` directory if it is safe to recreate, then run `npm ci` again.

## Local Development and Preview

Start the development server on the loopback interface and open the shown local URL (normally `http://127.0.0.1:5173`) in a browser:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

For a production-style preview, first build with the Pages base-path context, then serve the built output locally:

```powershell
$repositoryName = Split-Path -Leaf (Get-Location)
$env:PAGES_REPOSITORY_NAME = $repositoryName
try {
  npm run build
  Write-Host "Open http://127.0.0.1:4173/$repositoryName/"
  npx vite preview --host 127.0.0.1 --port 4173
} finally {
  Remove-Item Env:PAGES_REPOSITORY_NAME -ErrorAction SilentlyContinue
}
```

While preview is running, open the repository-subpath URL printed by the command, such as `http://127.0.0.1:4173/<repository-name>/`. Stop either server with `Ctrl+C`; the `finally` block then clears `PAGES_REPOSITORY_NAME`. The E2E runner also uses `127.0.0.1:4173`, so do not leave a stale server on that port before an E2E run.

## Test and Build Matrix

These are all current package scripts. Run the focused command appropriate to the change, then run `npm run verify` before considering a change complete.

| Command | Purpose |
| --- | --- |
| `npm test` | Start Vitest in watch mode. |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Type-check the project. |
| `npm run test:run` | Run the Vitest suite once. |
| `npm run build` | Type-check and make the production build. |
| `npm run e2e` | Run Playwright E2E tests. |
| `npm run verify` | Run lint, typecheck, unit tests, production build, and E2E tests. |

Playwright starts `npm run dev -- --host 127.0.0.1 --port 4173` automatically when necessary. Its base URL is `http://127.0.0.1:4173`, and it runs the `desktop-chromium` (1440 × 1000) and `mobile-chromium` (390 × 844) projects.

Verify the documented automation names without relying on a Bash shell:

```powershell
$package = Get-Content package.json -Raw | ConvertFrom-Json
$required = @('dev','build','e2e','test:run','typecheck','lint','verify')
$missing = $required | Where-Object { -not $package.scripts.PSObject.Properties.Name.Contains($_) }
if ($missing) { throw "Missing package scripts: $($missing -join ', ')" }
```

## PowerShell Environment Variables

The Pages build must derive its base path from the current clone directory. For a build without a preview server, use this temporary-variable pattern so cleanup also occurs if the build fails:

```powershell
$repositoryName = Split-Path -Leaf (Get-Location)
$env:PAGES_REPOSITORY_NAME = $repositoryName
try {
  npm run build
} finally {
  Remove-Item Env:PAGES_REPOSITORY_NAME -ErrorAction SilentlyContinue
}
```

Do not replace `PAGES_REPOSITORY_NAME` with a hard-coded owner, repository name, URL, or hosting identifier. Do not put credentials in `$env:` commands or commit an environment file containing secrets.

To emulate CI behavior for a single terminal session, if needed:

```powershell
$env:CI = 'true'
npm run e2e
Remove-Item Env:CI
```

## Playwright Setup and Recovery

Install the browser binary after `npm ci` and whenever the Playwright package version changes:

```powershell
npx playwright install chromium
```

Playwright’s [browser installation documentation](https://playwright.dev/docs/browsers) covers browser binaries and corporate-network configuration. If a proxy is required for the download, set temporary PowerShell variables using the organization-approved proxy endpoint, without credentials in shell history:

```powershell
$env:HTTPS_PROXY = 'http://proxy.example:port'
$env:HTTP_PROXY = 'http://proxy.example:port'
npx playwright install chromium
Remove-Item Env:HTTPS_PROXY
Remove-Item Env:HTTP_PROXY
```

For a missing or corrupted Chromium installation, close running test processes, run `npx playwright install chromium` again, and then retry `npm run e2e`. If `127.0.0.1:4173` is occupied, identify the listening process and stop only the process you own:

```powershell
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, State, OwningProcess
```

## Native Windows Troubleshooting

- **Line endings:** Keep repository formatting intact. Inspect `git diff --check` before handoff; do not mass-convert files between CRLF and LF. If a tool changes endings unexpectedly, inspect the affected diff and the repository’s Git attributes/configuration before editing further.
- **Long paths:** Prefer a short workspace location. If Git reports a path-length failure and your organization permits it, enable Git’s long-path support with `git config --global core.longpaths true`; do not change system-wide policy just to work around one clone.
- **Port already in use:** Stop the local process you own on 5173 or 4173, or choose another port for manual development. Keep Playwright on `127.0.0.1:4173` unless the test configuration changes.
- **Firewall or endpoint security symptoms:** A browser that cannot reach a running loopback server, or a blocked browser download, may be caused by local security controls. Use `127.0.0.1`, review the approved security tooling, and ask the administrator rather than disabling firewall or endpoint protection.
- **Native modules or install failures:** Reconfirm Node 24.15.0+ and rerun `npm ci` from a clean generated dependency directory. Capture only non-sensitive error details when escalating.
- **Pages asset paths:** A page that works at `/` but not under the repository path was likely built without the temporary `PAGES_REPOSITORY_NAME` value. Rebuild using the documented pattern above.

## Deployment-Safe Checks

Use the repository’s configured Pages workflow and repository UI to review deployment status and settings. Do not add, expose, or document opaque hosting linkage, deployment identifiers, tokens, or repository-owner-specific URLs.

Before handing off a deployment-related change:

```powershell
$env:PAGES_REPOSITORY_NAME = (Split-Path -Leaf (Get-Location))
npm run build
Remove-Item Env:PAGES_REPOSITORY_NAME

git diff --check
```

Confirm the built artifact path and Pages workflow from checked-in configuration, keep the repository-name environment variable temporary, and use the repository UI for Pages rather than constructing a hosted URL.

## Readiness Checklist

- [ ] `HANDS_OFF.md` and the required source, test, and deployment files were read before the change.
- [ ] PowerShell 7 is preferred; Node is Node 24.15.0+; Git is installed.
- [ ] `npm ci` completed from the lockfile on a clean checkout.
- [ ] Chromium is installed with `npx playwright install chromium`.
- [ ] Focused checks passed and `npm run verify` passed, or an exact environmental failure was recorded.
- [ ] Deployment builds used the temporary `PAGES_REPOSITORY_NAME` pattern.
- [ ] `git diff --check` passed and no secrets, private keys, SSH fingerprints, account details, or opaque hosting identifiers were added.
- [ ] GitHub Pages was reviewed through the repository UI when deployment status or settings mattered.

## Optional WSL Fallback

WSL2 is optional, not required for Codex or this repository. Use it only when a Windows-specific tool limitation cannot be resolved under local policy and the task permits it. A WSL environment is a separate toolchain: install its own Node version and dependencies, do not mix its `node_modules` with the native Windows checkout, and continue to honor the repository contract. The native Windows/PowerShell path above remains the primary runbook.
