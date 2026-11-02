import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data: users, isLoading, isError, error, refetch } =
    useGetUsersQuery()

  if (isLoading) {
    return <p data-testid="users-loading">Loading users...</p>
  }

  if (isError) {
    const message =
      error && 'error' in error
        ? error.error
        : error && 'message' in error
          ? error.message
          : 'Unable to load users. Please try again.'

    return <ErrorDisplay error={message} onRetry={refetch} />
  }

  return (
    <ul data-testid="users-list">
      {users?.map((user) => (
        <li key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.username}</p>
        </li>
      ))}
    </ul>
  )
}
