import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>()
  const parsedPostId = postId ? Number(postId) : 1
  const id = Number.isInteger(parsedPostId) && parsedPostId > 0 ? parsedPostId : undefined
  const { data: post, isLoading, isError } = useGetPostByIdQuery(id ?? 0, {
    skip: !id,
  })

  if (!id) {
    return <p data-testid="post-detail-error">A valid post ID is required.</p>
  }

  if (isLoading) {
    return <p data-testid="post-detail-loading">Loading post...</p>
  }

  if (isError || !post) {
    return <p data-testid="post-detail-error">Unable to load this post.</p>
  }

  return (
    <article data-testid="post-detail">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </article>
  )
}
