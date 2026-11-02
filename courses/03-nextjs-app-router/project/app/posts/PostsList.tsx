'use client'

import { useGetPostsQuery } from '../store/apiSlice'

export default function PostsList() {
  const { data: posts = [], isLoading, isError } = useGetPostsQuery()

  if (isLoading) {
    return <p role="status">Loading API posts...</p>
  }

  if (isError) {
    return <p role="alert">Unable to load API posts.</p>
  }

  return (
    <section aria-labelledby="api-posts-heading">
      <h2 id="api-posts-heading">Posts from the API</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No API posts are available.</p>
      )}
    </section>
  )
}
