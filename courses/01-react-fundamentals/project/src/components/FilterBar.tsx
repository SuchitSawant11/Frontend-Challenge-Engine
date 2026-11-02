import { useEffect, useRef } from 'react'
import Button from './Button'

export type TaskFilter = 'all' | 'active' | 'completed'
export type TaskSortOrder =
  | 'recent'
  | 'priority-high-low'
  | 'priority-low-high'
  | 'alphabetical'
  | 'due-date-soonest'

interface FilterBarProps {
  filter?: TaskFilter
  onFilterChange?: (filter: TaskFilter) => void
  sortOrder?: TaskSortOrder
  onSortChange?: (sortOrder: TaskSortOrder) => void
  searchTerm?: string
  onSearchChange?: (searchTerm: string) => void
  onClearSearch?: () => void
  categories?: string[]
  category?: string
  onCategoryChange?: (category: string) => void
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const SORT_OPTIONS: { value: TaskSortOrder; label: string }[] = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'priority-high-low', label: 'Priority: High to Low' },
  { value: 'priority-low-high', label: 'Priority: Low to High' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'due-date-soonest', label: 'Due Date (Soonest First)' },
]

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sortOrder = 'recent',
  onSortChange,
  searchTerm = '',
  onSearchChange,
  onClearSearch,
  categories = [],
  category = 'all',
  onCategoryChange,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <div id="filter-bar">
      {FILTERS.map(({ value, label }) => (
        <Button
          key={value}
          type="button"
          variant={filter === value ? 'primary' : 'secondary'}
          data-active={filter === value}
          onClick={() => onFilterChange?.(value)}
        >
          {label}
        </Button>
      ))}
      <label htmlFor="category-filter">Category</label>
      <select
        id="category-filter"
        value={category}
        onChange={(event) => onCategoryChange?.(event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="form-input">
        <label htmlFor="search-input">Search tasks</label>
        <input
          ref={searchInputRef}
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>
      {searchTerm && (
        <Button
          id="clear-search"
          type="button"
          variant="secondary"
          onClick={onClearSearch}
        >
          Clear search
        </Button>
      )}
      <label htmlFor="sort-order">Sort by</label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) =>
          onSortChange?.(event.target.value as TaskSortOrder)
        }
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
