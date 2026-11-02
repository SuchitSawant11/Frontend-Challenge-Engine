import type { Ref } from 'react'
import TaskCard from './TaskCard'
import ErrorBoundary from './ErrorBoundary'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed: boolean
  category: string
  tags: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>,
  ) => void
  editingId?: string | number | null
  onEditTask?: (id: string | number) => void
  onCancelEdit?: () => void
  listRef?: Ref<HTMLElement>
  linkToTaskDetail?: boolean
}

const HARDCODED_TASKS: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First hardcoded task',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second hardcoded task',
    priority: 'Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 3,
    title: 'Task Three',
    description: 'Third hardcoded task',
    priority: 'Low',
    completed: false,
    category: 'General',
    tags: [],
  },
]

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  onEditTask,
  onCancelEdit,
  listRef,
  linkToTaskDetail,
}: TaskListProps) {
  const list = tasks ?? HARDCODED_TASKS

  return (
    <>
      {countText && <p id="task-count">{countText}</p>}
      <ErrorBoundary>
        <section id="task-list" ref={listRef} tabIndex={-1}>
          {list.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.completed}
              category={task.category}
              tags={task.tags}
              dueDate={task.dueDate}
              onToggle={onToggle}
              onDelete={onDelete}
              editing={editingId === task.id}
              onEdit={onEditTask}
              onCancelEdit={onCancelEdit}
              onUpdateTask={onUpdateTask}
              linkToTaskDetail={linkToTaskDetail}
            />
          ))}
        </section>
      </ErrorBoundary>
    </>
  )
}
