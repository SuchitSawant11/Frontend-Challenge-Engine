import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostLikeButton from './PostLikeButton'

interface Post {
  id: number
  title: string
  body: string
}

interface PostPageProps {
  params: {
    id: string
  }
}

async function getPost(id: string): Promise<Post | null> {
  const postId = Number(id)

  if (!Number.isInteger(postId) || postId < 1) {
    return null
  }

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Unable to load this post.')
  }

  return (await response.json()) as Post
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.id)

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.',
    }
  }

  return {
    title: `${post.title} | Next.js App Router Project`,
    description: post.body,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <PostLikeButton />
    </main>
  )
}
