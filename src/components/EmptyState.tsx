interface EmptyStateProps {
  groupName: string;
}

export function EmptyState({ groupName }: EmptyStateProps) {
  return <p className="metric-empty-state">{groupName}暂无已核验观测。</p>;
}
