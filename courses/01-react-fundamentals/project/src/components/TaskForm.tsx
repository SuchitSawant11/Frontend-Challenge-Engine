import { useState, type FormEvent } from 'react'
import type { Task } from './TaskList'
import Button from './Button'
import FormInput from './FormInput'

interface TaskFormProps {
  onAddTask: (task: Task) => void
  categories?: string[]
}

export default function TaskForm({
  onAddTask,
  categories = ['General', 'Work', 'Personal'],
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('Medium')
  const [category, setCategory] = useState('General')
  const [tagsInput, setTagsInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const categoryOptions = [...new Set(['General', ...categories])]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    onAddTask({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      category,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      dueDate: dueDate || undefined,
    })

    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('General')
    setTagsInput('')
    setDueDate('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Title"
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <FormInput
        label="Description"
        id="task-description"
        as="textarea"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <label htmlFor="task-category-select">Category</label>
      <select
        id="task-category-select"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        {categoryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label htmlFor="task-tags-input">Tags (comma separated)</label>
      <input
        id="task-tags-input"
        type="text"
        value={tagsInput}
        onChange={(event) => setTagsInput(event.target.value)}
      />

      <label htmlFor="task-due-date-input">Due date</label>
      <input
        id="task-due-date-input"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(event) =>
          setPriority(event.target.value as Task['priority'])
        }
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {error && <p id="task-form-error">{error}</p>}
      <Button type="submit" variant="primary">
        Add Task
      </Button>
    </form>
  )
}
