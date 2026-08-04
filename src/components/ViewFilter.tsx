import type { ViewMode } from "../domain/types";

interface ViewFilterProps {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
}

const options: Array<{ value: ViewMode; label: string }> = [
  { value: "combined", label: "综合" },
  { value: "monthly", label: "月报" },
  { value: "weekly", label: "周报" },
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
