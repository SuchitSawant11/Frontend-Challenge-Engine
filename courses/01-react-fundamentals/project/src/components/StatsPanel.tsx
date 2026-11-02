interface StatsPanelProps {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
}

export default function StatsPanel({
  total = 0,
  completed = 0,
  active = 0,
  overdue = 0,
  completedPercentage,
}: StatsPanelProps) {
  const percentage =
    completedPercentage ??
    (total === 0 ? 0 : Math.round((completed / total) * 100))

  return (
    <section id="stats-panel">
      <p>Total: {total}</p>
      <p>
        Completed: {completed} ({percentage}%)
      </p>
      <p>Active: {active}</p>
      <p>Overdue: {overdue}</p>
      <div
        role="progressbar"
        aria-label="Task completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div style={{ width: `${percentage}%` }} />
      </div>
    </section>
  )
}
