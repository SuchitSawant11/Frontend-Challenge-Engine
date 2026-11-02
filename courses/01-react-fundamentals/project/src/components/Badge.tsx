import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'tag' | 'category' | 'priority'
  id?: string
  'data-tag'?: string
}

export default function Badge({
  children,
  variant = 'tag',
  id,
  'data-tag': dataTag,
}: BadgeProps) {
  return (
    <span
      id={id}
      className={`badge badge--${variant}`}
      data-tag={dataTag}
    >
      {children}
    </span>
  )
}
