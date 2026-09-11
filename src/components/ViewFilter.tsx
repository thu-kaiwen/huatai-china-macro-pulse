import type { Frequency } from "../domain/types";

interface ViewFilterProps {
  value: Frequency;
  onChange: (view: Frequency) => void;
}

const options: Array<{ value: Frequency; label: string }> = [
  { value: "weekly", label: "周报" },
  { value: "monthly", label: "月报" },
];

export function ViewFilter({ value, onChange }: ViewFilterProps) {
  return (
    <div aria-label="报告视图" className="view-filter" role="group">
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          className="view-filter-button"
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
