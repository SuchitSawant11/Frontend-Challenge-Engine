import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data: posts, isLoading, isError } = useGetPostsQuery()

  if (isLoading) return <p data-testid="posts-loading">Loading posts...</p>
  if (isError) {
    return <p data-testid="posts-error">Unable to load posts. Please try again.</p>
  }

  return (
    <ul id="posts-list" data-testid="posts-list">
      {posts?.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
