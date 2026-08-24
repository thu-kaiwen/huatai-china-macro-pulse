export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartBounds {
  left: number;
  top: number;
  width: number;
  height: number;
  min: number;
  max: number;
}

export function buildLineSegments(
  values: ReadonlyArray<number | null>,
  totalPoints: number,
  bounds: ChartBounds,
): ChartPoint[][] {
  const segments: ChartPoint[][] = [];
  let current: ChartPoint[] = [];
  const denominator = Math.max(1, totalPoints - 1);
  const range = Math.max(Number.EPSILON, bounds.max - bounds.min);

  values.forEach((value, index) => {
    if (value === null) {
      if (current.length > 0) segments.push(current);
      current = [];
      return;
    }

    current.push({
      x: bounds.left + bounds.width * index / denominator,
      y: bounds.top + (bounds.max - value) / range * bounds.height,
    });
  });

  if (current.length > 0) segments.push(current);
  return segments;
}
