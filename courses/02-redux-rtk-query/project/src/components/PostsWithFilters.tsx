import { useMemo } from 'react'
import { useGetPostsQuery } from '../api/apiSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  setPostSortOrder,
  setUserFilter,
  type PostSortOrder,
} from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const { data: posts, isLoading, isError } = useGetPostsQuery()
  const filters = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  const userIds = useMemo(
    () => [...new Set((posts ?? []).map((post) => post.userId))].sort((a, b) => a - b),
    [posts],
  )
  const visiblePosts = useMemo(() => {
    const filteredPosts = (posts ?? []).filter(
      (post) => filters.userId === 'all' || post.userId === filters.userId,
    )

    return filteredPosts.sort((first, second) =>
      filters.sortOrder === 'newest'
        ? second.id - first.id
        : first.id - second.id,
    )
  }, [posts, filters.userId, filters.sortOrder])

  return (
    <section data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <label htmlFor="post-user-filter">Filter by user</label>
        <select
          id="post-user-filter"
          value={filters.userId}
          onChange={(event) => {
            const value = event.target.value
            dispatch(setUserFilter(value === 'all' ? 'all' : Number(value)))
          }}
        >
          <option value="all">All users</option>
          {userIds.map((userId) => (
            <option key={userId} value={userId}>
              User {userId}
            </option>
          ))}
        </select>

        <label htmlFor="post-sort-order">Sort posts</label>
        <select
          id="post-sort-order"
          value={filters.sortOrder}
          onChange={(event) =>
            dispatch(setPostSortOrder(event.target.value as PostSortOrder))
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading posts...</p>
      ) : isError ? (
        <p role="alert">Unable to load posts.</p>
      ) : (
        <ul>
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <small>User {post.userId}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
