# Transferable GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing China Macro Pulse site from a public GitHub repository through a GitHub Pages workflow that remains valid after repository ownership transfer.

**Architecture:** Vite will derive an optional Pages base path from the repository name supplied by CI, while local and Codex Sites builds retain `/`. A two-job GitHub Actions workflow will validate and build `dist/client`, upload it as the official Pages artifact, and deploy it through the protected `github-pages` environment.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Vitest 4, Playwright, GitHub Actions, GitHub Pages, GitHub CLI, Git over SSH

## Global Constraints

- Create a public repository named `huatai-china-macro-pulse`.
- Do not hard-code any GitHub account or organization name in CI, build configuration, package scripts, or documentation.
- Use GitHub CLI only for repository and Pages API operations; use the existing SSH key for Git pushes.
- Preserve the existing Codex Sites configuration and its `/` base path.
- Do not transfer the repository during this implementation.
- Do not add a custom domain or account-specific badge.

## File Map

- Create `build/pages-base.ts`: pure base-path resolver shared by the Vite configuration and unit tests.
- Create `build/pages-base.test.ts`: verifies local/Codex Sites behavior and transfer-safe repository-name behavior.
- Modify `vite.config.ts`: sets Vite's `base` through the resolver without changing existing plugins.
- Create `.github/workflows/pages.yml`: validates, builds, uploads, and deploys the static client artifact.

---

### Task 1: Add Transfer-Safe Vite Base-Path Resolution

**Files:**
- Create: `build/pages-base.test.ts`
- Create: `build/pages-base.ts`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: optional `PAGES_REPOSITORY_NAME` process environment variable.
- Produces: `resolvePagesBase(repositoryName: string | undefined): string`, returning `/` locally and `/<repository-name>/` for Pages.

- [ ] **Step 1: Write the failing unit tests**

```ts
import { describe, expect, it } from "vitest";
import { resolvePagesBase } from "./pages-base";

describe("resolvePagesBase", () => {
  it("keeps local and Codex Sites builds at the origin root", () => {
    expect(resolvePagesBase(undefined)).toBe("/");
    expect(resolvePagesBase("")).toBe("/");
  });

  it("uses only the repository name for GitHub Pages", () => {
    expect(resolvePagesBase("huatai-china-macro-pulse")).toBe(
      "/huatai-china-macro-pulse/",
    );
    expect(resolvePagesBase("recipient-owned-project")).toBe(
      "/recipient-owned-project/",
    );
  });

  it("rejects an owner-qualified repository value", () => {
    expect(() => resolvePagesBase("owner/repository")).toThrow(
      "PAGES_REPOSITORY_NAME must be an unqualified repository name",
    );
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm run test:run -- build/pages-base.test.ts`

Expected: FAIL because `build/pages-base.ts` does not exist.

- [ ] **Step 3: Implement the resolver**

```ts
export function resolvePagesBase(repositoryName: string | undefined): string {
  if (!repositoryName) {
    return "/";
  }

  if (repositoryName.includes("/")) {
    throw new Error(
      "PAGES_REPOSITORY_NAME must be an unqualified repository name",
    );
  }

  return `/${repositoryName}/`;
}
```

- [ ] **Step 4: Wire the resolver into Vite**

Add the import:

```ts
import { resolvePagesBase } from "./build/pages-base.ts";
```

Add this property to the returned Vite configuration object without changing the existing plugin or test configuration:

```ts
base: resolvePagesBase(process.env.PAGES_REPOSITORY_NAME),
```

- [ ] **Step 5: Run the focused test and both build modes**

Run:

```bash
npm run test:run -- build/pages-base.test.ts
npm run build
PAGES_REPOSITORY_NAME=huatai-china-macro-pulse npm run build
```

Expected: tests and both builds PASS. The local build uses `/assets/...`; the Pages build uses `/huatai-china-macro-pulse/assets/...` in `dist/client/index.html`.

- [ ] **Step 6: Check transfer constraints and commit**

Run:

```bash
rg -n "repository_owner|github\.com[:/]" build vite.config.ts
git diff --check
git add build/pages-base.ts build/pages-base.test.ts vite.config.ts
git commit -m "build: support transferable Pages base path"
```

Expected: `rg` produces no matches; diff check passes; commit succeeds.

---

### Task 2: Add the Official GitHub Pages Workflow

**Files:**
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `github.event.repository.name`, the committed npm lockfile, and Task 1's `PAGES_REPOSITORY_NAME` interface.
- Produces: a `github-pages` deployment whose URL is available as `steps.deployment.outputs.page_url`.

- [ ] **Step 1: Create the workflow with no account-specific values**

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Set up Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:run

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Build static site
        env:
          PAGES_REPOSITORY_NAME: ${{ github.event.repository.name }}
        run: npm run build

      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist/client

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate structure and account independence**

Run:

