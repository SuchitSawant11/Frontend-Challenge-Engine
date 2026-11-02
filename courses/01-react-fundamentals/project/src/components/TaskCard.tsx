import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'
import Button from './Button'
import StatusIndicator, { type TaskStatus } from './StatusIndicator'

function parseTaskDate(value: string | number): Date {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return new Date(value)
}

function toDateInputValue(value?: string | number): string {
  if (value === undefined) return ''

  const date = parseTaskDate(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface TaskCardProps {
  id?: string | number
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
  linkToTaskDetail?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  editing?: boolean
  onEdit?: (id: string | number) => void
  onCancelEdit?: () => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: 'Low' | 'Medium' | 'High'
      dueDate?: string | number
    },
  ) => void
}

function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  category = 'General',
  tags = [],
  dueDate,
  linkToTaskDetail = false,
  onToggle,
  onDelete,
  editing = false,
  onEdit,
  onCancelEdit,
  onUpdateTask,
}: TaskCardProps) {
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editPriority, setEditPriority] = useState(priority)
  const [editDueDate, setEditDueDate] = useState(toDateInputValue(dueDate))
  const [editError, setEditError] = useState('')

  function handleDelete() {
    if (id !== undefined && window.confirm('Are you sure?')) {
      onDelete?.(id)
    }
  }

  function handleEdit() {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditDueDate(toDateInputValue(dueDate))
    setEditError('')
    if (id !== undefined) onEdit?.(id)
  }

  function handleSave() {
    if (!editTitle.trim()) {
      setEditError('Title is required')
      return
    }

    if (id !== undefined) {
      onUpdateTask?.(id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        dueDate: editDueDate || undefined,
      })
    }
  }

  const parsedDueDate = dueDate === undefined ? null : parseTaskDate(dueDate)
  const validDueDate =
    parsedDueDate && !Number.isNaN(parsedDueDate.getTime())
      ? parsedDueDate
      : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDay = validDueDate
    ? new Date(
        validDueDate.getFullYear(),
        validDueDate.getMonth(),
        validDueDate.getDate(),
      )
    : null
  const daysUntilDue = dueDay
    ? Math.round((dueDay.getTime() - today.getTime()) / 86400000)
    : null
  const isOverdue = !completed && daysUntilDue !== null && daysUntilDue < 0
  const dueStatus: TaskStatus | null = isOverdue
    ? 'overdue'
    : daysUntilDue === 0
      ? 'due-today'
      : daysUntilDue !== null && daysUntilDue > 0 && daysUntilDue <= 3
        ? 'due-soon'
        : null

  return (
    <article
      id="task-card"
      data-completed={completed}
      data-overdue={isOverdue ? 'true' : 'false'}
    >
      {editing ? (
        <div>
          <label htmlFor={`edit-title-${id}`}>Title</label>
          <input
            id={`edit-title-${id}`}
            aria-label="Edit title"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />
          <label htmlFor={`edit-description-${id}`}>Description</label>
          <textarea
            id={`edit-description-${id}`}
            aria-label="Edit description"
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
          />
          <label htmlFor={`edit-priority-${id}`}>Priority</label>
          <select
            id={`edit-priority-${id}`}
            aria-label="Edit priority"
            value={editPriority}
            onChange={(event) =>
              setEditPriority(event.target.value as typeof priority)
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <label htmlFor={`edit-due-date-${id}`}>Due date</label>
          <input
            id={`edit-due-date-${id}`}
            aria-label="Edit due date"
            type="date"
            value={editDueDate}
            onChange={(event) => setEditDueDate(event.target.value)}
          />
          {editError && <p id="task-edit-error">{editError}</p>}
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Cancel
          </Button>
        </div>
      ) : (
        <>
          {onToggle && (
            <input
              type="checkbox"
              aria-label={`Mark ${title} completed`}
              checked={completed}
              onChange={() => onToggle?.(id ?? title)}
            />
          )}
          <h2 style={{ textDecoration: completed ? 'line-through' : 'none' }}>
            {linkToTaskDetail && id !== undefined ? (
              <Link to={`/challenge/21-react-router/task/${id}`}>{title}</Link>
            ) : (
              title
            )}
          </h2>
          <p style={{ textDecoration: completed ? 'line-through' : 'none' }}>
            {description}
          </p>
          <p>
            <Badge variant="priority">{`Priority: ${priority}`}</Badge>
          </p>
          <Badge id="task-category" variant="category">
            {category}
          </Badge>
          {completed ? (
            <StatusIndicator status="completed" />
          ) : (
            dueStatus && <StatusIndicator status={dueStatus} />
          )}
          {validDueDate && (
            <p
              id="task-due-date"
              style={{ color: isOverdue ? '#b91c1c' : undefined }}
            >
              Due: {validDueDate.toLocaleDateString()}
            </p>
          )}
          <div id="task-tags">
            {tags.map((tag) => (
              <Badge key={tag} variant="tag" data-tag={tag}>
                {tag}
              </Badge>
            ))}
          </div>
          {onUpdateTask && id !== undefined && (
            <Button type="button" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </>
      )}
      {onDelete && id !== undefined && (
        <Button type="button" variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </article>
  )
}

export default React.memo(TaskCard)
