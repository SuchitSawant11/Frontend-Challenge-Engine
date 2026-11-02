'use client'

interface PostsErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PostsError({ error, reset }: PostsErrorProps) {
  return (
    <main role="alert">
      <h2>Unable to load posts</h2>
      <p>{error.message || 'An unexpected error occurred.'}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  )
}
