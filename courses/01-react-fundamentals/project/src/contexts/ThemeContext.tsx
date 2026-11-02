import type { ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ThemeContext, type Theme, type ThemeContextValue } from './theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(
    'task-app-theme',
    'light',
    (value) => (value === 'dark' ? 'dark' : 'light'),
  )

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
  }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