```bash
rg -n "actions/(checkout@v6|setup-node@v6|configure-pages@v5|upload-pages-artifact@v4|deploy-pages@v4)" .github/workflows/pages.yml
rg -n "repository_owner|github\.com[:/]" .github/workflows/pages.yml
git diff --check
```

Expected: the first command finds all five official action references; the second produces no matches; diff check passes.

- [ ] **Step 3: Reproduce the CI build locally**

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:run
PAGES_REPOSITORY_NAME=huatai-china-macro-pulse npm run build
```

Expected: every command exits successfully and `dist/client/index.html` contains `/huatai-china-macro-pulse/assets/` references.

- [ ] **Step 4: Commit the workflow**

```bash
git add .github/workflows/pages.yml
git commit -m "ci: deploy site to GitHub Pages"
```

---

### Task 3: Run the Full Local Release Gate

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: the complete repository and the Pages build environment variable.
- Produces: evidence that the existing site and both hosting targets still build correctly.

- [ ] **Step 1: Run the repository verification suite**

Run: `npm run verify`

Expected: ESLint, TypeScript, all Vitest tests, the Cloudflare/Codex Sites production build, and all Playwright checks PASS.

- [ ] **Step 2: Verify the Pages artifact independently**

Run:

```bash
PAGES_REPOSITORY_NAME=huatai-china-macro-pulse npm run build
rg -n '/huatai-china-macro-pulse/assets/' dist/client/index.html
rg -n 'repository_owner|github\.com[:/]' .github build vite.config.ts package.json README.md
git status --short --branch
```

Expected: asset references use only the repository-name path; the account-name search has no matches; the worktree is clean.

---

### Task 4: Install GitHub CLI and Create the Public Repository

**Files:**
- No repository file changes expected.

**Interfaces:**
- Consumes: Ubuntu 22.04, GitHub CLI authentication, and the existing SSH key.
- Produces: an empty public remote repository and an SSH `origin` remote.

- [ ] **Step 1: Install GitHub CLI from the Ubuntu package source**

Run:

```bash
sudo apt-get update
sudo apt-get install -y gh
gh --version
```

Expected: `gh --version` prints an installed GitHub CLI version.

- [ ] **Step 2: Authenticate GitHub CLI while selecting SSH for Git operations**

Run: `gh auth login --hostname github.com --git-protocol ssh --web`

Expected: the user completes the browser/device authorization and `gh auth status --hostname github.com` reports the intended GitHub account with Git protocol `ssh`.

- [ ] **Step 3: Verify the existing SSH key identity**

Run: `ssh -o BatchMode=yes -T git@github.com`

Expected: GitHub reports successful authentication for the same intended account. GitHub's SSH test may exit with status 1 even when authentication succeeds.

- [ ] **Step 4: Confirm the repository name is available and create it**

Run:

```bash
github_login="$(gh api user --jq .login)"
gh repo view "$github_login/huatai-china-macro-pulse"
gh repo create huatai-china-macro-pulse --public --description "China macro pulse dashboard derived from Huatai Securities macro research reports"
```

Expected: the first command reports that the repository does not exist; the second creates a public repository under the authenticated account.

- [ ] **Step 5: Enable workflow publishing before the first push**

Run:

```bash
github_login="$(gh api user --jq .login)"
gh api --method POST "repos/$github_login/huatai-china-macro-pulse/pages" -f build_type=workflow
```

Expected: Pages is created with workflow publishing enabled.

- [ ] **Step 6: Add an SSH remote, verify its form, and push**

Run:

```bash
github_login="$(gh api user --jq .login)"
git remote add origin "git@github.com:$github_login/huatai-china-macro-pulse.git"
git remote get-url origin
git push -u origin main
```

Expected: the remote begins with `git@github.com:` and the `main` push succeeds. The account name is present only in local Git remote metadata, not in committed files or CI.

---

### Task 5: Observe and Verify GitHub Pages

**Files:**
- No repository file changes expected.

**Interfaces:**
- Consumes: the pushed workflow and GitHub CLI API access.
- Produces: a successful Pages deployment and a verified public site URL.

- [ ] **Step 1: Observe the deployment workflow**

Run:

```bash
gh run list --workflow pages.yml --limit 1
gh run watch --exit-status
```

Expected: the latest `Deploy GitHub Pages` run completes successfully.

- [ ] **Step 2: Resolve and test the deployed URL**

Run:

```bash
gh api repos/{owner}/{repo}/pages --jq .html_url
```

Open the returned URL and verify the page loads without failed JavaScript, CSS, or logo requests. Exercise navigation, the theme switcher, and representative weekly/monthly charts.

Expected: the public site renders and its static asset requests return successful responses.

- [ ] **Step 3: Verify manual redeployment**

Run:

```bash
gh workflow run pages.yml
gh run watch --exit-status
```

Expected: a manual run deploys the existing commit successfully.

- [ ] **Step 4: Record final repository state**

Run:

```bash
git status --short --branch
git log -5 --oneline --decorate
git remote -v
```

Expected: the worktree is clean, `main` tracks `origin/main`, and the local remote uses SSH.
