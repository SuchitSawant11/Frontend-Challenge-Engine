export type TaskStatus = 'overdue' | 'due-today' | 'due-soon' | 'completed'

interface StatusIndicatorProps {
  status: TaskStatus
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  overdue: 'Overdue',
  'due-today': 'Due Today',
  'due-soon': 'Due Soon',
  completed: 'Completed',
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <span className={`status-indicator status-indicator--${status}`} data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  )
}
