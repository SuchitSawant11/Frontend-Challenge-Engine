import { useNavigate, useParams } from 'react-router-dom'
import type { Task } from './TaskList'

const TASKS_STORAGE_KEY = 'task-app-tasks'
type StoredTask = Omit<Task, 'category' | 'tags'> &
  Partial<Pick<Task, 'category' | 'tags'>>

function isTask(value: unknown): value is StoredTask {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const task = value as Record<string, unknown>
  return (
    (typeof task.id === 'string' || typeof task.id === 'number') &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.priority === 'Low' ||
      task.priority === 'Medium' ||
      task.priority === 'High') &&
    typeof task.completed === 'boolean' &&
    (task.category === undefined || typeof task.category === 'string') &&
    (task.tags === undefined ||
      (Array.isArray(task.tags) && task.tags.every((tag) => typeof tag === 'string')))
  )
}

function findTask(taskId?: string): Task | null {
  if (!taskId) return null

  try {
    const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY)
    if (!storedTasks) return null

    const parsedTasks: unknown = JSON.parse(storedTasks)
    if (!Array.isArray(parsedTasks)) return null

    const task = parsedTasks.find(
      (candidate): candidate is StoredTask =>
        isTask(candidate) && String(candidate.id) === taskId,
    )

    if (!task) return null
    return {
      ...task,
      category: task.category?.trim() || 'General',
      tags: task.tags ?? [],
    }
  } catch {
    return null
  }
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const task = findTask(id)

  return (
    <main id="task-detail-page">
      <button
        id="task-detail-back"
        type="button"
        onClick={() => navigate('/challenge/21-react-router')}
      >
        Back to list
      </button>
      {task ? (
        <article>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Category: {task.category}</p>
          <p>Status: {task.completed ? 'Completed' : 'Active'}</p>
          {task.dueDate !== undefined && <p>Due date: {task.dueDate}</p>}
          {task.tags.length > 0 && <p>Tags: {task.tags.join(', ')}</p>}
        </article>
      ) : (
        <p>Task not found.</p>
      )}
    </main>
  )
}
