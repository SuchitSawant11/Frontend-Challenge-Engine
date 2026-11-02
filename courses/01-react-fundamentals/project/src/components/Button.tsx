import type { MouseEventHandler, ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  id?: string
  'data-active'?: boolean
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  id,
  'data-active': dataActive,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      data-active={dataActive}
    >
      {children}
    </button>
  )
}
