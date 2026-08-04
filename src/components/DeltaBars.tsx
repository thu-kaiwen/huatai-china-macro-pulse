interface DeltaBarsProps {
  current: number;
  previous: number;
  unit: string;
  currentLabel: string;
  previousLabel: string;
}

function formatValue(value: number, unit: string): string {
  if (unit === "%" || unit === "bp" || unit === "指数") {
    return `${value.toFixed(1)}${unit}`;
  }

  return `${value}${unit}`;
}

export function DeltaBars({
  current,
  previous,
  unit,
  currentLabel,
  previousLabel,
}: DeltaBarsProps) {
  const largestValue = Math.max(Math.abs(current), Math.abs(previous), 1);
  const values = [
    { label: currentLabel, value: current },
    { label: previousLabel, value: previous },
  ];

  return (
    <div aria-label="本期与前值对比" className="delta-bars">
      {values.map(({ label, value }) => (
        <div className="delta-bar-row" key={label}>
          <span aria-hidden="true" className="delta-bar-track">
            <span
              className={`delta-bar ${value < 0 ? "delta-bar-negative" : "delta-bar-positive"}`}
              style={{ width: `${(Math.abs(value) / largestValue) * 100}%` }}
            />
          </span>
          <output>{label} {formatValue(value, unit)}</output>
        </div>
      ))}
    </div>
  );
}
