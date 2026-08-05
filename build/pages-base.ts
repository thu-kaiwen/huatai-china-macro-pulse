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
