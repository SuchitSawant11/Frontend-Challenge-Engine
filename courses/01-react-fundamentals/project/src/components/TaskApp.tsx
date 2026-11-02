import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Task } from './TaskList'
import {
  ADD_TASK,
  TOGGLE_TASK,
  UPDATE_TASK,
  type TaskAction,
} from '../reducers/taskReducer'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import FilterBar, { type TaskFilter, type TaskSortOrder } from './FilterBar'
import StatsPanel from './StatsPanel'

function getDueDateTimestamp(dueDate?: string | number): number | null {
  if (dueDate === undefined) return null

  let date: Date
  if (typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    const [year, month, day] = dueDate.split('-').map(Number)
    date = new Date(year, month - 1, day)
  } else {
    date = new Date(dueDate)
  }

  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

interface TaskAppProps {
  tasks?: Task[]
  dispatch: (action: TaskAction) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp({
  tasks = [],
  dispatch,
  showForm = false,
  countFormat,
  onDelete,
  showFilterBar = false,
  showStatsPanel = false,
  linkToTaskDetail = false,
}: TaskAppProps) {
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>('recent')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const taskListRef = useRef<HTMLElement>(null)
  const statistics = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const overdue = tasks.filter((task) => {
      if (task.completed) return false
      const dueDate = getDueDateTimestamp(task.dueDate)
      return dueDate !== null && dueDate < today.getTime()
    }).length

    return {
      total,
      completed,
      active: total - completed,
      overdue,
      completedPercentage:
        total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  }, [tasks])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const handleAddTask = useCallback((task: Task) => {
    dispatch({ type: ADD_TASK, payload: task })
  }, [dispatch])

  const handleToggle = useCallback((taskId: string | number) => {
    dispatch({ type: TOGGLE_TASK, payload: taskId })
  }, [dispatch])

  const handleUpdateTask = useCallback((
    taskId: string | number,
    updates: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>,
  ) => {
    dispatch({ type: UPDATE_TASK, payload: { id: taskId, ...updates } })
    setEditingId(null)
  }, [dispatch])

  const categories = useMemo(
    () => [...new Set(tasks.map((task) => task.category?.trim() || 'General'))],
    [tasks],
  )
  const formCategories = useMemo(
    () => [...new Set(['General', 'Work', 'Personal', ...categories])],
    [categories],
  )
  const normalizedSearchTerm = debouncedSearchTerm.trim().toLocaleLowerCase()
  const { filteredTasks, sortedTasks } = useMemo(() => {
    const matchingTasks = tasks.filter((task) => {
      if (filter === 'active' && task.completed) return false
      if (filter === 'completed' && !task.completed) return false
      if (
        categoryFilter !== 'all' &&
        (task.category || 'General') !== categoryFilter
      ) return false
      if (!normalizedSearchTerm) return true
      return (
        task.title.toLocaleLowerCase().includes(normalizedSearchTerm) ||
        task.description.toLocaleLowerCase().includes(normalizedSearchTerm)
      )
    })
    const orderedTasks = [...matchingTasks]
    const priorityOrder = { High: 0, Medium: 1, Low: 2 }

    if (sortOrder === 'priority-high-low') {
      orderedTasks.sort(
        (first, second) =>
          priorityOrder[first.priority] - priorityOrder[second.priority],
      )
    } else if (sortOrder === 'priority-low-high') {
      orderedTasks.sort(
        (first, second) =>
          priorityOrder[second.priority] - priorityOrder[first.priority],
      )
    } else if (sortOrder === 'alphabetical') {
      orderedTasks.sort((first, second) =>
        first.title.localeCompare(second.title, undefined, {
          sensitivity: 'base',
        }),
      )
    } else if (sortOrder === 'due-date-soonest') {
      orderedTasks.sort((first, second) => {
        const firstDueDate = getDueDateTimestamp(first.dueDate)
        const secondDueDate = getDueDateTimestamp(second.dueDate)

        if (firstDueDate === null) return secondDueDate === null ? 0 : 1
        if (secondDueDate === null) return -1
        return firstDueDate - secondDueDate
      })
    }

    return { filteredTasks: matchingTasks, sortedTasks: orderedTasks }
  }, [tasks, filter, categoryFilter, normalizedSearchTerm, sortOrder])

  const countText = showFilterBar
    ? `Showing ${filteredTasks.length} of ${tasks.length} tasks`
    : countFormat === 'completed'
      ? `${tasks.filter((task) => task.completed).length} of ${tasks.length} completed`
      : `${tasks.length} Tasks`

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    taskListRef.current?.focus()
  }, [])
  const handleCancelEdit = useCallback(() => setEditingId(null), [])

  return (
    <>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} categories={formCategories} />
      )}
      {showStatsPanel && <StatsPanel {...statistics} />}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          category={categoryFilter}
          categories={categories}
          onCategoryChange={setCategoryFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={handleClearSearch}
        />
      )}
      {showFilterBar && searchTerm !== debouncedSearchTerm && (
        <p id="searching-indicator">Searching...</p>
      )}
      {showFilterBar && filteredTasks.length === 0 && (
        <p id="filter-empty-message">
          {normalizedSearchTerm
            ? `No tasks found for "${debouncedSearchTerm}"`
            : 'No tasks match this filter'}
        </p>
      )}
      <TaskList
        tasks={sortedTasks}
        listRef={taskListRef}
        countText={countText}
        onToggle={handleToggle}
        onDelete={onDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        onEditTask={setEditingId}
        onCancelEdit={handleCancelEdit}
        linkToTaskDetail={linkToTaskDetail}
      />
    </>
  )
}
