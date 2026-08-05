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
