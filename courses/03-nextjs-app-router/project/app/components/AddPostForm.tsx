'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { createPost } from '../actions'

export default function AddPostForm() {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const form = event.currentTarget
      const result = await createPost(new FormData(form))
      setMessage(result)
      if (result === 'Post added successfully.') {
        form.reset()
      }
    } catch {
      setMessage('Unable to add the post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a post</h2>
      <label htmlFor="post-title">Title</label>
      <input id="post-title" name="title" required maxLength={120} />
      <label htmlFor="post-body">Content</label>
      <textarea id="post-body" name="body" required maxLength={1000} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add post'}
      </button>
      {message ? <p role="status">{message}</p> : null}
    </form>
  )
}
