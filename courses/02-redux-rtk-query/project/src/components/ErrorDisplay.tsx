interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div data-testid="error-display" role="alert">
      <p>{error}</p>
      <button data-testid="retry-btn" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
