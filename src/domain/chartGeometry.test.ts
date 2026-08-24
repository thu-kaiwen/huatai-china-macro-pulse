import { describe, expect, it } from "vitest";
import { buildLineSegments } from "./chartGeometry";

describe("buildLineSegments", () => {
  it("keeps a 32-week current-year series at the August position on a 52-week axis", () => {
    const values = Array.from({ length: 32 }, (_, index) => 180_000 + index * 1_000);

    const segments = buildLineSegments(values, 52, {
      left: 45,
      top: 18,
      width: 550,
      height: 196,
      min: 155_000,
      max: 230_000,
    });

    expect(segments).toHaveLength(1);
    expect(segments[0]).toHaveLength(32);
    expect(segments[0]?.at(-1)?.x).toBeCloseTo(45 + 550 * 31 / 51, 5);
    expect(segments[0]?.at(-1)?.x).toBeLessThan(45 + 550 * 0.65);
  });

  it("does not draw trailing months represented by null values", () => {
    const values = [1, 2, 3, null, null];

    const segments = buildLineSegments(values, 5, {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      min: 0,
      max: 4,
    });

    expect(segments).toEqual([[{ x: 0, y: 75 }, { x: 25, y: 50 }, { x: 50, y: 25 }]]);
  });
});
