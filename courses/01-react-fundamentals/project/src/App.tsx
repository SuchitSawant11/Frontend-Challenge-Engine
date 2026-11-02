import './App.css'
import { useCallback, useEffect, useReducer } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChallengeList from './components/ChallengeList'
import TaskList from './components/TaskList'
import TaskApp from './components/TaskApp'
import TaskDetailPage from './components/TaskDetailPage'
import FetchDemoView from './components/FetchDemoView'
import { ThemeProvider } from './contexts/ThemeContext'
import { useTheme } from './contexts/theme-context'
import Button from './components/Button'
import type { Task } from './components/TaskList'
import { DELETE_TASK, taskReducer } from './reducers/taskReducer'

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'First Task', description: 'Description one', priority: 'High', completed: false, category: 'General', tags: [] },
  { id: 2, title: 'Second Task', description: 'Description two', priority: 'Medium', completed: false, category: 'General', tags: [] },
  { id: 3, title: 'Third Task', description: 'Description three', priority: 'Low', completed: false, category: 'General', tags: [] },
  { id: 4, title: 'Fourth Task', description: 'Description four', priority: 'Medium', completed: false, category: 'General', tags: [] },
  { id: 5, title: 'Fifth Task', description: 'Description five', priority: 'High', completed: false, category: 'General', tags: [] },
]

const TASKS_STORAGE_KEY = 'task-app-tasks'
type StoredTask = Omit<Task, 'category' | 'tags'> &
  Partial<Pick<Task, 'category' | 'tags'>>

function isStoredTask(value: unknown): value is StoredTask {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const task = value as Record<string, unknown>
  const validId =
    typeof task.id === 'string' ||
    (typeof task.id === 'number' && Number.isFinite(task.id))

  return (
    validId &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.priority === 'Low' ||
      task.priority === 'Medium' ||
      task.priority === 'High') &&
    typeof task.completed === 'boolean' &&
    (task.category === undefined || typeof task.category === 'string') &&
    (task.tags === undefined ||
      (Array.isArray(task.tags) && task.tags.every((tag) => typeof tag === 'string'))) &&
    (task.dueDate === undefined ||
      typeof task.dueDate === 'string' ||
      typeof task.dueDate === 'number')
  )
}

function deserializeTasks(value: unknown): Task[] {
  if (!Array.isArray(value) || !value.every(isStoredTask)) {
    throw new Error('Stored tasks have an invalid format')
  }

  return (value as StoredTask[]).map((task) => ({
    ...task,
    category: task.category?.trim() || 'General',
    tags: task.tags ?? [],
  }))
}

function loadTasks(initialTasks: Task[]): Task[] {
  try {
    const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY)
    return storedTasks === null
      ? initialTasks
      : deserializeTasks(JSON.parse(storedTasks))
  } catch {
    return initialTasks
  }
}

function AppContent() {
  const [tasks, dispatch] = useReducer(taskReducer, INITIAL_TASKS, loadTasks)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Keep the app usable when browser storage is unavailable.
    }
  }, [tasks])

  const handleDelete = useCallback((id: string | number) => {
    dispatch({ type: DELETE_TASK, payload: id })
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="App" data-theme={theme}>
        <header className="app-header">
          <Button
            id="theme-toggle"
            type="button"
            variant="secondary"
            onClick={toggleTheme}
          >
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
          </Button>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ChallengeList />} />
            <Route path="/challenge/01-static-task-display" element={<TaskList />} />
            <Route path="/challenge/02-dynamic-task-rendering" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm={false} countFormat="tasks" />} />
            <Route path="/challenge/03-adding-new-tasks" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/04-task-completion-toggle" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="completed" />} />
            <Route path="/challenge/05-task-deletion" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" onDelete={handleDelete} />} />
            <Route path="/challenge/06-task-filtering" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/07-priority-based-sorting" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/08-task-editing" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/09-search-functionality" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/10-useeffect-local-storage" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/11-useeffect-debounced-search" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/12-categories-and-tags" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/13-due-dates-and-sorting" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/14-task-statistics-dashboard" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showStatsPanel />} />
            <Route path="/challenge/15-component-organization" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/16-context-api-theme" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/17-custom-hook-uselocalstorage" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/18-usereducer-complex-state" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" onDelete={handleDelete} />} />
            <Route path="/challenge/19-performance-optimization" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/20-error-boundaries" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/21-react-router" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" linkToTaskDetail />} />
            <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
            <Route path="/challenge/22-data-fetching" element={<FetchDemoView />} />
            <Route path="/challenge/23-useref-focus-management" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
