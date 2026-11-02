'use client'

import { useState } from 'react'

export default function PostLikeButton() {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  function toggleLike() {
    setIsLiked((currentIsLiked) => !currentIsLiked)
    setLikeCount((currentCount) => currentCount + (isLiked ? -1 : 1))
  }

  return (
    <section aria-label="Post interaction">
      <button
        type="button"
        aria-pressed={isLiked}
        onClick={toggleLike}
      >
        {isLiked ? 'Unlike post' : 'Like post'}
      </button>
      <p aria-live="polite">Likes: {likeCount}</p>
    </section>
  )
}
