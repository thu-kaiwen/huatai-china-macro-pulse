# GitHub Pages Deployment Design

## Goal

Publish the existing China Macro Pulse site from a new public GitHub repository and deploy it with GitHub Pages. The repository will initially live under the current maintainer's account, but the deployment must continue to work after repository ownership is transferred.

## Scope

This change will:

- create a public repository named `huatai-china-macro-pulse`;
- push the existing `main` branch through SSH;
- add a GitHub Actions workflow that validates, builds, and deploys the site to GitHub Pages;
- make the Vite base path depend on the repository name rather than its owner;
- retain the existing Codex Sites deployment configuration;
- verify the published GitHub Pages site after the first deployment.

This change will not transfer the repository yet, add a custom domain, install the GitHub plugin, or add account-specific badges and URLs to repository files.

## Repository Creation and Authentication

GitHub CLI will be installed locally because GitHub cannot create a repository through the Git-over-SSH protocol alone. GitHub CLI authentication will be used only for repository and Pages API operations. The Git remote will use the SSH form, and source pushes will use the existing local SSH key.

Before any push, the authenticated GitHub identity and repository destination will be verified. No private key material or authentication token will be printed or stored in the repository.

## Deployment Architecture

The workflow will use GitHub's official Pages artifact deployment flow:

1. Trigger on pushes to `main` and through manual dispatch.
2. Check out the repository and install the supported Node.js runtime.
3. Install locked dependencies with `npm ci`.
4. Run linting, TypeScript checks, unit tests, and the production build.
5. Upload the generated static client directory as the Pages artifact.
6. Deploy the artifact with GitHub's official Pages deployment action.

The workflow will grant only the permissions required by Pages: read access to repository contents, write access to Pages, and an OIDC identity token. A Pages concurrency group will prevent overlapping production deployments.

## Transfer-Safe Path Handling

The CI source and build configuration will not contain a GitHub account or organization name. The Pages base path will be supplied from GitHub's repository-name context at build time. Because a normal repository transfer retains the repository name, static asset paths will remain valid after ownership changes.

The GitHub Actions interface and standard action logs may display the repository's full owner/name as platform metadata. The project cannot suppress that platform-provided information, but no owner name will be authored into the workflow, Vite configuration, package scripts, or documentation.

Local and Codex Sites builds will continue to default to `/`. Only the GitHub Pages job will provide the repository-derived subpath.

## Failure Handling

Validation or build failures will stop the deployment before an artifact is published. GitHub Pages deployment failures will remain visible in the workflow run and deployment environment. The previous successful Pages deployment will remain available when a later build fails.

Repository creation, Pages enablement, and the initial push will be performed as separate observable operations so authentication, permission, or naming failures can be identified without partially changing build configuration.

## Verification

Before publishing:

- run the repository's lint, typecheck, unit-test, build, and end-to-end checks locally;
- inspect the production artifact and confirm its asset URLs use the repository-derived base path for the Pages build;
- confirm no current GitHub account name is hard-coded in the CI workflow or build configuration.

After publishing:

- wait for the Pages workflow to complete successfully;
- confirm the deployment environment reports a Pages URL;
- load the published page and verify that its HTML, JavaScript, CSS, logo, navigation, theme switcher, and core charts render successfully;
- confirm a manual rerun can deploy the same commit without source changes.

## Ownership Transfer

The later ownership transfer is outside this implementation. When transfer is requested, the recipient must accept it through GitHub. After transfer, the maintainer should trigger the generic Pages workflow once and verify the new Pages URL. No CI source edit should be necessary unless the repository is renamed or the recipient introduces a custom domain or organization policy.
