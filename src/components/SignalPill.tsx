import type { Signal } from "../domain/types";

interface SignalPillProps {
  signal: Signal;
}

const signalPresentation: Record<Signal, { icon: string; label: string }> = {
  improving: { icon: "↑", label: "改善" },
  stable: { icon: "→", label: "平稳" },
  watch: { icon: "◌", label: "观察" },
  deteriorating: { icon: "↓", label: "承压" },
};

export function SignalPill({ signal }: SignalPillProps) {
  const { icon, label } = signalPresentation[signal];

  return (
    <span className={`signal-pill signal-pill-${signal}`} data-testid="macro-signal">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}
