import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BrandLockup } from "./BrandLockup";

describe("BrandLockup", () => {
  afterEach(cleanup);

  it("routes the logo through Vite's bundled asset graph", () => {
    render(<BrandLockup />);

    expect(screen.getByRole("img", { name: "华泰证券标志" })).toHaveAttribute(
      "src",
      "/src/assets/huatai-logo.png",
    );
  });
});
