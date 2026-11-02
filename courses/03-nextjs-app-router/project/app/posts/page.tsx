import AddPostForm from '../components/AddPostForm'
import PostsList from './PostsList'
import Link from 'next/link'
import { getCreatedPosts } from './post-store'

interface Post {
  id: number
  title: string
  body: string
}

export const dynamic = 'force-dynamic'

interface PostsPageProps {
  searchParams: {
    q?: string | string[]
    page?: string | string[]
  }
}

const pageSize = 10

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const searchValue = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q
  const query = searchValue?.trim() ?? ''
  const pageValue = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page
  const requestedPage = Number.parseInt(pageValue ?? '1', 10)
  const safePage = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1
  let posts: Post[] = getCreatedPosts()
  let hasError = false

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')

    if (!response.ok) {
      throw new Error('Unable to fetch posts')
    }

    posts = (await response.json()) as Post[]
    posts = [...getCreatedPosts(), ...posts]
  } catch {
    hasError = true
  }

  const normalizedQuery = query.toLocaleLowerCase()
  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.body}`.toLocaleLowerCase().includes(normalizedQuery),
  )
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize))
  const currentPage = Math.min(safePage, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const visiblePosts = filteredPosts.slice(pageStart, pageStart + pageSize)
  const pageHref = (page: number) => ({
    pathname: '/posts',
    query: {
      ...(query ? { q: query } : {}),
      page: String(page),
    },
  })

  return (
    <main>
      <h1>Posts</h1>
      <AddPostForm />
      <PostsList />
      <form action="/posts" method="get">
        <label htmlFor="post-search">Search posts</label>
        <input
          id="post-search"
          name="q"
          type="search"
          defaultValue={query}
        />
        <button type="submit">Search</button>
      </form>
      {hasError && posts.length === 0 ? (
        <p role="alert">Unable to load posts. Please try again later.</p>
      ) : visiblePosts.length > 0 ? (
        <ul>
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>{query ? 'No posts match your search.' : 'No posts are available.'}</p>
      )}
      {filteredPosts.length > 0 ? (
        <nav aria-label="Post ">
          <span>Page {currentPage} of {totalPages}</span>
          {currentPage > 1 ? (
            <Link href={pageHref(currentPage - 1)}>Previous</Link>
          ) : null}
          {currentPage < totalPages ? (
            <Link href={pageHref(currentPage + 1)}>Next</Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  )
}
