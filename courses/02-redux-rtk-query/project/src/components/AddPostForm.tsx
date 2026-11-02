import { useState, type FormEvent } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [addPost, { isLoading, isSuccess, isError, error }] =
    useAddPostMutation()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()
    if (!trimmedTitle || !trimmedBody) return

    try {
      await addPost({ userId: 1, title: trimmedTitle, body: trimmedBody }).unwrap()
      setTitle('')
      setBody('')
    } catch {
      // The mutation error is displayed below.
    }
  }

  const errorMessage =
    error && 'error' in error
      ? error.error
      : error && 'message' in error
        ? error.message
        : 'Unable to add the post. Please try again.'

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <label htmlFor="post-title">Title</label>
      <input
        id="post-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <label htmlFor="post-body">Body</label>
      <textarea
        id="post-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
      />

      {isError && <p role="alert">{errorMessage}</p>}
      {isSuccess && <p role="status">Post added successfully.</p>}

      <button data-testid="add-post-submit" type="submit" disabled={isLoading}>
        {isLoading ? 'Adding post...' : 'Add Post'}
      </button>
    </form>
  )
}
