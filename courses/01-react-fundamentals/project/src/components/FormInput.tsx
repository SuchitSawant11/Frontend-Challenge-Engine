import type { ChangeEvent } from 'react'

interface FormInputProps {
  label: string
  id: string
  value: string
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  type?: string
  as?: 'input' | 'textarea'
  placeholder?: string
  error?: string
}

export default function FormInput({
  label,
  id,
  value,
  onChange,
  type = 'text',
  as = 'input',
  placeholder,
  error,
}: FormInputProps) {
  return (
    <div className="form-input">
      <label htmlFor={id}>{label}</label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && <p id={`${id}-error`}>{error}</p>}
    </div>
  )
}
